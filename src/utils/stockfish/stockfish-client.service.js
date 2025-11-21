import axios from 'axios';

/**
 * Client-side service for interacting with Stockfish analysis API
 */
class StockfishClientService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  }

  /**
   * Analyze a chess position using Stockfish engine
   * @param {Array} moves - Array of moves in format [{from: 'e2', to: 'e4'}, ...]
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} Analysis result
   */
  async analyzePosition(moves, options = {}) {
    try {
      const {
        depth = 15,
        includeCommentary = true
      } = options;

      const response = await axios.post(`${this.baseURL}/chess/analyze-stockfish`, {
        moves,
        depth,
        includeCommentary
      });

      return response.data;
    } catch (error) {
      console.error('Error analyzing position with Stockfish:', error);
      throw new Error('Failed to analyze position');
    }
  }

  /**
   * Get the best move for a position
   * @param {Array} moves - Array of moves
   * @returns {Promise<Object>} Best move information
   */
  async getBestMove(moves) {
    try {
      const analysis = await this.analyzePosition(moves, { includeCommentary: false });
      return {
        move: analysis.bestMove,
        evaluation: analysis.evaluation,
        depth: analysis.depth
      };
    } catch (error) {
      console.error('Error getting best move:', error);
      throw error;
    }
  }

  /**
   * Get analysis with commentary
   * @param {Array} moves - Array of moves
   * @returns {Promise<Object>} Analysis with commentary
   */
  async getAnalysisWithCommentary(moves) {
    try {
      const analysis = await this.analyzePosition(moves, { includeCommentary: true });
      return {
        bestMove: analysis.bestMove,
        evaluation: analysis.evaluation,
        commentary: analysis.commentary,
        principalVariation: analysis.principalVariation,
        depth: analysis.depth,
        nodes: analysis.nodes,
        time: analysis.time
      };
    } catch (error) {
      console.error('Error getting analysis with commentary:', error);
      throw error;
    }
  }

  /**
   * Check if the service is available
   * @returns {Promise<boolean>} Service availability
   */
  async isAvailable() {
    try {
      const response = await axios.get(`${this.baseURL}/health`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

// Create and export singleton instance
const stockfishClientService = new StockfishClientService();
export default stockfishClientService;

