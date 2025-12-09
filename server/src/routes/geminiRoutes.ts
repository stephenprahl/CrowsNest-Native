import { Hono } from 'hono';
import { geminiController } from '../controllers';

const geminiRouter = new Hono();

// Gemini routes
geminiRouter.post('/generate', geminiController.generateResponse);

export default geminiRouter;