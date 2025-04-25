import { useState, useEffect } from "react";
import ChessBoard from "./ChessBoard";
import { fenToBoard, samplePositions, getSafeFen } from "../utils/chessUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export default function CognitiveSwitchBoard({ puzzleType }: { puzzleType: string }) {
  const { toast } = useToast();
  const [orientation, setOrientation] = useState<"white" | "black">("white"); // Default to white
  const [rotation, setRotation] = useState<number>(0);
  const [fenIdx, setFenIdx] = useState(0);

  // Perspective Switch
  if (puzzleType === "perspective") {
    try {
      const fen = getSafeFen(samplePositions[fenIdx % samplePositions.length].fen);
      return (
        <div className="flex flex-col items-center">
          <div className="flex gap-4 mb-2">
            <Button variant={orientation==="white"?"default":"outline"} onClick={() => setOrientation("white")}>
              White
            </Button>
            <Button variant={orientation==="black"?"default":"outline"} onClick={() => setOrientation("black")}>
              Black
            </Button>
            <Button variant="outline" onClick={()=>{
              setFenIdx((cur)=>(cur+1)%samplePositions.length);
              toast({
                description: "Switched to new position",
              });
            }}>Next Position</Button>
          </div>
          <div className="mb-2 font-medium">
            Board Position: <span className="font-mono text-gray-600">{samplePositions[fenIdx % samplePositions.length].title}</span>
          </div>
          <ChessBoard 
            board={fenToBoard(fen)}
            perspective={orientation}
            interactive={false}
          />
          <div className="mt-2 text-gray-500 text-sm text-center">Switch between white/black view and see if you can spot the same position from both sides.</div>
        </div>
      );
    } catch (error) {
      console.error("Error loading chess position:", error);
      // Fall back to the starting position
      const defaultFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
      return (
        <div className="flex flex-col items-center">
          <div className="text-red-500 mb-4">Error loading position. Using default position.</div>
          <ChessBoard 
            board={fenToBoard(defaultFen)}
            perspective="white"
            interactive={false}
          />
        </div>
      );
    }
  }

  // Reverse Recall Puzzle
  if (puzzleType === "reverse") {
    // Dynamic moves pool: cycle for variety
    const moveSets = [
      ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6"],
      ["d4", "d5", "c4", "e6", "Nc3", "Nf6"],
      ["c4", "e5", "Nc3", "Nf6", "g3", "d5"]
    ];
    const [setIdx, setSetIdx] = useState(0);
    const moves = moveSets[setIdx % moveSets.length];
    const [userInput, setUserInput] = useState("");
    const [score, setScore] = useState<null|number>(null);

    const handleCheck = () => {
      const inputMoves = userInput.split(",").map(s => s.trim()).filter(Boolean);
      let correct = 0;
      for (let i=0; i<moves.length; ++i) {
        if (inputMoves[i] && inputMoves[i].toLowerCase() === moves[moves.length-1-i].toLowerCase()) correct++;
      }
      const scoreValue = Math.round((correct/moves.length)*100);
      setScore(scoreValue);
      
      toast({
        title: scoreValue > 80 ? "Great job!" : "Score",
        description: `You scored ${scoreValue}%`,
        variant: scoreValue > 80 ? "default" : "destructive",
      });
    };

    const handleReset = () => {
      setUserInput("");
      setScore(null);
      setSetIdx(i=>(i+1)%moveSets.length); // Next set
      toast({
        description: "New move sequence loaded",
      });
    };

    return (
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="mb-2 text-gray-700 font-medium">Recent moves:</div>
        <div className="font-mono text-lg text-chess-primary">{moves.join(", ")}</div>
        <div className="mt-2 w-full">
          <Input 
            type="text"
            placeholder={"Enter moves in reverse (" + moves.slice().reverse().join(", ") + ")"}
            value={userInput}
            onChange={e=>setUserInput(e.target.value)}
            disabled={score!==null}
            className="mb-2"
          />
        </div>
        {score===null ? (
           <Button className="w-full" onClick={handleCheck} disabled={!userInput}>Check</Button>
        ) : (
          <div className="w-full flex flex-col items-center">
            <div className="mb-1 text-lg font-semibold text-chess-primary">Score: {score}%</div>
            <div className="mb-1 text-gray-700 text-sm">Answer: <span className="font-mono">{moves.slice().reverse().join(", ")}</span></div>
            <Button className="w-full" onClick={handleReset}>Try another</Button>
          </div>
        )}
        <div className="mt-1 text-gray-500 text-sm text-center">
          Recall the moves <b>in reverse order</b>; separate with commas.<br/>
          For example: <span className="font-mono">Nc6, e5, e4</span>
        </div>
      </div>
    );
  }

  // Rotation Match Puzzle
  if (puzzleType === "rotation") {
    try {
      const fen = getSafeFen(samplePositions[fenIdx % samplePositions.length].fen);
      const [targetRot, setTargetRot] = useState<number>(0);
      const [userRot, setUserRot] = useState<number>(0);
      const [matched, setMatched] = useState<boolean|null>(null);
      
      // Initialize target rotation when the component loads
      useEffect(() => {
        setTargetRot(Math.floor(Math.random() * 4) * 90); // 0/90/180/270
      }, []);

      const handleRotate = () => {
        setUserRot((r) => (r + 90) % 360);
        toast({
          description: `Board rotated to ${(userRot + 90) % 360}°`,
          variant: "default",
        });
      };
      
      const handleNext = () => {
        setFenIdx(i => (i + 1) % samplePositions.length);
        setTargetRot(Math.floor(Math.random() * 4) * 90);
        setUserRot(0);
        setMatched(null);
        toast({
          description: "New position loaded",
        });
      };
      
      const handleCheck = () => {
        const isMatched = userRot === targetRot;
        setMatched(isMatched);
        toast({
          title: isMatched ? "Correct!" : "Not matched",
          description: isMatched ? "You found the correct rotation" : `The correct rotation was ${targetRot}°`,
          variant: isMatched ? "default" : "destructive",
        });
      };

      return (
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex gap-3 mb-2">
            <Button variant="outline" onClick={() => setUserRot((r) => (r + 90) % 360)}>Rotate 90°</Button>
            <Button variant="default" onClick={handleCheck} disabled={matched !== null}>Check</Button>
            <Button variant="outline" onClick={handleNext}>Next Board</Button>
          </div>
          <div 
            className="mx-auto"
            style={{ transform: `rotate(${userRot}deg)`, transition: "transform 0.3s", width: "min(90vw,380px)" }}>
            <ChessBoard 
              board={fenToBoard(fen)}
              perspective="white"
              interactive={false}
            />
          </div>
          <div className="mt-1">
            {matched === null
              ? <div className="text-gray-600 text-sm text-center">Try to rotate the board to match the true rotation. Hit "Check" to see if you got it!</div>
              : matched
                ? <div className="text-green-600 font-bold text-sm">Matched! 🎉</div>
                : <div className="text-red-500 font-bold text-sm">Not matched. Real rotation was: <b>{targetRot}°</b></div>
            }
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error in rotation match puzzle:", error);
      return <div className="text-red-500">Error loading chess position</div>;
    }
  }

  // Default case - when puzzleType doesn't match any known type
  return (
    <div className="flex flex-col items-center gap-4 p-4 text-center">
      <div className="text-red-500 font-medium">
        Unknown puzzle type: "{puzzleType}"
      </div>
      <div className="text-gray-600">
        Available puzzle types: "perspective", "reverse", "rotation"
      </div>
    </div>
  );
}
