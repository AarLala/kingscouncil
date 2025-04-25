
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import { preloadChessPieces } from "./utils/chessUtils";

import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Challenges from "./pages/Challenges";
import MemoryChallenge from "./pages/MemoryChallenge";
import BlurredChallenge from "./pages/BlurredChallenge";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import PredictionGame from "./pages/PredictionGame";
import RecallTheGame from "./pages/RecallTheGame";
import CognitiveSwitch from "./pages/CognitiveSwitch";

const queryClient = new QueryClient();

const App = () => {
  // Preload chess piece images when app starts
  useEffect(() => {
    preloadChessPieces();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/about" element={<About />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/challenges" element={
                <ProtectedRoute>
                  <Challenges />
                </ProtectedRoute>
              } />
              <Route path="/challenges/1" element={
                <ProtectedRoute>
                  <MemoryChallenge />
                </ProtectedRoute>
              } />
              <Route path="/challenges/2" element={
                <ProtectedRoute>
                  <BlurredChallenge />
                </ProtectedRoute>
              } />
              <Route path="/challenges/3" element={
                <ProtectedRoute>
                  <PredictionGame />
                </ProtectedRoute>
              } />
              <Route path="/challenges/4" element={
                <ProtectedRoute>
                  <RecallTheGame />
                </ProtectedRoute>
              } />
              <Route path="/challenges/5" element={
                <ProtectedRoute>
                  <CognitiveSwitch />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
