"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from "recharts"
import { Sword, Shield, Zap, Brain, Target, User, Crown, Trophy, Star, Medal } from "lucide-react"
import { motion } from "framer-motion"
import { WorkoutService } from "@/services/workout-service"

// XP Constants
const XP_PER_WORKOUT = 100
const XP_PER_LEVEL = 1000

// Muscle to Workout Type Mapping
const WORKOUT_MUSCLE_MAP: Record<string, string[]> = {
    "Chest": ["Pectorals", "Deltoids"],
    "Back": ["Lats", "Traps"],
    "Legs": ["Quadriceps", "Hamstrings", "Glutes"],
    "Arms": ["Biceps", "Triceps"],
    "Core": ["Abs", "Obliques"],
    "Upper Body": ["Pectorals", "Deltoids", "Lats"],
    "Lower Body": ["Quadriceps", "Hamstrings", "Glutes"],
    "Full Body": ["Pectorals", "Lats", "Quadriceps", "Abs"],
}

// Achievement Definitions
const ACHIEVEMENTS = [
    { id: "first_blood", name: "First Blood", desc: "Complete 1 workout", icon: Star, threshold: 1, color: "text-yellow-500" },
    { id: "warrior", name: "Warrior", desc: "Complete 10 workouts", icon: Sword, threshold: 10, color: "text-orange-500" },
    { id: "veteran", name: "Veteran", desc: "Complete 25 workouts", icon: Shield, threshold: 25, color: "text-blue-500" },
    { id: "legend", name: "Legend", desc: "Complete 50 workouts", icon: Crown, threshold: 50, color: "text-purple-500" },
    { id: "mythic", name: "Mythic", desc: "Complete 100 workouts", icon: Trophy, threshold: 100, color: "text-red-500" },
]

interface MuscleStatus {
    name: string
    status: "Training" | "Sore" | "Recovered" | "Ready"
    color: string
    bg: string
    border: string
}

export default function RPGPage() {
    const [workoutCount, setWorkoutCount] = useState(0)
    const [level, setLevel] = useState(1)
    const [xp, setXp] = useState(0)
    const [xpProgress, setXpProgress] = useState(0)
    const [muscles, setMuscles] = useState<MuscleStatus[]>([])
    const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])

    useEffect(() => {
        loadRPGData()
    }, [])

    const loadRPGData = async () => {
        const workouts = await WorkoutService.getRecentWorkouts()

        // Calculate XP and Level
        const totalWorkouts = workouts.length
        const totalXP = totalWorkouts * XP_PER_WORKOUT
        const currentLevel = Math.floor(totalXP / XP_PER_LEVEL) + 1
        const xpInCurrentLevel = totalXP % XP_PER_LEVEL
        const progress = (xpInCurrentLevel / XP_PER_LEVEL) * 100

        setWorkoutCount(totalWorkouts)
        setXp(totalXP)
        setLevel(currentLevel)
        setXpProgress(progress)

        // Calculate Muscle Status based on recent workouts
        const now = Date.now()
        const muscleLastWorked: Record<string, number> = {}

        workouts.forEach(w => {
            const workoutTime = new Date(w.date).getTime()
            const workoutType = w.title || "Full Body"

            // Find matching muscles
            Object.entries(WORKOUT_MUSCLE_MAP).forEach(([type, muscles]) => {
                if (workoutType.toLowerCase().includes(type.toLowerCase())) {
                    muscles.forEach(muscle => {
                        if (!muscleLastWorked[muscle] || workoutTime > muscleLastWorked[muscle]) {
                            muscleLastWorked[muscle] = workoutTime
                        }
                    })
                }
            })
        })

        // Generate muscle status list
        const allMuscles = ["Pectorals", "Deltoids", "Quadriceps", "Lats", "Abs", "Biceps", "Glutes"]
        const muscleStatuses: MuscleStatus[] = allMuscles.map(muscle => {
            const lastWorked = muscleLastWorked[muscle]
            const hoursSinceWorked = lastWorked ? (now - lastWorked) / (1000 * 60 * 60) : 999

            let status: MuscleStatus["status"] = "Recovered"
            let color = "text-green-500"
            let bg = "bg-green-500/10"
            let border = "border-green-500/20"

            if (hoursSinceWorked < 24) {
                status = "Training"
                color = "text-yellow-500"
                bg = "bg-yellow-500/10"
                border = "border-yellow-500/20"
            } else if (hoursSinceWorked < 48) {
                status = "Sore"
                color = "text-red-500"
                bg = "bg-red-500/10"
                border = "border-red-500/20"
            } else if (hoursSinceWorked < 72) {
                status = "Ready"
                color = "text-green-500"
                bg = "bg-green-500/10"
                border = "border-green-500/20"
            }

            return { name: muscle, status, color, bg, border }
        })

        setMuscles(muscleStatuses)

        // Check Achievements
        const unlocked = ACHIEVEMENTS
            .filter(a => totalWorkouts >= a.threshold)
            .map(a => a.id)
        setUnlockedAchievements(unlocked)
    }

    // RPG Stats (increases with level)
    const rpgStats = [
        { subject: 'Strength', A: Math.min(150, 50 + level * 8), fullMark: 150 },
        { subject: 'Agility', A: Math.min(150, 40 + level * 5), fullMark: 150 },
        { subject: 'Endurance', A: Math.min(150, 30 + level * 6), fullMark: 150 },
        { subject: 'Wisdom', A: Math.min(150, 60 + level * 4), fullMark: 150 },
        { subject: 'Discipline', A: Math.min(150, 45 + level * 5), fullMark: 150 },
        { subject: 'Recovery', A: Math.min(150, 35 + level * 3), fullMark: 150 },
    ]

    // Determine Class based on level
    const getClass = () => {
        if (level >= 50) return "Immortal"
        if (level >= 25) return "Champion"
        if (level >= 10) return "Warrior"
        if (level >= 5) return "Fighter"
        return "Recruit"
    }

    return (
        <div className="space-y-8 h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Sword className="h-8 w-8 text-primary" />
                        The RPG Protocol
                    </h2>
                    <p className="text-muted-foreground">Your body is your character. Level up.</p>
                </motion.div>
                <div className="text-right flex items-center gap-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-12 w-12 rounded-full border-2 border-yellow-500 flex items-center justify-center bg-yellow-500/10"
                    >
                        <Crown className="h-6 w-6 text-yellow-500" />
                    </motion.div>
                    <div>
                        <div className="text-2xl font-bold text-yellow-500">Lvl {level}</div>
                        <div className="text-xs text-muted-foreground">{getClass()} Class</div>
                    </div>
                </div>
            </div>

            {/* XP Progress Bar */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass border border-white/5 rounded-xl p-4"
            >
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">{xp} XP Total</span>
                    <span className="text-primary font-bold">{Math.round(xpProgress)}% to Level {level + 1}</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${xpProgress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary to-yellow-500 rounded-full"
                    />
                </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="glass border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            {ACHIEVEMENTS.map((achievement) => {
                                const isUnlocked = unlockedAchievements.includes(achievement.id)
                                const progress = Math.min(100, (workoutCount / achievement.threshold) * 100)
                                const remaining = Math.max(0, achievement.threshold - workoutCount)
                                return (
                                    <motion.div
                                        key={achievement.id}
                                        whileHover={{ scale: 1.05 }}
                                        className={`relative flex flex-col items-center gap-1 px-4 py-3 rounded-xl border transition-all cursor-pointer ${isUnlocked
                                            ? `bg-white/10 border-white/20 ${achievement.color}`
                                            : "bg-black/30 border-white/10 text-muted-foreground"
                                            }`}
                                        title={isUnlocked ? achievement.desc : `${remaining} more workouts to unlock`}
                                    >
                                        <achievement.icon className={`h-5 w-5 ${isUnlocked ? "" : "opacity-40"}`} />
                                        <span className="text-xs font-bold">{achievement.name}</span>
                                        {!isUnlocked && (
                                            <div className="w-full mt-1">
                                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary/50 rounded-full transition-all"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] text-muted-foreground">{workoutCount}/{achievement.threshold}</span>
                                            </div>
                                        )}
                                    </motion.div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Character Sheet (Radar Chart) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="glass border-white/5 h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-500" />
                                Character Stats
                            </CardTitle>
                            <CardDescription>Attributes scale with your level.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={rpgStats}>
                                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Current Stats"
                                        dataKey="A"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        fill="#10b981"
                                        fillOpacity={0.2}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Muscle Heatmap (Dynamic Status) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="glass border-white/5 h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-red-500" />
                                Muscle Status Map
                            </CardTitle>
                            <CardDescription>Auto-updates based on your workouts.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {muscles.map((muscle, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + (i * 0.05) }}
                                            className={`flex items-center justify-between p-3 rounded-xl border ${muscle.bg} ${muscle.border} transition-transform hover:scale-105`}
                                        >
                                            <span className="text-sm font-medium text-white">{muscle.name}</span>
                                            <span className={`text-xs px-2 py-1 rounded-md bg-black/20 ${muscle.color} font-mono font-bold uppercase tracking-wider`}>
                                                {muscle.status}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="text-xs text-muted-foreground text-center mt-4">
                                    Status: <span className="text-yellow-500">Training</span> (&lt;24h) → <span className="text-red-500">Sore</span> (24-48h) → <span className="text-green-500">Recovered</span> (&gt;48h)
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
