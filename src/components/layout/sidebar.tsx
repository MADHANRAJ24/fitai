"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Activity, Utensils, Zap, Settings, LogOut, Dumbbell, ScanFace, Calendar, Users, Book, Sparkles, Watch, Beaker, Wallet, Sword, ChefHat } from "lucide-react"
import { useAuth } from "@/context/auth-context"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    const { signOut } = useAuth()

    const routes = [
        {
            label: "Overview",
            icon: LayoutDashboard,
            href: "/dashboard",
            color: "text-sky-500",
        },
        {
            label: "Workouts",
            icon: Dumbbell,
            href: "/dashboard/workouts",
            color: "text-violet-500",
        },
        {
            label: "Smart Schedule",
            icon: Calendar,
            href: "/dashboard/schedule",
            color: "text-blue-500",
        },
        {
            label: "Habits",
            icon: Book,
            href: "/dashboard/habits",
            color: "text-emerald-400",
        },
        {
            label: "Nutrition",
            icon: Utensils,
            href: "/dashboard/nutrition",
            color: "text-pink-700",
        },
        {
            label: "AI Diet Chef",
            icon: ChefHat,
            href: "/dashboard/diet",
            color: "text-yellow-500",
        },
        {
            label: "AI Scanner",
            icon: ScanFace,
            href: "/dashboard/scan",
            color: "text-emerald-500",
        },
        {
            label: "AI Coach",
            icon: Zap,
            href: "/dashboard/coach",
            color: "text-orange-700",
        },
        {
            label: "Community",
            icon: Users,
            href: "/dashboard/community",
            color: "text-indigo-500",
        },
        {
            label: "AI Vision Trainer",
            icon: ScanFace,
            href: "/dashboard/vision",
            color: "text-red-500",
        },
        {
            label: "Device Sync",
            icon: Watch,
            href: "/dashboard/wearables",
            color: "text-pink-500",
        },
        {
            label: "Bio-Lab",
            icon: Beaker,
            href: "/dashboard/bio",
            color: "text-cyan-400",
        },
        {
            label: "Finance ROI",
            icon: Wallet,
            href: "/dashboard/finance",
            color: "text-emerald-400",
        },
        {
            label: "RPG Protocol",
            icon: Sword,
            href: "/dashboard/rpg",
            color: "text-purple-500",
        },
        {
            label: "Ego Chamber",
            icon: Sword,
            href: "/dashboard/ego",
            color: "text-orange-600",
        },
        {
            label: "Profile",
            icon: Activity,
            href: "/dashboard/profile",
            color: "text-teal-500",
        },
        {
            label: "Billing",
            icon: Wallet,
            href: "/dashboard/billing",
            color: "text-yellow-500",
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/dashboard/settings",
        },
    ]

    return (
        <div className="w-64 glass-panel h-screen flex flex-col fixed left-0 top-0">
            <div className="p-6">
                <div className="flex items-center gap-2 font-bold text-xl text-white tracking-widest uppercase font-heading">
                    <div className="h-8 w-8 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        <Dumbbell className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">FitAI</span>
                </div>
            </div>

            <div className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-xl transition-all duration-300 relative overflow-hidden",
                            pathname === route.href
                                ? "text-white bg-primary/10 border border-primary/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                                : "text-zinc-400 hover:text-white hover:bg-white/5 hover:border-white/10 border border-transparent"
                        )}
                    >
                        {pathname === route.href && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_#10b981]" />
                        )}
                        <div className="flex items-center flex-1 relative z-10">
                            <route.icon className={cn("h-5 w-5 mr-3 transition-colors", pathname === route.href ? "text-primary" : "group-hover:text-white", route.color)} />
                            <span className={pathname === route.href ? "text-shadow-sm font-semibold" : ""}>{route.label}</span>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="p-3 w-full pb-safe-bottom">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent rounded-xl"
                    onClick={() => signOut()}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div >
    )
}
