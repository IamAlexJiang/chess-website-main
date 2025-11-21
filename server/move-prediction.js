const { Chess } = require('chess.js');

/**
 * Simple move prediction endpoint using chess.js
 * Provides the best move prediction for a given position
 */
async function predictMove(req, res) {
  try {
    const { moves } = req.body;
    
    console.log('Received moves for prediction:', moves);
    
    if (!moves || !Array.isArray(moves) || moves.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid moves data',
        predictedMove: null
      });
    }

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
        return res.json({
          predictedMove: null,
          status: chess.isCheckmate() ? 'checkmate' : 'draw',
          message: chess.isCheckmate() ? 'Checkmate!' : 'Draw!'
        });
      }

      // Simple heuristic for best move (you can enhance this)
      // For now, prioritize center control and piece development
      const bestMove = selectBestMove(legalMoves, chess);
      
      const result = {
        predictedMove: {
          from: bestMove.from,
          to: bestMove.to,
          san: bestMove.san,
          uci: bestMove.from + bestMove.to,
          piece: bestMove.piece,
          color: bestMove.color
        },
        allLegalMoves: legalMoves.map(move => ({
          from: move.from,
          to: move.to,
          san: move.san,
          piece: move.piece
        })),
        position: {
          fen: chess.fen(),
          turn: chess.turn(),
          isCheck: chess.isCheck(),
          isCheckmate: chess.isCheckmate(),
          isDraw: chess.isDraw()
        }
      };

      console.log('Predicted move:', result.predictedMove);
      return res.json(result);
      
    } catch (error) {
      throw new Error(`Position analysis failed: ${error.message}`);
    }
    
  } catch (error) {
    console.error('Error in move prediction:', error);
    return res.status(500).json({ 
      error: 'Failed to predict move',
      predictedMove: null
    });
  }
}

/**
 * Simple move selection algorithm
 * Prioritizes center control, piece development, and captures
 */
function selectBestMove(legalMoves, chess) {
  // Score moves based on simple heuristics
  const scoredMoves = legalMoves.map(move => {
    let score = 0;
    
    // Prioritize captures
    if (move.captured) {
      score += 100;
      // Add piece value
      const pieceValues = { 'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0 };
      score += pieceValues[move.captured] || 0;
    }
    
    // Prioritize center control
    const centerSquares = ['d4', 'd5', 'e4', 'e5'];
    if (centerSquares.includes(move.to)) {
      score += 20;
    }
    
    // Prioritize piece development (knights and bishops)
    if (move.piece === 'n' || move.piece === 'b') {
      score += 10;
    }
    
    // Prioritize castling
    if (move.flags.includes('k') || move.flags.includes('q')) {
      score += 15;
    }
    
    // Avoid moving into danger (simple check)
    const tempChess = new Chess(chess.fen());
    tempChess.move(move);
    if (tempChess.isCheck()) {
      score -= 50;
    }
    
    return { ...move, score };
  });
  
  // Sort by score and return the best move
  scoredMoves.sort((a, b) => b.score - a.score);
  return scoredMoves[0];
}

module.exports = predictMove;

