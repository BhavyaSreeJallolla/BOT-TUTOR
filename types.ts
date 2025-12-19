
export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export enum UserRole {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export interface Mistake {
  id: string;
  language: string;
  topic: string;
  wrongCode: string;
  correctCode: string;
  errorType: string;
  explanation: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  role: UserRole;
  preferredLanguages: string[];
  mistakes: Mistake[];
  completedLessons: string[];
  points: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  language: string;
  difficulty: Difficulty;
  starterCode: string;
  solutionTemplate: string;
  testCases: { input: string; output: string }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface LessonContent {
  title: string;
  explanation: string;
  syntax: string;
  examples: string[];
  nextSteps: string[];
}
