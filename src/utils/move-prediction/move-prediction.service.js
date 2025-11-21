import axios from 'axios';

/**
 * Service for getting move predictions
 */
class MovePredictionService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  }

  /**
   * Get the best move prediction for a position
   * @param {Array} moves - Array of moves in format [{from: 'e2', to: 'e4'}, ...]
   * @returns {Promise<Object>} Move prediction result
   */
  async predictMove(moves) {
    try {
      const response = await axios.post(`${this.baseURL}/chess/predict-move`, {
        moves
      });

      return response.data;
    } catch (error) {
      console.error('Error predicting move:', error);
      throw new Error('Failed to predict move');
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
const movePredictionService = new MovePredictionService();
export default movePredictionService;

