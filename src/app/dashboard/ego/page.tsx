"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Upload, AlertTriangle, Flame, ArrowRight, History, Share2, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

interface EgoLog {
    id: number
    photo: string // base64
    date: string
}

const STORAGE_KEY = "ego_chamber_logs"
const STREAK_KEY = "ego_streak_data"

const MOTIVATIONAL_QUOTES = [
    "Success is rented, and the rent is due every day. You haven't paid today.",
    "Your body keeps score. What story are you writing?",
    "Discipline is choosing between what you want NOW and what you want MOST.",
    "The pain of discipline is nothing compared to the pain of regret.",
    "Champions don't show up to get everything they want; they show up to give everything they have.",
]

export default function EgoPage() {
    const [logs, setLogs] = useState<EgoLog[]>([])
    const [streak, setStreak] = useState(0)
    const [lastLogDate, setLastLogDate] = useState<string | null>(null)
    const [showWarning, setShowWarning] = useState(true)
    const [beastMode, setBeastMode] = useState(false)
    const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0])
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        loadData()
        setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)])
    }, [])

    const loadData = () => {
        if (typeof window === 'undefined') return

        // Load logs
        const storedLogs = localStorage.getItem(STORAGE_KEY)
        if (storedLogs) {
            setLogs(JSON.parse(storedLogs))
        }

        // Load streak data
        const streakData = localStorage.getItem(STREAK_KEY)
        if (streakData) {
            const { streak: s, lastDate } = JSON.parse(streakData)
            setStreak(s)
            setLastLogDate(lastDate)

            // Check if logged today
            const today = new Date().toDateString()
            if (lastDate === today) {
                setShowWarning(false)
            }
        }
    }

    const saveData = (newLogs: EgoLog[], newStreak: number, date: string) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs))
        localStorage.setItem(STREAK_KEY, JSON.stringify({ streak: newStreak, lastDate: date }))
    }

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            const base64 = reader.result as string
            const today = new Date().toDateString()

            // Check if already logged today
            if (lastLogDate === today) {
                toast.info("Already logged today! Keep it up 💪")
                return
            }

            // Calculate streak
            let newStreak = 1
            if (lastLogDate) {
                const yesterday = new Date()
                yesterday.setDate(yesterday.getDate() - 1)
                if (lastLogDate === yesterday.toDateString()) {
                    newStreak = streak + 1
                }
            }

            const newLog: EgoLog = {
                id: Date.now(),
                photo: base64,
                date: today
            }

            const newLogs = [newLog, ...logs]
            setLogs(newLogs)
            setStreak(newStreak)
            setLastLogDate(today)
            setShowWarning(false)
            saveData(newLogs, newStreak, today)

            toast.success(`Day ${newStreak} logged! 🔥`)
        }
        reader.readAsDataURL(file)
    }

    const handleDelete = (id: number) => {
        const newLogs = logs.filter(l => l.id !== id)
        setLogs(newLogs)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs))
        toast.success("Photo removed")
    }

    const activateBeastMode = () => {
        setBeastMode(true)
        toast.success("BEAST MODE ACTIVATED! 🔥", {
            description: "No excuses. Maximum effort.",
            duration: 3000
        })
        setTimeout(() => setBeastMode(false), 5000)
    }

    // Calculate discipline level based on streak
    const disciplineLevel = Math.min(100, streak * 10)
    const disciplineLabel = disciplineLevel >= 70 ? "High" : disciplineLevel >= 40 ? "Medium" : "Low"
    const disciplineColor = disciplineLevel >= 70 ? "text-green-400" : disciplineLevel >= 40 ? "text-yellow-400" : "text-red-400"
    const barColor = disciplineLevel >= 70 ? "bg-green-500" : disciplineLevel >= 40 ? "bg-yellow-500" : "bg-red-500"

    return (
        <div className={`space-y-8 h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar transition-all ${beastMode ? "animate-pulse" : ""}`}>
            {/* Beast Mode Overlay */}
            <AnimatePresence>
                {beastMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-orange-500/20 pointer-events-none z-50"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Strict Mode Warning */}
            <AnimatePresence>
                {showWarning && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-4 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
                        <div className="p-2 bg-red-500/20 rounded-lg z-10">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                        </div>
                        <div className="z-10 flex-1">
                            <h3 className="font-bold text-red-500">EGO ACTIVATION REQUIRED</h3>
                            <p className="text-sm text-red-400/80 mt-1">
                                You haven&apos;t logged your physique today. Your past self is laughing at you.
                                Upload now to maintain the standard.
                            </p>
                        </div>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="z-10"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Upload Proof
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Flame className={`h-8 w-8 ${beastMode ? "text-red-500 animate-bounce" : "text-orange-500"}`} />
                        Ego Chamber
                    </h2>
                    <p className="text-muted-foreground">Visual proof of your evolution. No excuses.</p>
                </div>
                <div className="flex items-center gap-4">
                    <motion.div
                        className="text-right"
                        animate={streak > 0 ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-2xl font-bold text-white flex items-center justify-end gap-2">
                            <Flame className={`h-5 w-5 ${streak >= 7 ? "text-orange-500" : "text-muted-foreground"}`} />
                            {streak} <span className="text-sm font-normal text-muted-foreground">DAYS</span>
                        </div>
                        <div className="text-xs text-orange-500 font-bold uppercase tracking-wider">Current Streak</div>
                    </motion.div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Upload Section */}
                <Card className="glass border-white/5 md:col-span-2">
                    <CardHeader>
                        <CardTitle>Daily Log</CardTitle>
                        <CardDescription>Capture your physique in consistent lighting.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            capture="environment"
                            onChange={handlePhotoUpload}
                        />
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-white/10 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-all group"
                        >
                            <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Camera className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <p className="text-lg font-medium text-white group-hover:text-primary transition-colors">Take Daily Photo</p>
                            <p className="text-sm text-muted-foreground mt-2">or drag and drop here</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Progress Gallery */}
                <Card className="glass border-white/5 h-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Evolution Gallery</CardTitle>
                            <CardDescription>Your visual timeline ({logs.length} photos).</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon">
                            <History className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </CardHeader>
                    <CardContent className="h-[400px] overflow-y-auto custom-scrollbar p-2">
                        <div className="grid grid-cols-2 gap-2">
                            {logs.length > 0 ? (
                                logs.map((log, i) => (
                                    <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="aspect-[3/4] rounded-lg bg-black/50 overflow-hidden relative group"
                                    >
                                        <img src={log.photo} alt="Progress" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                className="rounded-full h-8 w-8"
                                                onClick={() => handleDelete(log.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 rounded text-[10px] font-mono text-white">
                                            DAY {logs.length - i}
                                        </div>
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 rounded text-[10px] font-mono text-muted-foreground">
                                            {new Date(log.date).toLocaleDateString()}
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-2 h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                    <Camera className="h-12 w-12 mb-2" />
                                    <p>No logs yet</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Comparison / Motivation */}
                <Card className="glass border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent pointer-events-none" />
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" /> Reality Check
                        </CardTitle>
                        <CardDescription>AI-generated motivation based on your activity.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                            <p className="text-sm font-medium text-orange-200 italic">
                                &quot;{quote}&quot;
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                <span>Discipline Level</span>
                                <span className={disciplineColor}>{disciplineLabel}</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${disciplineLevel}%` }}
                                    transition={{ duration: 1 }}
                                    className={`h-full rounded-full ${barColor}`}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground text-right pt-1">
                                {disciplineLevel >= 70 ? "Champion Zone 🏆" : disciplineLevel >= 40 ? "Building Momentum..." : "Danger Zone"}
                            </p>
                        </div>

                        <Button
                            onClick={activateBeastMode}
                            className="w-full bg-white text-black hover:bg-white/90 font-bold"
                        >
                            ACTIVATE BEAST MODE <Flame className="h-4 w-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
