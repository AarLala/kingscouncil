
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "../components/Header";

const Challenges = () => {
  const challenges = [
    {
      id: 1,
      title: "Memory Recall",
      description: "Remember the position of chess pieces and recreate it from memory",
      difficulty: "Basic",
      status: "Available",
      icon: "♟",
      brainArea: "Working Memory",
      unlocked: true,
    },
    {
      id: 2,
      title: "Blurred Vision",
      description: "Identify chess positions through a blurred lens",
      difficulty: "Intermediate",
      status: "Available",
      icon: "👁️",
      brainArea: "Visual Processing",
      unlocked: true,
    },
    {
      id: 3,
      title: "Prediction Game",
      description: "Try to predict the computer's next move",
      difficulty: "Intermediate",
      status: "Available",
      icon: "🔮",
      brainArea: "Strategic Thinking",
      unlocked: true, // Now enabled
    },
    {
      id: 4,
      title: "Recall the Game",
      description: "Remember all the moves played in sequence",
      difficulty: "Advanced",
      status: "Available",
      icon: "📜",
      brainArea: "Sequential Memory",
      unlocked: true, // Now enabled
    },
    {
      id: 5,
      title: "Cognitive Switch",
      description: "Adapt to changing board orientations and positions",
      difficulty: "Advanced",
      status: "Available",
      icon: "🔄",
      brainArea: "Cognitive Flexibility",
      unlocked: true, // Now enabled
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Basic":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-chess-primary/10 text-chess-primary";
      case "Coming Soon":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <h1 className="text-2xl font-bold">Brain Challenges</h1>
            <p className="text-gray-600">
              Improve your memory, focus, and cognitive abilities through chess-based exercises
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <Link 
                to={challenge.unlocked ? `/challenges/${challenge.id}` : "#"} 
                key={challenge.id}
                className={`block ${!challenge.unlocked && "pointer-events-none"}`}
              >
                <Card className={`h-full overflow-hidden transition-all ${
                  challenge.unlocked 
                    ? "hover:shadow-md hover:translate-y-[-4px]" 
                    : "opacity-70"
                }`}>
                  <div className={`h-32 flex items-center justify-center ${
                    challenge.unlocked 
                      ? "bg-gradient-to-r from-chess-primary to-chess-secondary" 
                      : "bg-gradient-to-r from-gray-300 to-gray-400"
                  }`}>
                    <div className="text-white text-5xl">{challenge.icon}</div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg">{challenge.title}</h3>
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      {challenge.description}
                    </p>
                    
                    <div className="flex justify-between items-center mt-auto">
                      <div className="text-xs text-gray-500">
                        Brain Area: <span className="font-medium">{challenge.brainArea}</span>
                      </div>
                      
                      <Badge className={getStatusColor(challenge.status)}>
                        {challenge.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 p-6 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-4">Why Chess for Brain Training?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Pattern Recognition</h3>
                <p className="text-gray-600">
                  Chess challenges help develop the ability to recognize and remember complex patterns, a skill that transfers to many academic and real-world scenarios.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Working Memory</h3>
                <p className="text-gray-600">
                  Recalling chess positions exercises your working memory capacity, which is critical for learning, reasoning, and problem-solving.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Cognitive Flexibility</h3>
                <p className="text-gray-600">
                  Adapting to different chess challenges helps build mental flexibility, allowing for better adaptation to new situations and problems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Challenges;
