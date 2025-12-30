"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { X, Zap, ExternalLink } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function AdBanner() {
    const { user } = useAuth()
    const [isVisible, setIsVisible] = useState(true)
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    // Don't show if loading or not client
    if (!isClient) return null

    // Determine if user is premium
    // Logic: If user has a plan that contains 'pro' or 'elite', they are premium
    const plan = user?.app_metadata?.plan || 'free'
    const isPremium = plan.includes('pro') || plan.includes('elite')

    // If premium or banner dismissed, don't show
    if (isPremium || !isVisible) return null

    return (
        <div className="fixed bottom-[80px] md:bottom-4 left-0 right-0 z-40 px-4 md:px-8 pointer-events-none">
            <div className="max-w-4xl mx-auto bg-zinc-900/90 backdrop-blur-md border border-white/10 rounded-lg shadow-lg overflow-hidden pointer-events-auto flex items-center justify-between p-3 md:p-4 animate-in slide-in-from-bottom-5 duration-500">

                {/* Internal Ad: Upgrade Call to Action */}
                <div className="flex items-center gap-3 md:gap-4 flex-1">
                    <div className="h-10 w-10 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 animate-pulse">
                        <Zap className="h-6 w-6 text-white text-shadow" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-sm md:text-base truncate">
                            Remove Ads & Unlock AI Coach
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                            Get 50% Off Annual Plan Today!
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 md:gap-3 ml-2">
                    {/* Google Ad Placeholder (Hidden for now, logic ready) */}
                    {/* <div id="google-ad-slot" className="hidden md:block w-[320px] h-[50px] bg-white/5" /> */}

                    <Link href="/dashboard/billing">
                        <Button size="sm" className="bg-white text-black hover:bg-white/90 font-bold whitespace-nowrap">
                            Upgrade <span className="hidden sm:inline ml-1">Now</span>
                        </Button>
                    </Link>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="h-4 w-4 text-white/50" />
                    </button>
                </div>
            </div>
        </div>
    )
}
