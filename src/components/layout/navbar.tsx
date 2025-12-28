"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dumbbell, LayoutDashboard, User } from "lucide-react"

export function Navbar() {
    const pathname = usePathname()

    const navItems = [
        { name: "Home", href: "/", icon: Dumbbell },
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Profile", href: "/profile", icon: User },
    ]

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
            <div className="glass absolute inset-0 -z-10 rounded-b-xl" />

            <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Dumbbell className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold tracking-tight text-gradient">
                    FitAI
                </span>
            </div>

            <nav className="hidden md:flex items-center gap-1 bg-black/40 rounded-full px-4 py-2 border border-white/10 backdrop-blur-md">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 -z-10 rounded-full bg-white/10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="hidden sm:flex">
                        Sign In
                    </Button>
                </Link>
                <Link href="/onboarding">
                    <Button variant="neon" size="sm">
                        Get Started
                    </Button>
                </Link>
            </div>
        </header>
    )
}
