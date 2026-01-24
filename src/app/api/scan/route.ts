import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

// Configure xAI (Grok)
const xai = createOpenAI({
    name: 'xai',
    baseURL: 'https://api.x.ai/v1',
    apiKey: process.env.GROK_API_KEY,
});

export const maxDuration = 60; // Allow 60 seconds for vision analysis

export async function POST(req: Request) {
    try {
        const { image, type } = await req.json();

        if (!image) {
            return new Response(JSON.stringify({ error: "No image provided" }), { status: 400 });
        }

        // Determine prompt based on type
        const systemPrompt = "You are FitAI's advanced vision scanner. Output ONLY valid JSON.";
        const userPrompt = type === "food"
            ? "Analyze this food image. Return a JSON object with fields: name (string), calories (number), protein (string), fats (string), carbs (string). If not food, return { error: 'Not food' }."
            : "Analyze this full body image for posture. Return a JSON object with fields: posture (Excellent/Good/Average/Bad), alignment (percentage string), issues (array of strings), correction (string), suggested_workout (string). If person not found, return { error: 'No person detected' }."

        const { text } = await generateText({
            model: xai('grok-2-vision-1212'), // Using specific vision model for safety
            system: systemPrompt,
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: userPrompt },
                        { type: 'image', image: image }, // Expecting base64 data URL
                    ],
                },
            ],
        });

        // Clean and parse JSON
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);

        return new Response(JSON.stringify(data), { status: 200 });

    } catch (error: any) {
        console.error("Scan Error:", error);
        return new Response(JSON.stringify({ error: "Scan failed", details: error.message }), { status: 500 });
    }
}
