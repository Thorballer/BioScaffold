import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve teacher dashboard at /teacher/
app.use('/teacher', express.static('teacher'));

// --- Ollama Setup (used for embeddings + final report only) ---
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:3b';
const EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text';

async function ollamaGenerate(prompt) {
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: OLLAMA_MODEL,
            prompt,
            stream: false,
            options: { temperature: 0.7 },
        }),
    });
    if (!res.ok) throw new Error(`Ollama error: ${res.status} ${res.statusText}`);
    const data = await res.json();
    return data.response;
}

async function ollamaEmbed(text) {
    const res = await fetch(`${OLLAMA_URL}/api/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: EMBED_MODEL,
            prompt: text,
        }),
    });
    if (!res.ok) throw new Error(`Ollama embed error: ${res.status} ${res.statusText}`);
    const data = await res.json();
    return data.embedding;
}

// --- Vector Math ---
function cosineSimilarity(a, b) {
    if (!a || !b || a.length !== b.length) return 0;
    let dot = 0, magA = 0, magB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        magA += a[i] * a[i];
        magB += b[i] * b[i];
    }
    const denom = Math.sqrt(magA) * Math.sqrt(magB);
    return denom === 0 ? 0 : dot / denom;
}

// --- In-Memory Session Store ---
const sessions = new Map();

// --- Question Bank ---
const DATA_DIR = join(__dirname, 'data');
const BANK_FILE = join(DATA_DIR, 'question-bank.json');
const GRADES_JSON = join(DATA_DIR, 'grades.json');
const GRADES_CSV = join(DATA_DIR, 'grades.csv');

let questionBank = [];
let bankLoaded = false;

function loadQuestionBank() {
    if (!existsSync(BANK_FILE)) {
        console.warn('  ⚠️  No question bank found at data/question-bank.json');
        console.warn('     Run: node generate-bank.js');
        return false;
    }
    try {
        const raw = JSON.parse(readFileSync(BANK_FILE, 'utf-8'));
        questionBank = raw.questions || [];
        console.log(`  ✅ Loaded question bank: ${questionBank.length} questions`);

        // Summary by category/difficulty
        const summary = {};
        for (const q of questionBank) {
            const key = `${q.category} [${q.difficulty}]`;
            summary[key] = (summary[key] || 0) + 1;
        }
        for (const [k, v] of Object.entries(summary)) {
            console.log(`     ${k}: ${v}`);
        }
        return true;
    } catch (err) {
        console.error('  ❌ Failed to load question bank:', err.message);
        return false;
    }
}

function ensureDataDir() {
    if (!existsSync(DATA_DIR)) {
        mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!existsSync(GRADES_JSON)) {
        writeFileSync(GRADES_JSON, '[]', 'utf-8');
    }
    if (!existsSync(GRADES_CSV)) {
        writeFileSync(GRADES_CSV, 'Student Name,Date,Score,Percentage,Level,Cells %,Genetics %,Evolution %,Ecology %\n', 'utf-8');
    }
}
ensureDataDir();

// --- Constants ---
const StandardCategory = {
    CELLS: 'Molecular and Cellular Biology',
    GENETICS: 'Genetics and Heredity',
    EVOLUTION: 'Classification, Heredity, and Evolution',
    ECOLOGY: 'Organisms, Populations, and Ecosystems',
};
const CATEGORIES = Object.values(StandardCategory);
const TOTAL_QUESTIONS = 60;

// --- Question Selection via Embeddings ---
async function selectQuestion(currentLevel, usedQuestionIds, targetCategory) {
    const difficulty = currentLevel >= 4 ? 'High' : currentLevel >= 2.5 ? 'Moderate' : 'Low';

    // Filter out used questions
    const available = questionBank.filter(q => !usedQuestionIds.has(q.id));
    if (available.length === 0) {
        throw new Error('No more questions available in the bank');
    }

    // First try: filter by exact category and difficulty
    let candidates = available.filter(q => q.category === targetCategory && q.difficulty === difficulty);

    // If not enough exact matches, relax difficulty
    if (candidates.length === 0) {
        candidates = available.filter(q => q.category === targetCategory);
    }

    // If still nothing, use all available
    if (candidates.length === 0) {
        candidates = available;
    }

    // Try embedding-based selection
    try {
        const queryText = `${targetCategory} ${difficulty} difficulty biology question`;
        const queryEmbedding = await ollamaEmbed(queryText);

        // Only consider candidates with embeddings
        const withEmbeddings = candidates.filter(q => q.embedding && q.embedding.length > 0);

        if (withEmbeddings.length > 0) {
            // Score each candidate by cosine similarity
            const scored = withEmbeddings.map(q => ({
                question: q,
                score: cosineSimilarity(queryEmbedding, q.embedding),
            }));
            scored.sort((a, b) => b.score - a.score);

            // Pick from top 5 with some randomness to avoid always picking the same one
            const topN = scored.slice(0, Math.min(5, scored.length));
            const pick = topN[Math.floor(Math.random() * topN.length)];

            console.log(`  [Select] ${targetCategory.slice(0, 25)}... [${difficulty}] → "${pick.question.text.slice(0, 50)}..." (sim: ${pick.score.toFixed(3)})`);
            return stripEmbedding(pick.question);
        }
    } catch (err) {
        console.warn(`  ⚠️  Embedding selection failed, using random: ${err.message}`);
    }

    // Fallback: random selection from candidates
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    console.log(`  [Select] Random fallback → "${pick.text.slice(0, 50)}..."`);
    return stripEmbedding(pick);
}

function stripEmbedding(question) {
    // Don't send the embedding vector to the client
    const { embedding, ...rest } = question;
    return rest;
}

// --- Fallback question if no bank loaded ---
function fallbackQuestion(category) {
    return {
        id: 'fallback-' + Math.random().toString(36).substr(2, 9),
        standard: 'SC.912.L.14.1',
        category: category || StandardCategory.CELLS,
        difficulty: 'Low',
        text: 'Which component is a key part of the cell theory?',
        options: [
            'All cells come from pre-existing cells',
            'All cells have a nucleus',
            'All cells move',
            'Cells are made of atoms only',
        ],
        correctAnswer: 0,
        explanation: 'Cell theory states that all cells come from pre-existing cells.',
    };
}

// --- Helper: Generate final AI report via Ollama ---
async function generateFinalReport(performance) {
    const prompt = `Based on the following performance data from a 60-question Florida Biology EOC simulation:
${JSON.stringify(performance)}

Provide a professional summary of student strengths and weaknesses.
Include 3-5 specific, actionable recommendations for improvement aligned with Florida Standards.

Respond with ONLY valid JSON in exactly this format (no markdown, no code fences, no extra text):
{"summary":"Summary text here","recommendations":["Recommendation 1","Recommendation 2","Recommendation 3"]}`;

    try {
        const responseText = await ollamaGenerate(prompt);
        const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found in response');
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Ollama report generation error:', error.message);
        return {
            summary: 'Simulation complete. Review your performance by category below.',
            recommendations: [
                'Focus on standards with lower accuracy.',
                'Practice high-complexity data analysis questions.',
            ],
        };
    }
}

// --- API Routes ---

// Create a new test session
app.post('/api/sessions', (req, res) => {
    const { studentName } = req.body;
    if (!studentName || !studentName.trim()) {
        return res.status(400).json({ error: 'Student name is required' });
    }

    if (!bankLoaded || questionBank.length === 0) {
        return res.status(503).json({
            error: 'Question bank not loaded. Run: node generate-bank.js'
        });
    }

    const sessionId = Math.random().toString(36).substr(2, 12) + Date.now().toString(36);
    const session = {
        id: sessionId,
        studentName: studentName.trim(),
        questions: [],
        userAnswers: [],
        usedQuestionIds: new Set(),
        currentQuestionIndex: 0,
        totalQuestions: Math.min(TOTAL_QUESTIONS, questionBank.length),
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
        currentQuestion: null,
    };

    sessions.set(sessionId, session);
    console.log(`[Session] Created: ${sessionId} for "${studentName}" (${session.totalQuestions} questions)`);
    res.json({ sessionId, totalQuestions: session.totalQuestions });
});

// Get session state
app.get('/api/sessions/:id', (req, res) => {
    const session = sessions.get(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    res.json({
        studentName: session.studentName,
        currentQuestionIndex: session.currentQuestionIndex,
        totalQuestions: session.totalQuestions,
        currentAbilityLevel: session.currentAbilityLevel,
        status: session.status,
        categoryPerformance: session.categoryPerformance,
    });
});

// Get next question — uses embedding-based selection from the bank
app.get('/api/sessions/:id/question', async (req, res) => {
    const session = sessions.get(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.status !== 'testing') return res.status(400).json({ error: 'Test is not in progress' });
    if (session.currentQuestionIndex >= session.totalQuestions) {
        return res.status(400).json({ error: 'All questions have been answered' });
    }

    const nextCategory = CATEGORIES[session.currentQuestionIndex % CATEGORIES.length];

    try {
        const question = await selectQuestion(
            session.currentAbilityLevel,
            session.usedQuestionIds,
            nextCategory
        );
        session.currentQuestion = question;
        session.usedQuestionIds.add(question.id);

        res.json({
            question,
            questionNumber: session.currentQuestionIndex + 1,
            totalQuestions: session.totalQuestions,
            currentAbilityLevel: session.currentAbilityLevel,
        });
    } catch (error) {
        console.error('Error selecting question:', error.message);
        // Fallback
        const fb = fallbackQuestion(nextCategory);
        session.currentQuestion = fb;
        res.json({
            question: fb,
            questionNumber: session.currentQuestionIndex + 1,
            totalQuestions: session.totalQuestions,
            currentAbilityLevel: session.currentAbilityLevel,
        });
    }
});

// Submit an answer
app.post('/api/sessions/:id/answer', (req, res) => {
    const session = sessions.get(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.status !== 'testing') return res.status(400).json({ error: 'Test is not in progress' });
    if (!session.currentQuestion) return res.status(400).json({ error: 'No current question' });

    const { answerIndex } = req.body;
    if (answerIndex === undefined || answerIndex === null) {
        return res.status(400).json({ error: 'answerIndex is required' });
    }

    const question = session.currentQuestion;
    const isCorrect = answerIndex === question.correctAnswer;

    // Adaptive logic
    const newAbilityLevel = isCorrect
        ? Math.min(5, session.currentAbilityLevel + 0.1)
        : Math.max(1, session.currentAbilityLevel - 0.15);

    // Update session
    session.questions.push(question);
    session.userAnswers.push(answerIndex);
    session.currentAbilityLevel = newAbilityLevel;
    session.currentQuestionIndex += 1;
    session.categoryPerformance[question.category] = {
        correct: session.categoryPerformance[question.category].correct + (isCorrect ? 1 : 0),
        total: session.categoryPerformance[question.category].total + 1,
    };
    session.currentQuestion = null;

    const isFinished = session.currentQuestionIndex >= session.totalQuestions;
    if (isFinished) {
        session.status = 'finished';
        session.endTime = Date.now();
    }

    res.json({
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        currentAbilityLevel: newAbilityLevel,
        currentQuestionIndex: session.currentQuestionIndex,
        isFinished,
        categoryPerformance: session.categoryPerformance,
    });
});

// Finish test and save grade
app.post('/api/sessions/:id/finish', async (req, res) => {
    const session = sessions.get(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    session.status = 'finished';
    session.endTime = session.endTime || Date.now();

    const totalCorrect = session.questions.reduce((acc, q, idx) => {
        return acc + (session.userAnswers[idx] === q.correctAnswer ? 1 : 0);
    }, 0);

    const percentage = (totalCorrect / session.totalQuestions) * 100;
    const ability = session.currentAbilityLevel;

    let level = 1;
    if (ability >= 4.2 && percentage > 85) level = 5;
    else if (ability >= 3.5 && percentage > 70) level = 4;
    else if (ability >= 2.8 && percentage > 55) level = 3;
    else if (ability >= 2.0 && percentage > 40) level = 2;

    // Category percentages
    const catPct = {};
    for (const [cat, stats] of Object.entries(session.categoryPerformance)) {
        catPct[cat] = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    }

    // Generate AI report
    const aiReport = await generateFinalReport({
        totalCorrect,
        percentage,
        abilityScore: ability,
        breakdown: session.categoryPerformance,
    });

    // Save grade
    const gradeRecord = {
        studentName: session.studentName,
        date: new Date().toISOString(),
        score: `${totalCorrect}/${session.totalQuestions}`,
        percentage: Math.round(percentage),
        level,
        categoryPercentages: catPct,
        aiReport,
    };

    saveGrade(gradeRecord);

    res.json({
        studentName: session.studentName,
        totalCorrect,
        totalQuestions: session.totalQuestions,
        percentage: Math.round(percentage),
        level,
        currentAbilityLevel: ability,
        categoryPerformance: session.categoryPerformance,
        categoryPercentages: catPct,
        aiReport,
        questions: session.questions,
        userAnswers: session.userAnswers,
    });

    // Clean up session from memory after a delay
    setTimeout(() => sessions.delete(session.id), 5 * 60 * 1000);
});

// --- Grade Persistence ---
function saveGrade(record) {
    ensureDataDir();

    // Save to JSON
    let grades = [];
    try {
        grades = JSON.parse(readFileSync(GRADES_JSON, 'utf-8'));
    } catch { grades = []; }
    grades.push(record);
    writeFileSync(GRADES_JSON, JSON.stringify(grades, null, 2), 'utf-8');

    // Append to CSV
    const csvLine = [
        `"${record.studentName}"`,
        `"${record.date}"`,
        `"${record.score}"`,
        record.percentage,
        record.level,
        record.categoryPercentages[StandardCategory.CELLS] || 0,
        record.categoryPercentages[StandardCategory.GENETICS] || 0,
        record.categoryPercentages[StandardCategory.EVOLUTION] || 0,
        record.categoryPercentages[StandardCategory.ECOLOGY] || 0,
    ].join(',');

    const csvContent = readFileSync(GRADES_CSV, 'utf-8');
    if (!csvContent.trim()) {
        writeFileSync(GRADES_CSV, 'Student Name,Date,Score,Percentage,Level,Cells %,Genetics %,Evolution %,Ecology %\n' + csvLine + '\n', 'utf-8');
    } else {
        writeFileSync(GRADES_CSV, csvContent + csvLine + '\n', 'utf-8');
    }

    console.log(`[Grade] Saved for "${record.studentName}": Level ${record.level}, ${record.percentage}%`);
}

// Download grades as CSV
app.get('/api/grades', (req, res) => {
    ensureDataDir();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="biology_eoc_grades.csv"');
    res.sendFile(GRADES_CSV);
});

// List grades as JSON
app.get('/api/grades/json', (req, res) => {
    ensureDataDir();
    try {
        const grades = JSON.parse(readFileSync(GRADES_JSON, 'utf-8'));
        res.json(grades);
    } catch {
        res.json([]);
    }
});

// Bank info endpoint
app.get('/api/bank/info', (req, res) => {
    const summary = {};
    for (const q of questionBank) {
        const key = `${q.category} [${q.difficulty}]`;
        summary[key] = (summary[key] || 0) + 1;
    }
    res.json({
        loaded: bankLoaded,
        totalQuestions: questionBank.length,
        breakdown: summary,
    });
});

// --- Serve Static Files (production) ---
const distPath = join(__dirname, 'dist');
if (existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(join(distPath, 'index.html'));
        }
    });
}

// --- Start Server ---
bankLoaded = loadQuestionBank();

app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║   🧬 Florida Biology EOC Adaptive Coach — Server Running   ║');
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log(`║   Local:     http://localhost:${PORT}                         ║`);
    console.log(`║   Network:   http://0.0.0.0:${PORT}                          ║`);
    console.log(`║   Bank:      ${questionBank.length} questions loaded                     ║`);
    console.log(`║   Embed:     ${EMBED_MODEL} (for selection)                ║`);
    console.log(`║   LLM:       ${OLLAMA_MODEL} (for reports only)           ║`);
    console.log('║                                                              ║');
    console.log('║   Tailscale Funnel:                                          ║');
    console.log(`║     Run: tailscale funnel ${PORT}                             ║`);
    console.log('║                                                              ║');
    console.log('║   Grades CSV: GET /api/grades                                ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');
});
