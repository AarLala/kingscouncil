import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Header from "../components/Header";
import ChessBoard from "../components/ChessBoard";
import { fenToBoard } from "../utils/chessUtils";
import { ChessBoard as ChessBoardType } from "../types";
import { Crown } from "lucide-react";
import { Chess } from "chess.js";
import { useAuth } from "../context/AuthContext";
import { supabase, getChallengeUuidMap } from "../supabaseClient";
import openingBook from '../openingBook.json';

const openingMoves = [
  { userMove: "e4", aiMove: "e5" },
  { userMove: "d4", aiMove: "d5" },
  { userMove: "Nf3", aiMove: "Nf6" },
  { userMove: "c4", aiMove: "e5" },
  { userMove: "e3", aiMove: "d5" },
  { userMove: "g3", aiMove: "g6" },
];

// Common chess piece values
const pieceValues = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0
};

// Position bonus for pieces (encourages development and center control)
const positionBonus = {
  p: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    [0.1, 0.1, 0.2, 0.3, 0.3, 0.2, 0.1, 0.1],
    [0.05, 0.05, 0.1, 0.25, 0.25, 0.1, 0.05, 0.05],
    [0, 0, 0, 0.2, 0.2, 0, 0, 0],
    [0.05, -0.05, -0.1, 0, 0, -0.1, -0.05, 0.05],
    [0.05, 0.1, 0.1, -0.2, -0.2, 0.1, 0.1, 0.05],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ],
  n: [
    [-0.5, -0.4, -0.3, -0.3, -0.3, -0.3, -0.4, -0.5],
    [-0.4, -0.2, 0, 0, 0, 0, -0.2, -0.4],
    [-0.3, 0, 0.1, 0.15, 0.15, 0.1, 0, -0.3],
    [-0.3, 0.05, 0.15, 0.2, 0.2, 0.15, 0.05, -0.3],
    [-0.3, 0, 0.15, 0.2, 0.2, 0.15, 0, -0.3],
    [-0.3, 0.05, 0.1, 0.15, 0.15, 0.1, 0.05, -0.3],
    [-0.4, -0.2, 0, 0.05, 0.05, 0, -0.2, -0.4],
    [-0.5, -0.4, -0.3, -0.3, -0.3, -0.3, -0.4, -0.5]
  ],
  b: [
    [-0.2, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.2],
    [-0.1, 0, 0, 0, 0, 0, 0, -0.1],
    [-0.1, 0, 0.05, 0.1, 0.1, 0.05, 0, -0.1],
    [-0.1, 0.05, 0.05, 0.2, 0.2, 0.05, 0.05, -0.1],
    [-0.1, 0, 0.1, 0.2, 0.2, 0.1, 0, -0.1],
    [-0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, -0.1],
    [-0.1, 0.05, 0, 0, 0, 0, 0.05, -0.1],
    [-0.2, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.2]
  ],
  r: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0.05, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.05],
    [-0.05, 0, 0, 0, 0, 0, 0, -0.05],
    [-0.05, 0, 0, 0, 0, 0, 0, -0.05],
    [-0.05, 0, 0, 0, 0, 0, 0, -0.05],
    [-0.05, 0, 0, 0, 0, 0, 0, -0.05],
    [-0.05, 0, 0, 0, 0, 0, 0, -0.05],
    [0, 0, 0, 0.05, 0.05, 0, 0, 0]
  ],
  q: [
    [-0.2, -0.1, -0.1, -0.05, -0.05, -0.1, -0.1, -0.2],
    [-0.1, 0, 0, 0, 0, 0, 0, -0.1],
    [-0.1, 0, 0.05, 0.05, 0.05, 0.05, 0, -0.1],
    [-0.05, 0, 0.05, 0.05, 0.05, 0.05, 0, -0.05],
    [0, 0, 0.05, 0.05, 0.05, 0.05, 0, -0.05],
    [-0.1, 0.05, 0.05, 0.05, 0.05, 0.05, 0, -0.1],
    [-0.1, 0, 0.05, 0, 0, 0, 0, -0.1],
    [-0.2, -0.1, -0.1, -0.05, -0.05, -0.1, -0.1, -0.2]
  ],
  k: [
    [-0.3, -0.4, -0.4, -0.5, -0.5, -0.4, -0.4, -0.3],
    [-0.3, -0.4, -0.4, -0.5, -0.5, -0.4, -0.4, -0.3],
    [-0.3, -0.4, -0.4, -0.5, -0.5, -0.4, -0.4, -0.3],
    [-0.3, -0.4, -0.4, -0.5, -0.5, -0.4, -0.4, -0.3],
    [-0.2, -0.3, -0.3, -0.4, -0.4, -0.3, -0.3, -0.2],
    [-0.1, -0.2, -0.2, -0.2, -0.2, -0.2, -0.2, -0.1],
    [0.2, 0.2, 0, 0, 0, 0, 0.2, 0.2],
    [0.2, 0.3, 0.1, 0, 0, 0.1, 0.3, 0.2]
  ]
};

// Evaluate a move based on piece values and position
function evaluateMove(move, chessInstance) {
  if (!move || !chessInstance) return 0;
  
  const board = chessInstance.board();
  let score = 0;
  
  // Get the piece that's moving
  const fromRow = 8 - parseInt(move.from[1]);
  const fromCol = move.from.charCodeAt(0) - 97;
  
  if (fromRow < 0 || fromRow >= 8 || fromCol < 0 || fromCol >= 8) return 0;
  
  const piece = board[fromRow][fromCol];
  if (!piece || !piece.type) return 0;
  
  // Basic piece value
  score += pieceValues[piece.type.toLowerCase()] || 0;
  
  // Position value for the destination square
  const toRow = 8 - parseInt(move.to[1]);
  const toCol = move.to.charCodeAt(0) - 97;
  
  if (toRow < 0 || toRow >= 8 || toCol < 0 || toCol >= 8) return 0;
  
  const positionScore = positionBonus[piece.type.toLowerCase()]?.[toRow]?.[toCol] || 0;
  score += positionScore;
  
  // Bonus for captures
  const targetPiece = board[toRow][toCol];
  if (targetPiece && targetPiece.type) {
    score += (pieceValues[targetPiece.type.toLowerCase()] || 0) * 1.1;
  }
  
  // Penalty for moving pieces multiple times in opening
  if (chessInstance.history().length < 10) {
    const pieceHistory = chessInstance.history().filter(m => 
      m.startsWith(piece.type.toUpperCase()) || 
      (piece.type === 'p' && !m.startsWith('O'))
    ).length;
    score -= pieceHistory * 0.1;
  }
  
  return score;
}

function getBookMove(chessInstance) {
  // Build the move sequence in SAN
  const moveHistory = chessInstance.history({ verbose: true }).map(m => m.san);
  const key = moveHistory.join(' ');
  const moves = openingBook[key];
  if (moves && moves.length > 0) {
    // Pick a random book move
    const moveSan = moves[Math.floor(Math.random() * moves.length)];
    // Find the move object in legal moves
    const legal = chessInstance.moves({ verbose: true }).find(m => m.san === moveSan);
    return legal || null;
  }
  return null;
}

function makeAIMove(chessInstance) {
  if (!chessInstance) return null;
  // Try opening book first (for first 8 moves)
  if (chessInstance.history().length < 8) {
    const bookMove = getBookMove(chessInstance);
    if (bookMove) return bookMove;
  }
  // ...existing evaluation logic...
  const moves = chessInstance.moves({ verbose: true });
  if (!moves || moves.length === 0) return null;
  const evaluatedMoves = moves
    .map(move => ({
      move,
      score: evaluateMove(move, chessInstance)
    }))
    .filter(m => m.score !== undefined && !isNaN(m.score));
  if (evaluatedMoves.length === 0) return moves[0]; // Fallback to first legal move
  evaluatedMoves.sort((a, b) => b.score - a.score);
  const topMoves = evaluatedMoves.slice(0, Math.min(3, evaluatedMoves.length));
  const randomIndex = Math.floor(Math.random() * topMoves.length);
  return topMoves[randomIndex].move;
}

function moveToSAN(move, chessInstance) {
  // Accept algebraic, e.g., "e2e4", "Nf3", etc.
  try {
    chessInstance.move(move);
    return chessInstance.history({ verbose: true }).slice(-1)[0].san;
  } catch {
    return "";
  }
}

const PredictionGame = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: User moves, 2: Predict AI, 3: Show result
  const [chessObj, setChessObj] = useState<Chess | null>(null);
  const [board, setBoard] = useState<ChessBoardType>(fenToBoard("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"));
  const [moveHistory, setMoveHistory] = useState<{san: string, by: string}[]>([]);
  const [selectedFrom, setSelectedFrom] = useState<[number, number] | null>(null);
  const [userMove, setUserMove] = useState<string | null>(null);
  const [predictionMove, setPredictionMove] = useState<string | null>(null);
  const [aiMove, setAIMove] = useState<string | null>(null);
  const [result, setResult] = useState<null | "correct" | "wrong">(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [dragMode, setDragMode] = useState<"user" | "predict">("user");
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!chessObj) {
      const c = new Chess();
      setChessObj(c);
      setBoard(fenToBoard(c.fen()));
    }
  }, [chessObj]);

  useEffect(() => {
    if (chessObj) setBoard(fenToBoard(chessObj.fen()));
  }, [chessObj]);

  useEffect(() => {
    if (gameOver && currentUser) {
      (async () => {
        try {
          const uuidMap = await getChallengeUuidMap();
          const challengeUuid = uuidMap["3"];
          // Fetch previous best
          const { data: prev, error: fetchError } = await supabase
            .from("user_challenge_progress")
            .select("points")
            .eq("user_id", currentUser.id)
            .eq("challenge_id", challengeUuid)
            .single();
          if (!prev || score > prev.points) {
            await supabase
              .from("user_challenge_progress")
              .upsert([
                {
                  user_id: currentUser.id,
                  challenge_id: challengeUuid,
                  points: score,
                },
              ], { onConflict: "user_id,challenge_id" });
            toast({
              title: "Congratulations!",
              description: `You earned ${score} points.`,
              variant: "default"
            });
          }
        } catch (error) {
          console.error("Failed to update points in Supabase:", error);
        }
      })();
    }
  }, [gameOver, currentUser, score]);

  const handleUserDrop = (toRow, toCol, piece?) => {
    if (dragMode !== "user" || !selectedFrom || !chessObj) return;
    const from = selectedFrom;
    const files = "abcdefgh";
    const ranks = "87654321";
    const fromSq = files[from[1]] + ranks[from[0]];
    const toSq = files[toCol] + ranks[toRow];
    let move = {from: fromSq, to: toSq};
    const legal = chessObj.moves({verbose: true}).find(
      m => m.from === fromSq && m.to === toSq
    );
    if (legal) {
      chessObj.move(move);
      setBoard(fenToBoard(chessObj.fen()));
      setMoveHistory([...moveHistory, {san: legal.san, by: "user"}]);
      setUserMove(legal.san);
      setStep(2);
      setDragMode("predict");
      setSelectedFrom(null);
      setErrorMsg("");
      toast({
        description: "Now predict the computer's next move",
      });
    } else {
      setErrorMsg("Illegal move. Please play a legal move.");
    }
  };

  const handlePredictDrop = (toRow, toCol, piece?) => {
    if (dragMode !== "predict" || !selectedFrom || !chessObj) return;
    
    const from = selectedFrom;
    const files = "abcdefgh";
    const ranks = "87654321";
    const fromSq = files[from[1]] + ranks[from[0]];
    const toSq = files[toCol] + ranks[toRow];
    
    try {
      // Create a temporary chess instance to test the prediction
      const tempChess = new Chess(chessObj.fen());
      
      // Try to make the predicted move
      const userPrediction = tempChess.move({ from: fromSq, to: toSq });
      if (!userPrediction) {
        setErrorMsg("That is not a legal move for the opponent.");
        return;
      }
      
      setPredictionMove(userPrediction.san);
      
      // Get AI's move without modifying the main chess instance
      const aiMoveObj = makeAIMove(chessObj);
      if (!aiMoveObj) {
        setErrorMsg("AI has no legal moves.");
        return;
      }
      
      setAIMove(aiMoveObj.san);
      
      const correct = (
        aiMoveObj.san === userPrediction.san &&
        aiMoveObj.from === userPrediction.from &&
        aiMoveObj.to === userPrediction.to
      );
      
      if (correct) {
        setResult("correct");
        setScore(s => s + 1);
        toast({
          title: "Correct Prediction!",
          description: `+1 point. The AI played ${aiMoveObj.san}.`,
        });
      } else {
        setResult("wrong");
        toast({
          description: `The AI actually played ${aiMoveObj.san}.`,
          variant: "destructive"
        });
      }
      
      // Make the AI's move on the main chess instance
      const aiMove = chessObj.move({ from: aiMoveObj.from, to: aiMoveObj.to, promotion: aiMoveObj.promotion });
      if (!aiMove) {
        throw new Error("Failed to make AI move");
      }
      
      setBoard(fenToBoard(chessObj.fen()));
      setMoveHistory([...moveHistory, 
        {san: userPrediction.san, by: "predict"}, 
        {san: aiMoveObj.san, by: "AI"}
      ]);
      
      setStep(3);
      setDragMode("user");
      setSelectedFrom(null);
      if (round >= 5) {
        setGameOver(true);
        toast({
          title: "Game Over!",
          description: `Final Score: ${score} out of 5`,
        });
      } else {
        toast({
          description: "Click 'Next Move' to continue",
        });
      }
    } catch (error) {
      console.error("Move error:", error);
      setErrorMsg("There was an error making the move. Please try again.");
      setSelectedFrom(null);
    }
  };

  const handleSquareClick = (row, col) => {
    if (!chessObj) return;

    if (dragMode === "user") {
      const sq = board[row][col];
      if (sq.piece && sq.color === (chessObj.turn() === "w" ? "white" : "black")) {
        setSelectedFrom([row, col]);
        setErrorMsg("");
      } else if (selectedFrom) {
        handleUserDrop(row, col);
      }
    } else if (dragMode === "predict") {
      const sq = board[row][col];
      const opponentColor = chessObj.turn() === "w" ? "white" : "black";
      
      // Clear any previous error message when selecting a new piece
      if (sq.piece && sq.color === opponentColor) {
        setSelectedFrom([row, col]);
        setErrorMsg("");
      } else if (selectedFrom) {
        handlePredictDrop(row, col);
      } else {
        setErrorMsg("Please select one of the opponent's pieces to predict their move.");
      }
    }
  };

  const handleNextMove = () => {
    setUserMove(null);
    setPredictionMove(null);
    setAIMove(null);
    setResult(null);
    setStep(1);
    setRound(r => r + 1);
    setErrorMsg("");
    setSelectedFrom(null);
    setDragMode("user");

    if (round < 5) {
      const c = new Chess();
      setChessObj(c);
      setBoard(fenToBoard(c.fen()));
      setMoveHistory([]);
      toast({
        title: `Round ${round + 1}/5`,
        description: "Make your move to start the round",
      });
    }
  };

  const handleRestart = () => {
    const c = new Chess();
    setChessObj(c);
    setBoard(fenToBoard(c.fen()));
    setUserMove(null);
    setPredictionMove(null);
    setAIMove(null);
    setResult(null);
    setMoveHistory([]);
    setStep(1);
    setRound(1);
    setGameOver(false);
    setScore(0);
    setErrorMsg("");
    setSelectedFrom(null);
    setDragMode("user");
    toast({
      title: "New Game Started",
      description: "Round 1/5 - Make your move",
    });
  };

  const getHint = () => {
    if (!chessObj || hintsRemaining <= 0 || dragMode !== "predict") return;
    
    const legalMoves = chessObj.moves({ verbose: true });
    if (legalMoves.length > 0) {
      const aiMove = legalMoves[0]; // The move AI would make
      toast({
        title: "Hint",
        description: `The AI is likely to move a piece to ${aiMove.to}`,
      });
      setHintsRemaining(h => h - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 mt-8 rounded-xl shadow-md bg-gradient-to-br from-chess-primary/5 to-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-chess-primary">
                  Prediction Game
                </h1>
                <p className="text-gray-600">
                  Try to predict the computer's next move! Round {round}/5
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex gap-2 text-chess-primary items-center font-bold">
                  <Crown className="h-5 w-5" />
                  Score: <span className="text-xl">{score}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Hints: {hintsRemaining}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-5 gap-6 mb-4">
              <div className="md:col-span-3">
                <ChessBoard
                  board={board}
                  perspective="white" 
                  interactive={true}
                  onSquareClick={handleSquareClick}
                  selectedPiece={selectedFrom ? { 
                    piece: board[selectedFrom[0]][selectedFrom[1]].piece, 
                    color: board[selectedFrom[0]][selectedFrom[1]].color 
                  } : null}
                  highlightSquares={selectedFrom ? [] : []}
                />
                <div className="mt-4 p-3 bg-chess-primary/10 rounded-lg text-sm">
                  <h4 className="font-semibold mb-1">Move History</h4>
                  <div className="grid grid-cols-2 gap-x-4">
                    <div className="font-medium">You</div>
                    <div className="font-medium">Computer</div>
                    {moveHistory.map((m, i) => {
                      if (i % 2 === 0) {
                        const nextMove = moveHistory[i + 1];
                        return (
                          <div key={`move-${i}`} className="contents">
                            <div>{m.by === "user" || m.by === "predict" ? m.san : ""}</div>
                            <div>{nextMove && nextMove.by === "AI" ? nextMove.san : ""}</div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                  {errorMsg && <div className="mt-2 text-red-500">{errorMsg}</div>}
                </div>
              </div>
              <div className="md:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="mb-4 bg-chess-primary/5 p-3 rounded-lg">
                    <ol className="list-decimal ml-4 text-gray-600 text-sm">
                      <li>Click on your piece, then click where you want to move it</li>
                      <li>Then, predict the AI's reply by clicking the piece and destination</li>
                      <li>Get a point for every correct prediction!</li>
                      <li>Play 5 rounds to complete a game</li>
                      <li>Use hints wisely - you have {hintsRemaining} remaining</li>
                    </ol>
                  </div>
                  {step === 2 && (
                    <div className="p-4 bg-yellow-50 rounded-lg mb-4">
                      <h3 className="font-bold text-amber-600 mb-2">Your turn to predict</h3>
                      <p className="text-gray-700">
                        Now predict the computer's next move by clicking the piece and its destination.
                        You can only move the computer's {chessObj?.turn() === 'w' ? 'white' : 'black'} pieces.
                      </p>
                      {hintsRemaining > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={getHint}
                          className="mt-2"
                        >
                          Use Hint ({hintsRemaining} left)
                        </Button>
                      )}
                    </div>
                  )}
                  {step === 3 && (
                    <div>
                      {result === "correct" ? (
                        <div className="text-lg font-bold text-green-600 p-4 bg-green-50 rounded-lg mb-4">
                          🎉 Correct prediction!
                        </div>
                      ) : (
                        <div className="text-lg font-bold text-red-500 p-4 bg-red-50 rounded-lg mb-4">
                          ❌ Not quite right
                        </div>
                      )}

                      <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                        <div className="font-semibold text-chess-primary">AI replied:</div>
                        <div className="text-lg">{aiMove}</div>
                      </div>
                    </div>
                  )}
                </div>
                {step === 3 && !gameOver && (
                  <Button className="mt-4 bg-chess-primary hover:bg-chess-secondary" onClick={handleNextMove}>
                    Continue to Next Round
                  </Button>
                )}
                {(step === 3 && gameOver) && (
                  <div>
                    <div className="mb-4 p-4 bg-chess-primary/10 rounded-lg text-center">
                      <h3 className="font-bold text-lg mb-2">Game Complete!</h3>
                      <p>You scored {score} out of 5 possible points.</p>
                    </div>
                    <Button className="w-full bg-chess-primary hover:bg-chess-secondary" onClick={handleRestart}>
                      Play Again
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 p-4 border-t border-gray-200">
              <div className="flex items-center mb-2">
                <img src="/chess-brain.png" alt="Brain" className="h-8 w-8 mr-2" />
                <span className="font-bold text-chess-primary">Strategic Thinking</span>
              </div>
              <p className="text-gray-600 text-sm">
                This challenge exercises your prefrontal cortex, responsible for planning and prediction. By anticipating 
                your opponent's moves, you're developing pattern recognition and strategic reasoning skills.
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PredictionGame;
