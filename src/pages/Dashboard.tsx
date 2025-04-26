import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import { supabase } from "../supabaseClient";

const ACHIEVEMENTS = [
  { id: 1, name: "First Steps", description: "Complete your first challenge" },
  { id: 2, name: "Memory Master", description: "Score 100+ in Memory Recall" },
  { id: 3, name: "Visionary", description: "Score 100+ in Blurred Vision" },
  { id: 4, name: "Unlocker", description: "Unlock all challenges" },
  { id: 5, name: "Prediction Pro", description: "Score 100+ in Prediction Game" },
  { id: 6, name: "Quarter Grandmaster", description: "Reach 250 total points" },
  { id: 7, name: "Half Grandmaster", description: "Reach 500 total points" },
  { id: 8, name: "Grandmaster", description: "Reach 1000 total points" },
  { id: 9, name: "Legend", description: "Reach 2000 total points" },
];

const CHALLENGES = [
  {
    id: 1,
    title: "Memory Recall",
    description: "Remember chess positions and recreate them from memory",
    icon: "♟",
    difficulty: "Basic",
    unlock: (_challengePoints, _totalPoints) => true,
    unlockMsg: "",
  },
  {
    id: 2,
    title: "Blurred Vision",
    description: "Test your ability to recognize chess patterns through blurred images",
    icon: "👁️",
    difficulty: "Intermediate",
    unlock: (_challengePoints, _totalPoints) => true,
    unlockMsg: "",
  },
  {
    id: 3,
    title: "Prediction Game",
    description: "Anticipate the computer's next move",
    icon: "🔮",
    difficulty: "Advanced",
    unlock: (challengePoints, _totalPoints) => (challengePoints["1"] >= 100 && challengePoints["2"] >= 100),
    unlockMsg: "Unlock by scoring 100+ in both Memory Recall and Blurred Vision",
  },
  {
    id: 4,
    title: "Recall the Game",
    description: "Remember all the moves played in sequence",
    icon: "📜",
    difficulty: "Advanced",
    unlock: (_challengePoints, totalPoints) => totalPoints >= 300,
    unlockMsg: "Unlock by reaching 300 total points",
  },
  {
    id: 5,
    title: "Cognitive Switch",
    description: "Adapt to changing board orientations and positions",
    icon: "🔄",
    difficulty: "Advanced",
    unlock: () => false,
    unlockMsg: "Coming Soon!",
  },
];

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [challengePoints, setChallengePoints] = useState<{ [key: string]: number }>({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const fetchData = async () => {
      setLoading(true);
      // Fetch profile (username)
      const { data: profileData } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", currentUser.id)
        .single();
      setProfile(profileData);

      // Fetch challenge points
      const { data: progressData } = await supabase
        .from("user_challenge_progress")
        .select("challenge_id, points")
        .eq("user_id", currentUser.id);
      const pointsMap: { [key: string]: number } = {};
      let total = 0;
      if (progressData) {
        for (const row of progressData) {
          pointsMap[row.challenge_id] = row.points;
          total += row.points;
        }
      }
      setChallengePoints(pointsMap);
      setTotalPoints(total);

      // Fetch achievements (for demo, calculate from points)
      const userAchievements: any[] = [];
      if (progressData && progressData.length > 0) userAchievements.push(ACHIEVEMENTS[0]);
      if (pointsMap["1"] >= 100) userAchievements.push(ACHIEVEMENTS[1]);
      if (pointsMap["2"] >= 100) userAchievements.push(ACHIEVEMENTS[2]);
      if (pointsMap["1"] >= 100 && pointsMap["2"] >= 100) userAchievements.push(ACHIEVEMENTS[3]);
      if (pointsMap["3"] >= 100) userAchievements.push(ACHIEVEMENTS[4]);
      if (total >= 250) userAchievements.push(ACHIEVEMENTS[5]);
      if (total >= 500) userAchievements.push(ACHIEVEMENTS[6]);
      if (total >= 1000) userAchievements.push(ACHIEVEMENTS[7]);
      if (total >= 2000) userAchievements.push(ACHIEVEMENTS[8]);
      setAchievements(userAchievements);
      setLoading(false);
    };
    fetchData();
  }, [currentUser]);

  if (!currentUser || loading) {
    return <div>Loading...</div>;
  }

  // Challenge unlock logic
  const unlocked3 = challengePoints["1"] >= 100 && challengePoints["2"] >= 100;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Welcome, {profile?.username || currentUser.email}!</h1>
                <p className="text-gray-600">Track your progress and start new challenges</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="py-2 px-4 bg-chess-primary/10 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-chess-primary"></div>
                  <span className="font-medium text-chess-primary">{totalPoints} points</span>
                </div>
                <div className="py-2 px-4 bg-chess-accent/10 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-chess-accent"></div>
                  <span className="font-medium text-chess-accent">
                    {Object.keys(challengePoints).length} completed
                  </span>
                </div>
                <div className="py-2 px-4 bg-chess-success/10 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-chess-success"></div>
                  <span className="font-medium text-chess-success">
                    {achievements.length} achievements
                  </span>
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-bold mb-6">Your Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {CHALLENGES.map((challenge) => {
              const isUnlocked = typeof challenge.unlock === 'function' ? challenge.unlock(challengePoints, totalPoints) : challenge.unlock;
              const challengePointsVal = challengePoints[challenge.id] || 0;
              return isUnlocked ? (
                <Link to={`/challenges/${challenge.id}`} key={challenge.id}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
                    <div className="h-40 bg-gradient-to-r from-chess-primary to-chess-secondary flex items-center justify-center">
                      <div className="text-white text-5xl">{challenge.icon}</div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-2">{challenge.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{challenge.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{challenge.difficulty}</span>
                        <Button variant="ghost" size="sm" className="text-chess-primary">Start</Button>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">Points: {challengePointsVal}</div>
                    </CardContent>
                  </Card>
                </Link>
              ) : (
                <Card key={challenge.id} className="overflow-hidden border-dashed border-2 h-full opacity-60 relative">
                  <div className="h-40 bg-gray-100 flex items-center justify-center">
                    <div className="text-gray-400 text-5xl">{challenge.icon}</div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">{challenge.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{challenge.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">Locked</span>
                      <Button variant="ghost" size="sm" disabled className="text-gray-400">Locked</Button>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{challenge.unlockMsg}</div>
                  </CardContent>
                  {challenge.id === 5 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                      <span className="text-lg font-bold text-chess-primary">Coming Soon!</span>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">Recent Achievements</h2>
            </div>
            {achievements.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className="p-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-chess-primary/10 flex items-center justify-center text-chess-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">{achievement.name}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {/* For demo, just show today's date */}
                      {new Date().toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-1">No achievements yet</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Complete challenges to earn achievements and badges
                </p>
                <Link to="/challenges/1">
                  <Button className="bg-chess-primary hover:bg-chess-secondary">
                    Start a Challenge
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
