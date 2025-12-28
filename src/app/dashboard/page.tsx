"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { Activity, Flame, Footprints, Target, Download, Plus, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { StatsService, UserStats } from "@/services/stats-service"
import { WorkoutService, Workout } from "@/services/workout-service"

export default function DashboardPage() {
    const [isDownloading, setIsDownloading] = useState(false)
    const [stats, setStats] = useState<UserStats | null>(null)
    const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [statsData, workoutsData] = await Promise.all([
                    StatsService.getUserStats(),
                    WorkoutService.getRecentWorkouts()
                ])
                setStats(statsData)
                setRecentWorkouts(workoutsData)
            } catch (error) {
                console.error("Failed to load dashboard data", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadDashboardData()
    }, [])

    const handleDownload = () => {
        setIsDownloading(true)
        // Simulate download delay
        setTimeout(() => {
            setIsDownloading(false)
            alert("✅ Health Report Downloaded Successfully!")
        }, 2000)
    }

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-bold tracking-tight text-white"
                >
                    Dashboard
                </motion.h2>
                <div className="flex items-center space-x-4">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant="outline"
                            className="glass border-white/10 hover:bg-white/10 gap-2"
                            onClick={handleDownload}
                            disabled={isDownloading}
                        >
                            {isDownloading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Download className="h-4 w-4" />
                            )}
                            {isDownloading ? "Generating..." : "Download Report"}
                        </Button>
                    </motion.div>

                    <Link href="/dashboard/workouts">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="neon" className="gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                <Plus className="h-4 w-4 text-black" />
                                <span className="text-black font-bold">New Workout</span>
                            </Button>
                        </motion.div>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Total Calories", value: stats?.calories || 0, icon: Flame, color: "text-orange-500", sub: stats?.calorieTrend || "+0%" },
                    { title: "Active Minutes", value: `${stats?.activeMinutes || 0}m`, icon: Activity, color: "text-emerald-500", sub: stats?.minutesTrend || "+0%" },
                    { title: "Steps Taken", value: stats?.steps.toLocaleString() || 0, icon: Footprints, color: "text-sky-500", sub: stats?.stepsTrend || "+0%" },
                    { title: "Goals Met", value: `${stats?.goalsMet || 0}/5`, icon: Target, color: "text-pink-500", sub: "Daily Target" }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="glass border-white/5 hover:bg-white/5 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.sub}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <OverviewChart />

                <Card className="glass border-white/5 col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            {recentWorkouts.length > 0
                                ? `You completed ${recentWorkouts.length} workouts recently.`
                                : "No recent workouts found. Time to train!"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {recentWorkouts.map((workout, i) => (
                                <motion.div
                                    key={workout.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                    className="flex items-center"
                                >
                                    <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
                                        <Activity className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none text-white">{workout.title}</p>
                                        <p className="text-sm text-muted-foreground">{workout.date}</p>
                                    </div>
                                    <div className="ml-auto font-medium text-white">{workout.calories}</div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
