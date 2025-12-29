"use client"

import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/layout/navbar"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RefundPolicy() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            <Navbar />

            <main className="container mx-auto px-4 pt-32 pb-20 max-w-3xl">
                <Link href="/">
                    <Button variant="ghost" className="mb-8 text-muted-foreground hover:text-white pl-0">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
                    </Button>
                </Link>

                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">
                            Cancellation & Refund Policy
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Last updated: December 2024
                        </p>
                    </div>

                    <section className="prose prose-invert max-w-none space-y-4 text-zinc-300">
                        <h2 className="text-2xl font-bold text-white">1. Cancellation Policy</h2>
                        <p>
                            You may cancel your FitAI Premium subscription at any time via your Dashboard settings or by managing your subscription through the Google Play Store / Apple App Store depending on where you purchased it.
                        </p>
                        <p>
                            Upon cancellation, your subscription will continue to be valid until the end of the current billing cycle. No further charges will be made.
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-8">2. Refunds</h2>
                        <p>
                            We offer a **no-questions-asked 7-day refund policy** for first-time subscribers. If you are not satisfied with FitAI Premium, please contact us within 7 days of your purchase.
                        </p>
                        <p>
                            For subscriptions managed via Apple or Google (In-App Purchases), refunds must be requested directly through their respective support portals as we do not have control over their billing systems.
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-8">3. Contact Us</h2>
                        <p>
                            If you have any questions about our Returns and Refunds Policy, please contact us:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>By visiting this page on our website: <Link href="/contact" className="text-cyan-400 hover:underline">/contact</Link></li>
                            <li>By email: support@fitai.com</li>
                        </ul>
                    </section>
                </div>
            </main>
        </div>
    )
}
