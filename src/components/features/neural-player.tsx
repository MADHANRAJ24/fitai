"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Play, Pause, SkipBack, SkipForward, Waves, Headphones } from "lucide-react"

export function NeuralPlayer() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [activeTrack, setActiveTrack] = useState(0)
    const [mode, setMode] = useState<"focus" | "music">("focus")
    const audioContextRef = useRef<AudioContext | null>(null)
    const oscillatorRefs = useRef<OscillatorNode[]>([])
    const gainNodeRef = useRef<GainNode | null>(null)

    const tracks = [
        { title: "Alpha Waves (10Hz)", desc: "Light Relaxation", color: "text-blue-400", bg: "bg-blue-500", freq: 10 },
        { title: "Beta Waves (20Hz)", desc: "Active Concentration", color: "text-green-400", bg: "bg-green-500", freq: 20 },
        { title: "Theta Waves (6Hz)", desc: "Deep Meditation", color: "text-purple-400", bg: "bg-purple-500", freq: 6 },
        { title: "Gamma Waves (40Hz)", desc: "Peak Performance", color: "text-orange-400", bg: "bg-orange-500", freq: 40 },
    ]

    useEffect(() => {
        return () => stopAudio()
    }, [])

    useEffect(() => {
        if (isPlaying) {
            stopAudio()
            startAudio(tracks[activeTrack].freq)
        }
    }, [activeTrack])

    const startAudio = async (beatFreq: number) => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext
            const ctx = new AudioContext()

            // Resume audio context if suspended (browser autoplay policy)
            if (ctx.state === 'suspended') {
                await ctx.resume()
            }

            audioContextRef.current = ctx

            const gainNode = ctx.createGain()
            gainNode.gain.value = 0.3 // Increased volume for audibility
            gainNode.connect(ctx.destination)
            gainNodeRef.current = gainNode

            // Base frequency (Carrier tone)
            const baseFreq = 200

            // Left Ear Oscillator
            const osc1 = ctx.createOscillator()
            osc1.type = "sine"
            osc1.frequency.value = baseFreq
            osc1.connect(gainNode)

            // Right Ear Oscillator (Carrier + Beat)
            const osc2 = ctx.createOscillator()
            osc2.type = "sine"
            osc2.frequency.value = baseFreq + beatFreq
            osc2.connect(gainNode)

            osc1.start()
            osc2.start()

            oscillatorRefs.current = [osc1, osc2]
            console.log("Audio started:", beatFreq, "Hz binaural beat")
        } catch (error) {
            console.error("Audio failed to start:", error)
        }
    }

    const stopAudio = () => {
        oscillatorRefs.current.forEach(osc => {
            try { osc.stop() } catch (e) { }
        })
        oscillatorRefs.current = []
        if (audioContextRef.current) {
            audioContextRef.current.close()
            audioContextRef.current = null
        }
    }

    const togglePlay = async () => {
        if (isPlaying) {
            stopAudio()
            setIsPlaying(false)
        } else {
            await startAudio(tracks[activeTrack].freq)
            setIsPlaying(true)
        }
    }

    return (
        <Card className="glass border-white/5 h-full flex flex-col">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Headphones className="h-5 w-5 text-primary" />
                        {mode === "focus" ? "Neural-Focus" : "Global Radio"}
                    </CardTitle>
                    <div className="flex bg-white/10 rounded-full p-1">
                        <button
                            onClick={() => {
                                setMode("focus")
                                setIsPlaying(false)
                                stopAudio()
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${mode === "focus" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"}`}
                        >
                            Focus
                        </button>
                        <button
                            onClick={() => {
                                setMode("music")
                                setIsPlaying(false)
                                stopAudio()
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${mode === "music" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"}`}
                        >
                            Music
                        </button>
                    </div>
                </div>
                <CardDescription>
                    {mode === "focus" ? "Binaural beats. Use headphones." : "Top hits in all languages."}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between p-4 pt-0">
                {mode === "focus" ? (
                    <>
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
                                    onClick={togglePlay}
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
                    </>
                ) : (
                    <div className="h-full w-full rounded-xl overflow-hidden mt-4 bg-black">
                        <iframe
                            style={{ borderRadius: "12px" }}
                            src="https://open.spotify.com/embed/playlist/37i9dQZF1DX76Wlfdnj7AP?utm_source=generator&theme=0"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
