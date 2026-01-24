"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { Activity, Flame, Footprints, Target, Download, Plus, Loader2, Zap, Trophy, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { StatsService, UserStats } from "@/services/stats-service"
import { WorkoutService, Workout } from "@/services/workout-service"
import { ActivityService } from "@/services/activity-service"
import { useSensory } from "@/hooks/use-sensory"
import { toast } from "sonner"

export default function DashboardPage() {
    const [isDownloading, setIsDownloading] = useState(false)
    const [stats, setStats] = useState<UserStats | null>(null)
    const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const [userName, setUserName] = useState("Agent")

    const { triggerFeedback } = useSensory()

    useEffect(() => {
        const loadDashboardData = async () => {
            // ... existing load logic ...
            if (typeof window !== "undefined") {
                const stored = localStorage.getItem("user_onboarding")
                if (stored) {
                    const data = JSON.parse(stored)
                    if (data.name) setUserName(data.name)
                }
            }
            try {
                const [statsData, workoutsData] = await Promise.all([
                    StatsService.getUserStats(),
                    WorkoutService.getRecentWorkouts()
                ])

                const localActivities = ActivityService.getRecentWorkouts()
                const mergedWorkouts = [...localActivities, ...workoutsData]

                setStats(statsData)
                setRecentWorkouts(mergedWorkouts)
            } catch (error) {
                console.error("Failed to load dashboard data", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadDashboardData()

        const handleUpdate = () => loadDashboardData()
        window.addEventListener("activity_logged", handleUpdate)
        return () => window.removeEventListener("activity_logged", handleUpdate)
    }, [])

    const handleDownload = () => {
        triggerFeedback("click")
        setIsDownloading(true)
        setTimeout(() => {
            setIsDownloading(false)
            triggerFeedback("success")
            toast.success("Health Report Exported", {
                description: "Tactical data archived successfully."
            })
        }, 2000)
    }

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="relative">
                    <div className="h-20 w-20 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Zap className="h-8 w-8 text-primary animate-pulse" />
                    </div>
                </div>
            </div>
        )
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, scale: 0.95 },
        show: { opacity: 1, scale: 1 }
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8 pb-20 px-6 sm:px-8 max-w-[1600px] mx-auto relative"
        >
            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px]" />
            </div>

            <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-white font-heading uppercase tracking-tighter flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                            <Activity className="h-8 w-8 text-primary" />
                        </div>
                        Command Center
                    </h2>
                    <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.3em] mt-1 opacity-70">
                        Subject: <span className="text-primary">{userName.toUpperCase()}</span> • Biometrics: Optimal
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => { triggerFeedback("click"); window.location.href = '/dashboard/workouts'; }}
                        className="bg-primary hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-[10px] px-8 py-6 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 transition-all"
                    >
                        <Plus className="h-4 w-4 mr-2 stroke-[3px]" /> Start Mission
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleDownload}
                        className="bg-white/5 border-white/10 text-white font-bold hover:bg-white/10 px-6 py-6 rounded-2xl transition-all"
                    >
                        {isDownloading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                    </Button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {[
                    { title: "Calories Burned", value: stats?.calories || 0, icon: Flame, color: "text-orange-500", from: "from-orange-500", border: "group-hover:border-orange-500/50", sub: "kcal", trend: stats?.calorieTrend },
                    { title: "Active Time", value: stats?.activeMinutes || 0, icon: Activity, color: "text-emerald-500", from: "from-emerald-500", border: "group-hover:border-emerald-500/50", sub: "mins", trend: stats?.minutesTrend },
                    { title: "Steps Count", value: (stats?.steps || 0).toLocaleString(), icon: Footprints, color: "text-cyan-500", from: "from-cyan-500", border: "group-hover:border-cyan-500/50", sub: "steps", trend: stats?.stepsTrend },
                    { title: "Daily Goals", value: `${stats?.goalsMet || 0}/5`, icon: Target, color: "text-purple-500", from: "from-purple-500", border: "group-hover:border-purple-500/50", sub: "completed", trend: "On Track" }
                ].map((stat, i) => (
                    <motion.div
                        variants={item}
                        key={i}
                        whileHover={{ scale: 1.05, y: -8 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className={`group relative p-8 rounded-[2rem] bg-black/60 border border-white/5 backdrop-blur-3xl overflow-hidden transition-all duration-500 ${stat.border} shadow-2xl h-full flex flex-col justify-between`}>
                            {/* Animated Background Glow */}
                            <div className={`absolute -inset-1 bg-gradient-to-br ${stat.from}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl`} />
                            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-white/10 rounded-tr-[2rem] pointer-events-none" />

                            {/* Decorative Icon Corner */}
                            <div className={`absolute top-0 right-0 p-5 opacity-40 group-hover:opacity-100 transition-all duration-500 ${stat.color} bg-white/[0.03] rounded-bl-[1.5rem] backdrop-blur-md border-l border-b border-white/5`}>
                                <stat.icon className="h-6 w-6 group-hover:scale-110 transition-transform stroke-[2.5px]" />
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] font-mono opacity-60 group-hover:opacity-100 transition-opacity">{stat.title}</p>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <h3 className="text-5xl font-black text-white tracking-tighter font-heading">
                                            {stat.value}
                                        </h3>
                                        <span className="text-[10px] text-muted-foreground font-mono font-black uppercase tracking-widest opacity-40">{stat.sub}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`text-[8px] px-3 py-1.5 rounded-xl bg-black/80 border border-white/10 ${stat.color} font-mono tracking-[0.2em] font-black uppercase shadow-inner`}>
                                        {stat.trend || 'STATUS_ONLINE'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Content Split */}
            <motion.div variants={container} className="grid gap-6 md:grid-cols-7">
                {/* Chart Section */}
                <motion.div variants={item} className="md:col-span-4 rounded-[2.5rem] bg-black/60 border border-white/5 p-8 relative overflow-hidden backdrop-blur-3xl shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-emerald-500 to-transparent opacity-50" />
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/30 rounded-tl-3xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/30 rounded-br-3xl" />

                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                            <h3 className="text-2xl font-black text-white font-heading uppercase tracking-tighter flex items-center gap-2">
                                <Activity className="h-6 w-6 text-primary" /> Performance Analytics
                            </h3>
                            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mt-1 opacity-70">METRIC_TYPE: BIOMETRIC_FLOW</p>
                        </div>
                        <select className="bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white p-3 outline-none focus:border-primary/50 transition-all cursor-pointer">
                            <option>Last 6 Months</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="relative z-10">
                        <OverviewChart />
                    </div>
                </motion.div>

                {/* Recent Activity Feed */}
                <motion.div variants={item} className="md:col-span-3 flex flex-col gap-6">
                    <div className="rounded-[2.5rem] bg-black/60 border border-white/5 overflow-hidden flex flex-col h-full relative backdrop-blur-3xl shadow-2xl">
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/30 rounded-tr-3xl" />

                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02] relative z-10">
                            <div>
                                <h3 className="text-2xl font-black text-white font-heading uppercase tracking-tighter">Mission Log</h3>
                                <p className="text-[9px] text-primary/50 font-mono font-black uppercase tracking-widest">ENCRYPTED_FEED</p>
                            </div>
                            <Link href="/dashboard/workouts" className="text-[9px] text-primary hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-all flex items-center gap-2 font-black uppercase tracking-widest border border-primary/20">
                                History [ALL] <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar max-h-[450px] relative z-10">
                            {recentWorkouts.length > 0 ? recentWorkouts.slice(0, 5).map((workout, i) => (
                                <motion.div
                                    key={workout.id}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    className="group flex items-center p-5 rounded-[1.5rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="h-14 w-14 rounded-2xl bg-black flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-all shadow-2xl shrink-0 relative overflow-hidden">
                                        <Trophy className="h-7 w-7 text-primary group-hover:scale-110 transition-transform relative z-10" />
                                        <div className="absolute inset-0 bg-primary/10 animate-pulse-slow" />
                                    </div>
                                    <div className="ml-5 flex-1 min-w-0 relative z-10">
                                        <p className="text-sm font-black text-white truncate font-heading uppercase tracking-tight group-hover:text-primary transition-colors">{workout.title}</p>
                                        <p className="text-[10px] text-white/30 font-mono mt-1 font-bold tracking-widest uppercase">{workout.date} • COMPLETED</p>
                                    </div>
                                    <div className="text-right shrink-0 relative z-10">
                                        <div className="text-lg font-black text-primary font-heading">+{workout.calories}</div>
                                        <div className="text-[8px] text-muted-foreground uppercase font-mono tracking-[0.2em] font-black">CAL_EXCHANGE</div>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground font-mono text-xs opacity-50 space-y-4">
                                    <div className="h-12 w-12 rounded-full border border-dashed border-white/20 flex items-center justify-center">
                                        <Zap className="h-5 w-5" />
                                    </div>
                                    <span className="tracking-[0.3em] font-black">NO_DATA_ARCHIVED</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}
