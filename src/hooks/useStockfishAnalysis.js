import { useState, useCallback } from 'react';
import stockfishClientService from '../utils/stockfish/stockfish-client.service';

/**
 * Custom hook for Stockfish chess analysis
 * @returns {Object} Analysis state and functions
 */
export const useStockfishAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Analyze a chess position
   * @param {Array} moves - Array of moves
   * @param {Object} options - Analysis options
   */
  const analyzePosition = useCallback(async (moves, options = {}) => {
    if (!moves || moves.length === 0) {
      setError('No moves provided for analysis');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await stockfishClientService.analyzePosition(moves, options);
      setAnalysis(result);
    } catch (err) {
      setError(err.message || 'Analysis failed');
      console.error('Stockfish analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /**
   * Get the best move for a position
   * @param {Array} moves - Array of moves
   */
  const getBestMove = useCallback(async (moves) => {
    if (!moves || moves.length === 0) {
      setError('No moves provided for analysis');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await stockfishClientService.getBestMove(moves);
      setAnalysis(result);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to get best move');
      console.error('Best move analysis error:', err);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /**
   * Get analysis with commentary
   * @param {Array} moves - Array of moves
   */
  const getAnalysisWithCommentary = useCallback(async (moves) => {
    if (!moves || moves.length === 0) {
      setError('No moves provided for analysis');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await stockfishClientService.getAnalysisWithCommentary(moves);
      setAnalysis(result);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to get analysis with commentary');
      console.error('Analysis with commentary error:', err);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /**
   * Clear current analysis
   */
  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  /**
   * Check if Stockfish service is available
   */
  const checkAvailability = useCallback(async () => {
    try {
      return await stockfishClientService.isAvailable();
    } catch (err) {
      console.error('Service availability check failed:', err);
      return false;
    }
  }, []);

  return {
    // State
    isAnalyzing,
    analysis,
    error,
    
    // Functions
    analyzePosition,
    getBestMove,
    getAnalysisWithCommentary,
    clearAnalysis,
    checkAvailability
  };
};

export default useStockfishAnalysis;

