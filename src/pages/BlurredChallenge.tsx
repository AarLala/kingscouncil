import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import Header from "../components/Header";
import ChessBoard from "../components/ChessBoard";
import BrainInfo from "../components/BrainInfo";
import { fenToBoard, calculateAccuracy, generateRandomPosition } from "../utils/chessUtils";
import { ChessBoard as ChessBoardType } from "../types";
import { Timer } from "lucide-react";

const TIME_LIMIT = 30; // seconds for the challenge

const BlurredChallenge = () => {
  const [phase, setPhase] = useState<"intro" | "study" | "recall" | "result">("intro");
  const [selectedTime, setSelectedTime] = useState<number>(30);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [board, setBoard] = useState<ChessBoardType>([]);
  const [userBoard, setUserBoard] = useState<ChessBoardType>([]);
  const [selectedPiece, setSelectedPiece] = useState<{piece: string, color: "white" | "black"} | null>(null);
  const [score, setScore] = useState<number>(0);
  const [boardPerspective] = useState<"white">("white");
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [positionKey, setPositionKey] = useState<number>(0);
  const [showBlurred, setShowBlurred] = useState<boolean>(true);
  const [blurLevel, setBlurLevel] = useState(4);
  const { toast } = useToast();

  useEffect(() => {
    if (phase === "intro") {
      try {
        const validFen = generateRandomPosition(difficulty);
        const newBoard = fenToBoard(validFen);
        setBoard(newBoard);
        
        // Initialize empty board for user to place pieces
        const emptyBoard = Array(8).fill(null).map(() => Array(8).fill(null));
        setUserBoard(emptyBoard);
        
        // Set blur level based on difficulty
        setBlurLevel(difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5);
      } catch (error) {
        console.error("Error initializing board:", error);
        toast({
          title: "Error loading chess position",
          description: "Reverting to default position",
          variant: "destructive",
        });
        
        const defaultFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        setBoard(fenToBoard(defaultFen));
        const emptyBoard = Array(8).fill(null).map(() => Array(8).fill(null));
        setUserBoard(emptyBoard);
      }
    }
  }, [phase, difficulty, toast, positionKey]);

  // Timer for challenge phase
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (phase === "study" && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (phase === "study" && timeLeft === 0) {
      calculateScore();
      toast({
        title: "Time's up!",
        description: "Let's see how you did.",
      });
    }
    
    return () => clearTimeout(timer);
  }, [phase, timeLeft]);

  const startChallenge = () => {
    setTimeLeft(TIME_LIMIT);
    setPhase("study");
  };

  const handleSquareClick = (row: number, col: number) => {
    if (phase !== "study" || !selectedPiece || showBlurred) return;
    
    const newBoard = [...userBoard];
    newBoard[row][col] = {
      piece: selectedPiece.piece,
      color: selectedPiece.color
    };
    
    setUserBoard(newBoard);
    // Clear selected piece after placing it
    setSelectedPiece(null);
  };

  const handleSelectPiece = (piece: string, color: "white" | "black") => {
    setSelectedPiece({ piece, color });
  };

  // Handle piece dropping on the board
  const handleBoardDrop = (row: number, col: number, piece?: {piece: string, color: "white" | "black"}) => {
    if (phase !== "study" || showBlurred || !piece) return;
    
    const newBoard = [...userBoard];
    newBoard[row][col] = {
      piece: piece.piece,
      color: piece.color
    };
    
    setUserBoard(newBoard);
    setSelectedPiece(null);
  };

  // Handle piece being dragged outside the board
  const handleDragOutside = (row: number, col: number) => {
    if (phase !== "study" || showBlurred) return;
    
    // Clear the piece from its original position
    const newBoard = [...userBoard];
    newBoard[row][col] = { piece: null, color: null };
    setUserBoard(newBoard);
  };

  const calculateScore = () => {
    const accuracy = calculateAccuracy(board, userBoard);
    let finalScore = accuracy;
    
    // Bonus points for difficulty
    if (difficulty === 'medium') {
      finalScore += 10;
    } else if (difficulty === 'hard') {
      finalScore += 20;
    }
    
    setScore(finalScore);
    
    // Update difficulty based on performance
    if (accuracy >= 80) {
      if (difficulty === 'easy') {
        setDifficulty('medium');
        toast({
          title: "Level Up!",
          description: "Great job! You've unlocked medium difficulty with increased blur.",
        });
      } else if (difficulty === 'medium') {
        setDifficulty('hard');
        toast({
          title: "Level Up!",
          description: "Excellent! You've unlocked hard difficulty with maximum blur.",
        });
      } else {
        toast({
          title: "Perfect Vision!",
          description: `Amazing score of ${finalScore} points with ${accuracy}% accuracy.`,
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
          description: "Let's try some easier positions with less blur.",
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
    
    setPhase("result");
  };

  const resetChallenge = () => {
    setPhase("intro");
    setTimeLeft(selectedTime);
    setScore(0);
    setSelectedPiece(null);
    setShowBlurred(true);
    // Initialize empty board for user
    const emptyBoard = Array(8).fill(null).map(() => Array(8).fill(null));
    setUserBoard(emptyBoard);
    // Increment positionKey to trigger new position generation
    setPositionKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {phase === "intro" && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 text-center">
              <h1 className="text-2xl font-bold mb-3">Blurred Vision Challenge</h1>
              <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                Test your visual processing ability by identifying chess pieces through a blurred lens,
                then recreating the position accurately.
              </p>
              
              <div className="relative max-w-lg mx-auto mb-10">
                <div className="chess-board border border-chess-darker">
                  <ChessBoard board={board} perspective="white" interactive={false} />
                  <div 
                    className="absolute inset-0 backdrop-blur-md bg-white/30" 
                    style={{ backdropFilter: `blur(${blurLevel}px)` }}
                  ></div>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <p className="text-lg font-medium bg-white/80 p-3 rounded-lg shadow-sm">
                    Can you identify the pieces?
                  </p>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="font-medium mb-3">Current Difficulty: <span className="text-chess-primary">{difficulty}</span></h2>
                <p className="text-sm text-gray-500 mb-4">
                  {difficulty === 'easy' ? 'Lower blur level and simpler positions to start!' :
                   difficulty === 'medium' ? 'Increased blur and more complex positions!' :
                   'Maximum blur and the most challenging positions!'}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Blur Level: <span className="font-medium">{blurLevel}px</span>
                  {difficulty !== 'hard' && " - Score well to unlock higher difficulties!"}
                </p>
                
                <Button 
                  onClick={startChallenge}
                  className="bg-chess-primary hover:bg-chess-secondary"
                >
                  Start Challenge
                </Button>
              </div>
            </div>
          )}
          
          {phase === "study" && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-wrap justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Blurred Vision Challenge</h1>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-chess-primary flex items-center justify-center">
                      <Timer className="text-white h-5 w-5" />
                      <span className="text-white font-bold ml-1">{timeLeft}</span>
                    </div>
                    <span className="text-sm text-gray-500">seconds remaining</span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowBlurred(!showBlurred)}
                    className="border-chess-primary text-chess-primary"
                  >
                    {showBlurred ? "Show Empty Board" : "Show Blurred Position"}
                  </Button>
                </div>
              </div>
              
              <Progress value={(timeLeft / TIME_LIMIT) * 100} className="mb-6 h-2" />
              
              <div className="grid md:grid-cols-4 gap-6">
                <div className="md:col-span-3">
                  {showBlurred ? (
                    <div className="relative">
                      <ChessBoard board={board} perspective="white" interactive={false} />
                      <div 
                        className="absolute inset-0 backdrop-blur-sm bg-white/20" 
                        style={{ backdropFilter: `blur(${blurLevel}px)` }}
                      ></div>
                    </div>
                  ) : (
                    <ChessBoard 
                      board={userBoard} 
                      perspective="white"
                      interactive={true}
                      onSquareClick={handleSquareClick}
                      selectedPiece={selectedPiece}
                      onDrop={handleBoardDrop}
                      onDragOutside={handleDragOutside}
                    />
                  )}
                </div>
                
                <div className="space-y-4">
                  {!showBlurred && (
                    <>
                      <div>
                        <h3 className="font-medium mb-2">Select Piece</h3>
                        <div className="grid grid-cols-3 gap-2">
                          {["p", "r", "n", "b", "q", "k"].map(piece => (
                            <div key={piece} className="flex flex-col items-center">
                              <button
                                className={`w-10 h-10 rounded ${
                                  selectedPiece?.piece === piece && selectedPiece?.color === "white"
                                    ? "ring-2 ring-chess-primary"
                                    : ""
                                }`}
                                onClick={() => handleSelectPiece(piece, "white")}
                                draggable={true}
                                onDragStart={(e) => {
                                  e.dataTransfer.setData("piece", piece);
                                  e.dataTransfer.setData("color", "white");
                                  const img = new window.Image();
                                  img.src = `/chess/w${piece}.svg`;
                                  e.dataTransfer.setDragImage(img, 25, 25);
                                }}
                              >
                                <img 
                                  src={`/chess/w${piece}.svg`} 
                                  alt={`White ${piece}`} 
                                  className="w-full h-full"
                                  draggable={false}
                                />
                              </button>
                              
                              <button
                                className={`w-10 h-10 rounded mt-1 ${
                                  selectedPiece?.piece === piece && selectedPiece?.color === "black"
                                    ? "ring-2 ring-chess-primary"
                                    : ""
                                }`}
                                onClick={() => handleSelectPiece(piece, "black")}
                                draggable={true}
                                onDragStart={(e) => {
                                  e.dataTransfer.setData("piece", piece);
                                  e.dataTransfer.setData("color", "black");
                                  const img = new window.Image();
                                  img.src = `/chess/b${piece}.svg`;
                                  e.dataTransfer.setDragImage(img, 25, 25);
                                }}
                              >
                                <img 
                                  src={`/chess/b${piece}.svg`} 
                                  alt={`Black ${piece}`} 
                                  className="w-full h-full"
                                  draggable={false}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-6">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setSelectedPiece(null)}
                          >
                            Clear Selection
                          </Button>
                        </div>
                      </div>
                      
                      <div className="pt-6">
                        <Button 
                          className="bg-chess-primary hover:bg-chess-secondary w-full"
                          onClick={calculateScore}
                        >
                          Submit Answer
                        </Button>
                      </div>
                    </>
                  )}
                  
                  {showBlurred && (
                    <div className="p-4 bg-chess-primary/5 rounded-lg border border-chess-primary/20">
                      <h3 className="font-medium mb-2">How to Play</h3>
                      <ul className="text-sm space-y-2">
                        <li>📊 Toggle between blurred view and empty board</li>
                        <li>👁️ Try to identify pieces through the blur</li>
                        <li>♟️ Place pieces on the empty board</li>
                        <li>⏱️ Complete within {TIME_LIMIT} seconds</li>
                      </ul>
                    </div>
                  )}
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
                    Your score is based on accuracy and completion time
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h2 className="font-medium mb-3">Original Position</h2>
                    <Card className="p-4">
                      <ChessBoard board={board} perspective="white" interactive={false} />
                    </Card>
                  </div>
                  
                  <div>
                    <h2 className="font-medium mb-3">Your Answer</h2>
                    <Card className="p-4">
                      <ChessBoard board={userBoard} perspective="white" interactive={false} />
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
                title="Visual Processing Training"
                area="Occipital Lobe & Visual Cortex"
                description="This challenge exercises your visual processing abilities, primarily located in the occipital lobe. When you try to identify blurred chess pieces, your brain is working to fill in missing visual information and recognize patterns despite incomplete data. This type of processing helps with reading, facial recognition, and navigating complex visual environments. For neurodivergent learners, strengthening visual processing can help with visual tracking needed for reading and other academic tasks."
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BlurredChallenge;
