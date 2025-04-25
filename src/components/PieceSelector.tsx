
import { useState } from "react";
import { getPieceImage } from "../utils/chessUtils";

interface PieceSelectorProps {
  onSelectPiece: (piece: string, color: "white" | "black") => void;
}

const PieceSelector = ({ onSelectPiece }: PieceSelectorProps) => {
  const [activeColor, setActiveColor] = useState<"white" | "black">("white");
  
  const pieces = [
    { type: "p", name: "Pawn" },
    { type: "r", name: "Rook" },
    { type: "n", name: "Knight" },
    { type: "b", name: "Bishop" },
    { type: "q", name: "Queen" },
    { type: "k", name: "King" },
  ];

  const handleDragStart = (e: React.DragEvent, piece: string) => {
    e.dataTransfer.setData("piece", piece);
    e.dataTransfer.setData("color", activeColor);
    
    // Create a drag image (optional)
    const img = new Image();
    img.src = getPieceImage(piece, activeColor);
    e.dataTransfer.setDragImage(img, 30, 30);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-center space-x-4 mb-3">
        <button
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            activeColor === "white" 
              ? "bg-chess-primary text-white" 
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveColor("white")}
        >
          White
        </button>
        <button
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            activeColor === "black" 
              ? "bg-chess-primary text-white" 
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveColor("black")}
        >
          Black
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {pieces.map((piece) => (
          <div
            key={piece.type}
            className="flex flex-col items-center bg-gray-50 p-2 rounded-md cursor-grab hover:bg-gray-100 transition-colors"
            draggable
            onDragStart={(e) => handleDragStart(e, piece.type)}
            onClick={() => onSelectPiece(piece.type, activeColor)}
          >
            <img
              src={getPieceImage(piece.type, activeColor)}
              alt={`${activeColor} ${piece.name}`}
              className="h-10 w-10"
            />
            <span className="text-xs mt-1">{piece.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieceSelector;
