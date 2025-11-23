import { Chess } from 'chess.js';

/**
 * Formats chess moves into professional notation
 * Converts moves like [{from: 'e2', to: 'e4'}, {from: 'e7', to: 'e5'}] 
 * into "1. e4, e5" format
 */
export function formatMoves(moves) {
  if (!moves || moves.length === 0) return [];
  
  const chess = new Chess();
  const formattedMoves = [];
  
  // First, replay all moves to determine which are white and which are black
  const moveNotations = [];
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    try {
      const chessMove = chess.move({
        from: move.from,
        to: move.to,
        promotion: move.promotion || 'q'
      });
      
      if (chessMove) {
        moveNotations.push({
          san: chessMove.san,
          color: chessMove.color,
          index: i
        });
      }
    } catch (error) {
      // If move is invalid, skip it
      console.error('Error formatting move:', move, error);
    }
  }
  
  // Now group moves by move number (White+Black pairs)
  let i = 0;
  let moveNumber = 1;
  
  while (i < moveNotations.length) {
    const moveNote = moveNotations[i];
    
    if (moveNote.color === 'w') {
      // White move - start new move number
      const formattedMove = {
        moveNumber: moveNumber,
        whiteMove: moveNote.san,
        blackMove: null,
        full: `${moveNumber}. ${moveNote.san}`
      };
      
      // Check if there's a black move next
      if (i + 1 < moveNotations.length && moveNotations[i + 1].color === 'b') {
        formattedMove.blackMove = moveNotations[i + 1].san;
        formattedMove.full = `${moveNumber}. ${moveNote.san}, ${moveNotations[i + 1].san}`;
        i += 2; // Skip both white and black moves
      } else {
        i++; // Only skip white move
      }
      
      formattedMoves.push(formattedMove);
      moveNumber++;
    } else {
      // Black move without preceding white move - edge case (shouldn't happen in normal chess)
      formattedMoves.push({
        moveNumber: moveNumber,
        whiteMove: null,
        blackMove: moveNote.san,
        full: `${moveNumber}. ...${moveNote.san}`
      });
      i++;
      moveNumber++;
    }
  }
  
  return formattedMoves;
}

/**
 * Gets the move notation for a single move (like "e4" or "Nf3")
 */
export function getMoveNotation(move) {
  if (!move) return '';
  
  const chess = new Chess();
  try {
    const chessMove = chess.move({
      from: move.from,
      to: move.to,
      promotion: move.promotion || 'q'
    });
    return chessMove ? chessMove.san : '';
  } catch (error) {
    return '';
  }
}

