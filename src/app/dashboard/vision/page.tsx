"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScanFace, Camera, Eye, RefreshCw, Play, Square, Activity, Target } from "lucide-react"

export default function VisionPage() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isActive, setIsActive] = useState(false)
    const [reps, setReps] = useState(0)
    const [status, setStatus] = useState("Stand in frame")
    const [isCalibrated, setIsCalibrated] = useState(false)

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                setIsActive(true)
                setStatus("Calibrating AR Engine...")
                setTimeout(() => {
                    setStatus("Tracking Active")
                    setIsCalibrated(true)
                }, 3000)
            }
        } catch (err) {
            console.error("Error accessing camera:", err)
            setStatus("Camera Access Denied")
        }
    }

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream
            const tracks = stream.getTracks()
            tracks.forEach(track => track.stop())
            videoRef.current.srcObject = null
            setIsActive(false)
            setStatus("System Offline")
            setIsCalibrated(false)
        }
    }

    // Simulate Rep Counting
    useEffect(() => {
        if (!isCalibrated) return

        const interval = setInterval(() => {
            if (Math.random() > 0.6) {
                setReps(prev => prev + 1)
                setStatus("Rep Counted")
                setTimeout(() => setStatus("Tracking Active"), 1000)
            }
        }, 3000)

        return () => clearInterval(interval)
    }, [isCalibrated])

    return (
        <div className="space-y-8 h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <ScanFace className="h-8 w-8 text-primary" />
                        AI Vision Trainer
                    </h2>
                    <p className="text-muted-foreground">Real-time biomechanics analysis.</p>
                </motion.div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <motion.div
                            key={reps}
                            initial={{ scale: 1.5, color: "#10b981" }}
                            animate={{ scale: 1, color: "#10b981" }}
                            className="text-4xl font-mono font-bold text-primary"
                        >
                            {reps}
                        </motion.div>
                        <div className="text-xs text-muted-foreground font-mono">REPS COMPLETED</div>
                    </div>
                    {isActive ? (
                        <Button variant="destructive" onClick={stopCamera} className="shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                            <Square className="h-4 w-4 mr-2" /> Stop Session
                        </Button>
                    ) : (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="neon" onClick={startCamera}>
                                <Play className="h-4 w-4 mr-2" /> Activate Vision
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Camera Feed */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    <Card className="glass border-white/5 overflow-hidden relative min-h-[500px] flex flex-col bg-black/40">
                        {/* Status Indicators */}
                        <div className="absolute top-4 left-4 z-30 flex gap-2">
                            <div className={`px-3 py-1 rounded-md text-xs font-mono border flex items-center gap-2 backdrop-blur-md ${isActive ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-gray-500/10 text-gray-500 border-gray-500/30'}`}>
                                <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
                                {isActive ? "LIVE FEED" : "OFFLINE"}
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={status}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="px-3 py-1 rounded-md text-xs font-mono bg-primary/20 text-primary border border-primary/30 backdrop-blur-md"
                                >
                                    {status.toUpperCase()}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* AR Overlay Layer */}
                        {isActive && (
                            <div className="absolute inset-0 z-20 pointer-events-none">
                                {/* Scanning Line */}
                                <motion.div
                                    initial={{ top: "0%" }}
                                    animate={{ top: "100%" }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 w-full h-1 bg-primary/50 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                                />

                                {/* Corner Brackets */}
                                <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-primary/50 rounded-tr-lg" />
                                <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-primary/50 rounded-bl-lg" />
                                <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-primary/50 rounded-br-lg" />

                                {/* Center Target */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50">
                                    <Target className="h-64 w-64 text-primary animate-spin-slow" strokeWidth={0.5} />
                                </div>

                                {/* Rep Feedback Flash */}
                                <AnimatePresence>
                                    {status.includes("Rep") && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 0.3 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-primary"
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        <div className="flex-1 bg-black flex items-center justify-center relative overflow-hidden">
                            {!isActive && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center text-muted-foreground z-10"
                                >
                                    <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                    <p className="font-mono text-sm">AWAITING VIDEO INPUT</p>
                                </motion.div>
                            )}

                            {/* Grid Background while offline */}
                            <div className={`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] ${isActive ? 'opacity-20' : 'opacity-100'}`} />

                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className={`w-full h-full object-cover relative z-0 ${isActive ? 'opacity-100' : 'opacity-0 hidden'}`}
                            />
                        </div>
                    </Card>
                </motion.div>

                {/* Side Stats */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-6"
                >
                    <Card className="glass border-white/5">
                        <CardHeader>
                            <CardTitle className="text-lg">Biomechanics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { label: "Form Quality", val: "98%", score: 98, color: "bg-green-500", icon: Activity },
                                { label: "Tempo Consistency", val: "94%", score: 94, color: "bg-blue-500", icon: RefreshCw },
                                { label: "Range of Motion", val: "100%", score: 100, color: "bg-purple-500", icon: Eye }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <stat.icon className="h-3 w-3" /> {stat.label}
                                        </div>
                                        <span className="font-mono font-bold text-white">{stat.val}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: isCalibrated ? `${stat.score}%` : "0%" }}
                                            transition={{ duration: 1, delay: i * 0.2 }}
                                            className={`h-full ${stat.color} shadow-[0_0_8px_currentColor]`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="glass border-white/5">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <ScanFace className="h-4 w-4" />
                                </div>
                                <div className="font-bold text-sm">System Ready</div>
                            </div>
                            <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                                &gt; INITIALIZING SKELETAL TRACKING.<br />
                                &gt; LIGHTING CONDITIONS: OPTIMAL.<br />
                                &gt; PLACE DEVICE ON STABLE SURFACE.<br />
                                &gt; STEP BACK 3-5 FEET.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
