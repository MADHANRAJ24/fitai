"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Dumbbell, Activity } from "lucide-react"

export function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        // Hide splash screen after 2.5 seconds
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 2500)

        return () => clearTimeout(timer)
    }, [])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="splash"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
                >
                    {/* Background Ambient Glow */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 90, 0]
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-[20%] -left-[20%] w-[70%] h-[70%] bg-emerald-500/10 rounded-full blur-[100px]"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, -45, 0]
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="absolute -bottom-[20%] -right-[20%] w-[70%] h-[70%] bg-blue-500/10 rounded-full blur-[100px]"
                        />
                    </div>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="relative z-10 flex flex-col items-center"
                    >
                        {/* Animated Logo Icon */}
                        <div className="relative mb-6">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-2 border-dashed border-emerald-500/30 rounded-full w-32 h-32"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-2 border border-dashed border-white/10 rounded-full w-28 h-28"
                            />

                            <div className="w-32 h-32 flex items-center justify-center rounded-full bg-black/50 border border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                                <Dumbbell className="h-14 w-14 text-emerald-500 fill-emerald-500/20" />
                            </div>
                        </div>

                        {/* Text Reveal */}
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-400 to-white"
                        >
                            FIT<span className="text-emerald-500">AI</span>
                        </motion.h1>

                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mt-2 rounded-full opacity-50"
                        />

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-4 text-zinc-500 text-sm font-medium tracking-[0.3em] uppercase"
                        >
                            System Initialization
                        </motion.p>
                    </motion.div>

                    {/* Loading Dots */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="absolute bottom-12 flex gap-2"
                    >
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                                className="w-2 h-2 bg-emerald-500 rounded-full"
                            />
                        ))}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
