"use client"

import { ChronoPredictor } from "@/components/features/chrono-predictor"
import { NeuralPlayer } from "@/components/features/neural-player"
import { Beaker } from "lucide-react"
import { motion } from "framer-motion"

export default function BioLabPage() {
    return (
        <div className="space-y-8 h-[calc(100vh-8rem)]">
            <div className="flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Beaker className="h-8 w-8 text-primary" />
                        Bio-Future Lab
                    </h2>
                    <p className="text-muted-foreground">Experimental features for peak human performance.</p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 h-full"
                >
                    <ChronoPredictor />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="h-full"
                >
                    <NeuralPlayer />
                </motion.div>

                {/* Background Decor to make it feel like a Lab */}
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] opacity-20">
                    <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-primary/20 blur-[100px] rounded-full mix-blend-screen animate-pulse" />
                    <div className="absolute bottom-[20%] right-[10%] w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full mix-blend-screen animate-pulse" />
                </div>
            </div>
        </div>
    )
}
