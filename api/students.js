import { getStudents, addStudent } from './_lib/gradeStore.js';
import { getGrades } from './_lib/gradeStore.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'GET') {
        try {
            const students = await getStudents();
            const grades = await getGrades();

            const studentStats = students.map(s => {
                const studentGrades = grades.filter(g => g.studentName === s.name);
                const avgScore = studentGrades.length > 0
                    ? studentGrades.reduce((sum, g) => sum + (g.percentage || 0), 0) / studentGrades.length
                    : 0;

                return {
                    ...s,
                    sessionCount: studentGrades.length,
                    avgScore: Math.round(avgScore * 100) / 100,
                    lastSession: studentGrades.length > 0
                        ? studentGrades[studentGrades.length - 1].date
                        : null,
                };
            });

            return res.status(200).json({ students: studentStats });
        } catch (err) {
            console.error('getStudents error:', err);
            return res.status(500).json({ error: 'Failed to retrieve students' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { name, studentId, grade } = req.body;
            if (!name) return res.status(400).json({ error: 'name is required' });

            const student = {
                id: studentId || name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString(36),
                name,
                grade,
                createdAt: new Date().toISOString(),
            };
            await addStudent(student);
            return res.status(200).json({ success: true, student });
        } catch (err) {
            console.error('addStudent error:', err);
            return res.status(500).json({ error: 'Failed to add student' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
