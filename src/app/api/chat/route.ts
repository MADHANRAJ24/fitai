import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Configure xAI (Grok) as a custom OpenAI provider
const xai = createOpenAI({
    name: 'xai',
    baseURL: 'https://api.x.ai/v1',
    apiKey: process.env.GROK_API_KEY,
});

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = streamText({
        model: xai('grok-beta'),
        messages,
        system: `You are the FitAI Coach, a futuristic, high-energy bio-hacking expert. 
    Your tone is motivating, direct, and slightly sci-fi.
    You specialize in:
    1. Circadian Rhythm optimization.
    2. Hypertrophy training.
    3. Macronutrient precision.
    
    Keep responses concise (< 100 words) and use emojis sparingly but effectively.
    Always push the user to achieve their "Genetic Potential".`,
    });

    return result.toTextStreamResponse();
}
