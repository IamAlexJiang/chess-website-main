import { useState, useCallback } from 'react';
import movePredictionService from '../utils/move-prediction/move-prediction.service';

/**
 * Custom hook for move prediction
 * @returns {Object} Prediction state and functions
 */
export const useMovePrediction = () => {
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Predict the best move for a position
   * @param {Array} moves - Array of moves
   */
  const predictMove = useCallback(async (moves) => {
    if (!moves || moves.length === 0) {
      setError('No moves provided for prediction');
      return;
    }

    setIsPredicting(true);
    setError(null);
    setPrediction(null);

    try {
      const result = await movePredictionService.predictMove(moves);
      setPrediction(result);
      return result;
    } catch (err) {
      setError(err.message || 'Prediction failed');
      console.error('Move prediction error:', err);
      return null;
    } finally {
      setIsPredicting(false);
    }
  }, []);

  /**
   * Clear current prediction
   */
  const clearPrediction = useCallback(() => {
    setPrediction(null);
    setError(null);
  }, []);

  /**
   * Check if service is available
   */
  const checkAvailability = useCallback(async () => {
    try {
      return await movePredictionService.isAvailable();
    } catch (err) {
      console.error('Service availability check failed:', err);
      return false;
    }
  }, []);

  return {
    // State
    isPredicting,
    prediction,
    error,
    
    // Functions
    predictMove,
    clearPrediction,
    checkAvailability
  };
};

export default useMovePrediction;

