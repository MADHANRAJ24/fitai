"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Scanner } from "@/components/features/scanner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScanFace, Utensils, Zap, CheckCircle2, ChevronRight, Scale } from "lucide-react"

import { ActivityService } from "@/services/activity-service"
import { toast } from "sonner"
import { useSensory } from "@/hooks/use-sensory"

export default function ScanPage() {
    const { triggerFeedback } = useSensory()
    const [scanResult, setScanResult] = useState<any>(null)
    const [activeTab, setActiveTab] = useState("food")

    const onScanFinish = (result: any) => {
        setScanResult(result)
        triggerFeedback("success")
        window.dispatchEvent(new CustomEvent("show_success", { detail: { message: "Analysis Optimized" } }))
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 h-[calc(100vh-8rem)] flex flex-col relative">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none -z-10 rotate-180">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h2 className="text-4xl font-black tracking-tighter text-white flex items-center gap-3 uppercase font-heading">
                        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                            <ScanFace className="h-8 w-8 text-primary" />
                        </div>
                        AI Scanner
                    </h2>
                    <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.2em] mt-1 opacity-70">Sector: Biometric & Nutritional Analysis</p>
                </div>
            </motion.div>

            <Tabs defaultValue="food" className="flex-1 flex flex-col" onValueChange={(v) => { setActiveTab(v); setScanResult(null); triggerFeedback("click"); }}>
                <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 mb-10 max-w-md rounded-2xl border border-white/5 shadow-2xl">
                    <TabsTrigger value="food" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl font-bold uppercase tracking-widest text-[10px] h-10 transition-all">
                        <Utensils className="h-4 w-4 mr-2" /> Food Analysis
                    </TabsTrigger>
                    <TabsTrigger value="body" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl font-bold uppercase tracking-widest text-[10px] h-10 transition-all">
                        <Scale className="h-4 w-4 mr-2" /> Body Scan
                    </TabsTrigger>
                </TabsList>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10 items-start pb-10">
                    <motion.div
                        layout
                        className="w-full relative z-10"
                    >
                        <div className="relative group rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black">
                            {/* HUD Corners */}
                            <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-primary/50 z-30 pointer-events-none rounded-tl-lg" />
                            <div className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-primary/50 z-30 pointer-events-none rounded-tr-lg" />
                            <div className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 border-primary/50 z-30 pointer-events-none rounded-bl-lg" />
                            <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-primary/50 z-30 pointer-events-none rounded-br-lg" />

                            {/* Scanning Animation */}
                            <motion.div
                                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent z-40 shadow-[0_0_20px_#10b981] pointer-events-none"
                                animate={{ top: ["10%", "90%", "10%"] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            />

                            <div className="absolute inset-0 border-4 border-white/5 rounded-3xl z-20 pointer-events-none" />
                            <Scanner type={activeTab as "food" | "body"} onScanComplete={onScanFinish} />
                        </div>
                        <div className="mt-4 flex items-center justify-between px-2">
                            <span className="text-[10px] text-primary/50 font-mono tracking-widest uppercase flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                Camera Feedback: Operational
                            </span>
                            <span className="text-[10px] text-white/30 font-mono tracking-widest uppercase">
                                Res: 1080p AI-Enhanced
                            </span>
                        </div>
                    </motion.div>

                    <div className="space-y-6 min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {!scanResult ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="h-full"
                                >
                                    <div className="glass h-full min-h-[400px] flex items-center justify-center p-12 text-center rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-primary/5 animate-pulse-slow" />
                                        <div className="space-y-8 max-w-xs mx-auto relative z-10">
                                            <div className="relative mx-auto h-24 w-24">
                                                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                                                <div className="relative h-24 w-24 bg-white/[0.03] border border-white/10 rounded-full flex items-center justify-center text-muted-foreground shadow-2xl">
                                                    <Zap className="h-10 w-10 text-primary animate-pulse" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-white mb-3 uppercase font-heading tracking-tighter">Ready for Scan</h3>
                                                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                                                    Position {activeTab === "food" ? "your meal" : "target subject"} within the HUD parameters for rapid analysis.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ type: "spring", damping: 15 }}
                                >
                                    <div className="glass-card p-8 relative overflow-hidden shadow-2xl rounded-[2.5rem] border border-primary/30 min-h-[400px]">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />

                                        {/* Result Header */}
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 rounded-2xl bg-primary/20 border border-primary/30">
                                                    <CheckCircle2 className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="text-2xl font-black text-white font-heading uppercase tracking-tighter">Protocol Logged</h4>
                                                    <p className="text-[10px] text-primary font-mono tracking-[0.2em] font-bold uppercase">Confidence Rank: High</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            {activeTab === "food" ? (
                                                <>
                                                    <div className="text-center py-6 relative">
                                                        <motion.div
                                                            initial={{ scale: 0.8, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            className="inline-block"
                                                        >
                                                            <h3 className="text-5xl font-black text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 font-heading uppercase tracking-tighter">
                                                                {scanResult.name}
                                                            </h3>
                                                            <div className="h-1.5 w-32 mx-auto bg-primary shadow-[0_0_15px_#10b981] mt-4 rounded-full" />
                                                        </motion.div>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-4">
                                                        {[
                                                            { label: "Calories", val: scanResult.calories, unit: "kcal", color: "text-orange-400", bg: "bg-orange-500/10" },
                                                            { label: "Protein", val: scanResult.protein, unit: "g", color: "text-blue-400", bg: "bg-blue-500/10" },
                                                            { label: "Fats", val: scanResult.fats, unit: "g", color: "text-emerald-400", bg: "bg-emerald-500/10" }
                                                        ].map((item, i) => (
                                                            <motion.div
                                                                key={i}
                                                                initial={{ opacity: 0, y: 15 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.3 + (i * 0.1) }}
                                                                className={`p-5 rounded-3xl text-center border border-white/5 backdrop-blur-xl ${item.bg}`}
                                                            >
                                                                <div className={`text-3xl font-black font-heading ${item.color}`}>{item.val}</div>
                                                                <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-2 font-bold">{item.label}</div>
                                                            </motion.div>
                                                        ))}
                                                    </div>

                                                    <Button
                                                        className="w-full h-16 text-lg font-black rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest font-heading"
                                                        variant="neon"
                                                        onClick={() => {
                                                            triggerFeedback("click")
                                                            ActivityService.saveActivity({
                                                                type: "Scan",
                                                                title: scanResult.name,
                                                                details: `${scanResult.protein} Protein • ${scanResult.fats} Fat`,
                                                                calories: scanResult.calories
                                                            })
                                                            toast.success("Meal logged to Nutrition Plan")
                                                            setScanResult(null)
                                                        }}
                                                    >
                                                        Synchronize Data <ChevronRight className="ml-2 h-6 w-6" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex justify-between items-end border-b border-white/10 pb-6 relative">
                                                        <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
                                                        <div>
                                                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-2 font-mono">Posture Assessment</p>
                                                            <h3 className="text-5xl font-black text-white font-heading tracking-tighter">{scanResult.posture}</h3>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-4xl font-black text-primary font-heading tracking-tighter">{scanResult.alignment}</div>
                                                            <p className="text-[10px] text-primary/70 font-mono font-bold tracking-widest uppercase">Alignment</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid gap-4">
                                                        {scanResult.issues.map((issue: string, idx: number) => (
                                                            <motion.div
                                                                key={idx}
                                                                initial={{ x: -20, opacity: 0 }}
                                                                animate={{ x: 0, opacity: 1 }}
                                                                transition={{ delay: 0.1 * idx }}
                                                                className="flex items-center gap-4 bg-red-500/10 p-4 rounded-2xl border border-red-500/20 group"
                                                            >
                                                                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                                                <span className="text-sm text-white font-bold uppercase tracking-tight opacity-90 group-hover:opacity-100 transition-opacity">{issue}</span>
                                                            </motion.div>
                                                        ))}
                                                    </div>

                                                    <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-3xl relative overflow-hidden group">
                                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Zap className="h-16 w-16" /></div>
                                                        <p className="text-[9px] text-blue-400 font-black uppercase mb-3 tracking-[0.2em] font-mono">NEURAL CORRECTION</p>
                                                        <p className="text-[15px] text-white leading-relaxed font-bold tracking-tight">{scanResult.correction}</p>
                                                    </div>

                                                    {scanResult.suggested_workout && (
                                                        <Button
                                                            variant="outline"
                                                            className="w-full h-14 border-primary/20 hover:bg-primary/10 text-primary rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
                                                            onClick={() => {
                                                                triggerFeedback("click")
                                                                ActivityService.saveActivity({
                                                                    type: "Workout",
                                                                    title: "Corrective Routine",
                                                                    details: scanResult.suggested_workout,
                                                                    calories: 150
                                                                })
                                                                toast.success("Corrective routine saved")
                                                                setScanResult(null)
                                                            }}
                                                        >
                                                            <Zap className="mr-3 h-5 w-5 fill-primary/20" /> Save Tactical Plan
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </Tabs >
        </div >
    )
}
