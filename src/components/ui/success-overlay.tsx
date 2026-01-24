"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Trophy, Zap } from "lucide-react"

export function SuccessOverlay() {
    const [isVisible, setIsVisible] = useState(false)
    const [message, setMessage] = useState("Mission Accomplished")

    useEffect(() => {
        const handleShow = (e: any) => {
            if (e.detail?.message) setMessage(e.detail.message)
            setIsVisible(true)
            setTimeout(() => setIsVisible(false), 3000)
        }

        window.addEventListener("show_success", handleShow)
        return () => window.removeEventListener("show_success", handleShow)
    }, [])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-6 pointer-events-none"
                >
                    {/* Backdrop Blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
                    />

                    {/* Celebration Particles (Simple CSS/Motion) */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    x: "50%",
                                    y: "50%",
                                    scale: 0,
                                    opacity: 1
                                }}
                                animate={{
                                    x: `${Math.random() * 100}%`,
                                    y: `${Math.random() * 100}%`,
                                    scale: [0, 1.5, 0],
                                    opacity: [0, 1, 0]
                                }}
                                transition={{
                                    duration: 2 + Math.random() * 2,
                                    ease: "easeOut"
                                }}
                                className="absolute w-2 h-2 rounded-full bg-primary/40 blur-sm"
                            />
                        ))}
                    </div>

                    {/* Content Card */}
                    <motion.div
                        initial={{ scale: 0.8, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 1.1, opacity: 0 }}
                        className="relative glass border-primary/20 p-12 rounded-[3rem] text-center max-w-sm w-full shadow-[0_0_50px_rgba(16,185,129,0.3)] overflow-hidden"
                    >
                        {/* Animated Border Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-indigo-500/10" />

                        <motion.div
                            initial={{ rotate: -10, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className="relative mb-6 flex justify-center"
                        >
                            <div className="relative">
                                <CheckCircle2 className="h-24 w-24 text-primary relative z-10" />
                                <motion.div
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                                />
                            </div>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-3xl font-black text-white uppercase tracking-tighter mb-2 font-heading"
                        >
                            {message}
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-muted-foreground font-mono text-xs uppercase tracking-widest"
                        >
                            Protocol optimized • XP synchronization complete
                        </motion.p>

                        <div className="mt-8 flex justify-center gap-4">
                            <Zap className="h-5 w-5 text-primary animate-pulse" />
                            <Trophy className="h-5 w-5 text-indigo-400 animate-bounce" />
                            <Zap className="h-5 w-5 text-primary animate-pulse" />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
