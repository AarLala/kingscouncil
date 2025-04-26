import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

interface AuthContextProps {
  currentUser: any | null;
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
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for an existing session on mount
    const getSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    };
    getSession();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      setLoading(false);
      throw new Error(error?.message || "Login failed. Please check your credentials.");
    }
    setCurrentUser(data.user);
    setLoading(false);
  };

  const signup = async (email: string, username: string, password: string) => {
    setLoading(true);
    // Store username in user_metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });
    if (error) {
      setLoading(false);
      throw new Error(error.message);
    }

    // Insert into profiles table
    if (data.user) {
      await supabase
        .from("profiles")
        .insert([{ id: data.user.id, username }]);
    }

    setCurrentUser(data.user);
    setLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
