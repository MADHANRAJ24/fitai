"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, Zap, Crown, Star, Loader2, Shield, CreditCard, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { trialService, TrialData } from "@/services/trial-service"
import { RazorpayModal } from "@/components/features/razorpay-modal"

const PLANS = [
    {
        id: "free",
        name: "Starter",
        price: "$0",
        period: "forever",
        description: "Get started with basic features",
        icon: Star,
        color: "text-gray-400",
        bgColor: "bg-white/5",
        borderColor: "border-white/10",
        features: [
            "3 Workouts per week",
            "Basic AI Coach",
            "Habit Tracker",
            "Community Access",
        ],
        cta: "Current Plan",
        disabled: true,
    },
    {
        id: "pro",
        name: "Pro",
        price: "$9.99",
        period: "/month",
        description: "Unlock your full potential",
        icon: Zap,
        color: "text-primary",
        bgColor: "bg-primary/10",
        borderColor: "border-primary/50",
        popular: true,
        features: [
            "Unlimited Workouts",
            "Advanced AI Coach",
            "AI Diet Chef",
            "AI Vision Trainer",
            "Smart Schedule",
            "Priority Support",
        ],
        cta: "Start 7-Day Free Trial",
        trialEnabled: true,
        priceId: "pro_monthly",
    },
    {
        id: "elite",
        name: "Elite",
        price: "$79.99",
        period: "/year",
        description: "Best value - save 33%",
        icon: Crown,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/50",
        features: [
            "Everything in Pro",
            "1-on-1 Coaching Calls",
            "Custom Meal Plans",
            "Wearable Integration",
            "Bio-Lab Analytics",
            "RPG Exclusive Perks",
            "Early Access Features",
        ],
        cta: "Go Elite",
        priceId: "elite_yearly",
    },
]

export default function BillingPage() {
    const [loading, setLoading] = useState<string | null>(null)
    const [currentPlan, setCurrentPlan] = useState("free")
    const [trialData, setTrialData] = useState<TrialData | null>(null)
    const [daysRemaining, setDaysRemaining] = useState(0)

    // Razorpay modal state
    const [razorpayOpen, setRazorpayOpen] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string } | null>(null)

    useEffect(() => {
        loadTrialStatus()
    }, [])

    const loadTrialStatus = async () => {
        const trial = await trialService.getTrialData()
        setTrialData(trial)

        if (trial?.isActive) {
            setCurrentPlan("pro_trial")
            const days = await trialService.getTrialDaysRemaining()
            setDaysRemaining(days)
        }
    }

    const handleSubscribe = async (planId: string, priceId?: string, trialEnabled?: boolean) => {
        if (!priceId) {
            toast.info("This is your current plan")
            return
        }

        setLoading(planId)

        try {
            // If trial is enabled, try to start free trial
            if (trialEnabled) {
                toast.loading("Checking eligibility...", { id: "trial" })

                const canStart = await trialService.canStartTrial()
                toast.dismiss("trial")

                if (!canStart.allowed) {
                    toast.error("Trial not available", {
                        description: canStart.reason
                    })
                    setLoading(null)
                    return
                }

                // Start the trial
                const result = await trialService.startTrial()

                if (result.success) {
                    // Save to Supabase
                    const { SubscriptionService } = await import("@/services/subscription-service")
                    const now = new Date()
                    const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

                    await SubscriptionService.saveSubscription({
                        plan_name: 'pro_trial',
                        status: 'active',
                        start_date: now.toISOString(),
                        end_date: trialEnd.toISOString(),
                        provider: 'manual' // or 'trial'
                    })

                    toast.success("🎉 7-Day Free Trial Activated!", {
                        description: "Enjoy all Pro features. No credit card required.",
                        duration: 5000
                    })
                    setCurrentPlan("pro_trial")
                    setDaysRemaining(7)
                    setTrialData(result.data!)
                } else {
                    toast.error(result.error || "Failed to start trial")
                }
            } else {
                // Open Razorpay payment modal
                const plan = PLANS.find(p => p.id === planId)
                if (plan) {
                    setSelectedPlan({ name: plan.name, price: plan.price })
                    setRazorpayOpen(true)
                }
            }
        } catch (error) {
            toast.dismiss("trial")
            toast.dismiss("payment")
            toast.error("Something went wrong. Please try again.")
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="space-y-8 h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
            <div className="text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white flex items-center justify-center gap-3">
                        <CreditCard className="h-8 w-8 text-primary" />
                        Choose Your Plan
                    </h2>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                        Unlock premium features to accelerate your fitness journey
                    </p>
                </motion.div>
            </div>

            {/* Current Plan Badge */}
            <div className="flex justify-center">
                <Badge variant="outline" className="text-sm px-4 py-2 gap-2">
                    <Shield className="h-4 w-4" />
                    Current Plan: <span className="font-bold text-primary capitalize">{currentPlan}</span>
                </Badge>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {PLANS.map((plan, index) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className={`relative h-full flex flex-col ${plan.bgColor} ${plan.borderColor} border-2 ${plan.popular ? "ring-2 ring-primary ring-offset-2 ring-offset-black" : ""}`}>
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-primary text-black font-bold">MOST POPULAR</Badge>
                                </div>
                            )}
                            <CardHeader className="text-center pb-2">
                                <div className={`mx-auto h-12 w-12 rounded-full ${plan.bgColor} flex items-center justify-center mb-2`}>
                                    <plan.icon className={`h-6 w-6 ${plan.color}`} />
                                </div>
                                <CardTitle className={`text-xl ${plan.color}`}>{plan.name}</CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                                    <span className="text-muted-foreground">{plan.period}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm">
                                            <Check className={`h-4 w-4 ${plan.color} flex-shrink-0`} />
                                            <span className="text-white/80">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className={`w-full ${plan.popular ? "bg-primary text-black hover:bg-primary/90" : ""}`}
                                    variant={plan.popular ? "default" : "outline"}
                                    disabled={plan.disabled || loading === plan.id}
                                    onClick={() => handleSubscribe(plan.id, plan.priceId, (plan as any).trialEnabled)}
                                >
                                    {loading === plan.id ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        plan.cta
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 pt-8 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Secure Payments</span>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-2xl mx-auto pt-8">
                <h3 className="text-lg font-bold text-white text-center mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <h4 className="font-medium text-white">What payment methods are accepted?</h4>
                        <p className="text-sm text-muted-foreground mt-1">We accept all major credit/debit cards, UPI, and net banking through Razorpay.</p>
                    </div>
                </div>
            </div>

            {/* Razorpay Payment Modal */}
            {selectedPlan && (
                <RazorpayModal
                    isOpen={razorpayOpen}
                    onClose={() => {
                        setRazorpayOpen(false)
                        setLoading(null)
                    }}
                    planName={selectedPlan.name}
                    price={selectedPlan.price}
                    onSuccess={async () => {
                        setCurrentPlan(selectedPlan.name.toLowerCase())

                        // Save to LocalStorage (Legacy/Backup)
                        localStorage.setItem("fitai_subscription", JSON.stringify({
                            plan: selectedPlan.name.toLowerCase(),
                            activatedAt: new Date().toISOString()
                        }))

                        // Save to Supabase via Service
                        const { SubscriptionService } = await import("@/services/subscription-service")
                        const now = new Date()
                        const oneYearLater = new Date(now)
                        oneYearLater.setFullYear(now.getFullYear() + 1)

                        // Assume Elite is Yearly for this context, Pro is Monthly
                        const isYearly = selectedPlan.name.toLowerCase() === 'elite'
                        const endDate = new Date(now)
                        if (isYearly) endDate.setFullYear(now.getFullYear() + 1)
                        else endDate.setMonth(now.getMonth() + 1)

                        await SubscriptionService.saveSubscription({
                            plan_name: selectedPlan.name.toLowerCase(),
                            status: 'active',
                            start_date: now.toISOString(),
                            end_date: endDate.toISOString(),
                            provider: 'razorpay'
                        })

                        toast.success(`🎉 Welcome to ${selectedPlan.name}!`, {
                            description: "All premium features are now unlocked."
                        })
                    }}
                />
            )}
        </div>
    )
}
