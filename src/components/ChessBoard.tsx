import { useState } from "react";
import { ChessBoard as ChessBoardType } from "../types";
import { getPieceImage } from "../utils/chessUtils";

interface ChessBoardProps {
  board: ChessBoardType;
  perspective?: "white" | "black";
  interactive?: boolean;
  onSquareClick?: (row: number, col: number) => void;
  selectedPiece?: {
    piece: string;
    color: "white" | "black";
  } | null;
  onDrop?: (row: number, col: number, piece?: { piece: string, color: "white" | "black" }) => void;
  highlightSquares?: [number, number][];
  onDragOutside?: (row: number, col: number) => void;
}

const ChessBoard = ({
  board,
  perspective = "white", // Default is white perspective
  interactive = false,
  onSquareClick,
  selectedPiece,
  onDrop,
  highlightSquares = [],
  onDragOutside,
}: ChessBoardProps) => {
  const [draggedPiece, setDraggedPiece] = useState<{ piece: string; color: "white" | "black" } | null>(null);
  const [dragSquare, setDragSquare] = useState<[number, number] | null>(null);

  // Ensure the board is properly initialized
  if (!board || !Array.isArray(board) || board.length === 0) {
    console.error("Chess board is not properly initialized:", board);
    return <div className="p-4 text-red-500">Error loading chess board</div>;
  }

  // Calculate rows/cols display order based on perspective
  // For perspective "white": rows are 7→0 (top to bottom), cols are 0→7 (left to right)
  // For perspective "black": rows are 0→7 (top to bottom), cols are 7→0 (left to right)
  const displayRows = perspective === "white" 
    ? Array.from({ length: 8 }, (_, i) => i) 
    : Array.from({ length: 8 }, (_, i) => 7 - i);
  const displayCols = perspective === "white"
    ? Array.from({ length: 8 }, (_, i) => i)
    : Array.from({ length: 8 }, (_, i) => 7 - i);

  // Helper for matching highlights
  const isHighlighted = (row: number, col: number) =>
    highlightSquares.some(([r, c]) => r === row && c === col);

  // Helper to check if a square is the drag source
  const isDragSource = (row: number, col: number) => 
    dragSquare !== null && dragSquare[0] === row && dragSquare[1] === col;

  // Handle drag from piece palette
  const handleSquareDrop = (
    e: React.DragEvent,
    row: number,
    col: number
  ) => {
    if (!interactive || !onDrop) return;
    e.preventDefault();

    // Get piece info from drag event or internal drag state
    const piece = e.dataTransfer.getData("piece");
    const color = e.dataTransfer.getData("color");
    
    if (piece && color) {
      onDrop(row, col, { piece, color: color as "white" | "black" });
    } else if (draggedPiece && dragSquare) {
      // Board-to-board drag: move or swap
      onDrop(row, col, draggedPiece);
    }
    setDraggedPiece(null);
    setDragSquare(null);
  };

  // Handle drag from a board square
  const handlePieceDragStart = (
    e: React.DragEvent,
    row: number,
    col: number,
    piece: string,
    color: "white" | "black"
  ) => {
    if (!interactive) return;
    setDraggedPiece({ piece, color });
    setDragSquare([row, col]);
    e.dataTransfer.setData("piece", piece);
    e.dataTransfer.setData("color", color);
    // Provide custom drag image
    const img = new window.Image();
    img.src = getPieceImage(piece, color);
    e.dataTransfer.setDragImage(img, 25, 25);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!interactive) return;
    e.preventDefault();
  };

  const handleDragLeave = () => {};

  const handleSquareClick = (row: number, col: number) => {
    if (!interactive || !onSquareClick) return;
    onSquareClick(row, col);
  };
  
  // Handle when a drag operation ends
  const handleDragEnd = (e: React.DragEvent) => {
    if (!interactive || !dragSquare || !onDragOutside) return;
    
    // If the drag didn't end on a valid drop target (ended outside the board)
    if (e.dataTransfer.dropEffect === 'none') {
      onDragOutside(dragSquare[0], dragSquare[1]);
    }
    
    setDraggedPiece(null);
    setDragSquare(null);
  };

  // For coordinate labels (ranks and files)
  const fileLabels = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const rankLabels = ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <div
      className="relative w-full max-w-lg aspect-square mx-auto rounded-lg overflow-hidden shadow-md border border-chess-darker bg-chess-light"
      style={{ minWidth: 320 }}
      onDragOver={handleDragOver}
    >
      {/* Coordinate labels */}
      <div className="absolute inset-0 pointer-events-none">
        {/* File labels (a-h) - bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-around">
          {fileLabels.map(file => <div key={file} className="w-full text-center text-xs font-medium text-gray-500">{file}</div>)}
        </div>
        
        {/* Rank labels (1-8) - left side */}
        <div className="absolute top-0 left-1 bottom-0 flex flex-col justify-around">
          {rankLabels.map(rank => <div key={rank} className="h-full flex items-center text-xs font-medium text-gray-500">{rank}</div>)}
        </div>
      </div>

      <div className="grid grid-cols-8 grid-rows-8 w-full h-full absolute inset-0 pointer-events-none" aria-hidden />
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full absolute inset-0 pl-4 pt-0 pb-4">
        {displayRows.map((rowIdx, i) =>
          displayCols.map((colIdx, j) => {
            const isLight = (rowIdx + colIdx) % 2 === 0;
            // The square's content comes from the board array
            const square = board[rowIdx] && board[rowIdx][colIdx] 
              ? board[rowIdx][colIdx] 
              : { piece: null, color: null };

            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                className={`
                  relative flex items-center justify-center aspect-square select-none
                  transition-colors duration-150 ease-in-out
                  ${isLight ? "bg-chess-light" : "bg-chess-dark"}
                  ${isHighlighted(rowIdx, colIdx) || isDragSource(rowIdx, colIdx)
                    ? "ring-2 ring-chess-accent z-10"
                    : ""}
                  ${interactive ? "cursor-pointer hover:brightness-105" : ""}
                `}
                style={{ minWidth: 0, minHeight: 0 }}
                draggable={false}
                onClick={() => handleSquareClick(rowIdx, colIdx)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleSquareDrop(e, rowIdx, colIdx)}
                data-testid={`square-${rowIdx},${colIdx}`}
              >
                {square && square.piece && (
                  <img
                    src={getPieceImage(square.piece, square.color!)}
                    alt={`${square.color} ${square.piece}`}
                    className={`
                      block w-9/12 h-9/12 aspect-square max-w-[40px] max-h-[40px] m-auto drop-shadow-md
                      ${interactive ? "cursor-grab active:cursor-grabbing" : ""}
                      ${isDragSource(rowIdx, colIdx) ? "opacity-50" : ""}
                    `}
                    draggable={interactive}
                    onDragStart={(e) =>
                      handlePieceDragStart(
                        e,
                        rowIdx,
                        colIdx,
                        square.piece!,
                        square.color!
                      )
                    }
                    onDragEnd={handleDragEnd}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChessBoard;
