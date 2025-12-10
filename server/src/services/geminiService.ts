import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../utils/config';

const genAI = new GoogleGenerativeAI(config.gemini.apiKey!);
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    tools: [{ googleSearchRetrieval: {} }],
});

export const geminiService = {
    async generateResponse(prompt: string): Promise<string> {
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating Gemini response:', error);
            throw new Error('Failed to generate AI response');
        }
    },

    async searchWeb(query: string): Promise<string> {
        try {
            const prompt = `Search the web for: ${query}. Provide a summary of the most relevant results, including prices, sources, and key information.`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating Gemini search response:', error);
            throw new Error('Failed to perform web search');
        }
    },
};