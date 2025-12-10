import { Context } from 'hono';
import { geminiService } from '../services/geminiService';

export const geminiController = {
    async generateResponse(c: Context) {
        try {
            const body = await c.req.json();
            const { prompt } = body;

            if (!prompt || typeof prompt !== 'string') {
                return c.json({ success: false, error: 'Prompt is required and must be a string' }, 400);
            }

            const response = await geminiService.generateResponse(prompt);
            return c.json({ success: true, data: { response } });
        } catch (error) {
            console.error('Error in geminiController.generateResponse:', error);
            return c.json({ success: false, error: 'Internal server error' }, 500);
        }
    },

    async searchWeb(c: Context) {
        try {
            const body = await c.req.json();
            const { query } = body;

            if (!query || typeof query !== 'string') {
                return c.json({ success: false, error: 'Query is required and must be a string' }, 400);
            }

            const response = await geminiService.searchWeb(query);
            return c.json({ success: true, data: { response } });
        } catch (error) {
            console.error('Error in geminiController.searchWeb:', error);
            return c.json({ success: false, error: 'Internal server error' }, 500);
        }
    },
};