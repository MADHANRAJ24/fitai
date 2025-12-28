"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from "recharts"
import { Sword, Shield, Zap, Brain, Target, User, Crown } from "lucide-react"
import { motion } from "framer-motion"

const rpgStats = [
    { subject: 'Strength', A: 120, fullMark: 150 },
    { subject: 'Agility', A: 98, fullMark: 150 },
    { subject: 'Endurance', A: 86, fullMark: 150 },
    { subject: 'Wisdom', A: 99, fullMark: 150 },
    { subject: 'Discipline', A: 85, fullMark: 150 },
    { subject: 'Recovery', A: 65, fullMark: 150 },
];

const muscles = [
    { name: "Pectorals", status: "Recovered", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
    { name: "Deltoids", status: "Sore", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
    { name: "Quadriceps", status: "Training", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    { name: "Lats", status: "Recovered", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
    { name: "Abs", status: "Ready", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
]

export default function RPGPage() {
    return (
        <div className="space-y-8 h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Sword className="h-8 w-8 text-primary" />
                        The RPG Protocol
                    </h2>
                    <p className="text-muted-foreground">Your body is your character. Level up.</p>
                </motion.div>
                <div className="text-right flex items-center gap-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-12 w-12 rounded-full border-2 border-yellow-500 flex items-center justify-center bg-yellow-500/10"
                    >
                        <Crown className="h-6 w-6 text-yellow-500" />
                    </motion.div>
                    <div>
                        <div className="text-2xl font-bold text-yellow-500">Lvl 12</div>
                        <div className="text-xs text-muted-foreground">Warrior Class</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Character Sheet (Radar Chart) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="glass border-white/5 h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-500" />
                                Character Stats
                            </CardTitle>
                            <CardDescription>Current attribute levels based on performance.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={rpgStats}>
                                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Current Stats"
                                        dataKey="A"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        fill="#10b981"
                                        fillOpacity={0.2}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Muscle Heatmap (Status) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="glass border-white/5 h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-red-500" />
                                Muscle Status Map
                            </CardTitle>
                            <CardDescription>Real-time recovery analysis.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Visual Body Representation (Abstract) */}
                                <div className="relative h-64 border border-white/5 rounded-xl bg-black/40 flex items-center justify-center mb-6 overflow-hidden">
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />

                                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                        <User className="h-48 w-48 text-white" strokeWidth={1} />
                                    </div>

                                    {/* Overlay Nodes (Animated) */}
                                    <motion.div
                                        animate={{ boxShadow: ["0 0 0px red", "0 0 15px red", "0 0 0px red"] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute top-16 left-1/2 -ml-12 w-3 h-3 rounded-full bg-red-500"
                                    />
                                    <motion.div
                                        animate={{ boxShadow: ["0 0 0px red", "0 0 15px red", "0 0 0px red"] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                        className="absolute top-16 right-1/2 -mr-12 w-3 h-3 rounded-full bg-red-500"
                                    />
                                    <div className="absolute top-24 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-green-500 shadow-[0_0_10px_green]" />
                                    <div className="absolute top-40 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-yellow-500 shadow-[0_0_10px_yellow] opacity-80" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {muscles.map((muscle, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + (i * 0.1) }}
                                            className={`flex items-center justify-between p-3 rounded-xl border ${muscle.bg} ${muscle.border} transition-transform hover:scale-105`}
                                        >
                                            <span className="text-sm font-medium text-white">{muscle.name}</span>
                                            <span className={`text-xs px-2 py-1 rounded-md bg-black/20 ${muscle.color} font-mono font-bold uppercase tracking-wider`}>
                                                {muscle.status}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
