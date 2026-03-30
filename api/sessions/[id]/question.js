import { getSession, getNextQuestion } from '../../../api/_lib/sessionStore.js';

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'GET') {
        try {
            const { id } = req.query;
            
            if (!id) {
                return res.status(400).json({ error: 'Session ID required' });
            }
            
            const session = getSession(id);
            
            if (!session) {
                return res.status(404).json({ error: 'Session not found' });
            }
            
            const questionData = getNextQuestion(session);
            
            if (!questionData) {
                return res.status(200).json({ 
                    complete: true,
                    message: 'Test complete'
                });
            }
            
            return res.status(200).json(questionData);
        } catch (err) {
            console.error('Get question error:', err);
            return res.status(500).json({ error: 'Failed to get question' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}