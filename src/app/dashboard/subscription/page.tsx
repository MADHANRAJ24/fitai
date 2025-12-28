"use client"

import { useState } from "react"
import { Check, Sparkles, Zap, Crown, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Confetti } from "@/components/ui/confetti"
import { RazorpayModal } from "@/components/features/razorpay-modal"
import { Badge } from "@/components/ui/badge"

export default function SubscriptionPage() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
    const [showConfetti, setShowConfetti] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState<any>(null)

    const handleUpgrade = (plan: any) => {
        setSelectedPlan(plan)
    }

    const handlePaymentSuccess = () => {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
    }

    const plans = [
        {
            name: "Starter",
            price: "$0",
            desc: "The essentials aimed at beginners.",
            features: [
                "Manual Workout Logging",
                "Basic Dashboard Stats",
                "Community Access",
                "Limited Goal Setting"
            ],
            cta: "Current Plan",
            variant: "outline",
            icon: Zap,
            popular: false
        },
        {
            name: "Pro Athlete",
            price: billingCycle === "monthly" ? "$9.99" : "$99",
            desc: "For those serious about nutrition.",
            features: [
                "Everything in Starter",
                "AI Diet Chef (Unlimited)",
                "RPG Protocol (Gamification)",
                "Smart Schedule Generator",
                "Ad-Free Experience"
            ],
            cta: "Upgrade to Pro",
            variant: "neon",
            icon: Sparkles,
            popular: true
        },
        {
            name: "Elite Bio-Hacker",
            price: billingCycle === "monthly" ? "$19.99" : "$199",
            desc: "Full AI ecosystem access.",
            features: [
                "Everything in Pro",
                "AI Vision Trainer (Rep Count)",
                "Camera Food Scanner (Calories)",
                "Body Composition AI Analysis",
                "Bio-Lab (Future Features)"
            ],
            cta: "Go Elite",
            variant: "default",
            icon: Crown,
            popular: false
        }
    ]

    return (
        <div className="space-y-8 py-8 h-[calc(100vh-8rem)] overflow-y-auto relative custom-scrollbar">
            <Confetti trigger={showConfetti} />

            {selectedPlan && (
                <RazorpayModal
                    isOpen={!!selectedPlan}
                    onClose={() => setSelectedPlan(null)}
                    planName={selectedPlan.name}
                    price={selectedPlan.price}
                    onSuccess={handlePaymentSuccess}
                />
            )}

            <div className="text-center space-y-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Badge variant="outline" className="mb-2 border-primary/50 text-primary uppercase tracking-widest text-[10px]">Membership Plans</Badge>
                    <h2 className="text-4xl font-bold tracking-tight text-white">Unlock Your Full Potential</h2>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        Choose the plan that fits your journey. Upgrade anytime.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center justify-center gap-4 mt-6 p-1 bg-white/5 rounded-full inline-flex border border-white/10"
                >
                    <button
                        onClick={() => setBillingCycle("monthly")}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${billingCycle === "monthly" ? "bg-white text-black shadow-lg" : "text-muted-foreground hover:text-white"}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle("yearly")}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${billingCycle === "yearly" ? "bg-white text-black shadow-lg" : "text-muted-foreground hover:text-white"}`}
                    >
                        Yearly <span className="text-xs text-primary ml-1 font-bold">-20%</span>
                    </button>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                {plans.map((plan, i) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (i * 0.1), type: "spring" }}
                        whileHover={{ y: -8 }}
                    >
                        <Card className={`glass border-white/10 relative h-full flex flex-col transition-all duration-300 ${plan.popular ? "border-primary/50 shadow-[0_0_30px_rgba(34,197,94,0.1)] ring-1 ring-primary/50 bg-primary/[0.02]" : "hover:border-white/20"}`}>
                            {plan.popular && (
                                <div className="absolute -top-3 left-0 right-0 flex justify-center z-10">
                                    <span className="bg-primary text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                                        <Sparkles className="h-3 w-3" /> Most Popular
                                    </span>
                                </div>
                            )}
                            <CardHeader>
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 text-white ${plan.popular ? "bg-primary text-black" : "bg-white/10"}`}>
                                    <plan.icon className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl">{plan.name}</CardTitle>
                                <CardDescription>{plan.desc}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="mb-6">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={plan.price}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            className="flex items-baseline gap-1"
                                        >
                                            <span className="text-4xl font-bold text-white">{plan.price}</span>
                                            <span className="text-muted-foreground">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                                <ul className="space-y-3">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <Check className="h-3 w-3 text-primary" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full h-11 text-md font-bold"
                                    variant={plan.variant as any}
                                    onClick={plan.name !== "Starter" ? () => handleUpgrade(plan) : undefined}
                                >
                                    {plan.name === "Starter" ? "Current Plan" : plan.cta}
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="max-w-4xl mx-auto mt-12 p-8 rounded-2xl bg-white/5 border border-white/5 text-center space-y-4"
            >
                <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                    <Lock className="h-5 w-5 text-muted-foreground" /> Enterprise & Gyms
                </h3>
                <p className="text-muted-foreground">Want to white-label this technology for your fitness center?</p>
                <Button variant="link" className="text-white">Contact Sales &rarr;</Button>
            </motion.div>
        </div>
    )
}
