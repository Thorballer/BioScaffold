import { createSession } from './_lib/sessionStore.js';

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'POST') {
        try {
            const { studentName, totalQuestions } = req.body;
            
            if (!studentName) {
                return res.status(400).json({ error: 'studentName is required' });
            }
            
            const session = createSession(studentName, totalQuestions || 60);
            
            return res.status(200).json({
                sessionId: session.id,
                totalQuestions: session.totalQuestions
            });
        } catch (err) {
            console.error('Create session error:', err);
            return res.status(500).json({ error: 'Failed to create session' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}