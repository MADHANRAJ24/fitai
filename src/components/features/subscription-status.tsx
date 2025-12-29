"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { SubscriptionService } from "@/services/subscription-service"
import { useRouter } from "next/navigation"

export function SubscriptionStatus() {
    const router = useRouter()
    const [hasChecked, setHasChecked] = useState(false)

    useEffect(() => {
        if (hasChecked) return

        const checkStatus = async () => {
            // Only check if user is logged in
            const currentSub = await SubscriptionService.getCurrentSubscription()
            if (!currentSub) return

            const { expiringSoon, daysLeft, expired } = await SubscriptionService.checkExpirationStatus()

            if (expired) {
                toast.error("Subscription Expired", {
                    description: "Your plan has expired. Please renew to regain access.",
                    action: {
                        label: "Renew",
                        onClick: () => router.push("/dashboard/billing")
                    },
                    duration: 10000
                })
            } else if (expiringSoon) {
                toast.warning("Subscription Expiring Soon via Email", {
                    description: `Your plan expires in ${daysLeft} days. Renew now to avoid interruption.`,
                    action: {
                        label: "Renew",
                        onClick: () => router.push("/dashboard/billing")
                    },
                    duration: 8000
                })
            }

            setHasChecked(true)
        }

        checkStatus()
    }, [hasChecked, router])

    return null // Invisible component, logic only
}
