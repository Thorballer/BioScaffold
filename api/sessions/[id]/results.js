import { getSessionResults } from '../../_lib/sessionStore.js';

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
            
            const results = getSessionResults(id);
            
            if (!results) {
                return res.status(404).json({ error: 'Session not found' });
            }
            
            return res.status(200).json(results);
        } catch (err) {
            console.error('Get results error:', err);
            return res.status(500).json({ error: 'Failed to get results' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}