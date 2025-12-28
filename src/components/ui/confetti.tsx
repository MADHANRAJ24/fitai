"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function Confetti({ trigger }: { trigger: boolean }) {
    const [dots, setDots] = useState<{ id: number; x: number; color: string }[]>([])

    useEffect(() => {
        if (trigger) {
            const colors = ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#a855f7"]
            const newDots = Array.from({ length: 50 }).map((_, i) => ({
                id: i,
                x: Math.random() * 100, // percentage
                color: colors[Math.floor(Math.random() * colors.length)],
            }))
            setDots(newDots)

            const timer = setTimeout(() => setDots([]), 3000)
            return () => clearTimeout(timer)
        }
    }, [trigger])

    if (dots.length === 0) return null

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {dots.map((dot) => (
                <motion.div
                    key={dot.id}
                    initial={{ y: -20, x: `${dot.x}vw`, opacity: 1 }}
                    animate={{ y: "100vh", rotate: 360 }}
                    transition={{ duration: Math.random() * 2 + 1, ease: "linear" }}
                    className="absolute w-3 h-3 rounded-full"
                    style={{ backgroundColor: dot.color, left: 0 }}
                />
            ))}
        </div>
    )
}
