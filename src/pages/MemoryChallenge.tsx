import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import Header from "../components/Header";
import ChessBoard from "../components/ChessBoard";
import BrainInfo from "../components/BrainInfo";
import { fenToBoard, calculateAccuracy, generateRandomPosition, samplePositions, getSafeFen, getRandomChessPosition } from "../utils/chessUtils";
import { ChessBoard as ChessBoardType, ChessSquare } from "../types";
import PieceSelector from "../components/PieceSelector";
import { useAuth } from "../context/AuthContext";
import { supabase, getChallengeUuidMap } from "../supabaseClient";

const STUDY_TIME_OPTIONS = [15, 30];

const MemoryChallenge = () => {
  const [phase, setPhase] = useState<"intro" | "study" | "recall" | "result">("intro");
  const [selectedTime, setSelectedTime] = useState<number>(30);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [originalBoard, setOriginalBoard] = useState<ChessBoardType>([]);
  const [userBoard, setUserBoard] = useState<ChessBoardType>([]);
  const [selectedPiece, setSelectedPiece] = useState<{piece: string, color: "white" | "black"} | null>(null);
  const [score, setScore] = useState<number>(0);
  const [boardPerspective] = useState<"white">("white");
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [positionKey, setPositionKey] = useState<number>(0);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (phase === "intro") {
      try {
        const validFen = generateRandomPosition(difficulty);
        const board = fenToBoard(validFen);
        setOriginalBoard(board);
        
        const emptyBoard = Array(8).fill(null).map(() => 
          Array(8).fill(null).map(() => ({ piece: null, color: null }))
        );
        setUserBoard(emptyBoard);
      } catch (error) {
        console.error("Error initializing board:", error);
        toast({
          title: "Error loading chess position",
          description: "Reverting to default position",
          variant: "destructive",
        });
        
        const defaultFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        setOriginalBoard(fenToBoard(defaultFen));
      }
    }
  }, [phase, difficulty, toast, positionKey]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (phase === "study" && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (phase === "study" && timeLeft === 0) {
      setPhase("recall");
      toast({
        title: "Time's up!",
        description: "Now try to recreate the board from memory",
      });
    }
    
    return () => clearTimeout(timer);
  }, [phase, timeLeft, toast]);

  const startChallenge = (seconds: number) => {
    setSelectedTime(seconds);
    setTimeLeft(seconds);
    setPhase("study");
  };

  const handleSquareClick = (row: number, col: number) => {
    if (phase !== "recall" || !selectedPiece) return;
    
    const newBoard = [...userBoard];
    newBoard[row][col] = {
      piece: selectedPiece.piece,
      color: selectedPiece.color
    };
    
    setUserBoard(newBoard);
    setSelectedPiece(null);
  };

  const clearSquare = (row: number, col: number) => {
    if (phase !== "recall") return;
    
    const newBoard = [...userBoard];
    newBoard[row][col] = { piece: null, color: null };
    
    setUserBoard(newBoard);
  };

  const handleSelectPiece = (piece: string, color: "white" | "black") => {
    setSelectedPiece({ piece, color });
  };

  const handleBoardDrop = (row: number, col: number, piece?: {piece: string, color: "white" | "black"}) => {
    if (phase !== "recall") return;

    if (piece) {
      const newBoard = userBoard.map(arr => arr.map(sq => ({ ...sq })));
      newBoard[row][col] = { piece: piece.piece, color: piece.color };
      setUserBoard(newBoard);
      setSelectedPiece(null);
    }
  };

  const handleDragOutside = (row: number, col: number) => {
    if (phase !== "recall") return;
    
    const newBoard = [...userBoard];
    newBoard[row][col] = { piece: null, color: null };
    setUserBoard(newBoard);
  };

const calculateScore = async () => {
  const accuracy = calculateAccuracy(originalBoard, userBoard);
  let finalScore = accuracy;

  if (selectedTime === 15) finalScore += 15;
  if (difficulty === 'medium') finalScore += 10;
  else if (difficulty === 'hard') finalScore += 20;

  setScore(finalScore);
  setPhase("result");

  if (currentUser) {
    try {
      const uuidMap = await getChallengeUuidMap();
      const challengeUuid = uuidMap["1"];

      if (!challengeUuid) {
        console.error("Challenge UUID not found for challenge ID 1");
        return;
      }

      console.log("🔢 Final score:", finalScore);
console.log("🙋 User:", currentUser);
console.log("🗺️ UUID Map:", uuidMap);
console.log("📊 Challenge ID:", uuidMap["1"]);

const { data: prev, error: fetchError } = await supabase
  .from("user_challenge_progress")
  .select("*")
  .eq("user_id", currentUser.id)
  .eq("challenge_id", uuidMap["1"])
  .maybeSingle();

console.log("📥 Existing progress (prev):", prev);
console.log("⚠️ Fetch error (if any):", fetchError);

// Then log after upsert:
const { error: upsertError } = await supabase
  .from("user_challenge_progress")
  .upsert([
    {
      user_id: currentUser.id,
      challenge_id: challengeUuid,
      points: finalScore,
      completed: true, // if you want to track completion
    }
  ], { onConflict: "user_id,challenge_id" });



      if (fetchError && fetchError.code !== "PGRST116") {
        // Not "row not found" — an actual error
        console.error("Error fetching previous score:", fetchError);
        return;
      }

      if (!prev || finalScore > prev.points) {
        const { error: upsertError } = await supabase
          .from("user_challenge_progress")
          .upsert(
            [{
              user_id: currentUser.id,
              challenge_id: challengeUuid,
              points: finalScore,
            }],
            { onConflict: "user_id,challenge_id" }
          );

        if (upsertError) {
          console.error("Upsert error:", upsertError);
        } else {
          console.log("Score successfully saved or updated!");
        }
      } else {
        console.log("Score not updated because it wasn’t better than previous.");
      }
    } catch (err) {
      console.error("Failed to update points in Supabase:", err);
    }
  } else {
    console.warn("User is not signed in. Cannot save score.");
  }

  toast({
    title: "Congratulations!",
    description: `You earned ${finalScore} points.`,
    variant: "default"
  });
    if (accuracy >= 80) {
      if (difficulty === 'easy') {
        setDifficulty('medium');
        toast({
          title: "Level Up!",
          description: "Great job! You've unlocked medium difficulty.",
        });
      } else if (difficulty === 'medium' && selectedTime === 15) {
        setDifficulty('hard');
        toast({
          title: "Level Up!",
          description: "Excellent! You've unlocked hard difficulty.",
        });
      } else {
        toast({
          title: "Excellent memory!",
          description: `You scored ${finalScore} points with ${accuracy}% accuracy.`,
        });
      }
    } else if (accuracy >= 50) {
      toast({
        title: "Good effort!",
        description: `You scored ${finalScore} points with ${accuracy}% accuracy.`,
      });
    } else {
      if (difficulty !== 'easy') {
        setDifficulty('easy');
        toast({
          title: "Keep practicing!",
          description: "Let's try some easier positions first.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Room for improvement",
          description: `You scored ${finalScore} points with ${accuracy}% accuracy.`,
          variant: "destructive"
        });
      }
    }
  };

  const resetChallenge = () => {
    setPhase("intro");
    setSelectedTime(30);
    setTimeLeft(30);
    setScore(0);
    setSelectedPiece(null);
    setDifficulty('easy');
    setPositionKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {phase === "intro" && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 text-center">
              <h1 className="text-2xl font-bold mb-3 text-gray-600 ">Memory Recall Challenge</h1>
              <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                Test your visual memory by studying a chess position, then recreating it from memory.
                This exercise trains your working memory and spatial recognition.
              </p>
              
              <div className="mb-8">
<h2 className="text-gray-800 font-medium mb-3">
Current Difficulty: <span className="text-chess-primary">{difficulty}</span></h2>
                <p className="text-sm text-gray-500 mb-4">
                  {difficulty === 'easy' ? 'Master the basics to unlock more challenging positions!' :
                   difficulty === 'medium' ? 'Good progress! Can you handle even more complex positions?' :
                   'You\'re at the highest difficulty level. Test your limits!'}
                </p>
                <h2 className=" text-gray-800 font-medium mb-3 font-medium mb-3">Select study time and play:</h2>
                <div className="flex justify-center gap-4">
                  {STUDY_TIME_OPTIONS.map(time => (
                    <Button 
                      key={time}
                      onClick={() => startChallenge(time)}
                      variant={time === 15 ? "outline" : "default"}
                      className={time === 15 
                        ? "border-chess-primary text-chess-primary hover:bg-chess-primary/5" 
                        : "bg-chess-primary hover:bg-chess-secondary"}
                    >
                      {time} seconds {time === 15 && "(harder)"}
                    </Button>
                  ))}
                </div>
              </div>
              
              <p className="text-sm text-gray-500 max-w-lg mx-auto">
                Hint: The shorter time gives you bonus points, but makes the challenge more difficult!
                {difficulty !== 'easy' && " Higher difficulty levels also award bonus points!"}
              </p>
            </div>
          )}
          
          {phase === "study" && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-600">Study the Position</h1>
                <p className="text-gray-600 mb-4">
                  Memorize the position of all pieces. The board will clear when the timer ends.
                </p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-full bg-chess-primary flex items-center justify-center shadow">
                    <span className="text-white font-bold">{timeLeft}</span>
                  </div>
                  <span className="text-sm text-gray-500">seconds remaining</span>
                </div>
                <Progress value={(timeLeft / selectedTime) * 100} className="max-w-md mx-auto h-2 rounded-full bg-chess-light mb-3" />
                <p className="text-sm text-gray-600 mb-1">
                  Current perspective: <span className="font-medium">White</span>
                </p>
              </div>
              <div className="flex items-center justify-center my-4">
                <ChessBoard board={originalBoard} interactive={false} perspective="white" />
              </div>
            </div>
          )}
          
          {phase === "recall" && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold">Recreate the Position</h1>
                <p className="text-gray-600 mb-4">
                  Place the chess pieces in their correct positions from memory. You can drag-and-drop pieces or click a square with the palette piece selected.
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Recreate from perspective: <span className="font-medium">White</span>
                </p>
              </div>
              <div className="grid md:grid-cols-12 gap-6 place-items-center">
                <div className="md:col-span-7 flex flex-col items-center justify-center">
                  <ChessBoard
                    board={userBoard}
                    interactive={true}
                    onSquareClick={handleSquareClick}
                    selectedPiece={selectedPiece}
                    onDrop={handleBoardDrop}
                    onDragOutside={handleDragOutside}
                    perspective="white"
                  />
                  <button
                    className="text-xs text-chess-accent mt-4 hover:underline"
                    onClick={() => setUserBoard(Array(8).fill(null).map(() =>
                      Array(8).fill(null).map(() => ({ piece: null, color: null }))
                    ))}
                  >
                    Clear Board
                  </button>
                </div>
                <div className="md:col-span-5 w-full flex flex-col items-center justify-start">
                  <PieceSelector onSelectPiece={handleSelectPiece} />
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setSelectedPiece(null)}
                  >
                    Clear Selection
                  </Button>
                  <Button
                    className="bg-chess-primary hover:bg-chess-secondary w-full mt-4"
                    onClick={calculateScore}
                  >
                    Submit Answer
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {phase === "result" && (
            <div>
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold">Challenge Results</h1>
                  
                  <div className="w-24 h-24 rounded-full bg-chess-primary/10 flex items-center justify-center mx-auto my-6">
                    <span className="text-3xl font-bold text-chess-primary">{score}</span>
                  </div>
                  
                  <p className="text-gray-600">
                    Your score is based on accuracy and difficulty level
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h2 className="font-medium mb-3">Original Position</h2>
                    <Card className="p-4">
                      <ChessBoard board={originalBoard} interactive={false} perspective="white" />
                    </Card>
                  </div>
                  
                  <div>
                    <h2 className="font-medium mb-3">Your Answer</h2>
                    <Card className="p-4">
                      <ChessBoard board={userBoard} interactive={false} perspective="white" />
                    </Card>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    className="bg-chess-primary hover:bg-chess-secondary"
                    onClick={resetChallenge}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
              
              <BrainInfo
                title="Working Memory Training"
                area="Prefrontal Cortex"
                description="This challenge exercises your working memory, which is located primarily in your prefrontal cortex. Working memory is your brain's ability to temporarily hold and manipulate information. When you memorize a chess position, you're creating a mental image and storing it in working memory. This skill is crucial for learning, problem-solving, and following complex instructions."
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MemoryChallenge;
