// Shared library for Vercel API
import questionBank from '../../data/question-bank.json' with { type: 'json' };

// In-memory session store (resets on each cold start)
// For production, use Vercel KV or Blob storage
const sessions = new Map();

export function getQuestionBank() {
    return questionBank;
}

export function createSession(studentName, totalQuestions = 60) {
    const sessionId = generateId();
    const session = {
        id: sessionId,
        studentName,
        createdAt: new Date().toISOString(),
        totalQuestions,
        answered: 0,
        correct: 0,
        questions: selectQuestions(totalQuestions),
        currentIndex: 0,
        categoryScores: {
            'Molecular and Cellular Biology': { correct: 0, total: 0 },
            'Genetics and Heredity': { correct: 0, total: 0 },
            'Classification, Heredity, and Evolution': { correct: 0, total: 0 },
            'Organisms, Populations, and Ecosystems': { correct: 0, total: 0 }
        }
    };
    sessions.set(sessionId, session);
    return session;
}

export function getSession(sessionId) {
    return sessions.get(sessionId);
}

export function updateSession(sessionId, updates) {
    const session = sessions.get(sessionId);
    if (!session) return null;
    Object.assign(session, updates);
    return session;
}

function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function selectQuestions(count) {
    const bank = questionBank.questions;
    const selected = [];
    const categories = [
        'Molecular and Cellular Biology',
        'Genetics and Heredity',
        'Classification, Heredity, and Evolution',
        'Organisms, Populations, and Ecosystems'
    ];
    
    const perCategory = Math.floor(count / categories.length);
    const remainder = count % categories.length;
    
    for (let i = 0; i < categories.length; i++) {
        const catQuestions = bank.filter(q => q.category === categories[i]);
        const numToSelect = perCategory + (i < remainder ? 1 : 0);
        const shuffled = catQuestions.sort(() => Math.random() - 0.5);
        selected.push(...shuffled.slice(0, numToSelect));
    }
    
    // Shuffle final selection
    return selected.sort(() => Math.random() - 0.5);
}

export function getNextQuestion(session) {
    if (session.currentIndex >= session.questions.length) {
        return null; // Test complete
    }
    
    const question = session.questions[session.currentIndex];
    return {
        index: session.currentIndex + 1,
        total: session.totalQuestions,
        question: {
            id: question.id,
            category: question.category,
            difficulty: question.difficulty,
            text: question.text,
            options: question.options
        }
    };
}

export function submitAnswer(sessionId, answer) {
    const session = sessions.get(sessionId);
    if (!session) return { error: 'Session not found' };
    
    const question = session.questions[session.currentIndex];
    if (!question) return { error: 'No more questions' };
    
    const isCorrect = answer === question.correctAnswer;
    
    // Update session
    session.answered++;
    if (isCorrect) session.correct++;
    
    // Update category scores
    if (session.categoryScores[question.category]) {
        session.categoryScores[question.category].total++;
        if (isCorrect) session.categoryScores[question.category].correct++;
    }
    
    session.currentIndex++;
    
    return {
        correct: isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        progress: {
            answered: session.answered,
            total: session.totalQuestions,
            score: session.correct
        }
    };
}

export function getSessionResults(sessionId) {
    const session = sessions.get(sessionId);
    if (!session) return null;
    
    const percentage = Math.round((session.correct / session.answered) * 100);
    
    return {
        studentName: session.studentName,
        totalQuestions: session.totalQuestions,
        answered: session.answered,
        correct: session.correct,
        percentage,
        categoryScores: session.categoryScores,
        completedAt: new Date().toISOString()
    };
}