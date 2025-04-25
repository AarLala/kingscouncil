
import { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulated user for demo purposes
  const demoUser: User = {
    id: "demo-user-001",
    email: "demo@example.com",
    username: "ChessBrain",
    points: 150,
    completedChallenges: [
      { id: 1, score: 85, dateCompleted: new Date().toISOString() }
    ],
    achievements: [
      {
        id: 1,
        name: "First Challenge",
        description: "Completed your first challenge",
        icon: "award",
        dateUnlocked: new Date().toISOString()
      }
    ]
  };

  useEffect(() => {
    // Check if user is stored in localStorage (simulating persistence)
    const storedUser = localStorage.getItem("chessUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // This is a mock login. In a real app, you'd verify against a backend
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      
      // For demo purposes, we'll log in the demo user
      setCurrentUser(demoUser);
      localStorage.setItem("chessUser", JSON.stringify(demoUser));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, username: string, password: string) => {
    setLoading(true);
    try {
      // This is a mock signup. In a real app, you'd create a user in your backend
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      
      // Create a new user based on the demo user but with the provided email/username
      const newUser = {
        ...demoUser,
        id: `user-${Date.now()}`,
        email,
        username,
        // Reset progress for new user
        points: 0,
        completedChallenges: [],
        achievements: []
      };
      
      setCurrentUser(newUser);
      localStorage.setItem("chessUser", JSON.stringify(newUser));
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // Clear the user from state and localStorage
    setCurrentUser(null);
    localStorage.removeItem("chessUser");
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
