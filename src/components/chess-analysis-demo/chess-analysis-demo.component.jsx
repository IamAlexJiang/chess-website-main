import React, { useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import ChessAnalysis from '../chess-analysis/chess-analysis.component';
import './chess-analysis-demo.styles.scss';

const ChessAnalysisDemo = () => {
  const [game, setGame] = useState(new Chess());
  const [moves, setMoves] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  // Convert chess.js moves to our format
  const convertMoves = (chessMoves) => {
    return chessMoves.map(move => ({
      from: move.from,
      to: move.to,
      promotion: move.promotion
    }));
  };

  // Handle piece movement
  const onDrop = (sourceSquare, targetSquare, piece) => {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: piece[1] === 'P' && (targetSquare[1] === '8' || targetSquare[1] === '1') ? 'q' : undefined
      });

      if (move === null) return false;

      setGame(new Chess(game.fen()));
      const newMoves = convertMoves(game.history({ verbose: true }));
      setMoves(newMoves);

      // Get AI analysis for the new position
      getAIAnalysis(newMoves);

      return true;
    } catch (error) {
      console.error('Move error:', error);
      return false;
    }
  };

  // Get AI analysis (using your existing endpoint)
  const getAIAnalysis = async (movesToAnalyze) => {
    if (movesToAnalyze.length === 0) return;

    setIsLoadingAnalysis(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/chess/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ moves: movesToAnalyze }),
      });

      const result = await response.json();
      setAiAnalysis(result);
    } catch (error) {
      console.error('Error getting AI analysis:', error);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  // Handle Stockfish analysis completion
  const handleStockfishAnalysisComplete = (analysis) => {
    console.log('Stockfish analysis completed:', analysis);
    // You can handle the Stockfish analysis result here
    // For example, highlight the best move on the board
  };

  // Reset the game
  const resetGame = () => {
    setGame(new Chess());
    setMoves([]);
    setAiAnalysis(null);
  };

  // Undo last move
  const undoMove = () => {
    if (game.history().length === 0) return;

    game.undo();
    setGame(new Chess(game.fen()));
    const newMoves = convertMoves(game.history({ verbose: true }));
    setMoves(newMoves);
    setAiAnalysis(null);

    if (newMoves.length > 0) {
      getAIAnalysis(newMoves);
    }
  };

  return (
    <div className="chess-analysis-demo">
      <div className="demo-header">
        <h2>Chess Analysis Demo</h2>
        <p>Make moves on the board to see both AI commentary and Stockfish engine analysis</p>
        <div className="demo-controls">
          <button onClick={resetGame} className="reset-btn">
            Reset Game
          </button>
          <button onClick={undoMove} className="undo-btn" disabled={game.history().length === 0}>
            Undo Move
          </button>
        </div>
      </div>

      <div className="demo-content">
        <div className="board-section">
          <div className="board-container">
            <Chessboard
              position={game.fen()}
              onPieceDrop={onDrop}
              boardWidth={400}
              customBoardStyle={{
                borderRadius: '4px',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
              }}
            />
          </div>
          
          <div className="game-info">
            <h3>Game Status</h3>
            <p><strong>Turn:</strong> {game.turn() === 'w' ? 'White' : 'Black'}</p>
            <p><strong>Moves:</strong> {game.history().length}</p>
            <p><strong>Status:</strong> {
              game.isCheckmate() ? 'Checkmate' :
              game.isDraw() ? 'Draw' :
              game.isCheck() ? 'Check' :
              'In Progress'
            }</p>
            
            {game.history().length > 0 && (
              <div className="move-history">
                <h4>Move History</h4>
                <div className="moves-list">
                  {game.history().map((move, index) => (
                    <span key={index} className="move">
                      {Math.floor(index / 2) + 1}.{index % 2 === 0 ? '' : '..'} {move}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="analysis-section">
          <ChessAnalysis
            moves={moves}
            aiAnalysis={aiAnalysis}
            isLoadingAnalysis={isLoadingAnalysis}
            onAnalysisComplete={handleStockfishAnalysisComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default ChessAnalysisDemo;

