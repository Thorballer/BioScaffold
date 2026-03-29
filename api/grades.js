import { saveGrade, getGrades } from './_lib/gradeStore.js';

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'POST') {
        try {
            const record = req.body;
            if (!record || !record.studentName) {
                return res.status(400).json({ error: 'studentName is required' });
            }
            await saveGrade(record);
            return res.status(200).json({ success: true });
        } catch (err) {
            console.error('saveGrade error:', err);
            return res.status(500).json({ error: 'Failed to save grade' });
        }
    }

    if (req.method === 'GET') {
        try {
            const format = req.query.format;
            const grades = await getGrades();

            if (format === 'csv') {
                const header = 'Student Name,Date,Score,Percentage,Level,Cells %,Genetics %,Evolution %,Ecology %\n';
                const rows = grades.map(g => {
                    const cp = g.categoryPercentages || {};
                    return [
                        `"${g.studentName}"`,
                        `"${g.date}"`,
                        `"${g.score}"`,
                        g.percentage,
                        g.level,
                        cp['Molecular and Cellular Biology'] || 0,
                        cp['Genetics and Heredity'] || 0,
                        cp['Classification, Heredity, and Evolution'] || 0,
                        cp['Organisms, Populations, and Ecosystems'] || 0,
                    ].join(',');
                }).join('\n');

                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename="biology_eoc_grades.csv"');
                return res.status(200).send(header + rows);
            }

            return res.status(200).json(grades);
        } catch (err) {
            console.error('getGrades error:', err);
            return res.status(500).json({ error: 'Failed to retrieve grades' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
