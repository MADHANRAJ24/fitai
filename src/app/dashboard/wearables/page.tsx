"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Activity, Heart, Moon, Watch, Smartphone, RefreshCw, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export default function WearablesPage() {
    const [isSyncing, setIsSyncing] = useState(false)

    const handleSync = () => {
        setIsSyncing(true)
        setTimeout(() => setIsSyncing(false), 2000)
    }

    return (
        <div className="space-y-8 h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Watch className="h-8 w-8 text-primary" />
                        Device Sync
                    </h2>
                    <p className="text-muted-foreground">Connect your wearables for deeper insights.</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        variant="outline"
                        className={`gap-2 ${isSyncing ? "text-primary border-primary/50 bg-primary/10" : ""}`}
                        onClick={handleSync}
                        disabled={isSyncing}
                    >
                        <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                        {isSyncing ? "Syncing..." : "Sync Now"}
                    </Button>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Connected Devices */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="glass border-white/5 h-full">
                        <CardHeader>
                            <CardTitle>Connected Devices</CardTitle>
                            <CardDescription>Your active data sources.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center border border-white/10">
                                        <Watch className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">Apple Watch Ultra</div>
                                        <div className="text-xs text-green-400 flex items-center gap-1 font-mono mt-1">
                                            <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                                            CONNECTED
                                        </div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">Settings</Button>
                            </motion.div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center border border-white/10">
                                        <Smartphone className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">Google Fit</div>
                                        <div className="text-xs text-muted-foreground mt-1">Not connected</div>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">Connect</Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Live Metrics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="glass border-white/5 h-full relative overflow-hidden">
                        {isSyncing && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center"
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                                    <span className="text-sm font-bold text-white">Updating Data...</span>
                                </div>
                            </motion.div>
                        )}
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                Live Metrics
                                {isSyncing ? null : <span className="text-xs font-normal text-muted-foreground">Just now</span>}
                            </CardTitle>
                            <CardDescription>Data from Apple Watch Ultra.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex flex-col items-center justify-center text-center py-6"
                            >
                                <Heart className="h-8 w-8 text-red-500 mb-2 animate-pulse" />
                                <div className="text-3xl font-bold text-white">72 <span className="text-sm font-normal text-muted-foreground">bpm</span></div>
                                <div className="text-xs text-red-400 mt-1 font-bold uppercase">Resting HR</div>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col items-center justify-center text-center py-6"
                            >
                                <Moon className="h-8 w-8 text-indigo-500 mb-2" />
                                <div className="text-3xl font-bold text-white">7h 45m</div>
                                <div className="text-xs text-indigo-400 mt-1 font-bold uppercase">Sleep Score: 88</div>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex flex-col items-center justify-center text-center col-span-2 py-6"
                            >
                                <Activity className="h-8 w-8 text-orange-500 mb-2" />
                                <div className="text-4xl font-bold text-white">1,240 <span className="text-sm font-normal text-muted-foreground">kcals</span></div>
                                <div className="text-xs text-orange-400 mt-1 font-bold uppercase">Total Active Energy</div>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
