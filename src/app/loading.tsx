"use client"

import { Zap, Loader2 } from "lucide-react"

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl">
            <div className="relative w-24 h-24">
                {/* Spinning Outer Ring */}
                <div className="absolute inset-0 border-4 border-white/5 border-t-primary rounded-full animate-spin" />

                {/* Inner Pulsing Core */}
                <div className="absolute inset-4 bg-primary/20 rounded-full animate-pulse flex items-center justify-center">
                    <Zap className="h-8 w-8 text-primary animate-bounce shadow-lg" />
                </div>

                {/* Scanning Line */}
                <div className="absolute inset-0 overflow-hidden rounded-full">
                    <div className="w-full h-1 bg-white/50 absolute top-0 animate-[scan_2s_ease-in-out_infinite]" />
                </div>
            </div>

            <div className="mt-8 space-y-2 text-center">
                <h2 className="text-xl font-bold text-white font-heading tracking-[0.2em] animate-pulse">SYSTEM INITIALIZING</h2>
                <div className="text-xs text-primary/70 font-mono flex items-center gap-2 justify-center">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>LOADING MODULES...</span>
                </div>
            </div>
        </div>
    )
}
