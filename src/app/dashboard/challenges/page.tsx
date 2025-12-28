"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trophy, Calendar, Users, Target, ArrowRight, Flame } from "lucide-react"
import { motion } from "framer-motion"

const challenges = [
    {
        id: 1,
        title: "Squattober",
        description: "100 Squats every day for the month of October.",
        participants: 1240,
        daysLeft: 12,
        progress: 65,
        joined: true,
        color: "from-orange-500/20 to-red-500/5",
        border: "border-orange-500/20",
        icon: Trophy,
        iconColor: "text-orange-500",
        bgIcon: "bg-orange-500/10"
    },
    {
        id: 2,
        title: "Dry January",
        description: "0 Alcohol, 100% Hydration. Detox your body.",
        participants: 890,
        daysLeft: 28,
        progress: 0,
        joined: false,
        color: "from-blue-500/20 to-cyan-500/5",
        border: "border-blue-500/20",
        icon: Calendar,
        iconColor: "text-blue-500",
        bgIcon: "bg-blue-500/10"
    },
    {
        id: 3,
        title: "10K Steps Daily",
        description: "Hit 10,000 steps every single day.",
        participants: 3500,
        daysLeft: 5,
        progress: 80,
        joined: true,
        color: "from-green-500/20 to-emerald-500/5",
        border: "border-green-500/20",
        icon: Target,
        iconColor: "text-green-500",
        bgIcon: "bg-green-500/10"
    }
]

export default function ChallengesPage() {
    return (
        <div className="space-y-8 h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Trophy className="h-8 w-8 text-primary" />
                        Challenges Arena
                    </h2>
                    <p className="text-muted-foreground">Push your limits. Earn exclusive badges.</p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map((challenge, i) => (
                    <motion.div
                        key={challenge.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -8 }}
                    >
                        <Card className={`glass border-white/5 relative overflow-hidden flex flex-col h-full group ${challenge.joined ? 'ring-1 ring-primary/20' : ''}`}>
                            <div className={`absolute inset-0 bg-gradient-to-br ${challenge.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />

                            {/* Particle Effect Overlay (Simulated) */}
                            {challenge.joined && <div className="absolute top-0 right-0 p-20 bg-primary/10 blur-3xl rounded-full -translate-y-10 translate-x-10" />}

                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`p-3 ${challenge.bgIcon} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                                        <challenge.icon className={`h-6 w-6 ${challenge.iconColor}`} />
                                    </div>
                                    {challenge.joined ? (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="text-[10px] font-bold bg-green-500/20 text-green-400 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1"
                                        >
                                            <Flame className="h-3 w-3" /> Active
                                        </motion.span>
                                    ) : (
                                        <span className="text-[10px] font-bold bg-white/10 text-muted-foreground px-3 py-1 rounded-full uppercase tracking-wider">Open</span>
                                    )}
                                </div>
                                <CardTitle className="text-xl group-hover:text-primary transition-colors">{challenge.title}</CardTitle>
                                <CardDescription className="line-clamp-2">{challenge.description}</CardDescription>
                            </CardHeader>

                            <CardContent className="flex-1">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
                                    <div className="flex items-center gap-1">
                                        <Users className="h-3 w-3" /> {challenge.participants.toLocaleString()}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" /> {challenge.daysLeft} days left
                                    </div>
                                </div>

                                {challenge.joined && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-white">Your Progress</span>
                                            <span className="text-primary">{challenge.progress}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${challenge.progress}%` }}
                                                transition={{ duration: 1.5, ease: "circOut" }}
                                                className="h-full bg-primary"
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter>
                                {challenge.joined ? (
                                    <Button className="w-full font-bold" variant="outline">View Leaderboard</Button>
                                ) : (
                                    <Button className="w-full font-bold" variant="neon">Join Challenge <ArrowRight className="h-4 w-4 ml-2" /></Button>
                                )}
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
