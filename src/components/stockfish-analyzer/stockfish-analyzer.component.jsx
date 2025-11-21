import React, { useState } from 'react';
import useStockfishAnalysis from '../../hooks/useStockfishAnalysis';
import Button from '../button/button.component';
import './stockfish-analyzer.styles.scss';

const StockfishAnalyzer = ({ moves = [], onAnalysisComplete }) => {
  const [depth, setDepth] = useState(15);
  const [includeCommentary, setIncludeCommentary] = useState(true);
  
  const {
    isAnalyzing,
    analysis,
    error,
    analyzePosition,
    getBestMove,
    getAnalysisWithCommentary,
    clearAnalysis,
    checkAvailability
  } = useStockfishAnalysis();

  const handleAnalyze = async () => {
    if (moves.length === 0) {
      alert('No moves to analyze');
      return;
    }

    try {
      const result = await analyzePosition(moves, {
        depth,
        includeCommentary
      });

      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  const handleGetBestMove = async () => {
    if (moves.length === 0) {
      alert('No moves to analyze');
      return;
    }

    try {
      const result = await getBestMove(moves);
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (err) {
      console.error('Best move analysis failed:', err);
    }
  };

  const handleGetCommentary = async () => {
    if (moves.length === 0) {
      alert('No moves to analyze');
      return;
    }

    try {
      const result = await getAnalysisWithCommentary(moves);
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (err) {
      console.error('Commentary analysis failed:', err);
    }
  };

  const formatEvaluation = (evaluation) => {
    if (!evaluation) return 'N/A';
    
    if (typeof evaluation === 'string' && evaluation.startsWith('M')) {
      return evaluation; // Mate in X moves
    }
    
    const num = parseFloat(evaluation);
    if (isNaN(num)) return evaluation;
    
    if (num > 0) {
      return `+${num.toFixed(2)}`;
    } else if (num < 0) {
      return num.toFixed(2);
    } else {
      return '0.00';
    }
  };

  const formatMove = (move) => {
    if (!move) return 'N/A';
    
    if (move.san) {
      return move.san;
    } else if (move.from && move.to) {
      return `${move.from} to ${move.to}`;
    }
    
    return 'Invalid move';
  };

  return (
    <div className="stockfish-analyzer">
      <div className="analyzer-header">
        <h3>Stockfish Analysis</h3>
        <div className="analyzer-controls">
          <div className="control-group">
            <label htmlFor="depth">Depth:</label>
            <select
              id="depth"
              value={depth}
              onChange={(e) => setDepth(parseInt(e.target.value))}
              disabled={isAnalyzing}
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
            </select>
          </div>
          
          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={includeCommentary}
                onChange={(e) => setIncludeCommentary(e.target.checked)}
                disabled={isAnalyzing}
              />
              Include Commentary
            </label>
          </div>
        </div>
      </div>

      <div className="analyzer-actions">
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || moves.length === 0}
          className="analyze-btn"
        >
          {isAnalyzing ? 'Analyzing...' : 'Full Analysis'}
        </Button>
        
        <Button
          onClick={handleGetBestMove}
          disabled={isAnalyzing || moves.length === 0}
          className="best-move-btn"
        >
          Best Move Only
        </Button>
        
        <Button
          onClick={handleGetCommentary}
          disabled={isAnalyzing || moves.length === 0}
          className="commentary-btn"
        >
          With Commentary
        </Button>
        
        <Button
          onClick={clearAnalysis}
          disabled={isAnalyzing}
          className="clear-btn"
        >
          Clear
        </Button>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {analysis && (
        <div className="analysis-results">
          <h4>Analysis Results</h4>
          
          {analysis.bestMove && (
            <div className="result-section">
              <h5>Best Move</h5>
              <p><strong>Move:</strong> {formatMove(analysis.bestMove)}</p>
              {analysis.evaluation && (
                <p><strong>Evaluation:</strong> {formatEvaluation(analysis.evaluation)}</p>
              )}
              {analysis.depth && (
                <p><strong>Depth:</strong> {analysis.depth}</p>
              )}
            </div>
          )}

          {analysis.principalVariation && analysis.principalVariation.length > 0 && (
            <div className="result-section">
              <h5>Principal Variation</h5>
              <div className="pv-moves">
                {analysis.principalVariation.map((move, index) => (
                  <span key={index} className="pv-move">
                    {formatMove(move)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysis.commentary && (
            <div className="result-section">
              <h5>Commentary</h5>
              <p className="commentary">{analysis.commentary}</p>
            </div>
          )}

          {analysis.nodes && (
            <div className="result-section">
              <h5>Engine Info</h5>
              <p><strong>Nodes:</strong> {analysis.nodes.toLocaleString()}</p>
              {analysis.time && (
                <p><strong>Time:</strong> {analysis.time}ms</p>
              )}
            </div>
          )}
        </div>
      )}

      {moves.length === 0 && (
        <div className="no-moves-message">
          No moves available for analysis. Make some moves on the board first.
        </div>
      )}
    </div>
  );
};

export default StockfishAnalyzer;

