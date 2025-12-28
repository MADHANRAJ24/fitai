"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { DollarSign, TrendingUp, ShoppingBag, Dumbbell, Wallet } from "lucide-react"
import { motion } from "framer-motion"

const expenseData = [
    { name: "Supplements", value: 120, color: "#3b82f6" }, // Blue
    { name: "Gym Gear", value: 85, color: "#a855f7" },    // Purple
    { name: "Healthy Food", value: 350, color: "#10b981" }, // Green
    { name: "Memberships", value: 50, color: "#f59e0b" },   // Orange
]

const monthlyData = [
    { month: "Jan", spent: 450, budget: 500 },
    { month: "Feb", spent: 520, budget: 500 },
    { month: "Mar", spent: 480, budget: 500 },
    { month: "Apr", spent: 605, budget: 600 },
]

export default function FinancePage() {
    const totalSpent = expenseData.reduce((acc, curr) => acc + curr.value, 0)

    return (
        <div className="space-y-8 h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Wallet className="h-8 w-8 text-primary" />
                        Fitness ROI
                    </h2>
                    <p className="text-muted-foreground">Invest in your body. Track the returns.</p>
                </motion.div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Total Invested", val: `$${totalSpent}`, sub: "This Month", icon: DollarSign, color: "text-green-400" },
                    { title: "Health ROI", val: "4.2x", sub: "+12% vs last month", icon: TrendingUp, color: "text-blue-400" },
                    { title: "Top Category", val: "Food", sub: "62% of budget", icon: ShoppingBag, color: "text-purple-400" },
                    { title: "Cost / Workout", val: "$12.50", sub: "Based on 24 sessions", icon: Dumbbell, color: "text-orange-400" },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                    >
                        <Card className="glass border-white/5 hover:bg-white/5 transition-colors">
                            <CardContent className="p-6 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-2">
                                    <item.icon className={`h-5 w-5 ${item.color}`} />
                                    <span className="text-sm text-muted-foreground">{item.title}</span>
                                </div>
                                <div className="text-3xl font-bold text-white">{item.val}</div>
                                <div className="text-xs text-muted-foreground mt-1">{item.sub}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[400px]">
                {/* Expense Breakdown */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="glass border-white/5 h-full">
                        <CardHeader>
                            <CardTitle>Category Breakdown</CardTitle>
                            <CardDescription>Where your "Body Budget" goes.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={expenseData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {expenseData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex justify-center flex-wrap gap-4 -mt-4">
                                {expenseData.map((entry) => (
                                    <div key={entry.name} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                        <span className="text-xs text-muted-foreground">{entry.name}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Budget vs Actual */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="glass border-white/5 h-full">
                        <CardHeader>
                            <CardTitle>Budget vs Actual</CardTitle>
                            <CardDescription>Monthly spending trends.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <defs>
                                        <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                                    />
                                    <Bar dataKey="spent" fill="url(#colorSpent)" radius={[4, 4, 0, 0]} name="Invested ($)" />
                                    <Bar dataKey="budget" fill="#333" radius={[4, 4, 0, 0]} name="Budget Limit" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
