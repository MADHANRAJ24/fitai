"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Utensils, ScanBarcode, Droplets, Apple, Plus, Search, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { StatsService } from "@/services/stats-service"
import { ActivityService } from "@/services/activity-service"
import { useRouter } from "next/navigation"

export default function NutritionPage() {
    const router = useRouter()
    const [hydration, setHydration] = useState(1.2)
    const [calories, setCalories] = useState(0)
    const [meals, setMeals] = useState<any[]>([])
    const [isScanning, setIsScanning] = useState(false)

    useEffect(() => {
        // Load stats from Activity Service
        const loadNutrition = () => {
            const activities = ActivityService.getActivities()

            // Filter for Nutrition/Scan items
            const foodItems = activities.filter(a => a.type === "Nutrition" || a.type === "Scan")

            // Calculate total calories
            // Calculate total calories
            const totalCals = foodItems.reduce((sum, item) => {
                const val = typeof item.calories === 'string' ? parseInt(item.calories) : item.calories
                return sum + (Number(val) || 0)
            }, 0)

            // Format for display
            const formattedMeals = foodItems.map(item => ({
                id: item.id,
                type: item.type === "Scan" ? "Scanned Food" : "Meal",
                time: item.date, // Simplification
                items: [item.title],
                cals: item.calories
            }))

            setCalories(totalCals)
            setMeals(formattedMeals)
        }
        loadNutrition()
    }, [])

    const addWater = () => {
        setHydration(prev => Math.min(prev + 0.25, 3.0))
    }

    const handleScan = () => {
        setIsScanning(true)
        router.push("/dashboard/scan")
    }

    return (
        <div className="space-y-6 h-[calc(100vh-8rem)]">
            <div className="flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Utensils className="h-8 w-8 text-primary" />
                        Nutrition
                    </h2>
                    <p className="text-muted-foreground">Fuel your body right.</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="neon" onClick={handleScan} disabled={isScanning}>
                        {isScanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanBarcode className="mr-2 h-4 w-4" />}
                        {isScanning ? "Analyzing..." : "Scan Food"}
                    </Button>
                </motion.div>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                {/* Macro Cards */}
                {[
                    { label: "Calories", current: calories, total: 2400, unit: "kcal", color: "text-white", barColor: "bg-white" },
                    { label: "Protein", current: 110, total: 180, unit: "g", color: "text-emerald-400", barColor: "bg-emerald-400" },
                    { label: "Carbs", current: 140, total: 250, unit: "g", color: "text-sky-400", barColor: "bg-sky-400" },
                    { label: "Fats", current: 45, total: 70, unit: "g", color: "text-pink-400", barColor: "bg-pink-400" },
                ].map((macro, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="glass border-white/5">
                            <CardContent className="p-6">
                                <p className="text-xs text-muted-foreground uppercase font-bold">{macro.label}</p>
                                <div className="mt-2 flex items-baseline gap-1">
                                    <motion.span
                                        key={macro.current} // Trigger animation on change
                                        initial={{ scale: 1.2, color: "#fff" }}
                                        animate={{ scale: 1, color: "inherit" }}
                                        className={`text-2xl font-bold ${macro.color}`}
                                    >
                                        {macro.current}
                                    </motion.span>
                                    <span className="text-sm text-muted-foreground">/ {macro.total} {macro.unit}</span>
                                </div>
                                <div className="mt-3 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full rounded-full ${macro.barColor}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min((macro.current / macro.total) * 100, 100)}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Hydration */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="md:col-span-1"
                >
                    <Card className="glass border-white/5 h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Droplets className="h-5 w-5 text-sky-400" />
                                Hydration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center py-6">
                            <div className="relative h-48 w-48 flex items-center justify-center">
                                {/* SVG Circle Progress */}
                                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                                    <motion.circle
                                        cx="50" cy="50" r="45"
                                        fill="none"
                                        stroke="#38bdf8"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray="283"
                                        initial={{ strokeDashoffset: 283 }}
                                        animate={{ strokeDashoffset: 283 - (283 * (hydration / 3)) }}
                                        transition={{ duration: 1, type: "spring" }}
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <motion.span
                                        key={hydration}
                                        initial={{ scale: 1.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-4xl font-bold text-white"
                                    >
                                        {hydration.toFixed(2)}
                                    </motion.span>
                                    <span className="text-xs text-muted-foreground">Liters</span>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-8">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={addWater}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border border-sky-500/20 transition-colors"
                                >
                                    <Plus className="h-4 w-4" /> Add 250ml
                                </motion.button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Meals List */}
                <Card className="glass border-white/5 md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Utensils className="h-5 w-5 text-pink-500" />
                            Today's Meals
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="h-8 gap-2">
                            <Search className="h-4 w-4" /> Find Meal
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[300px] pr-4">
                            <div className="space-y-4">
                                {meals.map((meal, i) => (
                                    <motion.div
                                        key={meal.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + (i * 0.1) }}
                                        className="flex items-start justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                                    >
                                        <div className="flex gap-4">
                                            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                                <Apple className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white group-hover:text-primary transition-colors">{meal.type}</h4>
                                                <p className="text-xs text-muted-foreground">{meal.time}</p>
                                                <div className="mt-2 text-sm text-white/80">
                                                    {meal.items.join(", ")}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="font-bold text-white">{meal.cals} kcal</div>
                                    </motion.div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
