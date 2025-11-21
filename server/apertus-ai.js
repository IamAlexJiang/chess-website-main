/**
 * Free Chess AI service for chess analysis
 * Uses rule-based AI that doesn't require external APIs
 */
class FreeChessAI {
  constructor() {
    this.openingComments = [
      "White opens with the King's Pawn, controlling the center.",
      "Black responds with a solid central move.",
      "Both sides are developing their pieces normally.",
      "The opening shows classical development patterns.",
      "Center control is being contested by both players.",
      "The position is balanced with equal chances."
    ];
    
    this.midgameComments = [
      "The position is becoming more complex.",
      "Tactical possibilities are emerging.",
      "Both sides have active piece play.",
      "The game is entering the middlegame phase.",
      "Strategic plans are being formulated.",
      "The position offers interesting tactical opportunities."
    ];
    
    this.endgameComments = [
      "The endgame phase is approaching.",
      "Precise calculation is now required.",
      "The position demands accurate play.",
      "Endgame technique will be crucial.",
      "The game is reaching its critical phase.",
      "Every move counts in this position."
    ];
  }

  /**
   * Generate chess commentary using rule-based AI
   * @param {Array} moves - Array of chess moves
   * @returns {Object} Analysis with commentary
   */
  async analyzeChessPosition(moves) {
    try {
      console.log('Analyzing chess position with Free Chess AI...');
      
      // Determine game phase based on move count
      let commentary;
      const moveCount = moves.length;
      
      if (moveCount <= 8) {
        // Opening phase
        commentary = this.openingComments[Math.floor(Math.random() * this.openingComments.length)];
      } else if (moveCount <= 20) {
        // Middlegame phase
        commentary = this.midgameComments[Math.floor(Math.random() * this.midgameComments.length)];
      } else {
        // Endgame phase
        commentary = this.endgameComments[Math.floor(Math.random() * this.endgameComments.length)];
      }
      
      // Add move-specific analysis
      const lastMove = moves[moves.length - 1];
      if (lastMove) {
        const pieceAnalysis = this.analyzeMove(lastMove);
        commentary += ` ${pieceAnalysis}`;
      }
      
      // Generate a simple predicted move
      const predictedMove = this.generatePredictedMove(moves);
      
      console.log('Free Chess AI Analysis:', { commentary, predictedMove });
      
      return {
        commentary: commentary,
        predictedMove: predictedMove
      };
      
    } catch (error) {
      console.error('Error with Free Chess AI:', error);
      
      return {
        commentary: "Free Chess AI is analyzing the position. The game shows interesting tactical possibilities.",
        predictedMove: "No prediction available"
      };
    }
  }
  
  /**
   * Analyze a specific move
   * @param {Object} move - The move to analyze
   * @returns {string} Analysis of the move
   */
  analyzeMove(move) {
    const from = move.from;
    const to = move.to;
    
    // Simple move analysis based on squares
    if (from.includes('2') && to.includes('4')) {
      return "This pawn advance gains space in the center.";
    } else if (from.includes('7') && to.includes('5')) {
      return "Black's pawn move challenges the center.";
    } else if (from.includes('1') && to.includes('3')) {
      return "Knight development follows opening principles.";
    } else if (from.includes('8') && to.includes('6')) {
      return "Black develops the knight to a natural square.";
    } else {
      return "This move continues the development.";
    }
  }
  
  /**
   * Generate a predicted move based on common patterns
   * @param {Array} moves - Array of chess moves
   * @returns {string} Predicted move
   */
  generatePredictedMove(moves) {
    const moveCount = moves.length;
    
    // Simple prediction based on move count and common patterns
    if (moveCount === 1) {
      return "e7 to e5"; // Common response to e4
    } else if (moveCount === 2) {
      return "g1 to f3"; // Common knight development
    } else if (moveCount === 3) {
      return "b8 to c6"; // Common knight development
    } else {
      return "Nf3 Nc6"; // Generic knight moves
    }
  }

  /**
   * Generate commentary for Stockfish analysis
   * @param {Array} moves - Array of chess moves
   * @param {Object} stockfishAnalysis - Stockfish engine analysis
   * @returns {string} Commentary text
   */
  async generateStockfishCommentary(moves, stockfishAnalysis) {
    try {
      console.log('Generating Stockfish commentary with Free Chess AI...');
      
      const bestMoveText = stockfishAnalysis.bestMove 
        ? `${stockfishAnalysis.bestMove.from} to ${stockfishAnalysis.bestMove.to}`
        : 'No move available';

      const evaluationText = stockfishAnalysis.evaluation 
        ? `Evaluation: ${stockfishAnalysis.evaluation}`
        : 'No evaluation available';

      // Generate commentary based on engine analysis
      let commentary = "Engine analysis suggests ";
      
      if (stockfishAnalysis.bestMove) {
        commentary += `the move ${bestMoveText}. `;
      }
      
      if (stockfishAnalysis.evaluation) {
        const evaluation = parseFloat(stockfishAnalysis.evaluation);
        if (evaluation > 0.5) {
          commentary += "White has a slight advantage. ";
        } else if (evaluation < -0.5) {
          commentary += "Black has a slight advantage. ";
        } else {
          commentary += "The position is roughly equal. ";
        }
      }
      
      // Add phase-specific commentary
      const moveCount = moves.length;
      if (moveCount <= 8) {
        commentary += "The opening is developing normally.";
      } else if (moveCount <= 20) {
        commentary += "The middlegame offers tactical opportunities.";
      } else {
        commentary += "The endgame requires precise calculation.";
      }
      
      console.log('Free Chess AI Stockfish Commentary:', commentary);
      return commentary;
      
    } catch (error) {
      console.error('Error with Free Chess AI Stockfish commentary:', error);
      return "Engine analysis available, but commentary unavailable";
    }
  }
}

// Export singleton instance
module.exports = new FreeChessAI();
