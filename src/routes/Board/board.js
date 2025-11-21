import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useState, useEffect } from "react";
import Record from "./record";
import Manuals from "./manuals";
import "./board.css";
import { Switch, Message, Spin } from '@arco-design/web-react';
import api from "../../ajax";
import useMovePrediction from "../../hooks/useMovePrediction";
const ChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState("");
  const [moveTo, setMoveTo] = useState(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [moveSquares, setMoveSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});
  const [isCheckmate, setIsCheckmate] = useState(false);
  const [winner, setWinner] = useState("w");
  const [record, setRecord] = useState([]);
  const [manualId, setManualId] = useState('');
  const [manualList, setManualList] = useState([]);
  const [isRecord, setIsRecord] = useState(true);
  const [undoLock, setUndoLock] = useState(true);
  const [step, setStep] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  
  // Move prediction state
  const [predictedMove, setPredictedMove] = useState(null);
  const [predictedMoveSquares, setPredictedMoveSquares] = useState({});
  const [showPrediction, setShowPrediction] = useState(false);
  const [predictionEnabled, setPredictionEnabled] = useState(false);
  
  // Move prediction hook
  const { 
    isPredicting, 
    error: predictionError, 
    predictMove, 
    clearPrediction 
  } = useMovePrediction();
  function safeGameMutate(modify) {
    setGame((g) => {
      const update = new Chess(game.fen());
      modify(update);
      return update;
    });
  }

  function getMoveOptions(square) {
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  }


  function handleGameOver() {
    Message.info({ content: 'Game Over', duration: 2000 });
    setTimeout(() => {
      setStep(0);
      resetAll();
    }, 2000);
  }
  function onSquareClick(square) {
    setRightClickedSquares({});
    // from square
    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }

    // to square
    if (!moveTo) {
      // check if valid move before showing dialog
      const moves = game.moves({
        moveFrom,
        verbose: true,
      });
      const foundMove = moves.find(
        (m) => m.from === moveFrom && m.to === square
      );
      // not a valid move
      if (!foundMove) {
        // check if clicked on new piece
        const hasMoveOptions = getMoveOptions(square);
        // if new piece, setMoveFrom, otherwise clear moveFrom
        setMoveFrom(hasMoveOptions ? square : "");
        return;
      }
      // valid move
      setMoveTo(square);
      // if promotion move
      if (
        (foundMove.color === "w" &&
          foundMove.piece === "p" &&
          square[1] === "8") ||
        (foundMove.color === "b" &&
          foundMove.piece === "p" &&
          square[1] === "1")
      ) {
        setShowPromotionDialog(true);
        return;
      }

      // is normal move
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });
      setUndoLock(false);
      // if invalid, setMoveFrom and getMoveOptions
      if (move === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }
      setGame(gameCopy);
      if (!isRecord) {
        const manual = manualId && manualList.find(v => String(v.id) === manualId)?.value
        if (manual) {
          if (moveFrom !== manual[step].from || square !== manual[step].to) {
            setTimeout(() => {
              setMoveSquares({});
              setOptionSquares({});
              setRightClickedSquares({});
              gameCopy.undo();
              setGame(gameCopy)
            }, 300);
          } else {
            if (manual[step + 1]) {
              gameCopy.move({
                from: manual[step + 1].from,
                to: manual[step + 1].to,
                promotion: "q",
              });
              setGame(gameCopy);
              const newStep = step + 2;
              if (newStep >= manual.length) {
                handleGameOver();
              } else {
                setStep(newStep);
              }
            } else {
              handleGameOver();
            }
          }
        }
      } else {
        record.push({
          from: moveFrom,
          to: square
        });
        setRecord(record);
        
        // Get AI analysis after the move is recorded
        analyzeChessMoves();
        
        // Auto-update prediction if enabled
        if (predictionEnabled) {
          getMovePrediction();
        }
      }
      setMoveFrom("");
      setMoveTo(null);
      setOptionSquares({});
      return;
    }
  }

  function onPromotionPieceSelect(piece) {
    // if no piece passed then user has cancelled dialog, don't make move and reset
    if (piece) {
      const gameCopy = new Chess(game.fen());
      gameCopy.move({
        from: moveFrom,
        to: moveTo,
        promotion: piece[1].toLowerCase() ?? "q",
      });
      setGame(gameCopy);

      // If in manual mode, handle manual-specific logic
      if (!isRecord && manualId) {
        const manual = manualList.find(v => String(v.id) === manualId)?.value;
        if (manual && manual.length > 0) {
          // After promotion, auto-play opponent's next move if available
          const currentStep = Math.floor(step / 2) * 2;
          if (manual[currentStep + 1]) {
            setTimeout(() => {
              const gameCopyAfterPromotion = new Chess(game.fen());
              gameCopyAfterPromotion.move({
                from: manual[currentStep + 1].from,
                to: manual[currentStep + 1].to,
                promotion: "q",
              });
              setGame(gameCopyAfterPromotion);
              setStep(currentStep + 2);
            }, 300);
          }
        }
      }
    }

    setMoveFrom("");
    setMoveTo(null);
    setShowPromotionDialog(false);
    setOptionSquares({});
    
    return true;
  }

  function onSquareRightClick(square) {
    const colour = "rgba(0, 0, 255, 0.4)";
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] &&
        rightClickedSquares[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour },
    });
  }



  function resetAll() {
    safeGameMutate((game) => {
      game.reset();
    });
    setMoveSquares({});
    setOptionSquares({});
    setRightClickedSquares({});
    setRecord([]);
    setAiAnalysis(null);
    // Clear prediction state
    setPredictedMove(null);
    setPredictedMoveSquares({});
    setShowPrediction(false);
    clearPrediction();
  }
  const init = async () => {
    try {
      const result = await api.board.getBoards();
      if (result && Array.isArray(result)) {
        setManualList(result);
      } else {
        setManualList([]);
      }
    } catch (error) {
      console.error('Error loading saved games:', error);
      setManualList([]);
    }
  }
  const onDelete = async (id) => {
    try {
      const result = await api.board.deleteBoard(id);
      if (result) {
        const newList = manualList.filter(v => String(v.id) !== id);
        setManualList(newList);
        // If deleting the currently selected manual, reset
        if (String(id) === manualId) {
          setManualId('');
          setStep(0);
          resetAll();
        } else {
          setStep(0);
        }
        Message.success({ content: 'Game deleted successfully', duration: 2000 });
      } else {
        Message.error({ content: 'Failed to delete game', duration: 2000 });
      }
    } catch (error) {
      console.error('Error deleting game:', error);
      Message.error({ content: 'Error deleting game', duration: 2000 });
    }
  };
  useEffect(() => {
    init();
  },[])

  // Function to get move prediction
  const getMovePrediction = async () => {
    if (record.length === 0) {
      return; // Don't show warning, just return silently
    }

    try {
      const result = await predictMove(record);
      if (result && result.predictedMove) {
        setPredictedMove(result.predictedMove);
        setShowPrediction(true);
        
        // Highlight the predicted move on the board
        const newSquares = {};
        newSquares[result.predictedMove.from] = {
          background: "rgba(0, 255, 0, 0.4)",
          borderRadius: "50%",
        };
        newSquares[result.predictedMove.to] = {
          background: "rgba(0, 255, 0, 0.4)",
          borderRadius: "50%",
        };
        setPredictedMoveSquares(newSquares);
      }
    } catch (error) {
      console.error("Error getting move prediction:", error);
      
      // Show error if prediction is manually enabled
      if (predictionEnabled) {
        if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
          Message.error({ 
            content: 'Server not running. Please start the server with: npm run server', 
            duration: 4000 
          });
        }
      }
    }
  };

  // Function to toggle prediction on/off
  const togglePrediction = () => {
    const newEnabled = !predictionEnabled;
    setPredictionEnabled(newEnabled);
    
    if (newEnabled) {
      // Turn on prediction
      setShowPrediction(true);
      if (record.length > 0) {
        getMovePrediction();
      }
      Message.success({ content: 'Stockfish prediction enabled', duration: 2000 });
    } else {
      // Turn off prediction
      setShowPrediction(false);
      setPredictedMove(null);
      setPredictedMoveSquares({});
      clearPrediction();
      Message.info({ content: 'Stockfish prediction disabled', duration: 2000 });
    }
  };


  // Function to get AI analysis for the current game state
  const analyzeChessMoves = async () => {
    if (record.length === 0) return;
    
    setIsLoadingAnalysis(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/chess/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ moves: record }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Server returns {commentary, predictedMove} directly
      if (result.commentary) {
        setAiAnalysis(result);
      } else if (result.analysis) {
        setAiAnalysis(result.analysis);
      } else {
        setAiAnalysis(result);
      }
    } catch (error) {
      console.error("Error getting AI analysis:", error);
      
      // Check if it's a connection error (server not running)
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.code === 'ECONNREFUSED') {
        Message.error({ 
          content: 'Server not running. Please start the server with: npm run server', 
          duration: 4000 
        });
      } else {
        Message.error({ content: 'Failed to get AI analysis', duration: 2000 });
      }
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {isCheckmate ? (
        <>
          <div className="overlay"></div>
          <div className="chess-modal">
            <p>{winner === "b" ? "White" : "Black"} Wins</p>
            <svg
              style={{ fill: winner === "b" ? "white" : "black" }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M224 0c17.7 0 32 14.3 32 32l0 16 16 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-16 0 0 48 152 0c22.1 0 40 17.9 40 40c0 5.3-1 10.5-3.1 15.4L368 400 80 400 3.1 215.4C1 210.5 0 205.3 0 200c0-22.1 17.9-40 40-40l152 0 0-48-16 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l16 0 0-16c0-17.7 14.3-32 32-32zM38.6 473.4L80 432l288 0 41.4 41.4c4.2 4.2 6.6 10 6.6 16c0 12.5-10.1 22.6-22.6 22.6L54.6 512C42.1 512 32 501.9 32 489.4c0-6 2.4-11.8 6.6-16z" />
            </svg>
            <button
              className="chess-btn"
              onClick={() => {
                safeGameMutate((game) => {
                  game.reset();
                  setIsCheckmate(false);
                });
                setMoveSquares({});
                setOptionSquares({});
                setRightClickedSquares({});
              }}
            >
              Reset
            </button>
          </div>
        </>
      ) : (
        ""
      )}
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1' }}>
        <Chessboard
          boardWidth={700}
          id="ClickToMove"
          animationDuration={200}
          arePiecesDraggable={false}
          position={game.fen()}
          // onPieceDrop={onDrop}
          onSquareClick={onSquareClick}
          onSquareRightClick={onSquareRightClick}
          onPromotionPieceSelect={onPromotionPieceSelect}
          customBoardStyle={{
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            margin: "0 auto",
          }}
          customSquareStyles={{
            ...moveSquares,
            ...optionSquares,
            ...rightClickedSquares,
            ...predictedMoveSquares,
          }}
          promotionToSquare={moveTo}
          showPromotionDialog={showPromotionDialog}
          onMouseOverSquare={() => {
            setIsCheckmate(game.isCheckmate());
            setWinner(game.turn());
          }}
        />
        <div className="chess-btn-container">
        {isRecord &&
          <button
            className="chess-btn"
            onClick={resetAll}
          >
            Reset
          </button>
        }
        {isRecord &&
          <button
            className="chess-btn"
            onClick={() => {
              game.undo();
              setMoveSquares({});
              setOptionSquares({});
              setRightClickedSquares({});
              setPredictedMoveSquares({});
              setShowPrediction(false);
              if (!undoLock) {
                setStep(step - 1);
                record.pop();
                setRecord(record);
                setUndoLock(true);
                // Get AI analysis after undoing a move
                analyzeChessMoves();
                
                // Auto-update prediction if enabled
                if (predictionEnabled) {
                  getMovePrediction();
                }
              }
            }}
          >
            Undo
          </button>
        }
        {isRecord &&
          <button
            className="chess-btn prediction-btn"
            onClick={togglePrediction}
            disabled={isPredicting}
            style={{
              backgroundColor: isPredicting ? '#6c757d' : (predictionEnabled ? '#dc3545' : '#28a745'),
              color: 'white'
            }}
          >
            {isPredicting ? 'Predicting...' : (predictionEnabled ? 'Turn Off Prediction' : 'Turn On Prediction')}
          </button>
        }
        </div>
      </div>
      
      <div className="record-list">
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px'}}>
          <Switch checked={isRecord} onChange={(value) => { setIsRecord(value); setStep(0); resetAll(); }} />
          <div style={{ flex: '1', textAlign: 'center', marginRight: '20px' }}>
            {isRecord ? <b>Chess Record</b> : <b>Manual List</b>}
          </div>
        </div>
        <div className="record-content">
          <div className="record-section">
            {isRecord ? (
              <Record 
                list={record} 
                onSave={(id, savedGame) => { 
                  resetAll(); 
                  setIsRecord(false); 
                  setStep(0); 
                  setManualList([...manualList, savedGame]); 
                  setManualId(String(id)); 
                }} 
              />
            ) : (
              <Manuals 
                manualId={manualId} 
                step={step} 
                onSelect={(value) => { 
                  setManualId(value); 
                  setStep(0); 
                  resetAll();
                  // Reload manual list to ensure we have latest data
                  init();
                }} 
                manualList={manualList} 
                onDelete={onDelete} 
              />
            )}
          </div>
          

          {/* AI Analysis Display */}
          {isRecord && (
            <div className="ai-analysis-section">
              {isLoadingAnalysis ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                  <Spin />
                </div>
              ) : aiAnalysis ? (
                <div className="ai-analysis-content">
                  <div>
                    <h4>AI COMMENTARY:</h4>
                    <p>{aiAnalysis.commentary}</p>
                  </div>
                </div>
              ) : (
                <p>Make a move to get AI analysis</p>
              )}
            </div>
          )}
        </div>
        </div>
      </div>
      
      {/* Move Prediction Display - Below record and AI analysis */}
      {isRecord && predictionEnabled && showPrediction && predictedMove && (
        <div className="move-prediction-section">
          <div className="prediction-content">
            <h4>Stockfish Prediction</h4>
            <div className="predicted-move-display">
              <div className="move-notation">
                {predictedMove.san || `${predictedMove.from} to ${predictedMove.to}`}
              </div>
              <div className="move-details">
                <span className="piece-info">
                  {predictedMove.piece?.toUpperCase()} from {predictedMove.from} to {predictedMove.to}
                </span>
              </div>
            </div>
            {predictionError && (
              <div className="prediction-error">
                Error: {predictionError}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChessGame;
