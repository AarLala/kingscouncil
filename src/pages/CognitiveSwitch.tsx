import Header from "../components/Header";
import { Card } from "@/components/ui/card";

const CognitiveSwitch = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto">
          <Card className="p-6 mt-8 rounded-xl shadow-md bg-gradient-to-br from-chess-primary/5 to-white text-center">
            <h1 className="text-2xl font-bold text-chess-primary mb-4">
              Cognitive Switch <span className="ml-2 text-base text-gray-500 font-medium">(Challenge 5)</span>
            </h1>
            <div className="text-3xl mb-4">🧠🔄</div>
            <p className="text-lg text-gray-700 mb-2 font-semibold">Coming Soon!</p>
            <p className="text-gray-600">This challenge is under development. Stay tuned for new ways to train your cognitive flexibility and chess skills!</p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CognitiveSwitch;
