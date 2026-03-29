
export enum Difficulty {
  LOW = 'Low',
  MODERATE = 'Moderate',
  HIGH = 'High'
}

export enum StandardCategory {
  CELLS = 'Molecular and Cellular Biology',
  GENETICS = 'Genetics and Heredity',
  EVOLUTION = 'Classification, Heredity, and Evolution',
  ECOLOGY = 'Organisms, Populations, and Ecosystems'
}

export interface Question {
  id: string;
  standard: string;
  category: StandardCategory;
  difficulty: Difficulty;
  text: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  explanation: string;
}

export interface TestState {
  currentQuestionIndex: number;
  totalQuestions: number;
  questions: Question[];
  userAnswers: (number | null)[];
  currentAbilityLevel: number; // 1-5 range for internal calculation
  startTime: number;
  endTime: number | null;
  status: 'idle' | 'testing' | 'finished';
  categoryPerformance: Record<StandardCategory, { correct: number; total: number }>;
}

export interface ScoreReport {
  level: 1 | 2 | 3 | 4 | 5;
  percentage: number;
  standardBreakdown: Record<string, number>;
  recommendations: string[];
}
