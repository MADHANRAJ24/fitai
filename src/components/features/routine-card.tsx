"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dumbbell, Play, CheckCircle2, User } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface RoutineProps {
    id: string
    title: string
    muscles: string[] // e.g. ["Chest", "Triceps"]
    exercises: { name: string; icon?: string }[]
    isCompleted?: boolean
    onComplete?: (id: string) => void
}

export function RoutineCard({ id, title, muscles, exercises, isCompleted = false, onComplete }: RoutineProps) {
    const [completed, setCompleted] = useState(isCompleted)

    const handleComplete = () => {
        setCompleted(true)
        if (onComplete) onComplete(id)
    }

    // Mock visualization of muscle highlights based on props
    // In a real app, this would overlay highlights on a body SVG
    const getMuscleColor = (muscle: string) => {
        if (muscles.some(m => m.toLowerCase().includes(muscle.toLowerCase()))) {
            return "bg-red-500/80" // Highlight color
        }
        return "bg-white/10"
    }

    return (
        <Card className={cn(
            "relative overflow-hidden border-white/5 transition-all duration-300",
            completed ? "opacity-60 grayscale" : "hover:border-white/10"
        )}>
            {/* Background Gradient similar to "Hevy" app dark mode */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black -z-10" />

            <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-bold text-lg text-white">{title}</h3>
                        <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                            {muscles.map(m => (
                                <span key={m}>{m}</span>
                            ))}
                        </div>
                    </div>

                    {!completed ? (
                        <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full px-6"
                            onClick={handleComplete}
                        >
                            <Play className="w-4 h-4 mr-2 fill-current" />
                            Start
                        </Button>
                    ) : (
                        <Button size="sm" variant="ghost" className="text-emerald-500 pointer-events-none">
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            Completed
                        </Button>
                    )}
                </div>

                {/* Body Visualization Area (Simplified CSS version of the reference image) */}
                <div className="flex items-center gap-6 mb-6">
                    {/* Upper Body Schematic */}
                    <div className="relative h-24 w-20 mx-auto opacity-90">
                        {/* Head */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white/20" />
                        {/* Torso */}
                        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-8 h-12 rounded-sm bg-white/10" />
                        {/* Chest Highlights */}
                        {(muscles.includes("Chest") || muscles.includes("Upper Body")) && (
                            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-8 h-4 bg-red-500/60 blur-[2px]" />
                        )}
                        {/* Back Highlights */}
                        {(muscles.includes("Back") || muscles.includes("Lats")) && (
                            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-8 h-12 border-x-4 border-red-500/60 blur-[2px]" />
                        )}
                        {/* Arms */}
                        <div className="absolute top-5 left-1 w-2 h-10 bg-white/10 rotate-12" />
                        <div className="absolute top-5 right-1 w-2 h-10 bg-white/10 -rotate-12" />
                        {/* Arm Highlights */}
                        {(muscles.includes("Biceps") || muscles.includes("Triceps")) && (
                            <>
                                <div className="absolute top-5 left-1 w-2 h-6 bg-red-500/60 blur-[1px] rotate-12" />
                                <div className="absolute top-5 right-1 w-2 h-6 bg-red-500/60 blur-[1px] -rotate-12" />
                            </>
                        )}
                    </div>
                </div>

                {/* Horizontal Exercise Strip */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {exercises.map((ex, i) => (
                        <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2">
                            <div className="h-14 w-14 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                                {/* Use generic icon or specific if available */}
                                <Dumbbell className="h-6 w-6 text-muted-foreground/70" />
                            </div>
                            {/* Small text truncated */}
                            <span className="text-[10px] text-muted-foreground w-14 truncate text-center">
                                {ex.name}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
