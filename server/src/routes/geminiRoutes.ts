import { Hono } from 'hono';
import { geminiController } from '../controllers';

const geminiRouter = new Hono();

// Gemini routes
geminiRouter.post('/generate', geminiController.generateResponse);
geminiRouter.post('/search', geminiController.searchWeb);

export default geminiRouter;