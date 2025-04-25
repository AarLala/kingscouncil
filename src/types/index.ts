
export interface User {
  id: string;
  email: string;
  username: string;
  points: number;
  completedChallenges: CompletedChallenge[];
  achievements: Achievement[];
}

export interface CompletedChallenge {
  id: number;
  score: number;
  dateCompleted: string;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  dateUnlocked: string;
}

export interface ChessPosition {
  fen: string;
  title?: string;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  completed: boolean;
  brainArea: string;
  brainDescription: string;
}

export interface ChessSquare {
  piece: string | null;
  color: "white" | "black" | null;
}

export type ChessBoard = ChessSquare[][];

export interface BoardState {
  fen: string;
  board: ChessSquare[][];
}
