"use client"

import { useState, useEffect } from "react" // Fixed import
import { Mic, MicOff } from "lucide-react"

export function VoiceCommand() {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState("")

    // Mock Voice Recognition
    const toggleListening = () => {
        if (isListening) {
            setIsListening(false)
            setTranscript("")
        } else {
            setIsListening(true)
            // Simulate listening
            setTimeout(() => {
                setTranscript("Log a 30 minute run")
                setTimeout(() => {
                    setIsListening(false)
                    setTranscript("")
                    // Here we would actually trigger the action
                    alert("Executed: Log a 30 minute run")
                }, 1500)
            }, 2000)
        }
    }

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {isListening && (
                <div className="absolute bottom-16 right-0 bg-black/90 text-white p-4 rounded-xl border border-white/10 w-64 backdrop-blur-md mb-2 animate-in slide-in-from-bottom-5">
                    <p className="text-sm font-medium text-primary mb-1">Listening...</p>
                    <p className="text-lg italic">"{transcript}"</p>
                </div>
            )}

            <button
                onClick={toggleListening}
                className={`h-14 w-14 rounded-full flex items-center justify-center shadow-lg transition-all ${isListening
                        ? "bg-red-500 animate-pulse ring-4 ring-red-500/30"
                        : "bg-primary text-black hover:scale-105"
                    }`}
            >
                {isListening ? <MicOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6" />}
            </button>
        </div>
    )
}
