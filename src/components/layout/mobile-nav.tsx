"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Activity, Scan, User, Sparkles, Grid, X, LayoutDashboard, Dumbbell, Calendar, Book, Utensils, ChefHat, ScanFace, Zap, Users, Watch, Beaker, Wallet, Sword, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function MobileNav() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    const mainLinks = [
        { href: "/dashboard", icon: Home, label: "Home" },
        { href: "/dashboard/scan", icon: Scan, label: "AI Scan" },
        { type: "trigger", icon: Grid, label: "Menu" }, // Trigger for full menu
        { href: "/dashboard/diet", icon: ChefHat, label: "AI Cook" },
        { href: "/dashboard/profile", icon: User, label: "Profile" },
    ]

    const allFeatures = [
        { label: "Overview", icon: LayoutDashboard, href: "/dashboard", color: "text-sky-500" },
        { label: "Workouts", icon: Dumbbell, href: "/dashboard/workouts", color: "text-violet-500" },
        { label: "Smart Schedule", icon: Calendar, href: "/dashboard/schedule", color: "text-blue-500" },
        { label: "Habits", icon: Book, href: "/dashboard/habits", color: "text-emerald-400" },
        { label: "Nutrition", icon: Utensils, href: "/dashboard/nutrition", color: "text-pink-700" },
        { label: "AI Diet Chef", icon: ChefHat, href: "/dashboard/diet", color: "text-yellow-500" },
        { label: "AI Scanner", icon: ScanFace, href: "/dashboard/scan", color: "text-emerald-500" },
        { label: "AI Coach", icon: Zap, href: "/dashboard/coach", color: "text-orange-700" },
        { label: "Community", icon: Users, href: "/dashboard/community", color: "text-indigo-500" },
        { label: "AI Vision", icon: ScanFace, href: "/dashboard/vision", color: "text-red-500" },
        { label: "Device Sync", icon: Watch, href: "/dashboard/wearables", color: "text-pink-500" },
        { label: "Bio-Lab", icon: Beaker, href: "/dashboard/bio", color: "text-cyan-400" },
        { label: "Finance ROI", icon: Wallet, href: "/dashboard/finance", color: "text-emerald-400" },
        { label: "RPG Protocol", icon: Sword, href: "/dashboard/rpg", color: "text-purple-500" },
        { label: "Ego Chamber", icon: Sword, href: "/dashboard/ego", color: "text-orange-600" },
        { label: "Billing", icon: Wallet, href: "/dashboard/billing", color: "text-yellow-500" },
        { label: "Settings", icon: Settings, href: "/dashboard/settings", color: "text-gray-400" },
    ]

    return (
        <>
            {/* Full Screen Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl pt-safe-top pb-24 px-6 overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-8 mt-4">
                            <h2 className="text-2xl font-bold text-white tracking-tight">All Features</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {allFeatures.map((feature, i) => (
                                <Link
                                    key={feature.href}
                                    href={feature.href}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all gap-3 text-center h-32"
                                    >
                                        <div className={`p-3 rounded-full bg-black/50 ${feature.color}`}>
                                            <feature.icon className="h-6 w-6" />
                                        </div>
                                        <span className="text-xs font-medium text-white/80">{feature.label}</span>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pointer-events-none transform-gpu translate-z-0">
                {/* Float above safe area */}
                <div className="glass pointer-events-auto border-t border-primary/20 bg-black/60 backdrop-blur-xl pb-safe-bottom shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
                    <div className="grid grid-cols-5 h-[64px] items-center">
                        {mainLinks.map((link) => {
                            const Icon = link.icon
                            // If it's the menu trigger, check if menu is open. If standard link, check pathname.
                            const isActive = link.type === "trigger" ? isOpen : pathname === link.href

                            if (link.type === "trigger") {
                                return (
                                    <button
                                        key="menu-trigger"
                                        onClick={() => setIsOpen(!isOpen)}
                                        className={cn(
                                            "flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform",
                                            isActive ? "text-primary" : "text-muted-foreground hover:text-white"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-2 rounded-full transition-all duration-200",
                                            isActive ? "bg-primary/20 shadow-[0_0_15px_-3px_rgba(255,255,255,0.3)] scale-110" : "bg-white/5"
                                        )}>
                                            {isOpen ? <X className="h-5 w-5 fill-current" /> : <Grid className="h-5 w-5 fill-current" />}
                                        </div>
                                        {/* Label hidden for trigger or kept minimal */}
                                    </button>
                                )
                            }

                            return (
                                <Link
                                    key={link.href!}
                                    href={link.href!}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform",
                                        isActive ? "text-primary" : "text-muted-foreground hover:text-white"
                                    )}
                                >
                                    <Icon className={cn("h-6 w-6 transition-all", isActive && "fill-current scale-110")} />
                                    <span className={cn(
                                        "text-[10px] font-medium transition-opacity",
                                        isActive ? "opacity-100" : "opacity-70"
                                    )}>{link.label}</span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}
