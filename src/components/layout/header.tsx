"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Search, Menu, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { motion, AnimatePresence } from "framer-motion"

export function Header() {
    const pathname = usePathname()
    const { user } = useAuth()
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const getTitle = () => {
        if (pathname === "/dashboard") return "Overview"
        if (pathname === "/dashboard/scan") return "AI Scanner"
        if (pathname === "/dashboard/diet") return "Diet Chef"
        if (pathname === "/dashboard/profile") return "My Profile"
        if (pathname === "/dashboard/workouts") return "Workouts"
        if (pathname === "/dashboard/schedule") return "Schedule"
        return "Dashboard"
    }

    return (
        <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`fixed top-0 left-0 right-0 z-40 md:pl-64 pt-safe-top transition-all duration-300 border-b
                ${scrolled
                    ? "bg-black/90 backdrop-blur-xl border-white/10 shadow-lg"
                    : "bg-transparent border-transparent"
                }
            `}
        >
            <div className="h-16 px-6 flex items-center justify-between relative z-10">
                {/* Left: Title */}
                <div className="flex items-center gap-3">
                    <motion.h1
                        key={pathname}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xl font-bold text-white tracking-tight"
                    >
                        {getTitle()}
                    </motion.h1>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                            <Search className="h-5 w-5" />
                        </Button>

                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-primary rounded-full" />
                        </Button>

                        <div className="w-px h-6 bg-white/10 mx-2" />

                        <Link href="/dashboard/profile">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="h-9 w-9 rounded-full border border-white/20 overflow-hidden cursor-pointer bg-zinc-900"
                            >
                                {user?.user_metadata?.avatar_url || user?.user_metadata?.picture ? (
                                    <img src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture} alt="User" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-xs font-bold text-zinc-400">
                                        {user?.email?.[0].toUpperCase() || "U"}
                                    </div>
                                )}
                            </motion.div>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.header>
    )
}
