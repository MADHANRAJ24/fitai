"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, RotateCcw, Check, Sparkles, Dumbbell, Zap, CheckCircle2, User, AlertTriangle } from "lucide-react"

import { ActivityService } from "@/services/activity-service"
import { bodyProfileService, BodyProfile } from "@/services/body-profile-service"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useSensory } from "@/hooks/use-sensory"
import Link from "next/link"

export default function SchedulePage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [bodyProfile, setBodyProfile] = useState<BodyProfile | null>(null)
    const [preferences, setPreferences] = useState<{
        days: string[]
        duration: string
        focus: string
        context: string
    }>({
        days: [],
        duration: "",
        focus: "",
        context: "gym",
    })
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedSchedule, setGeneratedSchedule] = useState<any>(null)

    const { triggerFeedback } = useSensory()

    useEffect(() => {
        const profile = bodyProfileService.getProfile()
        setBodyProfile(profile)

        // Load existing plan
        const savedPlan = localStorage.getItem("user_workout_plan")
        if (savedPlan) {
            try {
                const parsed = JSON.parse(savedPlan)
                setGeneratedSchedule(parsed)
                setStep(4) // Jump to results
            } catch (e) {
                console.error("Failed to parse saved plan", e)
            }
        }

        // Check for Bonus Access
        import("@/services/trial-service").then(async m => {
            const trial = await m.trialService.getTrialData()
            if (trial) {
                const fallback = m.trialService.getFallbackFeatures(trial)
                if (!trial.isActive && fallback?.smartSchedule) {
                    toast.success("Bonus Feature Active! 🎁", {
                        description: "We've kept your Smart Schedule active even after your trial ended.",
                        duration: 5000
                    })
                }
            }
        })
    }, [])

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    const toggleDay = (day: string) => {
        triggerFeedback("click")
        setPreferences(prev => ({
            ...prev,
            days: prev.days.includes(day)
                ? prev.days.filter(d => d !== day)
                : [...prev.days, day]
        }))
    }

    const generate = () => {
        setIsGenerating(true)
        triggerFeedback("click")
        setTimeout(() => {
            setIsGenerating(false)
            triggerFeedback("success")

            const isGym = preferences.context === "gym"
            const duration = preferences.duration || "45 min"

            // Get excluded exercises from body conditions
            const excludedExercises = bodyProfile
                ? bodyProfileService.getExcludedExercises(bodyProfile)
                : []

            // Get sets/reps based on fitness level
            const { sets, reps } = bodyProfile
                ? bodyProfileService.getSetsReps(bodyProfile)
                : { sets: 3, reps: '10-12' }

            // Filter function
            const filterExercises = (exercises: string[]) =>
                exercises.filter(ex => !excludedExercises.some(excluded =>
                    ex.toLowerCase().includes(excluded.toLowerCase())
                ))

            // Base workouts - will be filtered
            const baseSchedule = [
                {
                    day: "Mon",
                    type: isGym ? "Upper Body Power" : "Push Work (Bodyweight)",
                    duration,
                    icon: Dumbbell,
                    visual: true,
                    exercises: filterExercises(isGym
                        ? ["Bench Press", "Rows", "Overhead Press", "Lat Pulldown"]
                        : ["Pushups", "Pike Pushups", "Dips", "Plank"]),
                    sets,
                    reps,
                    correction: bodyProfile?.conditions?.includes('back_pain')
                        ? "⚠️ Avoid rounding back - focus on neutral spine"
                        : "Focus on posture (Anti-slouch)"
                },
                {
                    day: "Wed",
                    type: "HIIT & Core Conditioning",
                    duration,
                    icon: Zap,
                    visual: true,
                    exercises: filterExercises(["Burpees", "Mtn Climbers", "Plank Variations", "Jump Squats"]),
                    sets,
                    reps,
                    correction: "Keep core tight (Pelvic Tilt fix)"
                },
                {
                    day: "Fri",
                    type: isGym ? "Lower Body Strength" : "Legs & Glutes",
                    duration,
                    icon: Dumbbell,
                    visual: true,
                    exercises: filterExercises(isGym
                        ? ["Squats", "Deadlifts", "Lunges", "Leg Press"]
                        : ["Squat Jumps", "Lunges", "Glute Bridges", "Step Ups"]),
                    sets,
                    reps,
                    correction: bodyProfile?.conditions?.includes('knee_issues')
                        ? "⚠️ Use shallow range - protect knees"
                        : "Knees out (Valgus correction)"
                },
                {
                    day: "Sun",
                    type: "Active Recovery & Mobility",
                    duration: "30 min",
                    icon: Sparkles,
                    visual: false,
                    exercises: ["Yoga Flow", "Foam Rolling", "Stretching"],
                    sets: 1,
                    reps: "Hold 30s"
                },
            ]

            // If beginner, reduce intensity
            if (bodyProfile?.fitnessLevel === 'beginner') {
                baseSchedule.forEach(workout => {
                    workout.duration = "30 min"
                })
            }

            setGeneratedSchedule(baseSchedule)
            setStep(4)

            if (bodyProfile) {
                toast.success(`Personalized for ${bodyProfile.fitnessLevel} level!`, {
                    description: excludedExercises.length > 0
                        ? `${excludedExercises.length} exercises excluded based on your conditions`
                        : undefined
                })
            }
        }, 3000)
    }

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0
        })
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 h-[calc(100vh-8rem)] relative">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h2 className="text-4xl font-black tracking-tighter text-white flex items-center gap-3 uppercase font-heading">
                        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                            <Calendar className="h-8 w-8 text-primary" />
                        </div>
                        Smart Scheduler
                    </h2>
                    <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.2em] mt-1 opacity-70">Protocol: Neural Path Optimization</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="glass border-white/5 relative overflow-hidden min-h-[500px] flex flex-col">
                        <AnimatePresence>
                            {isGenerating && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8 text-center"
                                >
                                    <div className="relative">
                                        <motion.div
                                            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                            className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                                        />
                                        <Sparkles className="relative h-16 w-16 text-primary animate-pulse" />
                                    </div>
                                    <motion.h3
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="text-2xl font-bold text-white mt-6 mb-2"
                                    >
                                        Analyzing Your Availability...
                                    </motion.h3>
                                    <p className="text-muted-foreground max-w-xs">
                                        Our AI is balancing intensity with recovery based on your {preferences.days.length}-day schedule.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <CardHeader className="bg-white/[0.02] border-b border-white/5 pb-8">
                            <CardTitle className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <span className="text-2xl font-black text-white uppercase font-heading tracking-tighter">
                                        {step === 1 && "Target Availability"}
                                        {step === 2 && "Operational Mode"}
                                        {step === 3 && "Optimization Focus"}
                                        {step === 4 && "AI Generated Plan"}
                                    </span>
                                    <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest font-black">Segment {step} of 4</p>
                                </div>
                            </CardTitle>
                            <div className="h-1.5 w-full bg-white/5 rounded-full mt-6 overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-primary to-emerald-400 shadow-[0_0_10px_#10b981]"
                                    initial={{ width: "25%" }}
                                    animate={{ width: `${step * 25}%` }}
                                    transition={{ duration: 0.8, ease: "circOut" }}
                                />
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1 pt-8">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="grid grid-cols-4 sm:grid-cols-4 gap-4"
                                    >
                                        {days.map(day => (
                                            <motion.button
                                                key={day}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => toggleDay(day)}
                                                className={`aspect-square sm:aspect-auto sm:h-24 flex flex-col items-center justify-center text-lg font-black rounded-2xl border-2 transition-all ${preferences.days.includes(day)
                                                    ? "bg-primary text-black border-primary shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                                                    : "bg-white/[0.03] hover:bg-white/10 text-muted-foreground border-white/10"
                                                    }`}
                                            >
                                                <span className="font-heading tracking-widest uppercase">{day}</span>
                                                {preferences.days.includes(day) && <div className="h-1.5 w-6 bg-black/40 rounded-full mt-2" />}
                                            </motion.button>
                                        ))}
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="space-y-4">
                                            <Label className="text-sm font-black uppercase tracking-widest text-primary/70 font-mono">Engagement Environment</Label>
                                            <div className="grid grid-cols-2 gap-6">
                                                {["gym", "home"].map(c => (
                                                    <motion.button
                                                        key={c}
                                                        whileHover={{ scale: 1.02, y: -4 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => { setPreferences(p => ({ ...p, context: c })); triggerFeedback("click"); }}
                                                        className={`p-10 rounded-3xl border-2 text-center transition-all flex flex-col items-center ${preferences.context === c
                                                            ? "bg-primary/20 text-white border-primary shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                                                            : "bg-white/[0.03] hover:bg-white/10 text-muted-foreground border-white/10"
                                                            }`}
                                                    >
                                                        <div className={`p-4 rounded-2xl mb-4 ${preferences.context === c ? "bg-primary text-black" : "bg-white/10"}`}>
                                                            {c === "gym" ? <Dumbbell className="h-8 w-8" /> : <Zap className="h-8 w-8" />}
                                                        </div>
                                                        <span className="font-heading font-black text-2xl uppercase tracking-tighter">{c} Terminal</span>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <Label className="text-sm font-black uppercase tracking-widest text-primary/70 font-mono">Mission Duration</Label>
                                            <div className="grid grid-cols-3 gap-4">
                                                {["30 min", "45 min", "60 min"].map(d => (
                                                    <motion.button
                                                        key={d}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => { setPreferences(p => ({ ...p, duration: d })); triggerFeedback("click"); }}
                                                        className={`p-5 rounded-2xl border-2 text-center transition-all ${preferences.duration === d
                                                            ? "bg-primary text-black border-primary font-black"
                                                            : "bg-white/[0.03] hover:bg-white/10 text-muted-foreground border-white/10"
                                                            }`}
                                                    >
                                                        <span className="font-mono text-sm font-bold uppercase tracking-widest">{d}</span>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -30 }}
                                        className="space-y-6"
                                    >
                                        {[
                                            { id: "strength", label: "Power & Stature", desc: "Build mass and absolute power via progressive overload protocols." },
                                            { id: "cardio", label: "Endurance Logic", desc: "Maximize metabolic rate and aerobic system efficiency." },
                                            { id: "hybrid", label: "Hybrid Integrated", desc: "Cohesive balance of raw power and tactical conditioning." }
                                        ].map(f => (
                                            <motion.button
                                                key={f.id}
                                                whileHover={{ scale: 1.01, x: 10 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => { setPreferences(p => ({ ...p, focus: f.id })); triggerFeedback("click"); }}
                                                className={`w-full p-8 rounded-3xl border-2 text-left transition-all flex items-center justify-between group relative overflow-hidden ${preferences.focus === f.id
                                                    ? "bg-primary/20 text-white border-primary shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                                                    : "bg-white/[0.03] hover:bg-white/10 text-muted-foreground border-white/10"
                                                    }`}
                                            >
                                                {preferences.focus === f.id && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
                                                )}
                                                <div className="relative z-10">
                                                    <div className={`font-black text-2xl font-heading tracking-tighter uppercase ${preferences.focus === f.id ? "text-primary" : "text-white group-hover:text-primary transition-colors"}`}>
                                                        {f.label}
                                                    </div>
                                                    <div className="text-sm font-medium opacity-60 mt-1 max-w-md">{f.desc}</div>
                                                </div>
                                                {preferences.focus === f.id && (
                                                    <motion.div
                                                        initial={{ scale: 0, rotate: -90 }}
                                                        animate={{ scale: 1, rotate: 0 }}
                                                        className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-black shadow-2xl"
                                                    >
                                                        <Check className="h-6 w-6 stroke-[3px]" />
                                                    </motion.div>
                                                )}
                                            </motion.button>
                                        ))}
                                    </motion.div>
                                )}

                                {step === 4 && (
                                    <motion.div
                                        key="step4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center gap-4 mb-6 p-5 bg-primary/10 border-2 border-primary/20 rounded-3xl relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent animate-pulse-slow" />
                                            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                                            <p className="text-sm text-white font-bold leading-relaxed relative z-10">
                                                Optimization complete. Your <span className="text-primary uppercase tracking-widest">{preferences.context}</span> protocols have been prioritized based on neural biomechanics.
                                            </p>
                                        </div>

                                        <div className="grid gap-4">
                                            {generatedSchedule?.map((s: any, i: number) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: -30 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1, type: "spring", damping: 12 }}
                                                    className="flex items-center p-6 rounded-[2rem] bg-white/[0.03] border-2 border-white/5 hover:border-primary/40 transition-all group shadow-xl"
                                                >
                                                    <div className="h-20 w-20 rounded-2xl bg-black/60 flex items-center justify-center text-primary font-bold border-2 border-white/5 overflow-hidden relative shadow-2xl">
                                                        {s.visual ? (
                                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent flex items-center justify-center">
                                                                <s.icon className="h-10 w-10 relative z-10" />
                                                            </div>
                                                        ) : (
                                                            <s.icon className="h-10 w-10" />
                                                        )}
                                                        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 pointer-events-none" />
                                                    </div>

                                                    <div className="ml-6 flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <div className="font-black text-white text-2xl font-heading uppercase tracking-tighter">{s.day}</div>
                                                            <div className="text-[10px] font-mono px-3 py-1.5 rounded-xl bg-primary text-black font-black uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.3)]">{s.duration}</div>
                                                        </div>
                                                        <div className="text-white/60 font-bold text-sm tracking-tight mb-3">{s.type}</div>

                                                        <div className="flex flex-wrap gap-2">
                                                            {s.exercises?.map((ex: string, j: number) => (
                                                                <span key={j} className="text-[9px] px-3 py-1 bg-white/[0.05] rounded-lg border border-white/5 whitespace-nowrap text-white/40 uppercase font-black tracking-widest">
                                                                    {ex}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>

                        <CardFooter className="flex justify-between border-t border-white/5 p-8 bg-black/40 backdrop-blur-xl">
                            {step > 1 && step < 4 && (
                                <Button variant="ghost" onClick={() => { setStep(s => s - 1); triggerFeedback("click"); }} className="h-14 px-8 text-white/50 font-black uppercase tracking-widest hover:text-white rounded-2xl">Back</Button>
                            )}

                            {step === 4 && (
                                <Button variant="outline" onClick={() => { setStep(1); triggerFeedback("click"); }} className="h-14 px-8 border-white/10 text-white/50 rounded-2xl font-black uppercase tracking-widest hover:bg-white/5">
                                    <RotateCcw className="mr-3 h-5 w-5" /> Start Over
                                </Button>
                            )}

                            <div className="ml-auto">
                                {step < 3 && (
                                    <Button variant="neon"
                                        className="h-14 px-10 text-lg font-black rounded-2xl shadow-2xl"
                                        disabled={
                                            (step === 1 && preferences.days.length === 0) ||
                                            (step === 2 && !preferences.duration)
                                        } onClick={() => { setStep(s => s + 1); triggerFeedback("click"); }}>
                                        Execute Next Step
                                    </Button>
                                )}
                                {step === 3 && (
                                    <Button variant="neon" className="h-14 px-10 text-lg font-black rounded-2xl shadow-2xl w-[200px]" disabled={!preferences.focus} onClick={generate}>
                                        <Sparkles className="mr-3 h-5 w-5" /> Finalize Plan
                                    </Button>
                                )}
                                {step === 4 && (
                                    <Button variant="neon" className="h-14 px-10 text-lg font-black rounded-2xl shadow-2xl" onClick={() => {
                                        triggerFeedback("success")
                                        localStorage.setItem("user_workout_plan", JSON.stringify(generatedSchedule))
                                        ActivityService.saveActivity({
                                            type: "Workout",
                                            title: "Neural Plan Activated",
                                            details: `${preferences.days.length} Day Deployment • ${preferences.duration}`,
                                            calories: 0
                                        })
                                        window.dispatchEvent(new CustomEvent("show_success", { detail: { message: "Tactical Plan Activated" } }))
                                        toast.success("Workout Plan Saved Successfully!")
                                    }}>
                                        <CheckCircle2 className="mr-3 h-6 w-6" /> Activate Protocol
                                    </Button>
                                )}
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="glass border-white/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Dumbbell className="h-5 w-5 text-purple-500" />
                                    AI Strategy
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                    <div className="text-sm text-purple-400 mb-1 uppercase tracking-wider font-bold">Method</div>
                                    <div className="font-bold text-white text-lg">Push / Pull / Split</div>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Based on your inputs, the AI will prioritize <strong>Compound Movements</strong> to maximize efficiency within your timeframe.
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
