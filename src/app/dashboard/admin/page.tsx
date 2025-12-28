"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Users, DollarSign, TrendingUp, Activity, Bell, Send, ShieldAlert, Plus, UserPlus, Server } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

const revenueData = [
    { month: "Jan", mrr: 2500 },
    { month: "Feb", mrr: 3200 },
    { month: "Mar", mrr: 4500 },
    { month: "Apr", mrr: 4100 },
    { month: "May", mrr: 5800 },
    { month: "Jun", mrr: 7200 },
    { month: "Jul", mrr: 8900 },
]

const recentUsers = [
    { name: "Alex Chen", plan: "Elite", status: "Active", joined: "2m ago", avatar: "AC" },
    { name: "Sarah Jones", plan: "Pro", status: "Active", joined: "15m ago", avatar: "SJ" },
    { name: "Mike Ross", plan: "Free", status: "Churned", joined: "1h ago", avatar: "MR" },
    { name: "Jessica P.", plan: "Elite", status: "Active", joined: "3h ago", avatar: "JP" },
    { name: "David Kim", plan: "Pro", status: "Active", joined: "5h ago", avatar: "DK" },
]

export default function AdminPage() {
    return (
        <div className="space-y-8 h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <ShieldAlert className="h-8 w-8 text-red-500" /> Command Center
                    </h2>
                    <p className="text-muted-foreground">Welcome back, Administrator. System Status: <span className="text-emerald-500 font-mono shadow-[0_0_10px_rgba(16,185,129,0.3)]">NOMINAL</span></p>
                </motion.div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
                        <Server className="mr-2 h-4 w-4" /> System Health
                    </Button>
                    <Button className="bg-white text-black hover:bg-white/90">
                        <Send className="mr-2 h-4 w-4" /> Push Update
                    </Button>
                </div>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { title: "Total Revenue", val: "$45,231.89", sub: "+20.1% from last month", icon: DollarSign, color: "text-emerald-500" },
                    { title: "Active Subs", val: "+2350", sub: "+180 new this week", icon: Users, color: "text-blue-500" },
                    { title: "Active Now", val: "573", sub: "+201 since last hour", icon: Activity, color: "text-orange-500" },
                    { title: "Engagement", val: "48.2%", sub: "Top 5% of industry", icon: TrendingUp, color: "text-purple-500" },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="glass border-white/5 relative overflow-hidden group hover:bg-white/5 transition-colors">
                            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${stat.color.replace('text', 'bg')}/10 blur-2xl group-hover:bg-opacity-20 transition-all`} />
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">{stat.val}</div>
                                <p className={`text-xs ${stat.color} flex items-center mt-1`}>
                                    {stat.sub}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-4"
                >
                    <Card className="glass border-white/5 h-full">
                        <CardHeader>
                            <CardTitle>Revenue Overview</CardTitle>
                            <CardDescription>Monthly Recurring Revenue (MRR) Growth</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis
                                            dataKey="month"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value: number) => `$${value}`}
                                        />
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: "#000", border: "1px solid #333", borderRadius: "8px" }}
                                            itemStyle={{ color: "#fff" }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="mrr"
                                            stroke="#10b981"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                            animationDuration={2000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Live User Feed */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-3"
                >
                    <Card className="glass border-white/5 h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserPlus className="h-5 w-5 text-blue-500" /> Live User Feed
                            </CardTitle>
                            <CardDescription>Real-time signups and activity.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {recentUsers.map((user, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + (i * 0.1) }}
                                        className="flex items-center justify-between group cursor-default"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <Avatar className="h-9 w-9 border border-white/10 group-hover:border-primary/50 transition-colors">
                                                    <AvatarFallback className="bg-white/5 text-xs font-bold">{user.avatar}</AvatarFallback>
                                                </Avatar>
                                                <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-black ${user.status === "Active" ? "bg-emerald-500" : "bg-red-500"}`} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none text-white group-hover:text-primary transition-colors">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.joined}</p>
                                            </div>
                                        </div>
                                        <Badge variant={user.plan === "Elite" ? "default" : user.plan === "Pro" ? "secondary" : "outline"} className="text-[10px]">
                                            {user.plan}
                                        </Badge>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Content Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "New Challenge", desc: "Launch a global event", icon: Plus, color: "text-purple-500", bg: "bg-purple-500/10" },
                    { title: "Push Notification", desc: "Alert all 2,350 users", icon: Bell, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { title: "Maintenance Mode", desc: "Toggle system status", icon: Activity, color: "text-yellow-500", bg: "bg-yellow-500/10" }
                ].map((action, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + (i * 0.1) }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Card className="glass border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className={`p-3 ${action.bg} rounded-xl group-hover:scale-110 transition-transform`}>
                                    <action.icon className={`h-6 w-6 ${action.color}`} />
                                </div>
                                <div>
                                    <CardTitle className="text-base group-hover:text-white transition-colors">{action.title}</CardTitle>
                                    <CardDescription>{action.desc}</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
