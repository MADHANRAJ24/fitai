"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Flame, TrendingUp, Users, Award, Star, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SocialFeed } from "@/components/features/social-feed"
import { motion } from "framer-motion"

export default function CommunityPage() {
    const leaderboard = [
        { rank: 1, name: "Sarah Connor", xp: 12500, streak: 45, avatar: "SC" },
        { rank: 2, name: "John Wick", xp: 11200, streak: 32, avatar: "JW" },
        { rank: 3, name: "You", xp: 8900, streak: 12, avatar: "ME", isMe: true },
        { rank: 4, name: "Bruce Wayne", xp: 8750, streak: 21, avatar: "BW" },
        { rank: 5, name: "Diana Prince", xp: 8200, streak: 8, avatar: "DP" },
    ]

    return (
        <div className="space-y-8 h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Users className="h-8 w-8 text-primary" />
                        Community
                    </h2>
                    <p className="text-muted-foreground">Compete, share, and grow together.</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="neon" className="gap-2">
                        <Share2 className="h-4 w-4" /> Invite Friends
                    </Button>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Leaderboard */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 space-y-6"
                >
                    <Card className="glass border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-primary/5 blur-3xl rounded-full translate-x-12 -translate-y-12" />
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-yellow-500" />
                                Weekly Leaderboard
                            </CardTitle>
                            <CardDescription>Top performers this week. Reset in 2 days.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {leaderboard.map((user, index) => (
                                <motion.div
                                    key={user.rank}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + (index * 0.1) }}
                                    whileHover={{ scale: 1.02, x: 10 }}
                                    className={`flex items-center p-4 rounded-xl border transition-all cursor-pointer ${user.isMe
                                        ? "bg-primary/20 border-primary/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                                        : "bg-white/5 border-white/10 hover:bg-white/10"
                                        }`}
                                >
                                    <div className={`font-bold w-8 text-center flex items-center justify-center ${user.rank <= 3 ? "text-yellow-500 scale-125" : "text-muted-foreground"}`}>
                                        {user.rank === 1 && <Trophy className="h-5 w-5 text-yellow-500" />}
                                        {user.rank === 2 && <Medal className="h-5 w-5 text-gray-400" />}
                                        {user.rank === 3 && <Medal className="h-5 w-5 text-orange-700" />}
                                        {user.rank > 3 && user.rank}
                                    </div>
                                    <Avatar className="h-10 w-10 ml-4 border border-white/10">
                                        <AvatarFallback className={user.isMe ? "bg-primary text-black font-bold" : "bg-white/10 text-white font-bold"}>
                                            {user.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="ml-4 flex-1">
                                        <div className={`font-bold ${user.isMe ? "text-primary" : "text-white"}`}>{user.name}</div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Flame className="h-3 w-3 text-orange-500" /> {user.streak} day streak
                                        </div>
                                    </div>
                                    <div className="font-bold text-white tabular-nums px-3 py-1 rounded bg-black/20">
                                        {user.xp.toLocaleString()} XP
                                    </div>
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Side Panel: Achievements & Feed */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="glass border-white/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5 text-purple-500" />
                                    Your Badges
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10", label: "7 Day Streak" },
                                        { icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10", label: "Improver" },
                                        { icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Top 10%" },
                                    ].map((badge, i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            className={`flex flex-col items-center justify-center p-3 rounded-xl border border-white/5 ${badge.bg} text-center cursor-help`}
                                        >
                                            <badge.icon className={`h-6 w-6 ${badge.color} mb-1`} />
                                            <span className="text-[10px] font-medium text-white/80 leading-tight">{badge.label}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <SocialFeed />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
