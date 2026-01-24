"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { AdMob, BannerAdPosition, BannerAdSize, BannerAdPluginEvents, AdMobBannerSize } from '@capacitor-community/admob'

export function AdBanner() {
    const [isVisible, setIsVisible] = useState(true)
    const [isPremium, setIsPremium] = useState(false)

    useEffect(() => {
        const checkPremium = () => {
            const premium = localStorage.getItem("fitai_is_premium") === "true"
            setIsPremium(premium)
            return premium
        }

        const showAd = async () => {
            const premium = checkPremium()
            if (premium) return

            try {
                await AdMob.showBanner({
                    adId: 'ca-app-pub-3061696204290590/1115965374',
                    adSize: BannerAdSize.ADAPTIVE_BANNER,
                    position: BannerAdPosition.BOTTOM_CENTER,
                    margin: 80, // Same as the fixed bottom in original UI
                    isTesting: false
                })
            } catch (error) {
                console.error('AdMob showBanner failed', error)
            }
        }

        showAd()

        return () => {
            AdMob.removeBanner()
        }
    }, [])

    if (isPremium || !isVisible) return null

    // We keep the banner container hidden if using native banners, 
    // or we can use it as a placeholder until the ad loads.
    // However, showBanner usually creates its own native view.
    return null
}
