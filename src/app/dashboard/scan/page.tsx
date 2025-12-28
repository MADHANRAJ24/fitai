"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Scanner } from "@/components/features/scanner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScanFace, Utensils, Zap, CheckCircle2, ChevronRight, Scale } from "lucide-react"

export default function ScanPage() {
    const [scanResult, setScanResult] = useState<any>(null)
    const [activeTab, setActiveTab] = useState("food")

    return (
        <div className="max-w-5xl mx-auto space-y-8 h-[calc(100vh-8rem)] flex flex-col">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <ScanFace className="h-8 w-8 text-primary" />
                        AI Scanner
                    </h2>
                    <p className="text-muted-foreground">Analyze your food or body composition instantly.</p>
                </div>
            </motion.div>

            <Tabs defaultValue="food" className="flex-1 flex flex-col" onValueChange={(v) => { setActiveTab(v); setScanResult(null); }}>
                <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 mb-8 max-w-md">
                    <TabsTrigger value="food" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Utensils className="h-4 w-4 mr-2" /> Food Analysis
                    </TabsTrigger>
                    <TabsTrigger value="body" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Scale className="h-4 w-4 mr-2" /> Body Scan
                    </TabsTrigger>
                </TabsList>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <motion.div
                        layout
                        className="w-full relative z-10"
                    >
                        <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                            <div className="absolute inset-0 border-2 border-primary/20 rounded-2xl z-20 pointer-events-none group-hover:border-primary/50 transition-colors" />
                            <Scanner type={activeTab as "food" | "body"} onScanComplete={setScanResult} />
                        </div>
                    </motion.div>

                    <div className="space-y-6 min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {!scanResult ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="h-full"
                                >
                                    <Card className="glass border-white/5 h-full flex items-center justify-center p-8 text-center border-dashed bg-white/[0.02]">
                                        <div className="space-y-6 max-w-xs mx-auto">
                                            <div className="relative mx-auto h-20 w-20">
                                                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                                                <div className="relative h-20 w-20 bg-white/5 rounded-full flex items-center justify-center text-muted-foreground">
                                                    <Zap className="h-8 w-8 text-primary" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-white mb-2">Ready to Scan</h3>
                                                <p className="text-muted-foreground text-sm leading-relaxed">
                                                    Point your camera at {activeTab === "food" ? "your meal" : "yourself (full body)"} to get instant AI insights.
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ type: "spring" }}
                                >
                                    <Card className="glass border-primary/50 relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent origin-left"
                                        />
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-primary">
                                                <CheckCircle2 className="h-5 w-5" />
                                                Analysis Complete
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {activeTab === "food" ? (
                                                <>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Detected Item</p>
                                                        <h3 className="text-4xl font-bold text-white mt-1">{scanResult.name}</h3>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-4">
                                                        {[
                                                            { label: "Calories", val: scanResult.calories, unit: "kcal" },
                                                            { label: "Protein", val: scanResult.protein, unit: "g" },
                                                            { label: "Fats", val: scanResult.fats, unit: "g" }
                                                        ].map((item, i) => (
                                                            <motion.div
                                                                key={i}
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.3 + (i * 0.1) }}
                                                                className="bg-white/5 p-4 rounded-xl text-center border border-white/5"
                                                            >
                                                                <div className="text-xl font-bold text-white">{item.val}</div>
                                                                <div className="text-xs text-muted-foreground">{item.unit}</div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                    <Button className="w-full h-12 text-lg font-bold" variant="neon">
                                                        Log to Nutrition <ChevronRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Posture Assessment</p>
                                                        <h3 className="text-3xl font-bold text-white mt-1">{scanResult.posture}</h3>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <motion.div
                                                            initial={{ x: -10, opacity: 0 }}
                                                            animate={{ x: 0, opacity: 1 }}
                                                            transition={{ delay: 0.3 }}
                                                            className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5"
                                                        >
                                                            <span className="text-sm text-muted-foreground">Alignment Score</span>
                                                            <span className="font-bold text-primary text-lg">{scanResult.alignment}</span>
                                                        </motion.div>
                                                        <motion.div
                                                            initial={{ x: -10, opacity: 0 }}
                                                            animate={{ x: 0, opacity: 1 }}
                                                            transition={{ delay: 0.4 }}
                                                            className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5"
                                                        >
                                                            <span className="text-sm text-muted-foreground">Issues</span>
                                                            <span className="font-bold text-white">{scanResult.issues[0]}</span>
                                                        </motion.div>
                                                    </div>
                                                    <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-xl">
                                                        <p className="text-xs text-blue-400 font-bold uppercase mb-2">Recommendation</p>
                                                        <p className="text-sm text-white leading-relaxed">{scanResult.correction}</p>
                                                    </div>
                                                </>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </Tabs>
        </div>
    )
}
