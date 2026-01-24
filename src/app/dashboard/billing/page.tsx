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
        <div className="space-y-12 h-[calc(100vh-8rem)] overflow-y-auto pr-4 no-scrollbar pb-10 relative">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <div className="text-center relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 font-mono text-[10px] uppercase tracking-[0.4em] font-black text-primary">
                        Secure Transaction Portal
                    </div>
                    <h2 className="text-5xl font-black tracking-tighter text-white flex items-center justify-center gap-4 uppercase font-heading">
                        <CreditCard className="h-10 w-10 text-primary" />
                        Resource Procurement
                    </h2>
                    <p className="text-muted-foreground mt-4 max-w-lg mx-auto font-medium leading-relaxed">
                        Authorize operational upgrades to maximize biometric potential and unlock advanced neural protocols.
                    </p>
                </motion.div>
            </div>

            {/* Current Status HUD */}
            <div className="flex justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass flex items-center gap-4 px-8 py-4 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-primary/5 animate-pulse-slow opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Shield className="h-5 w-5 text-primary" />
                    <div className="flex flex-col">
                        <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest font-black">Authentication Status</span>
                        <span className="font-heading font-black text-lg text-white uppercase tracking-tighter">Current Plan: <span className="text-primary">{currentPlan}</span></span>
                    </div>
                </motion.div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                {PLANS.map((plan, index) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -10 }}
                    >
                        <Card className={`relative h-full flex flex-col bg-black/60 backdrop-blur-3xl transition-all duration-500 rounded-[2.5rem] border-2 shadow-2xl overflow-hidden group ${plan.popular ? "border-primary/50 shadow-primary/20" : "border-white/5"}`}>
                            {plan.popular && (
                                <div className="absolute top-0 right-0 p-4">
                                    <Badge className="bg-primary text-black font-black text-[9px] px-3 py-1 rounded-xl shadow-2xl animate-pulse">RECOMMENDED_OPS</Badge>
                                </div>
                            )}

                            {/* HUD Corners */}
                            <div className={`absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 transition-colors opacity-30 group-hover:opacity-100 ${plan.popular ? "border-primary" : "border-white/20"}`} />
                            <div className={`absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 transition-colors opacity-30 group-hover:opacity-100 ${plan.popular ? "border-primary" : "border-white/20"}`} />

                            <CardHeader className="text-center pt-10 pb-6 relative z-10">
                                <div className={`mx-auto h-16 w-16 rounded-2xl ${plan.bgColor} flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform shadow-inner`}>
                                    <plan.icon className={`h-8 w-8 ${plan.color}`} />
                                </div>
                                <CardTitle className={`text-4xl font-black font-heading uppercase tracking-tighter ${plan.color}`}>{plan.name}</CardTitle>
                                <CardDescription className="font-mono text-[9px] uppercase tracking-widest font-black text-muted-foreground mt-2 opacity-60 group-hover:opacity-100 transition-opacity">{plan.description}</CardDescription>
                                <div className="mt-8 flex items-baseline justify-center gap-1">
                                    <span className="text-5xl font-black text-white tracking-tighter font-heading">{plan.price}</span>
                                    <span className="text-xs font-mono font-black uppercase tracking-widest text-muted-foreground opacity-40">{plan.period}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 px-8 relative z-10">
                                <ul className="space-y-4">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm">
                                            <div className={`h-5 w-5 rounded-lg flex items-center justify-center ${plan.popular ? "bg-primary/20" : "bg-white/5"}`}>
                                                <Check className={`h-3 w-3 ${plan.color} stroke-[3px]`} />
                                            </div>
                                            <span className="text-white/70 font-bold group-hover:text-white transition-colors">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter className="p-8 relative z-10">
                                <Button
                                    className={`w-full h-16 text-lg font-black rounded-2xl shadow-2xl transition-all uppercase tracking-widest font-heading ${plan.popular ? "bg-primary text-black hover:bg-emerald-400 hover:scale-[1.03]" : "bg-white/[0.03] text-white/50 border-white/5 hover:bg-white/10"}`}
                                    variant={plan.popular ? "neon" : "outline" as any}
                                    disabled={plan.disabled || loading === plan.id}
                                    onClick={() => handleSubscribe(plan.id, plan.priceId, (plan as any).trialEnabled)}
                                >
                                    {loading === plan.id ? (
                                        <>
                                            <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                                            SYNCING...
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
