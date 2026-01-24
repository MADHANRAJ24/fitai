"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Utensils, ScanBarcode, Droplets, Apple, Plus, Search, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { ActivityService } from "@/services/activity-service"
import { bodyProfileService } from "@/services/body-profile-service"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function NutritionPage() {
    const router = useRouter()
    const [hydration, setHydration] = useState(0)
    const [calories, setCalories] = useState(0)
    const [targets, setTargets] = useState({ calories: 2000, protein: 150, carbs: 250, fats: 70 })
    const [meals, setMeals] = useState<any[]>([])
    const [isScanning, setIsScanning] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = () => {
        // 1. Get Targets from Profile
        const profile = bodyProfileService.getProfile()
        if (profile) {
            const tdee = bodyProfileService.getRecommendedCalories(profile)
            setTargets({
                calories: tdee,
                protein: Math.round((tdee * 0.3) / 4), // 30% Protein
                carbs: Math.round((tdee * 0.45) / 4), // 45% Carbs
                fats: Math.round((tdee * 0.25) / 9),  // 25% Fats
            })
        }

        // 2. Get Activities
        const activities = ActivityService.getActivities()

        // Filter Today's Items
        const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        const todaysItems = activities.filter(a => a.date === today)

        // 3. Hydration
        const waterLogs = todaysItems.filter(a => a.type === 'Nutrition' && a.title === 'Water')
        const totalWater = waterLogs.reduce((sum, item) => sum + 0.25, 0) // Each log is 250ml (0.25L)
        setHydration(totalWater)

        // 4. Food / Calories
        const foodItems = todaysItems.filter(a => (a.type === "Nutrition" && a.title !== 'Water') || a.type === "Scan")
        const totalCals = foodItems.reduce((sum, item) => sum + (Number(item.calories) || 0), 0)

        setCalories(totalCals)
        setMeals(foodItems.map(item => ({
            id: item.id,
            type: item.type === "Scan" ? "Scanned Food" : "Meal",
            time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            items: [item.title],
            cals: item.calories
        })))
    }

    const addWater = () => {
        ActivityService.saveActivity({
            type: 'Nutrition',
            title: 'Water',
            details: '250ml Hydration',
            calories: 0
        })
        toast.success("Hydration Recorded 💧")
        loadData()
    }

    const handleScan = () => {
        setIsScanning(true)
        router.push("/dashboard/scan")
    }

    // Estimate Macros based on Calories (since simple logs might not have macro breakdown)
    // In a real app, this would sum actual macros from `details` JSON
    const currentMacros = {
        protein: Math.round(calories * 0.25 / 4),
        carbs: Math.round(calories * 0.50 / 4),
        fats: Math.round(calories * 0.25 / 9)
    }

    return (
        <div className="space-y-6 h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
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
                    { label: "Calories", current: calories, total: targets.calories, unit: "kcal", color: "text-white", barColor: "bg-white" },
                    { label: "Protein", current: currentMacros.protein, total: targets.protein, unit: "g", color: "text-emerald-400", barColor: "bg-emerald-400" },
                    { label: "Carbs", current: currentMacros.carbs, total: targets.carbs, unit: "g", color: "text-sky-400", barColor: "bg-sky-400" },
                    { label: "Fats", current: currentMacros.fats, total: targets.fats, unit: "g", color: "text-pink-400", barColor: "bg-pink-400" },
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
                                        animate={{ strokeDashoffset: 283 - (283 * (Math.min(hydration, 3) / 3)) }}
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
                                {meals.length > 0 ? meals.map((meal, i) => (
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
                                )) : (
                                    <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm">
                                        <Apple className="h-8 w-8 mb-2 opacity-20" />
                                        No meals logged today.
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
