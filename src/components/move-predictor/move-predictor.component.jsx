import React from 'react';
import useMovePrediction from '../../hooks/useMovePrediction';
import Button from '../button/button.component';
import './move-predictor.styles.scss';

const MovePredictor = ({ moves = [], onMovePredicted }) => {
  const {
    isPredicting,
    prediction,
    error,
    predictMove,
    clearPrediction
  } = useMovePrediction();

  const handlePredict = async () => {
    if (moves.length === 0) {
      alert('No moves to analyze');
      return;
    }

    try {
      const result = await predictMove(moves);
      if (onMovePredicted && result) {
        onMovePredicted(result);
      }
    } catch (err) {
      console.error('Prediction failed:', err);
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
    <div className="move-predictor">
      <div className="predictor-header">
        <h3>Move Prediction</h3>
        <p>Get the best move suggestion for the current position</p>
      </div>

      <div className="predictor-actions">
        <Button
          onClick={handlePredict}
          disabled={isPredicting || moves.length === 0}
          className="predict-btn"
        >
          {isPredicting ? 'Predicting...' : 'Predict Best Move'}
        </Button>
        
        <Button
          onClick={clearPrediction}
          disabled={isPredicting}
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

      {prediction && (
        <div className="prediction-results">
          <h4>Prediction Results</h4>
          
          {prediction.predictedMove ? (
            <div className="predicted-move-section">
              <h5>Best Move</h5>
              <div className="move-display">
                <span className="move-notation">{formatMove(prediction.predictedMove)}</span>
                <span className="move-details">
                  {prediction.predictedMove.piece.toUpperCase()} from {prediction.predictedMove.from} to {prediction.predictedMove.to}
                </span>
              </div>
            </div>
          ) : (
            <div className="game-over-section">
              <h5>Game Status</h5>
              <p><strong>Status:</strong> {prediction.status}</p>
              <p><strong>Message:</strong> {prediction.message}</p>
            </div>
          )}

          {prediction.position && (
            <div className="position-info">
              <h5>Position Info</h5>
              <p><strong>Turn:</strong> {prediction.position.turn === 'w' ? 'White' : 'Black'}</p>
              <p><strong>Check:</strong> {prediction.position.isCheck ? 'Yes' : 'No'}</p>
              <p><strong>Checkmate:</strong> {prediction.position.isCheckmate ? 'Yes' : 'No'}</p>
              <p><strong>Draw:</strong> {prediction.position.isDraw ? 'Yes' : 'No'}</p>
            </div>
          )}

          {prediction.allLegalMoves && prediction.allLegalMoves.length > 0 && (
            <div className="legal-moves">
              <h5>All Legal Moves ({prediction.allLegalMoves.length})</h5>
              <div className="moves-grid">
                {prediction.allLegalMoves.slice(0, 10).map((move, index) => (
                  <span key={index} className="legal-move">
                    {formatMove(move)}
                  </span>
                ))}
                {prediction.allLegalMoves.length > 10 && (
                  <span className="more-moves">
                    +{prediction.allLegalMoves.length - 10} more...
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {moves.length === 0 && (
        <div className="no-moves-message">
          No moves available for prediction. Make some moves on the board first.
        </div>
      )}
    </div>
  );
};

export default MovePredictor;

