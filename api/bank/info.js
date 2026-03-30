import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const questionBank = JSON.parse(
    readFileSync(join(__dirname, '../../data/question-bank.json'), 'utf-8')
);

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'GET') {
        try {
            const questions = questionBank.questions || [];
            
            // Calculate distribution
            const distribution = {};
            questions.forEach(q => {
                const key = `${q.category} [${q.difficulty}]`;
                distribution[key] = (distribution[key] || 0) + 1;
            });
            
            return res.status(200).json({
                totalQuestions: questions.length,
                categories: [
                    'Molecular and Cellular Biology',
                    'Genetics and Heredity',
                    'Classification, Heredity, and Evolution',
                    'Organisms, Populations, and Ecosystems'
                ],
                difficulties: ['Low', 'Moderate', 'High'],
                distribution,
                generatedAt: questionBank.generatedAt
            });
        } catch (err) {
            console.error('Bank info error:', err);
            return res.status(500).json({ error: 'Failed to get bank info' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}