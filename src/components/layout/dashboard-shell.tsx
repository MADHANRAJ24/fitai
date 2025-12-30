"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { AdBanner } from "@/components/features/ad-banner"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push("/")
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-background relative selection:bg-primary/20">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none fixed" />
            <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none fixed" />

            <div className="ml-0 lg:ml-64 p-8">
                {children}
                <AdBanner />
            </div>
        </div>
    )
}
