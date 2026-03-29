import { getGrades } from './_lib/gradeStore.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const grades = await getGrades();

        const totalSessions = grades.length;
        const avgScore = totalSessions > 0
            ? grades.reduce((sum, g) => sum + (g.percentage || 0), 0) / totalSessions
            : 0;

        const uniqueStudents = new Set(grades.map(g => g.studentName)).size;

        const categoryBreakdown = {
            'Molecular and Cellular Biology': { avg: 0, count: 0 },
            'Genetics and Heredity': { avg: 0, count: 0 },
            'Classification, Heredity, and Evolution': { avg: 0, count: 0 },
            'Organisms, Populations, and Ecosystems': { avg: 0, count: 0 },
        };

        const difficultyBreakdown = {
            Low: { correct: 0, total: 0 },
            Moderate: { correct: 0, total: 0 },
            High: { correct: 0, total: 0 },
        };

        grades.forEach(g => {
            if (g.categoryPercentages) {
                Object.entries(g.categoryPercentages).forEach(([cat, pct]) => {
                    if (categoryBreakdown[cat]) {
                        categoryBreakdown[cat].avg += pct;
                        categoryBreakdown[cat].count++;
                    }
                });
            }
            if (g.categoryPerformance) {
                Object.entries(g.categoryPerformance).forEach(([cat, stats]) => {
                    // Rough difficulty estimation from category data
                    if (stats.total > 0) {
                        difficultyBreakdown.Moderate.correct += stats.correct;
                        difficultyBreakdown.Moderate.total += stats.total;
                    }
                });
            }
        });

        Object.entries(categoryBreakdown).forEach(([cat, data]) => {
            categoryBreakdown[cat].avg = data.count > 0 ? data.avg / data.count : 0;
        });

        return res.status(200).json({
            totalSessions,
            avgScore: Math.round(avgScore * 100) / 100,
            totalStudents: uniqueStudents,
            categoryBreakdown,
            difficultyBreakdown,
            recentSessions: grades.slice(-10).reverse().map(g => ({
                studentName: g.studentName,
                date: g.date,
                score: g.percentage,
                questionsAnswered: g.totalQuestions || 60,
            })),
        });
    } catch (err) {
        console.error('analytics error:', err);
        return res.status(500).json({ error: 'Failed to load analytics' });
    }
}
