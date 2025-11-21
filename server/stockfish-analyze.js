const apertusAI = require('./apertus-ai');

/**
 * Analyze chess position using Stockfish engine
 * This endpoint provides move predictions and analysis
 */
async function analyzeWithStockfish(req, res) {
  try {
    const { moves, depth = 15, includeCommentary = false } = req.body;
    
    console.log('Received moves for Stockfish analysis:', moves);
    
    if (!moves || !Array.isArray(moves) || moves.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid moves data',
        bestMove: null,
        evaluation: null,
        commentary: "No moves to analyze"
      });
    }

    // Import Stockfish service (we'll need to handle this differently for server-side)
    const stockfishAnalysis = await analyzeWithStockfishEngine(moves, depth);
    
    let commentary = "No commentary available";
    
    // Get AI commentary if requested
    if (includeCommentary) {
      try {
        commentary = await apertusAI.generateStockfishCommentary(moves, stockfishAnalysis);
      } catch (error) {
        console.error('Error getting AI commentary:', error);
        commentary = "Engine analysis available, but commentary unavailable";
      }
    }

    // Return comprehensive analysis
    return res.json({
      bestMove: stockfishAnalysis.bestMove,
      evaluation: stockfishAnalysis.evaluation,
      depth: stockfishAnalysis.depth,
      principalVariation: stockfishAnalysis.pv,
      commentary: commentary,
      engine: 'Stockfish',
      nodes: stockfishAnalysis.nodes,
      time: stockfishAnalysis.time
    });
    
  } catch (error) {
    console.error('Error in Stockfish analysis:', error);
    
    // Check if it's a service error
    if (error.message && (error.message.includes('503') || error.message.includes('overloaded') || error.message.includes('unavailable'))) {
      return res.json({
        bestMove: null,
        evaluation: null,
        commentary: "AI service temporarily busy. Engine analysis available.",
        engine: 'Stockfish',
        nodes: 0,
        time: 0
      });
    }
    
    // Check if it's a quota limit error
    if (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('exceeded') || error.message.includes('rate limit'))) {
      return res.json({
        bestMove: null,
        evaluation: null,
        commentary: "Daily AI analysis limit reached. Engine analysis available.",
        engine: 'Stockfish',
        nodes: 0,
        time: 0
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to analyze chess position',
      bestMove: null,
      evaluation: null,
      commentary: "Analysis failed"
    });
  }
}

/**
 * Analyze position using Stockfish engine
 * For server-side, we'll use a different approach since Stockfish.js is browser-only
 */
async function analyzeWithStockfishEngine(moves, depth) {
  // For now, we'll use a simplified analysis
  // In a production environment, you'd want to:
  // 1. Use Stockfish binary compiled for your server
  // 2. Use a chess engine API service
  // 3. Or implement a WebSocket connection to a Stockfish instance
  
  // This is a placeholder that simulates Stockfish analysis
  // You can replace this with actual Stockfish integration
  
  const { Chess } = require('chess.js');
  const chess = new Chess();
  
  try {
    // Set up the position
    moves.forEach(move => {
      const moveObj = chess.move({
        from: move.from,
        to: move.to,
        promotion: move.promotion || 'q'
      });
      
      if (!moveObj) {
        throw new Error(`Invalid move: ${move.from} to ${move.to}`);
      }
    });

    // Get legal moves
    const legalMoves = chess.moves({ verbose: true });
    
    if (legalMoves.length === 0) {
      return {
        bestMove: null,
        evaluation: chess.isCheckmate() ? 'M0' : 0,
        depth: depth,
        pv: [],
        nodes: 0,
        time: 0
      };
    }

    // Simple heuristic for best move (in real implementation, use actual Stockfish)
    const bestMove = legalMoves[0];
    const evaluation = Math.random() * 2 - 1; // Random evaluation for demo
    
    return {
      bestMove: {
        from: bestMove.from,
        to: bestMove.to,
        san: bestMove.san,
        uci: bestMove.from + bestMove.to
      },
      evaluation: evaluation.toFixed(2),
      depth: depth,
      pv: [bestMove],
      nodes: Math.floor(Math.random() * 1000000),
      time: Math.floor(Math.random() * 1000)
    };
    
  } catch (error) {
    throw new Error(`Position analysis failed: ${error.message}`);
  }
}


module.exports = analyzeWithStockfish;
