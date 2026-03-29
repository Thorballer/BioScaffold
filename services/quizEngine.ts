/**
 * Client-Side Quiz Engine
 * Replaces the Express server for question selection, answer tracking,
 * adaptive difficulty, and report generation.
 * Runs entirely in the browser — no server calls needed.
 */

import { Question, StandardCategory, Difficulty } from '../types';
import { SeededRandom, hashString } from './seededRandom';

// Import question bank as static JSON (Vite handles this)
import questionBankData from '../data/question-bank-1000.json';

interface RawQuestion {
    id: string;
    category: string;
    difficulty: string;
    standard: string;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    embedding?: number[];
}

export interface QuizSession {
    studentName: string;
    seed: number;
    questions: Question[];
    userAnswers: number[];
    usedQuestionIds: Set<string>;
    currentQuestionIndex: number;
    totalQuestions: number;
    currentAbilityLevel: number;
    startTime: number;
    endTime: number | null;
    status: 'testing' | 'finished';
    categoryPerformance: Record<string, { correct: number; total: number }>;
}

export interface FinishResult {
    studentName: string;
    totalCorrect: number;
    totalQuestions: number;
    percentage: number;
    level: 1 | 2 | 3 | 4 | 5;
    currentAbilityLevel: number;
    categoryPerformance: Record<string, { correct: number; total: number }>;
    categoryPercentages: Record<string, number>;
    aiReport: { summary: string; recommendations: string[] };
    questions: Question[];
    userAnswers: number[];
}

const CATEGORIES = [
    StandardCategory.CELLS,
    StandardCategory.GENETICS,
    StandardCategory.EVOLUTION,
    StandardCategory.ECOLOGY,
];

const TOTAL_QUESTIONS = 60;

export class QuizEngine {
    private bank: RawQuestion[];
    private rng: SeededRandom;
    private session: QuizSession;

    constructor(studentName: string) {
        // Load question bank (strip embeddings to save memory)
        const rawBank = (questionBankData as any).questions || [];
        this.bank = rawBank.map((q: RawQuestion) => {
            const { embedding, ...rest } = q;
            return rest;
        });

        // Create seeded RNG from student name + timestamp component
        // The timestamp is rounded to ensure uniqueness per session, not per name
        const sessionSeed = hashString(studentName + '-' + Date.now().toString());
        this.rng = new SeededRandom(sessionSeed);

        // Pre-shuffle the entire bank so question ordering is unique per session
        this.bank = this.rng.shuffle(this.bank);

        this.session = {
            studentName: studentName.trim(),
            seed: sessionSeed,
            questions: [],
            userAnswers: [],
            usedQuestionIds: new Set(),
            currentQuestionIndex: 0,
            totalQuestions: Math.min(TOTAL_QUESTIONS, this.bank.length),
            currentAbilityLevel: 2.5,
            startTime: Date.now(),
            endTime: null,
            status: 'testing',
            categoryPerformance: {
                [StandardCategory.CELLS]: { correct: 0, total: 0 },
                [StandardCategory.GENETICS]: { correct: 0, total: 0 },
                [StandardCategory.EVOLUTION]: { correct: 0, total: 0 },
                [StandardCategory.ECOLOGY]: { correct: 0, total: 0 },
            },
        };
    }

    getSession(): QuizSession {
        return this.session;
    }

    getTotalQuestions(): number {
        return this.session.totalQuestions;
    }

    /**
     * Get the next question with shuffled answer choices.
     */
    getNextQuestion(): { question: Question; questionNumber: number; totalQuestions: number; currentAbilityLevel: number } | null {
        if (this.session.status !== 'testing') return null;
        if (this.session.currentQuestionIndex >= this.session.totalQuestions) return null;

        const targetCategory = CATEGORIES[this.session.currentQuestionIndex % CATEGORIES.length];
        const question = this.selectQuestion(targetCategory);

        if (!question) return null;

        // Shuffle answer choices
        const shuffled = this.shuffleAnswers(question);

        this.session.usedQuestionIds.add(shuffled.id);

        return {
            question: shuffled,
            questionNumber: this.session.currentQuestionIndex + 1,
            totalQuestions: this.session.totalQuestions,
            currentAbilityLevel: this.session.currentAbilityLevel,
        };
    }

    /**
     * Submit an answer and get feedback.
     */
    submitAnswer(question: Question, answerIndex: number): {
        isCorrect: boolean;
        correctAnswer: number;
        explanation: string;
        currentAbilityLevel: number;
        currentQuestionIndex: number;
        isFinished: boolean;
        categoryPerformance: Record<string, { correct: number; total: number }>;
    } {
        const isCorrect = answerIndex === question.correctAnswer;

        // Adaptive ability adjustment
        const newAbilityLevel = isCorrect
            ? Math.min(5, this.session.currentAbilityLevel + 0.1)
            : Math.max(1, this.session.currentAbilityLevel - 0.15);

        // Update session
        this.session.questions.push(question);
        this.session.userAnswers.push(answerIndex);
        this.session.currentAbilityLevel = newAbilityLevel;
        this.session.currentQuestionIndex += 1;

        const cat = question.category as string;
        if (this.session.categoryPerformance[cat]) {
            this.session.categoryPerformance[cat] = {
                correct: this.session.categoryPerformance[cat].correct + (isCorrect ? 1 : 0),
                total: this.session.categoryPerformance[cat].total + 1,
            };
        }

        const isFinished = this.session.currentQuestionIndex >= this.session.totalQuestions;
        if (isFinished) {
            this.session.status = 'finished';
            this.session.endTime = Date.now();
        }

        return {
            isCorrect,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            currentAbilityLevel: newAbilityLevel,
            currentQuestionIndex: this.session.currentQuestionIndex,
            isFinished,
            categoryPerformance: this.session.categoryPerformance,
        };
    }

    /**
     * Generate final results with rule-based AI report (no LLM needed).
     */
    finish(): FinishResult {
        this.session.status = 'finished';
        this.session.endTime = this.session.endTime || Date.now();

        const totalCorrect = this.session.questions.reduce((acc, q, idx) => {
            return acc + (this.session.userAnswers[idx] === q.correctAnswer ? 1 : 0);
        }, 0);

        const percentage = (totalCorrect / this.session.totalQuestions) * 100;
        const ability = this.session.currentAbilityLevel;

        let level: 1 | 2 | 3 | 4 | 5 = 1;
        if (ability >= 4.2 && percentage > 85) level = 5;
        else if (ability >= 3.5 && percentage > 70) level = 4;
        else if (ability >= 2.8 && percentage > 55) level = 3;
        else if (ability >= 2.0 && percentage > 40) level = 2;

        const categoryPercentages: Record<string, number> = {};
        for (const [cat, stats] of Object.entries(this.session.categoryPerformance)) {
            categoryPercentages[cat] = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
        }

        const aiReport = this.generateReport(percentage, categoryPercentages, level);

        return {
            studentName: this.session.studentName,
            totalCorrect,
            totalQuestions: this.session.totalQuestions,
            percentage: Math.round(percentage),
            level,
            currentAbilityLevel: ability,
            categoryPerformance: this.session.categoryPerformance,
            categoryPercentages,
            aiReport,
            questions: this.session.questions,
            userAnswers: this.session.userAnswers,
        };
    }

    // --- Private Methods ---

    private selectQuestion(targetCategory: string): RawQuestion | null {
        const difficulty = this.session.currentAbilityLevel >= 4 ? 'High'
            : this.session.currentAbilityLevel >= 2.5 ? 'Moderate' : 'Low';

        const available = this.bank.filter(q => !this.session.usedQuestionIds.has(q.id));
        if (available.length === 0) return null;

        // Try exact category + difficulty match
        let candidates = available.filter(q => q.category === targetCategory && q.difficulty === difficulty);

        // Relax difficulty if needed
        if (candidates.length === 0) {
            candidates = available.filter(q => q.category === targetCategory);
        }

        // Fall back to any available question
        if (candidates.length === 0) {
            candidates = available;
        }

        // Pick from top candidates with some randomness
        const pick = candidates[this.rng.nextInt(candidates.length)];
        return pick;
    }

    private shuffleAnswers(raw: RawQuestion): Question {
        const originalOptions = [...raw.options];
        const correctText = originalOptions[raw.correctAnswer];

        // Create index mapping and shuffle
        const indices = originalOptions.map((_, i) => i);
        const shuffledIndices = this.rng.shuffle(indices);
        const shuffledOptions = shuffledIndices.map(i => originalOptions[i]);

        // Find the new index of the correct answer
        const newCorrectIndex = shuffledOptions.indexOf(correctText);

        return {
            id: raw.id,
            standard: raw.standard,
            category: raw.category as StandardCategory,
            difficulty: raw.difficulty as Difficulty,
            text: raw.text,
            options: shuffledOptions,
            correctAnswer: newCorrectIndex,
            explanation: raw.explanation,
        };
    }

    private generateReport(
        percentage: number,
        categoryPercentages: Record<string, number>,
        level: number
    ): { summary: string; recommendations: string[] } {
        // Find strongest and weakest categories
        const sorted = Object.entries(categoryPercentages).sort((a, b) => b[1] - a[1]);
        const strongest = sorted[0];
        const weakest = sorted[sorted.length - 1];

        let summary: string;
        if (level >= 4) {
            summary = `Excellent performance! You scored ${Math.round(percentage)}% overall, demonstrating strong mastery of Florida Biology EOC standards. Your strongest area was ${strongest[0]} at ${strongest[1]}%. Continue challenging yourself with higher-complexity questions.`;
        } else if (level >= 3) {
            summary = `Good work! You scored ${Math.round(percentage)}% overall, showing solid understanding of core biology concepts. Your strongest area was ${strongest[0]} at ${strongest[1]}%, while ${weakest[0]} at ${weakest[1]}% needs the most attention.`;
        } else {
            summary = `You scored ${Math.round(percentage)}% overall. There is significant room for improvement across multiple biology standards. Focus your study efforts on ${weakest[0]} (${weakest[1]}%) and build foundational understanding before tackling higher-complexity questions.`;
        }

        const recommendations: string[] = [];

        // Category-specific recommendations
        if (categoryPercentages[StandardCategory.CELLS] < 60) {
            recommendations.push('Review cell organelle functions, membrane transport mechanisms, and the role of ATP in cellular respiration and photosynthesis (SC.912.L.14, SC.912.L.18).');
        }
        if (categoryPercentages[StandardCategory.GENETICS] < 60) {
            recommendations.push('Practice Punnett squares, DNA replication steps, and protein synthesis. Focus on understanding how mutations affect gene expression (SC.912.L.16).');
        }
        if (categoryPercentages[StandardCategory.EVOLUTION] < 60) {
            recommendations.push('Study the evidence for evolution, mechanisms of natural selection, and principles of biological classification including cladograms (SC.912.L.15).');
        }
        if (categoryPercentages[StandardCategory.ECOLOGY] < 60) {
            recommendations.push('Review energy flow through trophic levels, biogeochemical cycles, and human impacts on biodiversity and ecosystem stability (SC.912.L.17).');
        }

        // General recommendations based on level
        if (level <= 2) {
            recommendations.push('Build a strong vocabulary of biology terms — many EOC questions test precise understanding of scientific language.');
            recommendations.push('Practice interpreting data tables, graphs, and experimental setups, as these appear frequently on the EOC.');
        }
        if (level >= 3 && level < 5) {
            recommendations.push('Focus on application-level questions that ask you to apply concepts to new scenarios rather than just recall facts.');
        }
        if (recommendations.length === 0) {
            recommendations.push('Maintain your strong performance by reviewing any missed questions and exploring advanced biology topics.');
            recommendations.push('Consider helping peers study — teaching concepts deepens your own understanding.');
        }

        return { summary, recommendations };
    }
}
