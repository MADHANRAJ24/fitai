"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, CartesianGrid } from "recharts"
import { DollarSign, TrendingUp, ShoppingBag, Dumbbell, Wallet, Plus, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { expenseService, type Expense, type ExpenseStats } from "@/services/expense-service"
import { toast } from "sonner"

const CATEGORY_COLORS: Record<string, string> = {
    supplements: "#3b82f6",
    gear: "#a855f7",
    food: "#10b981",
    memberships: "#f59e0b"
}

const CATEGORY_LABELS: Record<string, string> = {
    supplements: "Supplements",
    gear: "Gym Gear",
    food: "Healthy Food",
    memberships: "Memberships"
}

export default function FinancePage() {
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [stats, setStats] = useState<ExpenseStats | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [newExpense, setNewExpense] = useState({
        category: 'food' as Expense['category'],
        amount: '',
        description: ''
    })

    useEffect(() => {
        // Seed demo data on first load
        expenseService.seedDemoData()
        loadData()

        // Listen for expense updates
        const handleUpdate = () => loadData()
        window.addEventListener('expense_added', handleUpdate)
        return () => window.removeEventListener('expense_added', handleUpdate)
    }, [])

    const loadData = () => {
        const expenseList = expenseService.getExpenses()
        setExpenses(expenseList)
        setStats(expenseService.getStats(24)) // Assuming 24 workouts
    }

    const handleAddExpense = () => {
        if (!newExpense.amount || parseFloat(newExpense.amount) <= 0) {
            toast.error("Please enter a valid amount")
            return
        }

        expenseService.addExpense({
            category: newExpense.category,
            amount: parseFloat(newExpense.amount),
            description: newExpense.description || CATEGORY_LABELS[newExpense.category],
            date: new Date().toISOString()
        })

        setNewExpense({ category: 'food', amount: '', description: '' })
        setShowModal(false)
        toast.success("Expense added!")
    }

    // Prepare chart data from expenses
    const pieData = Object.entries(stats?.categoryTotals || {}).map(([cat, value]) => ({
        name: CATEGORY_LABELS[cat] || cat,
        value,
        color: CATEGORY_COLORS[cat] || "#666"
    })).filter(d => d.value > 0)

    const monthlyData = [
        { month: "Jan", spent: 450, budget: 500 },
        { month: "Feb", spent: 520, budget: 500 },
        { month: "Mar", spent: 480, budget: 500 },
        { month: "This", spent: stats?.totalSpent || 0, budget: 600 },
    ]

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
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button onClick={() => setShowModal(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Expense
                    </Button>
                </motion.div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Total Invested", val: `$${stats?.totalSpent || 0}`, sub: "This Month", icon: DollarSign, color: "text-green-400" },
                    { title: "Health ROI", val: `${stats?.healthROI || 0}x`, sub: "Value Generated", icon: TrendingUp, color: "text-blue-400" },
                    { title: "Top Category", val: CATEGORY_LABELS[stats?.topCategory || 'food'] || "Food", sub: `${stats?.topCategoryPercent || 0}% of budget`, icon: ShoppingBag, color: "text-purple-400" },
                    { title: "Cost / Workout", val: `$${stats?.costPerWorkout || 0}`, sub: "Based on 24 sessions", icon: Dumbbell, color: "text-orange-400" },
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
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
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
                                {pieData.map((entry) => (
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

            {/* Add Expense Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass border border-white/10 rounded-2xl p-6 w-full max-w-md"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Add Expense</h3>
                                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-white">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-muted-foreground block mb-2">Category</label>
                                    <select
                                        value={newExpense.category}
                                        onChange={e => setNewExpense(prev => ({ ...prev, category: e.target.value as Expense['category'] }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                                    >
                                        <option value="supplements">Supplements</option>
                                        <option value="gear">Gym Gear</option>
                                        <option value="food">Healthy Food</option>
                                        <option value="memberships">Memberships</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm text-muted-foreground block mb-2">Amount ($)</label>
                                    <input
                                        type="number"
                                        value={newExpense.amount}
                                        onChange={e => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                                        placeholder="0.00"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-muted-foreground block mb-2">Description (Optional)</label>
                                    <input
                                        type="text"
                                        value={newExpense.description}
                                        onChange={e => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="e.g., Protein Powder"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                                    />
                                </div>

                                <Button onClick={handleAddExpense} className="w-full mt-4">
                                    Add Expense
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
