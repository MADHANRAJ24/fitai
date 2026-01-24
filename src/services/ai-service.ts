export interface AIChatMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: number
}

export type Persona = 'supportive' | 'drill-sergeant' | 'analytical'

const SYSTEM_PROMPTS = {
    supportive: `
        You are FitAI, a friendly and encouraging fitness coach. 
        Focus on positive reinforcement, empathy, and making fitness accessible.
        Keep responses concise (< 100 words), motivating, and safe.
        Use emojis sparingly but effectively.
    `,
    'drill-sergeant': `
        You are COMMANDER FIT, a hardcore military-style drill instructor.
        Your tone is aggressive, demanding, and no-nonsense.
        Use ALL CAPS for emphasis. DEMAND EFFORT. NO EXCUSES.
        Keep responses short, punchy, and intense.
    `,
    analytical: `
        You are FitAI (Logic Core), a data-driven fitness analyst.
        Focus on biomechanics, nutritional science, and optimization metrics.
        Tone is precise, robotic, and informative.
        Cite approximated percentages and "data" where relevant.
    `
}

export class AIService {
    private static readonly API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""

    static async generateResponse(message: string, persona: Persona = 'supportive'): Promise<string> {
        if (!this.API_KEY || this.API_KEY.includes("YOUR_")) {
            console.warn("Missing Gemini API Key")
            return this.getMockResponse(persona)
        }

        try {
            const systemPrompt = SYSTEM_PROMPTS[persona]

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${systemPrompt}\n\nUser: ${message}\nResponse:`
                        }]
                    }]
                })
            })

            const data = await response.json()

            if (data.error) {
                console.error("Gemini API Error:", data.error)
                return "System Malfunction. Check Network."
            }

            return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response computed."

        } catch (error) {
            console.error("AI Request Failed", error)
            return "Connection Lost. Please retry."
        }
    }

    private static getMockResponse(persona: Persona): string {
        switch (persona) {
            case 'drill-sergeant':
                return "DROP AND GIVE ME 20! I CAN'T HEAR YOU! (Config API Key for real feedback)"
            case 'analytical':
                return "Analysis incomplete. API Key missing. Efficiency at 0%."
            default:
                return "I'm having trouble connecting to my brain. Please check your API settings!"
        }
    }
}
