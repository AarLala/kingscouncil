
import { useState } from "react";
import Header from "../components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CognitiveSwitchBoard from "../components/CognitiveSwitchBoard";

const puzzleTypes = [
  { label: "Perspective Switch", key: "perspective" },
  { label: "Reverse Recall", key: "reverse" },
  { label: "Rotation Match", key: "rotation" }
];

const CognitiveSwitch = () => {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const puzzle = puzzleTypes[puzzleIdx];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto">
          <Card className="p-6 mt-8 rounded-xl shadow-md bg-gradient-to-br from-chess-primary/5 to-white">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-2xl font-bold text-chess-primary">
                Cognitive Switch <span className="ml-2 text-base text-gray-500 font-medium">(Challenge 5)</span>
              </h1>
              <div>
                {puzzleTypes.map((puz, i) => (
                  <Button
                    key={puz.key}
                    variant={i === puzzleIdx ? "default" : "outline"}
                    onClick={() => setPuzzleIdx(i)}
                    className="ml-2"
                  >
                    {puz.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="mb-5 text-gray-700">
              {puzzle.key === "perspective" && (
                <div>Switch between white/black orientation. Try to match the position as seen from both sides.</div>
              )}
              {puzzle.key === "reverse" && (
                <div>Recall and enter the last N moves <b>in reverse order</b>!</div>
              )}
              {puzzle.key === "rotation" && (
                <div>Match chess boards with random <span className="font-bold">rotations</span>. Can you spot the differences?</div>
              )}
            </div>
            <div className="my-8">
              <CognitiveSwitchBoard puzzleType={puzzle.key} />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CognitiveSwitch;
