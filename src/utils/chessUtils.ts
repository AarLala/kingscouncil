import { Chess, Piece, Square } from "chess.js";
import { ChessBoard, ChessSquare } from "../types";

// Convert FEN string to a ChessBoard array
export function fenToBoard(fen: string): ChessBoard {
  try {
    // Validate FEN string first
    const validFen = getSafeFen(fen);
    const chess = new Chess(validFen);
    const board: ChessBoard = Array(8).fill(null).map(() => Array(8).fill(null));

    const squares = chess.board();

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = squares[row][col];
        if (piece) {
          board[row][col] = {
            piece: piece.type,
            color: piece.color === "w" ? "white" : "black",
          };
        } else {
          board[row][col] = { piece: null, color: null };
        }
      }
    }

    return board;
  } catch (error) {
    console.error("Error converting FEN to board:", error);
    // Return empty board as fallback
    return Array(8).fill(null).map(() => 
      Array(8).fill(null).map(() => ({ piece: null, color: null }))
    );
  }
}

// Convert ChessBoard array (specifically string[][] from generateRandomPosition) to a FEN string
export function boardToFen(board: string[][]): string {
  let fen = '';
  for (let row = 0; row < 8; row++) {
    let emptyCount = 0;
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]; // piece is now 'K', 'p', '.' etc.
      
      if (piece === '.') { // Check for empty square
        emptyCount++;
      } else { // It's a piece
        if (emptyCount > 0) {
          fen += emptyCount; // Add the count of empty squares
          emptyCount = 0;
        }
        fen += piece; // Add the piece character directly ('K', 'p', etc.)
      }
    }
    // Add any trailing empty count for the row
    if (emptyCount > 0) {
      fen += emptyCount;
    }
    // Add row separator
    if (row < 7) {
      fen += "/";
    }
  }
  // Use a simpler FEN suffix
  fen += " w - - 0 1"; 
  console.log(`[boardToFen] Converted string[][] to FEN: ${fen}`); // Add log to confirm correct conversion
  return fen;
}

// Calculate accuracy between two chess boards
export function calculateAccuracy(
  originalBoard: ChessBoard,
  userBoard: ChessBoard
): number {
  let correctPieces = 0;
  let totalPieces = 0;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const originalSquare = originalBoard[row][col];
      const userSquare = userBoard[row][col];

      if (originalSquare && originalSquare.piece) {
        totalPieces++;
        if (
          userSquare &&
          userSquare.piece === originalSquare.piece &&
          userSquare.color === originalSquare.color
        ) {
          correctPieces++;
        }
      }
    }
  }

  return totalPieces > 0 ? Math.round((correctPieces / totalPieces) * 100) : 0;
}

// Piece placement probabilities for different difficulties
const pieceProbabilities = {
  easy: {
    p: 0.3, // pawns
    n: 0.2, // knights
    b: 0.2, // bishops
    r: 0.15, // rooks
    q: 0.1, // queens
  },
  medium: {
    p: 0.5,
    n: 0.3,
    b: 0.3,
    r: 0.25,
    q: 0.15,
  },
  hard: {
    p: 0.7,
    n: 0.4,
    b: 0.4,
    r: 0.35,
    q: 0.2,
  }
};

/**
 * Generates a random chess position based on difficulty level
 * @param difficulty 'easy' | 'medium' | 'hard'
 * @returns FEN string of the generated position
 */
export function generateRandomPosition(difficulty: 'easy' | 'medium' | 'hard'): string {
  console.log(`[generateRandomPosition] Difficulty: ${difficulty}`); // Log difficulty

  // Define piece counts for different difficulties
  const pieceCountRanges = {
    easy: { min: 10, max: 14 },
    medium: { min: 12, max: 20 },
    hard: { min: 16, max: 26 }
  };

  const range = pieceCountRanges[difficulty];
  const totalPieces = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  console.log(`[generateRandomPosition] Calculated totalPieces: ${totalPieces}`); // Log total pieces

  // Initialize empty board
  const board = Array(8).fill(null).map(() => Array(8).fill('.'));

  // Always place kings first
  const whiteKingPos = placeRandomPiece(board, 'K');
  const blackKingPos = placeRandomPiece(board, 'k', whiteKingPos);

  // Available pieces with their relative frequencies
  const pieces = {
    white: ['P', 'R', 'N', 'B', 'Q'],
    black: ['p', 'r', 'n', 'b', 'q']
  };

  // Place remaining pieces
  const piecesToPlace = totalPieces - 2; // subtract 2 for the kings
  console.log(`[generateRandomPosition] piecesToPlace (excluding kings): ${piecesToPlace}`); // Log pieces to place

  for (let i = 0; i < piecesToPlace; i++) {
    const color = Math.random() < 0.5 ? 'white' : 'black';
    const piece = pieces[color][Math.floor(Math.random() * pieces[color].length)];
    console.log(`[generateRandomPosition] Placing piece ${i + 1}/${piecesToPlace}: ${piece}`); // Log each piece placement attempt
    placeRandomPiece(board, piece);
  }

  // Convert board to FEN
  const fenResult = boardToFen(board);
  console.log(`[generateRandomPosition] Generated FEN: ${fenResult}`); // Log final FEN
  return fenResult;
}

/**
 * Places a piece randomly on the board
 * @param board The current board state
 * @param piece The piece to place
 * @param avoidPos Optional position to avoid (for king placement)
 * @returns The position where the piece was placed
 */
function placeRandomPiece(board: string[][], piece: string, avoidPos?: { row: number, col: number }): { row: number, col: number } {
  let attempts = 0;
  while (true) {
    attempts++;
    if (attempts > 1000) { // Safety break for potential infinite loop
      console.error("[placeRandomPiece] Too many attempts, breaking loop. Piece:", piece);
      // Return a dummy position to avoid crashing, although this might lead to issues
      // A better approach might be to throw an error or regenerate the board
      return { row: -1, col: -1 }; 
    }

    const row = Math.floor(Math.random() * 8);
    const col = Math.floor(Math.random() * 8);
    const currentContent = board[row][col];
    // console.log(`[placeRandomPiece] Attempt ${attempts}: Trying ${piece} at [${row}, ${col}]. Current content: ${currentContent}`);

    // Skip if trying to place on occupied square
    if (currentContent !== '.') {
      // console.log(`[placeRandomPiece] Skipping: Square [${row}, ${col}] occupied by ${currentContent}`);
      continue;
    }

    // For kings, ensure they're not adjacent (only relevant when placing black king)
    if (avoidPos && Math.abs(row - avoidPos.row) <= 1 && Math.abs(col - avoidPos.col) <= 1) {
      // console.log(`[placeRandomPiece] Skipping: Too close to other king at [${avoidPos.row}, ${avoidPos.col}]`);
      continue;
    }

    // For pawns, avoid first and last ranks
    if ((piece.toLowerCase() === 'p') && (row === 0 || row === 7)) {
      // console.log(`[placeRandomPiece] Skipping: Pawn on invalid rank ${row}`);
      continue;
    }

    // Place the piece if all checks pass
    board[row][col] = piece;
    console.log(`[placeRandomPiece] Successfully placed ${piece} at [${row}, ${col}] (Previous: ${currentContent})`);
    return { row, col };
  }
}

// Sample middlegame positions for variety
const middlegamePositions = [
  "r1bq1rk1/ppp2ppp/2np1n2/4p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 1",
  "r2qkb1r/1p1n1ppp/p2p1n2/4p3/4P3/1NN1B3/PPP2PPP/R2QK2R w KQkq - 0 1",
  "r1bqk2r/pp2bppp/2n2n2/2pp4/3P4/2N2NP1/PP2PPBP/R1BQK2R w KQkq - 0 1",
  "rnbq1rk1/pp3ppp/4pn2/2p5/2B5/2N1P3/PP3PPP/R1BQK2R w KQ - 0 1",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 1"
];

// Generate a position for challenges based on difficulty
export function getRandomChessPosition(difficulty: 'easy' | 'medium' | 'hard' = 'medium'): string {
  try {
    // Sometimes use predefined middlegame positions for more realistic scenarios
    if (difficulty === 'hard' && Math.random() < 0.3) {
      return middlegamePositions[Math.floor(Math.random() * middlegamePositions.length)];
    }
    
    // Generate a random position with appropriate complexity
    return generateRandomPosition(difficulty);
  } catch (error) {
    console.error("Error generating random chess position:", error);
    return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  }
}

// Sample positions for the challenges - properly formatted standard positions with kings
export const samplePositions = [
  {
    title: "Starting Position",
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  },
  {
    title: "Simple Checkmate Pattern",
    fen: "8/8/8/8/3K4/4Q3/8/4k3 w - - 0 1",
  },
  {
    title: "Rook Endgame",
    fen: "6k1/8/8/8/8/8/1R6/1K6 w - - 0 1",
  },
  {
    title: "Queen and Pawn vs Queen",
    fen: "3k4/8/8/8/3K4/3Q4/4P3/8 w - - 0 1",
  },
  {
    title: "Knight and Bishop Checkmate",
    fen: "k7/8/8/8/8/2K5/2N5/1B6 w - - 0 1",
  },
  {
    title: "King and Pawn Endgame",
    fen: "4k3/8/8/8/8/3K4/2P5/8 w - - 0 1",
  },
  {
    title: "Sicilian Defense",
    fen: "r1bqkb1r/pp2pp1p/2np1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6",
  },
  {
    title: "Queen's Gambit Declined",
    fen: "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 4",
  },
  {
    title: "Caro-Kann Defense",
    fen: "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
  },
  {
    title: "French Defense",
    fen: "rnbqkb1r/ppp2ppp/4pn2/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 4",
  },
  {
    title: "King's Indian Defense",
    fen: "rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 4",
  },
];

// Preload piece images
export function preloadChessPieces() {
  const pieces = ['p', 'r', 'n', 'b', 'q', 'k'];
  const colors = ['b', 'w'];
  
  pieces.forEach(piece => {
    colors.forEach(color => {
      const img = new Image();
      img.src = `/chess/${color}${piece}.svg`;
    });
  });
}

// Get the image path for a chess piece
export function getPieceImage(piece: string | null, color: "white" | "black" | null): string {
  if (!piece || !color) return '';
  
  const colorCode = color === 'white' ? 'w' : 'b';
  return `/chess/${colorCode}${piece}.svg`;
}

// Validate if a FEN string is valid
export function isValidFen(fen: string): boolean {
  try {
    // Check if the FEN has a white king and a black king
    if (!fen.includes('K') || !fen.includes('k')) {
      return false;
    }
    
    new Chess(fen);
    return true;
  } catch (error) {
    console.error("Invalid FEN string:", error);
    return false;
  }
}

// Get a safe FEN string - ensures a valid position is always returned
export function getSafeFen(fen: string): string {
  try {
    // First check if the FEN contains both kings
    if (!fen.includes('K') || !fen.includes('k')) {
      console.error("FEN missing kings, using default:", fen);
      return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    }
    
    new Chess(fen);
    return fen;
  } catch (error) {
    console.error("Invalid FEN, using default:", error);
    return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  }
}
