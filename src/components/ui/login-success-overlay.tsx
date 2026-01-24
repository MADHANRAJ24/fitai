"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check, ShieldCheck, Lock } from "lucide-react"

interface LoginSuccessOverlayProps {
    isVisible: boolean
}

export function LoginSuccessOverlay({ isVisible }: LoginSuccessOverlayProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Background Grid Effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                    {/* Central Animation Container */}
                    <div className="relative flex flex-col items-center justify-center space-y-6">

                        {/* Icon Animation */}
                        <div className="relative">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                                className="h-24 w-24 rounded-full bg-emerald-500/20 flex items-center justify-center border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                            >
                                <ShieldCheck className="h-12 w-12 text-emerald-400" />
                            </motion.div>

                            {/* Scanning Ring */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: [0, 1, 0], scale: 1.5 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                                className="absolute inset-0 rounded-full border border-emerald-500/50"
                            />
                        </div>

                        {/* Text Animation */}
                        <div className="text-center space-y-2">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-3xl font-black tracking-widest text-emerald-400 uppercase drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                            >
                                Access Granted
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-emerald-500/70 font-mono text-sm tracking-[0.2em]"
                            >
                                IDENTITY CONFIRMED
                            </motion.p>
                        </div>

                        {/* Loading Bar */}
                        <motion.div
                            className="w-48 h-1 bg-emerald-900/30 rounded-full overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <motion.div
                                className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.8 }}
                            />
                        </motion.div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
