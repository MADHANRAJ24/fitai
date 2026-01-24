"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Scale, Ruler, Activity, Heart, Utensils, ChevronRight, ChevronLeft, Check, Save, Camera, History, Trophy, Flame, Medal, Edit2, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { bodyProfileService, BodyProfile, BODY_CONDITIONS } from "@/services/body-profile-service"
import { ActivityService, ActivityItem } from "@/services/activity-service"

export default function ProfilePage() {
    const [profile, setProfile] = useState<Partial<BodyProfile>>({
        height: 170, weight: 70, age: 25, gender: 'male', fitnessLevel: 'intermediate', goal: 'maintain', conditions: [],
        dietary: { preference: 'non-veg', allergies: [], dailyCalorieTarget: 2000 },
        photoUrl: ''
    })
    const [isLoaded, setIsLoaded] = useState(false)
    const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
    const [isEditing, setIsEditing] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Load Data
    // Load Data & Listen for Sync
    useEffect(() => {
        const load = () => {
            const existingProfile = bodyProfileService.getProfile()
            if (existingProfile) setProfile(existingProfile)
            setRecentActivity(ActivityService.getActivities())
            setIsLoaded(true)
        }

        load()

        window.addEventListener('user_updated', load)
        window.addEventListener('storage_restored', load)
        return () => {
            window.removeEventListener('user_updated', load)
            window.removeEventListener('storage_restored', load)
        }
    }, [])

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 4 * 1024 * 1024) { return toast.error("Image too large (Max 4MB)") }
            const reader = new FileReader()
            reader.onloadend = () => {
                const newUrl = reader.result as string
                const updated = { ...profile, photoUrl: newUrl }
                setProfile(updated)
                // IMMEDIATE SAVE
                bodyProfileService.saveProfile(updated as BodyProfile)
                toast.success("Profile photo updated!")
            }
            reader.readAsDataURL(file)
        }
    }

    const saveChanges = () => {
        if (!profile.height || profile.height <= 50 || profile.height > 250) return toast.error("Height must be between 50cm and 250cm")
        if (!profile.weight || profile.weight <= 20 || profile.weight > 300) return toast.error("Weight must be between 20kg and 300kg")
        if (!profile.age || profile.age <= 10 || profile.age > 100) return toast.error("Age must be between 10 and 100")

        bodyProfileService.saveProfile(profile as BodyProfile)
        setIsEditing(false)
        toast.success("Profile updated successfully")
    }

    // Gamification Logic
    const calculateLevel = () => {
        const baseXP = recentActivity.reduce((acc, curr) => acc + (curr.calories || 10), 0)
        const level = Math.floor(baseXP / 1000) + 1
        const progress = (baseXP % 1000) / 10
        return { level, progress, totalXP: baseXP }
    }
    const stats = calculateLevel()

    const bmiData = profile.height && profile.weight ? bodyProfileService.calculateBMI(profile as BodyProfile) : null

    if (!isLoaded) return <div className="flex h-full items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" /></div>

    if (isEditing) {
        return (
            <div className="space-y-6 h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar p-1">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}><X className="h-5 w-5" /></Button>
                </div>

                <div className="space-y-4">
                    {/* Basic Inputs */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-muted-foreground">Height (cm)</label>
                            <input type="number" value={profile.height} onChange={e => setProfile({ ...profile, height: +e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-muted-foreground">Weight (kg)</label>
                            <input type="number" value={profile.weight} onChange={e => setProfile({ ...profile, weight: +e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-muted-foreground">Age</label>
                            <input type="number" value={profile.age} onChange={e => setProfile({ ...profile, age: +e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-muted-foreground">Gender</label>
                            <select value={profile.gender} onChange={e => setProfile({ ...profile, gender: e.target.value as any })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Fitness Goal</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['lose_weight', 'build_muscle', 'maintain', 'endurance'].map(g => (
                                <button key={g} onClick={() => setProfile({ ...profile, goal: g as any })}
                                    className={`p-3 rounded-xl border capitalize ${profile.goal === g ? "bg-primary text-black border-primary" : "bg-white/5 border-white/10 text-white"}`}>
                                    {g.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                    <Button onClick={saveChanges} className="w-full font-bold">Save Changes</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
            {/* Header Card (Gamer ID) */}
            <div className="relative rounded-3xl overflow-hidden glass-card p-6 md:p-8 group shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                <div className="absolute top-0 right-0 p-4 z-20">
                    <Button variant="ghost" size="icon" className="text-white/50 hover:text-white hover:bg-white/10" onClick={() => setIsEditing(true)}>
                        <Edit2 className="h-5 w-5" />
                    </Button>
                </div>

                {/* ID Card Decoration */}
                <div className="absolute top-4 left-4 w-20 h-20 border-t-2 border-l-2 border-primary/20 rounded-tl-3xl pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-20 h-20 border-b-2 border-r-2 border-accent/20 rounded-br-3xl pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-50 pointer-events-none" />

                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    {/* Avatar Logic (Top Tier Gamer) */}
                    <div className="relative group">
                        <div className="w-36 h-36 rounded-full p-1 bg-gradient-to-br from-primary via-emerald-400 to-teal-500 shadow-[0_0_25px_rgba(16,185,129,0.4)] animate-pulse-slow relative z-10">
                            <div className="w-full h-full rounded-full overflow-hidden bg-black relative border-4 border-black">
                                {profile.photoUrl ? (
                                    <img src={profile.photoUrl} alt="User" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-900"><User className="h-12 w-12 text-zinc-500" /></div>
                                )}
                                {/* Upload Overlay */}
                                <div onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                                    <Camera className="h-8 w-8 text-white drop-shadow-md" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black border border-primary/50 px-4 py-1 rounded-full text-sm font-bold text-primary shadow-lg z-20 tracking-widest font-heading uppercase flex items-center gap-1">
                            Lvl <span className="text-white text-base">{stats.level}</span>
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    </div>

                    <div className="text-center md:text-left space-y-3 flex-1">
                        <div>
                            <h1 className="text-4xl font-bold text-white font-heading tracking-wide uppercase text-shadow-sm">Fitness Warrior</h1>
                            <p className="text-primary font-mono text-xs tracking-[0.2em] uppercase opacity-80">Class: {profile.fitnessLevel || "Recruit"}</p>
                        </div>

                        <div className="flex items-center gap-4 justify-center md:justify-start text-sm text-muted-foreground font-medium bg-black/30 w-fit mx-auto md:mx-0 px-4 py-2 rounded-lg border border-white/5">
                            <span className="capitalize flex items-center gap-1"><User className="h-3 w-3" /> {profile.gender}</span>
                            <span className="w-1 h-1 bg-white/20 rounded-full" />
                            <span>{profile.age} Years</span>
                            <span className="w-1 h-1 bg-white/20 rounded-full" />
                            <span>{profile.height}cm</span>
                            <span className="w-1 h-1 bg-white/20 rounded-full" />
                            <span>{profile.weight}kg</span>
                        </div>

                        {/* XP Bar */}
                        <div className="w-full max-w-md space-y-1 pt-2">
                            <div className="flex justify-between text-xs text-primary font-bold font-mono tracking-wider">
                                <span>XP PROGRESS</span>
                                <span>{Math.round(stats.progress)}%</span>
                            </div>
                            <div className="h-3 w-full bg-black/50 rounded-full overflow-hidden border border-white/10 shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }} animate={{ width: `${stats.progress}%` }}
                                    className="h-full bg-gradient-to-r from-primary via-emerald-400 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                >
                                    <div className="w-full h-full bg-[linear-gradient(45deg,transparent,rgba(255,255,255,0.2),transparent)] bg-[length:10px_10px]" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Badges Row */}
                <div className="mt-8 flex gap-4 overflow-x-auto pb-2 noscroll">
                    {[
                        { icon: Trophy, color: "text-yellow-500", label: "Early Bird", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
                        { icon: Flame, color: "text-orange-500", label: "7 Day Streak", bg: "bg-orange-500/10", border: "border-orange-500/30" },
                        { icon: Medal, color: "text-blue-500", label: "Top 10%", bg: "bg-blue-500/10", border: "border-blue-500/30" },
                        { icon: Activity, color: "text-emerald-500", label: "10k Calories", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
                    ].map((badge, i) => (
                        <div key={i} className={`flex items-center gap-3 ${badge.bg} border ${badge.border} px-4 py-3 rounded-xl backdrop-blur-md flex-shrink-0 shadow-lg hover:scale-105 transition-transform cursor-default group`}>
                            <badge.icon className={`h-6 w-6 ${badge.color} drop-shadow-sm group-hover:animate-bounce`} />
                            <span className="text-xs font-bold text-white font-heading uppercase tracking-wider">{badge.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* BMI Card */}
                <div className="glass-card p-6 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-50 bg-white/5 rounded-bl-2xl backdrop-blur-md text-white">
                        <Scale className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white font-heading uppercase mb-4">Body Metrics</h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className={`text-5xl font-bold ${bmiData?.color} font-heading tracking-tighter text-glow-accent`}>{bmiData?.value || "--"}</div>
                            <div className="text-sm text-muted-foreground mt-1 font-medium">BMI Status</div>
                        </div>
                        <div className={`px-5 py-2 rounded-lg bg-white/5 border border-white/10 ${bmiData?.color} font-bold font-mono tracking-wider shadow-inner`}>
                            {bmiData?.category || "Unknown"}
                        </div>
                    </div>
                </div>

                {/* Calories Card */}
                <div className="glass-card p-6 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-50 bg-white/5 rounded-bl-2xl backdrop-blur-md text-white">
                        <Utensils className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white font-heading uppercase mb-4">Nutritional Target</h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-5xl font-bold text-primary font-heading tracking-tighter text-glow">{bodyProfileService.getRecommendedCalories(profile as BodyProfile)}</div>
                            <div className="text-sm text-muted-foreground mt-1 font-medium">Calories / Day</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card rounded-3xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-white/5">
                    <h3 className="text-lg font-bold text-white font-heading uppercase tracking-wide flex items-center gap-2">
                        <History className="h-5 w-5 text-primary" /> Training History
                    </h3>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {recentActivity.length > 0 ? recentActivity.map((activity, i) => (
                            <motion.div key={activity.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 hover:border-primary/30 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold font-heading group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                        {activity.title.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-white font-bold font-heading tracking-wide">{activity.title}</div>
                                        <div className="text-xs text-muted-foreground font-mono">{activity.date}</div>
                                    </div>
                                </div>
                                <div className="font-mono font-bold text-emerald-400 text-sm">+{activity.calories} XP</div>
                            </motion.div>
                        )) : (
                            <div className="text-center py-8 text-muted-foreground font-mono text-sm opacity-50">NO MISSION DATA RECORDED</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
