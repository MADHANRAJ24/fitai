"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <Link href="/">
                    <Button variant="ghost" className="pl-0 hover:pl-2 transition-all text-muted-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Button>
                </Link>

                <h1 className="text-4xl font-bold tracking-tight text-white">Terms of Service</h1>
                <p className="text-muted-foreground">Last Updated: December 26, 2025</p>

                <div className="space-y-6 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">1. Acceptance of Terms</h2>
                        <p>By accessing and using FitAI ("the App"), you accept and agree to be bound by the terms and provision of this agreement.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">2. AI Health Disclaimer</h2>
                        <p className="text-red-400/80 p-4 border border-red-500/20 rounded-lg bg-red-500/5">
                            <strong>IMPORTANT:</strong> FitAI uses Artificial Intelligence to provide fitness and nutritional suggestions. These suggestions do NOT constitute medical advice. You should consult a physician before starting any new diet or exercise program.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">3. User Accounts</h2>
                        <p>You are responsible for maintaining the security of your account. You must immediately notify us of any unauthorized uses of your account or any other breaches of security.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">4. Subscription & Payments</h2>
                        <p>Features marked as "Pro" or "Elite" require a paid subscription. Subscriptions automatically renew unless auto-renew is turned off at least 24-hours before the end of the current period.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">5. Prohibited Conduct</h2>
                        <p>You agree not to use the App to harvest biometric data of others without consent, or to generate harmful or illegal content.</p>
                    </section>
                </div>
            </div>
        </div>
    )
}
