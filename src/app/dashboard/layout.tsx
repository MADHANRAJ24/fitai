"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import DashboardShell from "@/components/layout/dashboard-shell"
import { SubscriptionStatus } from "@/components/features/subscription-status"
import { SuccessOverlay } from "@/components/ui/success-overlay"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { bodyProfileService } from "@/services/body-profile-service"
import { useAuth } from "@/context/auth-context"
import { ProfileCompletionModal } from "@/components/features/profile-completion-modal"


export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    const [showProfileModal, setShowProfileModal] = useState(false)
    const { loading, isSyncing } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const checkProfile = () => {
            if (loading || isSyncing) return
            if (pathname !== '/dashboard/profile') {
                const isComplete = bodyProfileService.isProfileComplete()
                if (!isComplete) {
                    setShowProfileModal(true)
                } else {
                    setShowProfileModal(false)
                }
            } else {
                setShowProfileModal(false)
            }
        }

        checkProfile()

        // Listen for sync events (e.g. late cloud sync)
        window.addEventListener('storage_restored', checkProfile)
        window.addEventListener('user_updated', checkProfile)

        return () => {
            window.removeEventListener('storage_restored', checkProfile)
            window.removeEventListener('user_updated', checkProfile)
        }
    }, [pathname, router, loading, isSyncing])

    return (
        <div className="relative h-screen w-screen bg-transparent flex flex-col overflow-hidden">
            {/* Modal for Incomplete Profile */}
            <ProfileCompletionModal isOpen={showProfileModal} />
            <SuccessOverlay />

            {/* Desktop Sidebar (Hidden on Mobile) */}
            <div className="hidden md:block fixed left-0 top-0 bottom-0 z-50">
                <Sidebar />
            </div>

            {/* Content Area - SCROLLS INSIDE, NOT BODY */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Main Scroll View */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden md:pl-64 scroll-smooth w-full">
                    <div className="min-h-full pb-[100px] pt-safe-top pt-4"> {/* Explicit padding for Nav bars */}
                        <SubscriptionStatus />
                        <DashboardShell>{children}</DashboardShell>
                    </div>
                </main>
            </div>

            {/* Background Orbs for Depth */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[10%] right-[10%] w-[35vw] h-[35vw] bg-indigo-500/10 rounded-full blur-[100px] animate-float" />
            </div>

            {/* Live Sync Indicator */}
            <div className="fixed top-safe-top right-4 z-[60] mt-2">
                {isSyncing ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md shadow-lg shadow-primary/10">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Live Syncing</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50">System: Optimized</span>
                    </div>
                )}
            </div>

            {/* Mobile Bottom Nav (Fixed on top of everything) */}
            <MobileNav />
        </div>
    )
}
