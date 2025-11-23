import axios from 'axios';

/**
 * Service for getting move predictions
 */
class MovePredictionService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:3001';
  }

  /**
   * Get the best move prediction for a position
   * @param {Array} moves - Array of moves in format [{from: 'e2', to: 'e4'}, ...]
   * @returns {Promise<Object>} Move prediction result
   */
  async predictMove(moves) {
    try {
      console.log('🔵 MovePredictionService: Calling /chess/predict-move with moves:', moves);
      console.log('🔵 MovePredictionService: Base URL:', this.baseURL);
      
      const response = await axios.post(`${this.baseURL}/chess/predict-move`, {
        moves
      });

      console.log('🔵 MovePredictionService: Response received:', response);
      console.log('🔵 MovePredictionService: Response data:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ MovePredictionService: Error predicting move:', error);
      console.error('❌ MovePredictionService: Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      throw new Error(error.response?.data?.error || error.message || 'Failed to predict move');
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

