import { Chess } from 'chess.js';
import Stockfish from 'stockfish';

/**
 * Stockfish Chess Engine Service
 * Provides chess position analysis using the Stockfish engine
 */
class StockfishService {
  constructor() {
    this.engine = null;
    this.isReady = false;
    this.analysisPromise = null;
    this.initializeEngine();
  }

  /**
   * Initialize the Stockfish engine
   */
  initializeEngine() {
    this.engine = Stockfish();
    
    this.engine.onmessage = (event) => {
      const message = event.data || event;
      console.log('Stockfish message:', message);
      
      if (message === 'uciok') {
        this.isReady = true;
        console.log('Stockfish engine ready');
      }
    };

    // Initialize UCI protocol
    this.engine.postMessage('uci');
    this.engine.postMessage('isready');
  }

  /**
   * Wait for engine to be ready
   */
  async waitForReady() {
    return new Promise((resolve) => {
      if (this.isReady) {
        resolve();
        return;
      }

      const checkReady = () => {
        if (this.isReady) {
          resolve();
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    });
  }

  /**
   * Analyze a chess position and get the best move
   * @param {Array} moves - Array of moves in format [{from: 'e2', to: 'e4'}, ...]
   * @param {number} depth - Analysis depth (default: 15)
   * @returns {Promise<Object>} Analysis result with best move and evaluation
   */
  async analyzePosition(moves, depth = 15) {
    await this.waitForReady();

    return new Promise((resolve, reject) => {
      const chess = new Chess();
      let analysisResult = {
        bestMove: null,
        evaluation: null,
        depth: depth,
        pv: [], // Principal variation (best line)
        nodes: 0,
        time: 0
      };

      // Set up the position
      try {
        moves.forEach(move => {
          const moveObj = chess.move({
            from: move.from,
            to: move.to,
            promotion: move.promotion || 'q' // Default to queen promotion
          });
          
          if (!moveObj) {
            throw new Error(`Invalid move: ${move.from} to ${move.to}`);
          }
        });
      } catch (error) {
        reject(new Error(`Invalid position: ${error.message}`));
        return;
      }

      // Set up message handler for this analysis
      const originalHandler = this.engine.onmessage;
      let analysisComplete = false;

      this.engine.onmessage = (event) => {
        const message = event.data || event;
        
        if (analysisComplete) return;

        // Parse bestmove response
        if (message.startsWith('bestmove')) {
          const parts = message.split(' ');
          if (parts.length >= 2) {
            const bestMoveUCI = parts[1];
            analysisResult.bestMove = this.convertUCIToMove(bestMoveUCI);
            
            // Get principal variation if available
            if (parts.length > 2 && parts[2] === 'ponder') {
              const ponderMove = parts[3];
              analysisResult.pv.push(this.convertUCIToMove(ponderMove));
            }
          }
          
          analysisComplete = true;
          this.engine.onmessage = originalHandler;
          resolve(analysisResult);
        }
        
        // Parse info response for evaluation
        else if (message.startsWith('info')) {
          const parts = message.split(' ');
          
          for (let i = 0; i < parts.length; i++) {
            if (parts[i] === 'depth' && i + 1 < parts.length) {
              analysisResult.depth = parseInt(parts[i + 1]);
            }
            else if (parts[i] === 'score' && i + 1 < parts.length) {
              if (parts[i + 1] === 'cp') {
                analysisResult.evaluation = parseInt(parts[i + 2]) / 100; // Convert centipawns to pawns
              } else if (parts[i + 1] === 'mate') {
                analysisResult.evaluation = `M${parts[i + 2]}`; // Mate in X moves
              }
            }
            else if (parts[i] === 'nodes' && i + 1 < parts.length) {
              analysisResult.nodes = parseInt(parts[i + 1]);
            }
            else if (parts[i] === 'time' && i + 1 < parts.length) {
              analysisResult.time = parseInt(parts[i + 1]);
            }
            else if (parts[i] === 'pv' && i + 1 < parts.length) {
              // Parse principal variation
              analysisResult.pv = [];
              for (let j = i + 1; j < parts.length; j++) {
                if (parts[j] && !parts[j].startsWith('depth') && !parts[j].startsWith('score')) {
                  analysisResult.pv.push(this.convertUCIToMove(parts[j]));
                } else {
                  break;
                }
              }
            }
          }
        }
      };

      // Set position and start analysis
      const fen = chess.fen();
      this.engine.postMessage(`position fen ${fen}`);
      this.engine.postMessage(`go depth ${depth}`);
    });
  }

  /**
   * Convert UCI move notation to readable format
   * @param {string} uciMove - UCI move (e.g., "e2e4")
   * @returns {Object} Move object with from and to properties
   */
  convertUCIToMove(uciMove) {
    if (!uciMove || uciMove.length < 4) {
      return null;
    }

    const from = uciMove.substring(0, 2);
    const to = uciMove.substring(2, 4);
    const promotion = uciMove.length > 4 ? uciMove.substring(4, 5) : null;

    return {
      from: from,
      to: to,
      promotion: promotion,
      uci: uciMove
    };
  }

  /**
   * Get multiple best moves for a position
   * @param {Array} moves - Array of moves
   * @param {number} numMoves - Number of best moves to return (default: 3)
   * @returns {Promise<Array>} Array of best moves with evaluations
   */
  async getMultipleBestMoves(moves, numMoves = 3) {
    await this.waitForReady();

    return new Promise((resolve, reject) => {
      const chess = new Chess();
      const bestMoves = [];

      try {
        // Set up the position
        moves.forEach(move => {
          const moveObj = chess.move({
            from: move.from,
            to: move.to,
            promotion: move.promotion || 'q'
          });
          
          if (!moveObj) {
            throw new Error(`Invalid move: ${move.from} to ${move.to}`);
          }
        });
      } catch (error) {
        reject(new Error(`Invalid position: ${error.message}`));
        return;
      }

      const originalHandler = this.engine.onmessage;
      let analysisComplete = false;

      this.engine.onmessage = (event) => {
        const message = event.data || event;
        
        if (analysisComplete) return;

        if (message.startsWith('bestmove')) {
          analysisComplete = true;
          this.engine.onmessage = originalHandler;
          resolve(bestMoves);
        }
        else if (message.startsWith('info') && message.includes('multipv')) {
          const parts = message.split(' ');
          let moveInfo = {};
          
          for (let i = 0; i < parts.length; i++) {
            if (parts[i] === 'multipv' && i + 1 < parts.length) {
              moveInfo.rank = parseInt(parts[i + 1]);
            }
            else if (parts[i] === 'score' && i + 1 < parts.length) {
              if (parts[i + 1] === 'cp') {
                moveInfo.evaluation = parseInt(parts[i + 2]) / 100;
              } else if (parts[i + 1] === 'mate') {
                moveInfo.evaluation = `M${parts[i + 2]}`;
              }
            }
            else if (parts[i] === 'pv' && i + 1 < parts.length) {
              moveInfo.move = this.convertUCIToMove(parts[i + 1]);
            }
          }
          
          if (moveInfo.rank && moveInfo.move) {
            bestMoves.push(moveInfo);
          }
        }
      };

      const fen = chess.fen();
      this.engine.postMessage(`position fen ${fen}`);
      this.engine.postMessage(`setoption name MultiPV value ${numMoves}`);
      this.engine.postMessage(`go depth 15`);
    });
  }

  /**
   * Get engine status
   */
  getStatus() {
    return {
      ready: this.isReady,
      engine: 'Stockfish'
    };
  }
}

// Create a singleton instance
const stockfishService = new StockfishService();

export default stockfishService;

