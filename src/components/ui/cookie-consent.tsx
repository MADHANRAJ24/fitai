"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Cookie } from "lucide-react"

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Check local storage to see if already consented
        const consented = localStorage.getItem("cookie_consent")
        if (!consented) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem("cookie_consent", "true")
        setIsVisible(false)
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 p-4 z-[100]"
                >
                    <div className="max-w-4xl mx-auto glass border-white/10 rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-full">
                                <Cookie className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-white font-medium">We use cookies</h3>
                                <p className="text-sm text-muted-foreground">To ensure you get the best experience on our website. <a href="/legal/privacy" className="text-primary hover:underline">Read Policy</a></p>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <Button variant="ghost" onClick={() => setIsVisible(false)} className="flex-1 md:flex-none">
                                Decline
                            </Button>
                            <Button onClick={handleAccept} className="flex-1 md:flex-none bg-primary text-black hover:bg-primary/90">
                                Accept All
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
