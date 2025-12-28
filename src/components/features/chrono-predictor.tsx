"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Sparkles, Brain, Zap, Moon } from "lucide-react"

const data = [
    { time: "06:00", energy: 40, focus: 30 },
    { time: "08:00", energy: 65, focus: 70 },
    { time: "10:00", energy: 90, focus: 95 }, // Peak Focus
    { time: "12:00", energy: 80, focus: 85 },
    { time: "14:00", energy: 60, focus: 50 }, // Dip
    { time: "16:00", energy: 75, focus: 60 },
    { time: "18:00", energy: 95, focus: 75 }, // Peak Physical
    { time: "20:00", energy: 70, focus: 50 },
    { time: "22:00", energy: 40, focus: 30 },
]

export function ChronoPredictor() {
    return (
        <Card className="glass border-white/5 relative overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />

            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Chrono-Performance Forecast
                </CardTitle>
                <CardDescription>AI-simulated circadian rhythm prediction for the next 16 hours.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="energy" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorEnergy)" name="Physical Energy" />
                            <Area type="monotone" dataKey="focus" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorFocus)" name="Cognitive Focus" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center text-center">
                        <Brain className="h-5 w-5 text-blue-400 mb-2" />
                        <span className="text-xs text-muted-foreground">Deep Work Window</span>
                        <span className="font-bold text-white">09:00 - 11:30</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center text-center">
                        <Zap className="h-5 w-5 text-green-400 mb-2" />
                        <span className="text-xs text-muted-foreground">Peak Strength</span>
                        <span className="font-bold text-white">17:30 - 19:00</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center text-center">
                        <Moon className="h-5 w-5 text-indigo-400 mb-2" />
                        <span className="text-xs text-muted-foreground">Melatonin Onset</span>
                        <span className="font-bold text-white">22:45</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
