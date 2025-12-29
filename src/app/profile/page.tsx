"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Settings, CreditCard, Bell, Shield, LogOut, ChevronRight, Calculator, Calendar, History, Trophy } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
    const { signOut } = useAuth()
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut()
        router.push("/onboarding")
    }

    return (
        <div className="min-h-screen bg-black relative selection:bg-cyan-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="fixed top-0 right-0 h-[500px] w-[500px] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />

            <Navbar />

            <div className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-3xl font-bold tracking-tight text-white flex items-center gap-3"
                        >
                            <User className="h-8 w-8 text-cyan-400" />
                            My Profile
                        </motion.h1>
                        <Button
                            variant="outline"
                            className="text-red-400 border-red-500/20 hover:bg-red-500/10"
                            onClick={handleSignOut}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Identity Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="md:col-span-3"
                        >
                            <Card className="glass border-white/10 bg-gradient-to-r from-zinc-900/50 to-black/50">
                                <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                                        <Avatar className="h-32 w-32 border-2 border-cyan-500/30 ring-4 ring-black shadow-2xl">
                                            <AvatarImage src="/avatar-placeholder.png" />
                                            <AvatarFallback className="bg-zinc-800 text-3xl font-bold text-cyan-500">JP</AvatarFallback>
                                        </Avatar>
                                        <Badge className="absolute -bottom-2 -right-2 bg-gradient-to-r from-cyan-500 to-purple-600 border-0 px-3 py-1">PRO</Badge>
                                    </div>

                                    <div className="flex-1 text-center md:text-left space-y-4">
                                        <div>
                                            <h2 className="text-3xl font-bold text-white">Guest User</h2>
                                            <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                                                guest@fitai.com • Member since Dec 2024
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                            {[
                                                { label: "Workouts", val: "12", icon: History },
                                                { label: "Streak", val: "5 Days", icon: Trophy, color: "text-orange-500" },
                                                { label: "Points", val: "2,450", icon: Calculator }
                                            ].map((stat, i) => (
                                                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
                                                    <stat.icon className={`h-4 w-4 ${stat.color || "text-gray-400"}`} />
                                                    <span className="font-bold text-white">{stat.val}</span>
                                                    <span className="text-xs text-muted-foreground uppercase">{stat.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 min-w-[200px]">
                                        <Link href="/dashboard/billing">
                                            <Button className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 border-0 text-white shadow-lg shadow-cyan-500/20">
                                                Manage Subscription
                                            </Button>
                                        </Link>
                                        <Link href="/dashboard/settings">
                                            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">
                                                <Settings className="h-4 w-4 mr-2" /> Settings
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Quick Actions Grid */}
                        {[
                            { title: "Notifications", desc: "Manage alerts & emails", icon: Bell, href: "/dashboard/settings" },
                            { title: "Billing & Plans", desc: "View invoices & plan", icon: CreditCard, href: "/dashboard/billing" },
                            { title: "Security", desc: "Password & 2FA", icon: Shield, href: "/dashboard/settings" },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                            >
                                <Link href={item.href}>
                                    <Card className="glass border-white/5 hover:bg-white/5 transition-all group cursor-pointer h-full">
                                        <CardHeader>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform">
                                                    <item.icon className="h-6 w-6 text-cyan-400" />
                                                </div>
                                                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                            </div>
                                            <CardTitle className="text-lg">{item.title}</CardTitle>
                                            <CardDescription>{item.desc}</CardDescription>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* App Version */}
                    <div className="text-center pt-8 border-t border-white/5">
                        <p className="text-xs text-muted-foreground font-mono">
                            FitAI Platform v1.0.0 • Build 2024.12.28<br />
                            Made with ❤️ by FitAI Engineering
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
