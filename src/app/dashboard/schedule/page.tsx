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

    useEffect(() => {
        const profile = bodyProfileService.getProfile()
        setBodyProfile(profile)

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
        setPreferences(prev => ({
            ...prev,
            days: prev.days.includes(day)
                ? prev.days.filter(d => d !== day)
                : [...prev.days, day]
        }))
    }

    const generate = () => {
        setIsGenerating(true)
        setTimeout(() => {
            setIsGenerating(false)

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
        <div className="max-w-5xl mx-auto space-y-8 h-[calc(100vh-8rem)]">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Calendar className="h-8 w-8 text-primary" />
                        Smart Scheduler
                    </h2>
                    <p className="text-muted-foreground">AI-driven workout planning based on your availability.</p>
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

                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>
                                    {step === 1 && "Select Available Days"}
                                    {step === 2 && "Duration & Intensity"}
                                    {step === 3 && "Primary Focus Area"}
                                    {step === 4 && "Your Optimized Plan"}
                                </span>
                                <span className="text-xs font-normal px-2 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                                    Step {step} / 4
                                </span>
                            </CardTitle>
                            <div className="h-1 w-full bg-secondary rounded-full mt-4 overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: "25%" }}
                                    animate={{ width: `${step * 25}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="grid grid-cols-4 sm:grid-cols-4 gap-4"
                                    >
                                        {days.map(day => (
                                            <motion.button
                                                key={day}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => toggleDay(day)}
                                                className={`aspect-square sm:aspect-auto sm:h-20 flex items-center justify-center text-lg font-bold rounded-2xl border transition-all ${preferences.days.includes(day)
                                                    ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                                    : "bg-white/5 hover:bg-white/10 text-muted-foreground border-white/10"
                                                    }`}
                                            >
                                                {day}
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
                                        className="space-y-6"
                                    >
                                        <div className="space-y-4">
                                            <Label className="text-lg">Where will you workout?</Label>
                                            <div className="grid grid-cols-2 gap-4">
                                                {["gym", "home"].map(c => (
                                                    <motion.button
                                                        key={c}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => setPreferences(p => ({ ...p, context: c }))}
                                                        className={`p-8 rounded-2xl border text-center transition-all ${preferences.context === c
                                                            ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                                            : "bg-white/5 hover:bg-white/10 text-muted-foreground border-white/10"
                                                            }`}
                                                    >
                                                        {c === "gym" ? <Dumbbell className="h-8 w-8 mx-auto mb-2" /> : <Zap className="h-8 w-8 mx-auto mb-2" />}
                                                        <span className="font-bold text-xl capitalize">{c} Workout</span>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <Label className="text-lg">Duration?</Label>
                                            <div className="grid grid-cols-3 gap-4">
                                                {["30 min", "45 min", "60 min"].map(d => (
                                                    <motion.button
                                                        key={d}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => setPreferences(p => ({ ...p, duration: d }))}
                                                        className={`p-4 rounded-xl border text-center transition-all ${preferences.duration === d
                                                            ? "bg-primary text-primary-foreground border-primary"
                                                            : "bg-white/5 hover:bg-white/10 text-muted-foreground border-white/10"
                                                            }`}
                                                    >
                                                        <span className="font-bold">{d}</span>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-4"
                                    >
                                        {[
                                            { id: "strength", label: "Strength & Muscle", desc: "Build mass and power with progressive overload." },
                                            { id: "cardio", label: "Cardio & Endurance", desc: "Maximize calorie burn and heart health." },
                                            { id: "hybrid", label: "Hybrid Athlete", desc: "The perfect balance of strength and conditioning." }
                                        ].map(f => (
                                            <motion.button
                                                key={f.id}
                                                whileHover={{ scale: 1.01, x: 5 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => setPreferences(p => ({ ...p, focus: f.id }))}
                                                className={`w-full p-6 rounded-2xl border text-left transition-all flex items-center justify-between group ${preferences.focus === f.id
                                                    ? "bg-primary/20 text-white border-primary shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                                    : "bg-white/5 hover:bg-white/10 text-muted-foreground border-white/10"
                                                    }`}
                                            >
                                                <div>
                                                    <div className={`font-bold text-lg ${preferences.focus === f.id ? "text-primary" : "text-white group-hover:text-primary"}`}>
                                                        {f.label}
                                                    </div>
                                                    <div className="text-sm opacity-70 mt-1">{f.desc}</div>
                                                </div>
                                                {preferences.focus === f.id && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-black"
                                                    >
                                                        <Check className="h-5 w-5" />
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
                                        className="space-y-4"
                                    >
                                        <div className="flex items-center gap-2 mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                            <Sparkles className="h-4 w-4 text-blue-400" />
                                            <p className="text-xs text-blue-200">
                                                Plan optimized for <strong>{preferences.context}</strong> environment.
                                                Visual guide included below.
                                            </p>
                                        </div>

                                        {generatedSchedule?.map((s: any, i: number) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group"
                                            >
                                                {/* Visual Placeholder */}
                                                <div className="h-16 w-16 rounded-xl bg-black/40 flex items-center justify-center text-primary font-bold border border-white/5 overflow-hidden relative">
                                                    {s.visual ? (
                                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center">
                                                            <s.icon className="h-6 w-6 relative z-10" />
                                                        </div>
                                                    ) : (
                                                        <s.icon className="h-6 w-6" />
                                                    )}
                                                </div>

                                                <div className="ml-4 flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <div className="font-bold text-white text-lg">{s.day}</div>
                                                        <div className="text-xs font-mono px-2 py-1 rounded bg-white/10 text-primary-foreground">{s.duration}</div>
                                                    </div>
                                                    <div className="text-muted-foreground mb-1">{s.type}</div>

                                                    {/* Visualize: List Exercises */}
                                                    <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                                                        {s.exercises?.map((ex: string, j: number) => (
                                                            <span key={j} className="text-[10px] px-2 py-0.5 bg-white/5 rounded border border-white/5 whitespace-nowrap">
                                                                {ex}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>

                        <CardFooter className="flex justify-between border-t border-white/5 pt-6">
                            {step > 1 && step < 4 && (
                                <Button variant="ghost" onClick={() => setStep(s => s - 1)}>Back</Button>
                            )}

                            {step === 4 && (
                                <Button variant="outline" onClick={() => setStep(1)}>
                                    <RotateCcw className="mr-2 h-4 w-4" /> Start Over
                                </Button>
                            )}

                            <div className="ml-auto">
                                {step < 3 && (
                                    <Button variant="neon" disabled={
                                        (step === 1 && preferences.days.length === 0) ||
                                        (step === 2 && !preferences.duration)
                                    } onClick={() => setStep(s => s + 1)}>
                                        Next Step
                                    </Button>
                                )}
                                {step === 3 && (
                                    <Button variant="neon" className="w-[150px]" disabled={!preferences.focus} onClick={generate}>
                                        <Sparkles className="mr-2 h-4 w-4" /> Generate
                                    </Button>
                                )}
                                {step === 4 && (
                                    <Button variant="neon" onClick={() => {
                                        // Save to LocalStorage
                                        localStorage.setItem("user_workout_plan", JSON.stringify(generatedSchedule))

                                        // Log Activity
                                        ActivityService.saveActivity({
                                            type: "Workout",
                                            title: "New Workout Plan Created",
                                            details: `${preferences.days.length} Days • ${preferences.duration}`,
                                            calories: 0
                                        })

                                        toast.success("Workout Plan Saved Successfully!")
                                    }}>
                                        <CheckCircle2 className="mr-2 h-4 w-4" /> Save Plan
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
