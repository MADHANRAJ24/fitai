"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dumbbell, Calendar, Clock, Trophy, Plus, Loader2, Activity } from "lucide-react"

import { useState, useEffect } from "react"
import { Workout, WorkoutService } from "@/services/workout-service"
import { motion } from "framer-motion"

import { ActivityService } from "@/services/activity-service"
import { RoutineCard } from "@/components/features/routine-card"
import { toast } from "sonner"
import { useSensory } from "@/hooks/use-sensory"

export default function WorkoutsPage() {
    const [workouts, setWorkouts] = useState<Workout[]>([])
    const [weeklyProgress, setWeeklyProgress] = useState(0)
    const [isLogging, setIsLogging] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        // 1. Load History
        const staticWorkouts = await WorkoutService.getRecentWorkouts()
        const localWorkouts = ActivityService.getRecentWorkouts()
        const allWorkouts = [...localWorkouts, ...staticWorkouts]
        setWorkouts(allWorkouts)

        // 2. Unify & Calculate Weekly Progress (This Week)
        // Get all activities (not just recent)
        const allActivities = ActivityService.getActivities()

        // Filter for "Workout" type and "This Week"
        const now = new Date()
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
        startOfWeek.setHours(0, 0, 0, 0)

        const thisWeekCount = allActivities.filter(a => {
            if (a.type !== 'Workout') return false
            const date = new Date(a.date) // 'formatted string' might be risky, ideally rely on timestamps
            // Fallback: check matching string if simple
            // Real Logic:
            const activityTime = a.timestamp // Use the timestamp!
            return activityTime >= startOfWeek.getTime()
        }).length

        // Since getRecentWorkouts returns formatted strings, we might need a better way. 
        // But ActivityService stores { timestamp: number } which is perfect.
        setWeeklyProgress(thisWeekCount)
    }

    const { triggerFeedback } = useSensory()

    const handleLogWorkout = () => {
        setIsLogging(true)
        // Simulate a "Quick Log"
        setTimeout(() => {
            ActivityService.saveActivity({
                type: 'Workout',
                title: 'Quick Workout',
                details: 'Freestyle Session',
                calories: 300
            })

            setIsLogging(false)
            triggerFeedback("success")
            window.dispatchEvent(new CustomEvent("show_success", { detail: { message: "Protocol Logged" } }))
            loadData() // Refresh
        }, 1000)
    }

    // Passed to RoutineCard
    const handleCompleteRoutine = (routineTitle: string, calories: number) => {
        ActivityService.saveActivity({
            type: 'Workout',
            title: routineTitle,
            details: 'Routine Completed',
            calories: calories
        })
        triggerFeedback("success")
        window.dispatchEvent(new CustomEvent("show_success", { detail: { message: "Mission: Complete" } }))
        loadData()
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="space-y-6 h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h2 className="text-3xl font-bold tracking-tight text-white font-heading uppercase">Workouts</h2>
                    <p className="text-muted-foreground font-light tracking-wide">Track your sessions and break records.</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        onClick={handleLogWorkout}
                        disabled={isLogging}
                        className="bg-primary hover:bg-emerald-400 text-black font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400/50"
                    >
                        {isLogging ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Plus className="mr-2 h-4 w-4" />
                        )}
                        {isLogging ? "Logging..." : "Quick Log"}
                    </Button>
                </motion.div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Weekly Stats */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="col-span-full lg:col-span-1"
                >
                    <div className="glass-card p-6 h-full relative overflow-hidden group rounded-3xl border border-white/10">
                        {/* Ambient Glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-yellow-500/20 transition-all duration-700" />

                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                <Trophy className="h-5 w-5 text-yellow-500 animate-pulse" />
                            </div>
                            <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 font-heading uppercase tracking-wide">
                                Weekly Goal
                            </span>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-baseline gap-1 mb-2">
                                <div className="text-6xl font-bold text-white tracking-tighter font-heading text-glow-accent">{weeklyProgress}</div>
                                <div className="text-xl text-muted-foreground font-light font-heading">/ 5</div>
                            </div>
                            <p className="text-sm text-yellow-500/80 mb-6 font-medium flex items-center gap-2">
                                <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 animate-ping" />
                                Workouts crushed this week
                            </p>

                            <div className="relative h-3 w-full bg-black/50 rounded-full overflow-hidden border border-white/10 shadow-inner">
                                <motion.div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-500 to-orange-600 shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((weeklyProgress / 5) * 100, 100)}%` }}
                                    transition={{ duration: 1.5, delay: 0.2, type: "spring", bounce: 0 }}
                                >
                                    {/* Shimmer Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-shimmer" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="col-span-full lg:col-span-2 space-y-4">
                    <motion.h3
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xl font-bold text-white font-heading uppercase tracking-wider flex items-center gap-2"
                    >
                        <Activity className="h-5 w-5 text-primary" /> Active Protocols
                    </motion.h3>

                    {/* Visual Routine Manager */}
                    <div className="space-y-4">
                        <RoutineCard
                            id="routine-1"
                            title="Chest-Triceps Power"
                            muscles={["Chest", "Triceps", "Shoulders"]}
                            exercises={[
                                { name: "Bench Press" },
                                { name: "Tri Pushdown" },
                                { name: "Incline Flyes" },
                                { name: "Overhead Press" },
                            ]}
                            onComplete={() => handleCompleteRoutine("Chest-Triceps Power", 450)}
                        />
                        <RoutineCard
                            id="routine-2"
                            title="Back-Biceps Hypertrophy"
                            muscles={["Back", "Biceps", "Lats"]}
                            exercises={[
                                { name: "Pullups (Weighted)" },
                                { name: "Barbell Rows" },
                                { name: "Hammer Curls" },
                                { name: "Face Pulls" },
                            ]}
                            onComplete={() => handleCompleteRoutine("Back-Biceps Hypertrophy", 500)}
                        />
                        <RoutineCard
                            id="routine-3"
                            title="Legs & Core"
                            muscles={["Quads", "Hamstrings", "Abs"]}
                            exercises={[
                                { name: "Squats" },
                                { name: "RDLs" },
                                { name: "Leg Press" },
                                { name: "Plank (3 mins)" },
                            ]}
                            onComplete={() => handleCompleteRoutine("Legs & Core", 600)}
                        />
                    </div>

                    <motion.h3
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xl font-bold text-white pt-6 flex items-center gap-2 font-heading uppercase tracking-wider"
                    >
                        <Trophy className="h-5 w-5 text-indigo-400" /> Mission Log
                    </motion.h3>
                    <ScrollArea className="h-[300px]">
                        <motion.div
                            className="space-y-3 pr-4 pb-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {workouts.map((workout) => (
                                <motion.div key={workout.id} variants={itemVariants}>
                                    <div className="group relative p-4 rounded-xl glass-panel border border-white/5 hover:border-primary/30 transition-all cursor-pointer overflow-hidden component-hover">
                                        {/* Status Indicator */}
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                                                    <Dumbbell className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-base font-heading tracking-wide group-hover:text-primary transition-colors">{workout.title}</h4>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 font-mono">
                                                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {workout.date}</span>
                                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {workout.duration || "45m"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-emerald-400 text-glow">+{workout.calories}</div>
                                                <div className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">XP Earned</div>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-2 pl-16">
                                            {workout.exercises && workout.exercises.slice(0, 3).map((ex, i) => (
                                                <span key={i} className="px-2 py-0.5 rounded-sm bg-black/40 text-[10px] text-zinc-400 border border-white/5 font-mono">
                                                    {ex}
                                                </span>
                                            ))}
                                            {(workout.exercises?.length || 0) > 3 && (
                                                <span className="px-2 py-0.5 rounded-sm bg-black/40 text-[10px] text-zinc-400 border border-white/5 font-mono">
                                                    +{(workout.exercises?.length || 0) - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}
