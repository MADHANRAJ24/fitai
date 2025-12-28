"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Play, Pause, SkipBack, SkipForward, Waves, Headphones } from "lucide-react"

export function NeuralPlayer() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [activeTrack, setActiveTrack] = useState(0)

    const tracks = [
        { title: "Alpha Waves (8-12Hz)", desc: "Light Relaxation", color: "text-blue-400", bg: "bg-blue-500" },
        { title: "Beta Waves (13-30Hz)", desc: "Active Concentration", color: "text-green-400", bg: "bg-green-500" },
        { title: "Theta Waves (4-8Hz)", desc: "Deep Meditation", color: "text-purple-400", bg: "bg-purple-500" },
        { title: "Gamma Waves (30Hz+)", desc: "Peak Performance", color: "text-orange-400", bg: "bg-orange-500" },
    ]

    return (
        <Card className="glass border-white/5 h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Headphones className="h-5 w-5 text-primary" />
                    Neural-Focus Player
                </CardTitle>
                <CardDescription>Binaural beats to entrain your brainwaves.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
                {/* Visualizer Mock */}
                <div className="flex-1 flex items-center justify-center gap-1 min-h-[150px]">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 rounded-full transition-all duration-300 ${tracks[activeTrack].bg}`}
                            style={{
                                height: isPlaying ? `${Math.random() * 100}%` : "20%",
                                opacity: isPlaying ? 1 : 0.3
                            }}
                        />
                    ))}
                </div>

                {/* Controls */}
                <div className="space-y-6 mt-6">
                    <div className="text-center">
                        <h3 className={`text-xl font-bold ${tracks[activeTrack].color} transition-colors`}>
                            {tracks[activeTrack].title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{tracks[activeTrack].desc}</p>
                    </div>

                    <div className="flex items-center justify-center gap-8">
                        <button
                            onClick={() => setActiveTrack(prev => (prev - 1 + tracks.length) % tracks.length)}
                            className="text-white/50 hover:text-white transition-colors"
                        >
                            <SkipBack className="h-6 w-6" />
                        </button>

                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className={`h-16 w-16 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 ${isPlaying ? "bg-white text-black" : "bg-primary text-black"}`}
                        >
                            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                        </button>

                        <button
                            onClick={() => setActiveTrack(prev => (prev + 1) % tracks.length)}
                            className="text-white/50 hover:text-white transition-colors"
                        >
                            <SkipForward className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
