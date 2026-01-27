"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dumbbell, LayoutDashboard, User, LogOut, CreditCard } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
    const pathname = usePathname()

    const navItems = [
        { name: "Home", href: "/", icon: Dumbbell },
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Profile", href: "/profile", icon: User },
    ]

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 pt-safe-top transition-all duration-300">
            <div className="glass absolute inset-0 -z-10 rounded-b-xl" />

            <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Dumbbell className="h-6 w-6" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-gradient">
                    FitAI (v6)
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
                <AuthButtons />
            </div>
        </header>
    )
}

function AuthButtons() {
    const { user, signIn, signOut, loading } = useAuth()
    const router = useRouter() // Need to move useRouter to Navbar or pass it? Navbar already has it.

    // Check if we need to redirect after login? 
    // Usually handled by Supabase callback or state change.

    if (loading) {
        return <div className="h-8 w-8 animate-pulse bg-white/10 rounded-full" />
    }

    if (user) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-white/10">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                            <AvatarFallback className="bg-primary/20 text-primary">
                                {user.email?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem onClick={() => window.location.href = '/dashboard/profile'}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/dashboard/billing'}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Billing</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={signOut} className="text-red-500 focus:text-red-500">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign Out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex"
                onClick={signIn}
            >
                Sign In (v24 - Native)
            </Button>
            <Link href="/onboarding">
                <Button variant="neon" size="default">
                    Get Started
                </Button>
            </Link>
        </>
    )
}
