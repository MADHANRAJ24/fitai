"use client"

import { ChatInterface } from "@/components/coach/chat-interface"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Sparkles, Zap, BrainCircuit, Activity } from "lucide-react"
import { motion } from "framer-motion"

export default function CoachPage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
            {/* Sidebar Info */}
            <div className="lg:col-span-1 space-y-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="h-full"
                >
                    <Card className="glass border-white/5 h-full flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                AI Insights
                            </CardTitle>
                            <CardDescription>
                                Real-time analysis of your fitness data.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 flex-1 overflow-y-auto">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-2 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-primary/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                <div className="flex items-center gap-2 text-primary font-medium relative z-10">
                                    <Zap className="h-4 w-4" />
                                    Recovery Status
                                </div>
                                <div className="text-3xl font-bold text-white relative z-10">92%</div>
                                <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full w-[92%]" />
                                </div>
                                <p className="text-xs text-muted-foreground relative z-10 pt-2">Ready for high intensity training.</p>
                            </motion.div>

                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 space-y-2"
                            >
                                <div className="flex items-center gap-2 text-sky-500 font-medium">
                                    <BrainCircuit className="h-4 w-4" />
                                    Focus Area
                                </div>
                                <div className="text-lg font-bold text-white">Mobility & Core</div>
                                <p className="text-xs text-muted-foreground">Based on yesterday's heavy leg session to prevent stiffness.</p>
                            </motion.div>

                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20 space-y-2"
                            >
                                <div className="flex items-center gap-2 text-pink-500 font-medium">
                                    <Activity className="h-4 w-4" />
                                    Weekly Load
                                </div>
                                <div className="text-lg font-bold text-white">Optimal</div>
                                <p className="text-xs text-muted-foreground">You are training within the sweet spot for hypertrophy.</p>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Main Chat Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-3 h-full"
            >
                <ChatInterface />
            </motion.div>
        </div>
    )
}
