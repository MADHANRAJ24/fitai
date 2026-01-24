"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, ArrowRight, Activity, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ProfileCompletionModalProps {
    isOpen: boolean
}

export function ProfileCompletionModal({ isOpen }: ProfileCompletionModalProps) {
    const router = useRouter()

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-zinc-950 border border-red-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.2)]"
                    >
                        {/* Decorative Top Line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />

                        <div className="p-8 flex flex-col items-center text-center space-y-6">

                            {/* Animated Icon */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse" />
                                <div className="relative h-20 w-20 bg-zinc-900 border border-red-500/50 rounded-full flex items-center justify-center">
                                    <ShieldAlert className="h-10 w-10 text-red-500" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-white tracking-wide">
                                    PROFILE INCOMPLETE
                                </h2>
                                <p className="text-zinc-400">
                                    Critical biometric data is missing. The AI cannot generate your optimization protocols without this data.
                                </p>
                            </div>

                            <div className="grid gap-3 w-full">
                                <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/10 p-3 rounded-lg">
                                    <Activity className="h-5 w-5 text-red-400" />
                                    <div className="text-left">
                                        <p className="text-xs text-red-300 font-bold uppercase">System Alert</p>
                                        <p className="text-xs text-zinc-500">Workout generation paused.</p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={() => router.push('/dashboard/profile')}
                                className="w-full h-12 bg-red-600 hover:bg-red-500 text-white font-bold tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                            >
                                CALIBRATE PROFILE <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
