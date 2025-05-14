import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useState, useEffect } from "react";
import Record from "./record";
import Manuals from "./manuals";
import "./board.css";
import { Switch, Message, Card, Spin } from '@arco-design/web-react';
import api from "../../ajax";
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

  function makeRandomMove() {
    const possibleMoves = game.moves();
    // exit if the game is over
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0)
      return;

    // const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    // safeGameMutate((game) => {
    //   game.move(possibleMoves[randomIndex]);
    // });
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
        getAIAnalysis();
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
      setTimeout(makeRandomMove, 300);
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

  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return false;
    return true;
  }

  function makeAMove(move) {
    const gameCopy = new Chess(game.fen());
    const result = gameCopy.move(move);
    setGame(gameCopy);
    return result; // null if the move was illegal, the move object if the move was legal
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
  }
  const init = async () => {
    const result = await api.board.getBoards() || [];
    setManualList(result);
  }
  const onDelete = async (id) => {
    const result = await api.board.deleteBoard(id);
    if (result) {
      const newList = manualList.filter(v => String(v.id) !== id);
      setManualList(newList);
      setStep(0);
      resetAll();
    } else {
      Message.error({ content: 'Server Error', duration: 2000 });
    }
  };
  useEffect(() => {
    init();
  },[])

  // Function to get AI analysis for the current game state
  const getAIAnalysis = async () => {
    if (record.length === 0) return;
    
    setIsLoadingAnalysis(true);
    try {
      const result = await api.board.getAIAnalysis(record);
      setAiAnalysis(result);
    } catch (error) {
      console.error("Error getting AI analysis:", error);
      Message.error({ content: 'Failed to get AI analysis', duration: 2000 });
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  return (
    <div style={{ position: "relative", display: 'flex' }}>
      {isCheckmate ? (
        <>
          <div className="overlay"></div>
          <div className="chess-modal">
            <p>{winner == "b" ? "White" : "Black"} Wins</p>
            <svg
              style={{ fill: winner == "b" ? "white" : "black" }}
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
              if (!undoLock) {
                setStep(step - 1);
                record.pop();
                setRecord(record);
                setUndoLock(true);
                // Get AI analysis after undoing a move
                getAIAnalysis();
              }
            }}
          >
            Undo
          </button>
        }
        </div>
        
        {/* AI Analysis Display */}
        {isRecord && (
          <div style={{ marginTop: '20px' }}>
            <Card title="AI Analysis" bordered={false}>
              {isLoadingAnalysis ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                  <Spin />
                </div>
              ) : aiAnalysis ? (
                <div>
                  <div style={{ marginBottom: '15px' }}>
                    <h4>Commentary:</h4>
                    <p>{aiAnalysis.commentary}</p>
                  </div>
                  <div>
                    <h4>Predicted Opponent Move:</h4>
                    <p>{aiAnalysis.predictedMove}</p>
                  </div>
                </div>
              ) : (
                <p>Make a move to get AI analysis</p>
              )}
            </Card>
          </div>
        )}
      </div>
      <div className="record-list">
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px'}}>
          <Switch checked={isRecord} onChange={(value) => { setIsRecord(value); setStep(0); resetAll(); }} />
          <div style={{ flex: '1', textAlign: 'center', marginRight: '20px' }}>
            {isRecord ? <b>Chess Record</b> : <b>Manual List</b>}
          </div>
        </div>
        <div style={{ flex: '1', overflow: 'hidden' }}>
          {isRecord ? <Record list={record} onSave={(id, list) => { resetAll(); setIsRecord(false); setStep(0); manualList.push(list); setManualList(manualList); setManualId(String(id)) }} /> : <Manuals manualId={manualId} step={step} onSelect={(value) => { setManualId(value); setStep(0); resetAll(); }} manualList={manualList} onDelete={onDelete} />}</div>        
      </div>
    </div>
  );
};

export default ChessGame;
