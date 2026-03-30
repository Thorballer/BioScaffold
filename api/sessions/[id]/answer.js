import { getSession, submitAnswer, getSessionResults } from '../../_lib/sessionStore.js';

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'POST') {
        try {
            const { id } = req.query;
            const { answer } = req.body;
            
            if (!id) {
                return res.status(400).json({ error: 'Session ID required' });
            }
            
            if (answer === undefined || answer === null) {
                return res.status(400).json({ error: 'Answer is required' });
            }
            
            const session = getSession(id);
            
            if (!session) {
                return res.status(404).json({ error: 'Session not found' });
            }
            
            const result = submitAnswer(id, answer);
            
            if (result.error) {
                return res.status(400).json(result);
            }
            
            return res.status(200).json(result);
        } catch (err) {
            console.error('Submit answer error:', err);
            return res.status(500).json({ error: 'Failed to submit answer' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}