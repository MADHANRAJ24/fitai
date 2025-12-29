"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dumbbell, Calendar, Clock, Trophy, Plus, Loader2 } from "lucide-react"

import { useState, useEffect } from "react"
import { Workout, WorkoutService } from "@/services/workout-service"
import { motion } from "framer-motion"

import { ActivityService } from "@/services/activity-service"

export default function WorkoutsPage() {
    const [workouts, setWorkouts] = useState<Workout[]>([])
    const [isLogging, setIsLogging] = useState(false)

    useEffect(() => {
        const loadWorkouts = async () => {
            const staticWorkouts = await WorkoutService.getRecentWorkouts()
            const localWorkouts = ActivityService.getRecentWorkouts()
            setWorkouts([...localWorkouts, ...staticWorkouts])
        }
        loadWorkouts()
    }, [])

    const handleLogWorkout = () => {
        setIsLogging(true)
        setTimeout(() => {
            setIsLogging(false)
            alert("✅ Workout Logged Successfully!")
            // Optionally add a new workout to the top of the list here
        }, 1500)
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h2 className="text-3xl font-bold tracking-tight text-white">Workouts</h2>
                    <p className="text-muted-foreground">Track your sessions and break records.</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="neon" onClick={handleLogWorkout} disabled={isLogging}>
                        {isLogging ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Plus className="mr-2 h-4 w-4" />
                        )}
                        {isLogging ? "Logging..." : "Log Workout"}
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
                    <Card className="glass border-white/5 h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-yellow-500" />
                                Weekly Goal
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-white mb-2">3/5</div>
                            <p className="text-sm text-muted-foreground mb-4">Workouts completed</p>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-yellow-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: "60%" }}
                                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Workout History */}
                <div className="col-span-full lg:col-span-2 space-y-4">
                    <motion.h3
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xl font-semibold text-white"
                    >
                        Recent Activity
                    </motion.h3>
                    <ScrollArea className="h-[400px]">
                        <motion.div
                            className="space-y-4 pr-4 pb-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {workouts.map((workout) => (
                                <motion.div key={workout.id} variants={itemVariants}>
                                    <Card className="glass border-white/5 hover:border-white/10 transition-colors cursor-pointer group hover:bg-white/5">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                        <Dumbbell className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-white">{workout.title}</h4>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Calendar className="h-3 w-3" /> {workout.date}
                                                            <span className="w-1 h-1 rounded-full bg-white/20" />
                                                            <Clock className="h-3 w-3" /> {workout.duration}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-white max-sm:text-sm">{workout.calories}</div>
                                                    <div className="text-xs text-primary">{workout.intensity}</div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {workout.exercises.map((ex, i) => (
                                                    <span key={i} className="px-2 py-1 rounded-md bg-white/5 text-xs text-muted-foreground border border-white/5">
                                                        {ex}
                                                    </span>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}
