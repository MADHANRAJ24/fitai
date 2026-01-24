"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Plus, Moon, Droplets, BrainCircuit, Book, Sun, Trophy, Trash2, LucideIcon } from "lucide-react"
import confetti from "canvas-confetti"
import { HabitService, Habit } from "@/services/habit-service"
import { toast } from "sonner"

// Map string names back to components
const IconMap: Record<string, LucideIcon> = {
    "Droplets": Droplets,
    "Moon": Moon,
    "BrainCircuit": BrainCircuit,
    "Sun": Sun,
    "Book": Book
}

export default function HabitsPage() {
    const [habits, setHabits] = useState<Habit[]>([])

    useEffect(() => {
        setHabits(HabitService.getHabits())
    }, [])

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    const toggleDay = (habitId: number, dayIndex: number) => {
        const updated = HabitService.toggleDay(habitId, dayIndex)
        setHabits(updated)

        // Check if just completed
        const habit = updated.find(h => h.id === habitId)
        if (habit && habit.completed[dayIndex]) {
            confetti({
                particleCount: 30,
                spread: 50,
                origin: { y: 0.7 },
                colors: ['#10B981', '#34D399']
            })
        }
    }

    const addNewHabit = () => {
        const title = prompt("Enter habit name:")
        if (title) {
            const updated = HabitService.addHabit(title)
            setHabits(updated)
            toast.success("New habit added!")
        }
    }

    const deleteHabit = (id: number) => {
        if (confirm("Delete this habit?")) {
            const updated = HabitService.deleteHabit(id)
            setHabits(updated)
            toast.success("Habit deleted")
        }
    }

    return (
        <div className="space-y-8 h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Trophy className="h-8 w-8 text-yellow-500" />
                        Habit Builder
                    </h2>
                    <p className="text-muted-foreground">Small steps lead to big changes.</p>
                </motion.div>
                <div className="flex gap-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="neon" onClick={addNewHabit}>
                            <Plus className="mr-2 h-4 w-4" /> New Habit
                        </Button>
                    </motion.div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence>
                    {habits.map((habit, index) => {
                        const Icon = IconMap[habit.iconName] || Book
                        return (
                            <motion.div
                                key={habit.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="glass border-white/5 hover:border-white/10 transition-colors group relative overflow-hidden">
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" onClick={() => deleteHabit(habit.id)} className="h-8 w-8 text-muted-foreground hover:text-red-500">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                                        {/* Habit Info */}
                                        <div className="flex items-center gap-4 w-full md:w-64">
                                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${habit.bg}`}>
                                                <Icon className={`h-6 w-6 ${habit.color}`} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-white">{habit.title}</h3>
                                                <p className="text-xs text-muted-foreground">Daily Goal</p>
                                            </div>
                                        </div>

                                        {/* Weekly Tracker */}
                                        <div className="flex-1 flex justify-between gap-2 w-full">
                                            {days.map((day, i) => (
                                                <div key={day} className="flex flex-col items-center gap-2">
                                                    <span className="text-xs text-muted-foreground font-medium">{day}</span>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.8 }}
                                                        onClick={() => toggleDay(habit.id, i)}
                                                        className={`h-10 w-10 rounded-full flex items-center justify-center border transition-all ${habit.completed[i]
                                                            ? "bg-primary border-primary text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                                                            : "bg-white/5 border-white/10 text-transparent hover:bg-white/10"
                                                            }`}
                                                    >
                                                        <Check className="h-5 w-5" />
                                                    </motion.button>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Stats */}
                                        <div className="w-full md:w-32 flex flex-col items-center md:items-end md:pl-4 md:border-l border-white/10 pt-4 md:pt-0 max-sm:border-t max-sm:mt-4">
                                            <div className="text-2xl font-bold text-white flex items-baseline gap-1">
                                                {habit.completed.filter(Boolean).length} <span className="text-sm text-muted-foreground font-normal">/ 7</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground">Days this week</div>
                                            <div className="w-full h-1.5 bg-secondary rounded-full mt-2 overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-primary"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(habit.completed.filter(Boolean).length / 7) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>
        </div>
    )
}
