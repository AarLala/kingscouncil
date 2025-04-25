import { useState, useEffect } from "react";
import Header from "../components/Header";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import ChessBoard from "../components/ChessBoard";
import { fenToBoard } from "../utils/chessUtils";
import { Timer } from "lucide-react";

const initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const files = "abcdefgh";

function getLegalPawnMoves(board, row, col, color) {
  const dir = color === "white" ? -1 : 1;
  const startRow = color === "white" ? 6 : 1;
  const moves = [];
  if (row+dir >=0 && row+dir < 8 && !board[row+dir][col].piece) {
    moves.push([row+dir, col]);
    if (row === startRow && !board[row+2*dir][col].piece) {
      moves.push([row+2*dir, col]);
    }
  }
  [col-1, col+1].forEach(c=>{
    if (c>=0 && c<8 && row+dir>=0 && row+dir<8) {
      const sq = board[row+dir][c];
      if (sq.piece && sq.color !== color) {
        moves.push([row+dir, c]);
      }
    }
  });
  return moves;
}

function getLegalKnightMoves(board, row, col, color) {
  const deltas = [
    [-2,-1], [-2,1], [-1,2], [1,2], [2,1], [2,-1], [1,-2], [-1,-2]
  ];
  const moves = [];
  for (const [dr, dc] of deltas) {
    const r = row+dr, c = col+dc;
    if (r>=0 && r<8 && c>=0 && c<8) {
      const sq = board[r][c];
      if (!sq.piece || sq.color !== color) {
        moves.push([r, c]);
      }
    }
  }
  return moves;
}

function getLegalRookMoves(board, row, col, color) {
  const moves = [];
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // right, down, left, up
  
  for (const [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;
    
    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      const sq = board[r][c];
      if (!sq.piece) {
        moves.push([r, c]);
      } else {
        if (sq.color !== color) {
          moves.push([r, c]); // capture
        }
        break; // blocked
      }
      r += dr;
      c += dc;
    }
  }
  
  return moves;
}

function getLegalBishopMoves(board, row, col, color) {
  const moves = [];
  const directions = [[1, 1], [1, -1], [-1, -1], [-1, 1]]; // diagonals
  
  for (const [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;
    
    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      const sq = board[r][c];
      if (!sq.piece) {
        moves.push([r, c]);
      } else {
        if (sq.color !== color) {
          moves.push([r, c]); // capture
        }
        break; // blocked
      }
      r += dr;
      c += dc;
    }
  }
  
  return moves;
}

function getLegalQueenMoves(board, row, col, color) {
  return [
    ...getLegalRookMoves(board, row, col, color),
    ...getLegalBishopMoves(board, row, col, color)
  ];
}

function getLegalKingMoves(board, row, col, color) {
  const moves = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      
      const r = row + dr;
      const c = col + dc;
      
      if (r >= 0 && r < 8 && c >= 0 && c < 8) {
        const sq = board[r][c];
        if (!sq.piece || sq.color !== color) {
          moves.push([r, c]);
        }
      }
    }
  }
  return moves;
}

function getAllLegalMoves(board, color) {
  const moves = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const sq = board[i][j];
      if (sq.piece && sq.color === color) {
        let pieceMoves = [];
        
        switch (sq.piece) {
          case 'p':
            pieceMoves = getLegalPawnMoves(board, i, j, color);
            break;
          case 'n':
            pieceMoves = getLegalKnightMoves(board, i, j, color);
            break;
          case 'r':
            pieceMoves = getLegalRookMoves(board, i, j, color);
            break;
          case 'b':
            pieceMoves = getLegalBishopMoves(board, i, j, color);
            break;
          case 'q':
            pieceMoves = getLegalQueenMoves(board, i, j, color);
            break;
          case 'k':
            pieceMoves = getLegalKingMoves(board, i, j, color);
            break;
        }
        
        for (const [r, c] of pieceMoves) {
          moves.push({ from: [i, j], to: [r, c], piece: sq.piece });
        }
      }
    }
  }
  return moves;
}

function moveToSan(move, fromSq, toSq) {
  switch (fromSq.piece) {
    case 'n':
      return "N" + files[move.to[1]] + (8-move.to[0]);
    case 'p':
      if (move.from[1] !== move.to[1]) {
        return files[move.from[1]] + "x" + files[move.to[1]] + (8-move.to[0]);
      }
      return files[move.to[1]] + (8-move.to[0]);
    case 'r':
      return "R" + files[move.to[1]] + (8-move.to[0]);
    case 'b':
      return "B" + files[move.to[1]] + (8-move.to[0]);
    case 'q':
      return "Q" + files[move.to[1]] + (8-move.to[0]);
    case 'k':
      return "K" + files[move.to[1]] + (8-move.to[0]);
    default:
      return "";
  }
}

function applyMove(board, move) {
  const bp = board.map(row=>row.map(sq=>({...sq})));
  const piece = bp[move.from[0]][move.from[1]].piece;
  const color = bp[move.from[0]][move.from[1]].color;
  bp[move.from[0]][move.from[1]] = { piece:null, color:null };
  bp[move.to[0]][move.to[1]] = { piece, color };
  return bp;
}

const RecallTheGame = () => {
  const { toast } = useToast();
  const [board, setBoard] = useState(fenToBoard(initialFen));
  const [selected, setSelected] = useState<[number,number]|null>(null);
  const [legalSquares, setLegalSquares] = useState<[number,number][]>([]);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [moveCount, setMoveCount] = useState(0);
  const [recallOpen, setRecallOpen] = useState(false);
  const [recallInput, setRecallInput] = useState("");
  const [recallScore, setRecallScore] = useState<number|null>(null);
  const [info, setInfo] = useState<string>("");
  const [totalScore, setTotalScore] = useState(0);
  const [round, setRound] = useState(1);
  const [maxRounds, setMaxRounds] = useState<3|5|7>(3);
  const [gamePhase, setGamePhase] = useState<"setup"|"play">("setup");
  const [playerColor, setPlayerColor] = useState<"white"|"black">("white");

  useEffect(() => {
    if (selected) {
      const [row, col] = selected;
      const piece = board[row][col].piece;
      const color = board[row][col].color;
      if (!piece || color !== (isWhiteTurn ? "white":"black")) {
        setLegalSquares([]);
        return;
      }
      
      let moves: [number,number][] = [];
      switch(piece) {
        case "p": 
          moves = getLegalPawnMoves(board, row, col, color);
          break;
        case "n": 
          moves = getLegalKnightMoves(board, row, col, color);
          break;
        case "r":
          moves = getLegalRookMoves(board, row, col, color);
          break;
        case "b":
          moves = getLegalBishopMoves(board, row, col, color);
          break;
        case "q":
          moves = getLegalQueenMoves(board, row, col, color);
          break;
        case "k":
          moves = getLegalKingMoves(board, row, col, color);
          break;
      }
      
      setLegalSquares(moves);
    } else {
      setLegalSquares([]);
    }
  }, [selected, board, isWhiteTurn]);

  function handleSquareClick(row: number, col: number) {
    if (gamePhase !== "play") return;
    
    // If no piece is selected yet
    if (!selected) {
      const square = board[row][col];
      // Only allow selecting own pieces
      if (square.piece && square.color === (isWhiteTurn ? "white" : "black")) {
        setSelected([row, col]);
        let moves: [number, number][] = [];
        switch(square.piece) {
          case "p": moves = getLegalPawnMoves(board, row, col, square.color); break;
          case "n": moves = getLegalKnightMoves(board, row, col, square.color); break;
          case "r": moves = getLegalRookMoves(board, row, col, square.color); break;
          case "b": moves = getLegalBishopMoves(board, row, col, square.color); break;
          case "q": moves = getLegalQueenMoves(board, row, col, square.color); break;
          case "k": moves = getLegalKingMoves(board, row, col, square.color); break;
        }
        setLegalSquares(moves);
      }
    }
    // If a piece is already selected
    else {
      const [fromRow, fromCol] = selected;
      const fromSq = board[fromRow][fromCol];
      const toSq = board[row][col];
      
      // Check if the move is legal
      if (legalSquares.some(([r, c]) => r === row && c === col)) {
        // Make the move
        const newBoard = applyMove(board, { from: [fromRow, fromCol], to: [row, col] });
        setBoard(newBoard);
        
        // Record the move
        const move = moveToSan(
          { from: [fromRow, fromCol], to: [row, col] },
          fromSq,
          toSq
        );
        setMoveHistory([...moveHistory, move]);
        setMoveCount(moveCount + 1);
        
        // Clear selection
        setSelected(null);
        setLegalSquares([]);
        
        // Switch turns and let AI move
        setIsWhiteTurn(false);
        
        // After 6 moves, prompt for recall
        if (moveCount + 1 >= 6) {
          setTimeout(() => {
            setRecallOpen(true);
          }, 500);
        } else {
          // AI's turn
          setTimeout(() => {
            const aiMoves = getAllLegalMoves(newBoard, "black");
            if (aiMoves.length > 0) {
              const aiMove = aiMoves[Math.floor(Math.random() * aiMoves.length)];
              const aiBoard = applyMove(newBoard, aiMove);
              setBoard(aiBoard);
              const aiMoveStr = moveToSan(
                aiMove,
                newBoard[aiMove.from[0]][aiMove.from[1]],
                newBoard[aiMove.to[0]][aiMove.to[1]]
              );
              setMoveHistory(prev => [...prev, aiMoveStr]);
              setMoveCount(moveCount + 2);
              setIsWhiteTurn(true);
              
              if (moveCount + 2 >= 6) {
                setTimeout(() => {
                  setRecallOpen(true);
                }, 500);
              }
            }
          }, 500);
        }
      } else {
        // Invalid move, just clear selection
        setSelected(null);
        setLegalSquares([]);
      }
    }
  }

  useEffect(() => {
    if (moveCount > 0 && moveCount % 6 === 0 && !recallOpen && recallScore === null) {
      setRecallOpen(true);
    }
  }, [moveCount, recallOpen, recallScore]);

  useEffect(() => {
    const aiShouldPlay =
      (isWhiteTurn && playerColor === "black") ||
      (!isWhiteTurn && playerColor === "white");

    if (
      aiShouldPlay &&
      !recallOpen &&
      recallScore === null &&
      gamePhase === "play" &&
      moveCount > 0
    ) {
      const aiColor = isWhiteTurn ? "white" : "black";

      const timeoutId = setTimeout(() => {
        if (
          (isWhiteTurn && playerColor === "black") ||
          (!isWhiteTurn && playerColor === "white")
        ) {
          const moves = getAllLegalMoves(board, aiColor);
          if (moves.length) {
            const move = moves[Math.floor(Math.random() * moves.length)];
            const newBoard = applyMove(board, move);
            setBoard(newBoard);

            const fromSq = board[move.from[0]][move.from[1]];
            const moveSAN = moveToSan(move, fromSq, board[move.to[0]][move.to[1]]);
            setMoveHistory((h) => [...h, moveSAN]);

            setIsWhiteTurn((prev) => !prev);
            setMoveCount((c) => c + 1);
          }
        }
      }, 800);

      return () => clearTimeout(timeoutId);
    }
  }, [isWhiteTurn, board, recallOpen, recallScore, gamePhase, playerColor, moveCount]);

  function handleRecallCheck() {
    const userMoves = recallInput
      .replace(/\s/g, "")
      .split(",")
      .filter(Boolean)
      .map(s => s.trim());
    
    let correct = 0;
    for (let i = 0; i < moveHistory.length; ++i) {
      if (userMoves[i] && userMoves[i].toLowerCase() === moveHistory[i].toLowerCase()) {
        correct++;
      }
    }
    
    const accuracy = Math.round((correct / moveHistory.length)*100);
    setRecallScore(accuracy);
    
    const roundPoints = Math.floor(accuracy / 10);
    setTotalScore(prev => prev + roundPoints);
    
    if (accuracy >= 80) {
      toast({
        title: "Excellent recall!",
        description: `You remembered ${correct} out of ${moveHistory.length} moves correctly.`,
      });
    } else if (accuracy >= 50) {
      toast({
        title: "Good effort!",
        description: `You remembered ${correct} out of ${moveHistory.length} moves correctly.`,
      });
    } else {
      toast({
        description: `You remembered ${correct} out of ${moveHistory.length} moves correctly.`,
        variant: "destructive"
      });
    }
  }

  function handleContinueAfterRecall() {
    setRecallOpen(false);
    setRecallInput("");
    setRecallScore(null);
    setInfo("");
    
    if (round < maxRounds) {
      setRound(round + 1);
      setBoard(fenToBoard(initialFen));
      setMoveHistory([]);
      setIsWhiteTurn(true);
      setMoveCount(0);
      setSelected(null);
      setLegalSquares([]);
    }
  }

  function handleNewGame() {
    setGamePhase("setup");
    setBoard(fenToBoard(initialFen));
    setSelected(null);
    setLegalSquares([]);
    setIsWhiteTurn(true);
    setMoveHistory([]);
    setMoveCount(0);
    setRecallOpen(false);
    setRecallInput("");
    setRecallScore(null);
    setInfo("");
    setTotalScore(0);
    setRound(1);
    setPlayerColor("white");
  }

  function startGame(rounds: 3|5|7, color: "white" | "black") {
    setMaxRounds(rounds);
    setPlayerColor(color);
    setGamePhase("play");
    
    const initialBoard = fenToBoard(initialFen);
    setBoard(initialBoard);
    
    if (color === "black") {
      setTimeout(() => {
        const moves = getAllLegalMoves(initialBoard, "white");
        if (moves.length) {
          const move = moves[Math.floor(Math.random() * moves.length)];
          const newBoard = applyMove(initialBoard, move);
          setBoard(newBoard);
          
          const fromSq = initialBoard[move.from[0]][move.from[1]];
          const moveSAN = moveToSan(move, fromSq, initialBoard[move.to[0]][move.to[1]]);
          setMoveHistory([moveSAN]);
          
          setIsWhiteTurn(false);
          setMoveCount(1);
        }
      }, 500);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto">
          {gamePhase === "setup" ? (
            <Card className="p-6 mt-8 rounded-xl shadow-md bg-gradient-to-br from-chess-primary/5 to-white">
              <h1 className="text-2xl font-bold text-chess-primary mb-4">
                Recall the Game
              </h1>
              <p className="text-gray-600 mb-6">
                Test your memory by playing a short game against the AI. After several moves, you will be asked to recall all previous moves.
              </p>
              
              <div className="space-y-4">
                <h2 className="font-semibold text-lg">Select number of rounds:</h2>
                <div className="flex flex-col space-y-2">
                  {[3, 5, 7].map(num => (
                    <Button 
                      key={num}
                      onClick={() => setMaxRounds(num as 3|5|7)}
                      variant={maxRounds === num ? "default" : "outline"}
                      className={maxRounds === num ? "bg-chess-primary hover:bg-chess-secondary" : ""}
                    >
                      {num} Rounds
                    </Button>
                  ))}
                </div>
                
                <h2 className="font-semibold text-lg mt-4">Choose your color:</h2>
                <div className="flex justify-between gap-2">
                  <Button 
                    onClick={() => startGame(maxRounds, "white")}
                    className="flex-1 bg-white text-black border border-gray-300 hover:bg-gray-100"
                  >
                    Play as White
                  </Button>
                  <Button 
                    onClick={() => startGame(maxRounds, "black")}
                    className="flex-1 bg-gray-800 text-white hover:bg-black"
                  >
                    Play as Black
                  </Button>
                </div>
                
                <div className="p-4 bg-chess-primary/10 rounded-lg mt-6">
                  <h3 className="font-medium text-chess-primary mb-2">How to play:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Click on your pieces to move them</li>
                    <li>After several moves, you'll be asked to recall all previous moves</li>
                    <li>Try to remember the precise sequence of moves</li>
                    <li>More rounds means more chances to earn points</li>
                  </ul>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 mt-8 rounded-xl shadow-md bg-gradient-to-br from-chess-primary/5 to-white">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-chess-primary">
                  Recall the Game <span className="ml-2 text-base text-gray-500 font-medium">(Round {round}/{maxRounds})</span>
                </h1>
                <div className="flex items-center bg-chess-primary/10 px-3 py-1 rounded-full">
                  <Timer className="h-4 w-4 mr-1 text-chess-primary" />
                  <span className="font-bold text-chess-primary">{totalScore}</span>
                  <span className="text-xs ml-1 text-gray-600">points</span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-3">
                Play a short game against the AI. When prompted, try to recall <span className="font-medium text-chess-primary">all previous moves</span>. 
                You are playing as <span className="font-medium">{playerColor}</span>.
              </p>
              
              {info && <div className="mb-2 text-red-500 font-medium">{info}</div>}
              
              <div className="flex flex-col items-center mt-6 mb-3">
                <ChessBoard
                  board={board}
                  perspective={playerColor}
                  interactive={true}
                  onSquareClick={handleSquareClick}
                  highlightSquares={selected ? legalSquares : []}
                />
              </div>
              
              <div className="flex justify-center mt-4">
                <Button 
                  onClick={handleNewGame} 
                  variant="outline"
                  size="sm"
                >
                  Restart Game
                </Button>
              </div>
            </Card>
          )}
        </div>
        
        <Dialog open={recallOpen} onOpenChange={b => !b && recallScore === null ? setRecallOpen(true) : setRecallOpen(b)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Recall all moves played so far</DialogTitle>
              <DialogDescription>
                Try to remember the sequence of moves from memory
              </DialogDescription>
            </DialogHeader>
            {recallScore === null ? (
              <>
                <p className="mb-2 text-gray-700">
                  Type <b>all</b> moves so far, in order (use <span className="font-mono bg-gray-50 px-1 py-0.5 rounded">,</span> to separate). Example: <span className="font-mono">e4, e5, Nf3</span>
                </p>
                <Textarea 
                  placeholder="Type your moves (e.g. e4, e5, Nf3)..."
                  value={recallInput}
                  onChange={e => setRecallInput(e.target.value)}
                  className="mb-3"
                  rows={3}
                />
                <Button onClick={handleRecallCheck} className="bg-chess-primary hover:bg-chess-secondary">Submit</Button>
              </>
            ) : (
              <div className="text-center">
                <div className="text-xl mb-2 font-bold text-chess-primary">Recall Score</div>
                <div className="mb-2 text-3xl">{recallScore}%</div>
                <div className="mb-2 text-gray-700 text-base">Correct moves:</div>
                <div className="font-mono mb-4 bg-gray-50 p-2 rounded break-all overflow-x-auto max-h-40">{moveHistory.join(", ")}</div>
                
                {round < maxRounds ? (
                  <Button onClick={handleContinueAfterRecall} className="bg-chess-primary hover:bg-chess-secondary">
                    Continue to Round {round + 1}
                  </Button>
                ) : (
                  <div>
                    <div className="mb-4 p-3 bg-chess-primary/10 rounded-lg text-center">
                      <div className="text-lg font-bold text-chess-primary">Final Score: {totalScore}</div>
                      <p className="text-sm text-gray-600 mt-1">You've completed all {maxRounds} rounds!</p>
                    </div>
                    <Button onClick={handleNewGame} className="bg-chess-primary hover:bg-chess-secondary">
                      Play Again
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default RecallTheGame;
