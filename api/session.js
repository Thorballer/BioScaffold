import { getSession, getNextQuestion, submitAnswer } from './_lib/sessionStore.js';

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const { id, action } = req.query;
        
        if (!id) {
            return res.status(400).json({ error: 'Session ID required' });
        }
        
        const session = getSession(id);
        
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        // GET /api/session?id=xxx&action=question - Get next question
        if (req.method === 'GET' && action === 'question') {
            const questionData = getNextQuestion(session);
            
            if (!questionData) {
                return res.status(200).json({ 
                    complete: true,
                    message: 'Test complete'
                });
            }
            
            return res.status(200).json(questionData);
        }
        
        // POST /api/session?id=xxx - Submit answer
        if (req.method === 'POST') {
            const { answer } = req.body;
            
            if (answer === undefined || answer === null) {
                return res.status(400).json({ error: 'Answer is required' });
            }
            
            const result = submitAnswer(id, answer);
            
            if (result.error) {
                return res.status(400).json(result);
            }
            
            return res.status(200).json(result);
        }
        
        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('Session error:', err);
        return res.status(500).json({ error: 'Failed to process request' });
    }
}