"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Lock } from "lucide-react"

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <Link href="/">
                    <Button variant="ghost" className="pl-0 hover:pl-2 transition-all text-muted-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Button>
                </Link>

                <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                    <Lock className="h-8 w-8 text-emerald-500" /> Privacy Policy
                </h1>
                <p className="text-muted-foreground">Last Updated: December 26, 2025</p>

                <div className="space-y-6 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">1. Data Collection</h2>
                        <p>We collect information you provide directly to us, such as when you create an account, update your profile, or use the interactive features of the App.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">2. Biometric Data & AI Vision</h2>
                        <div className="p-4 border border-emerald-500/20 rounded-lg bg-emerald-500/5">
                            <p className="text-emerald-400">
                                <strong>Your Privacy is Priority:</strong> Video feeds processed by "AI Vision Trainer" and images scanned by "Food Scanner" are processed locally on your device or via secure, ephemeral cloud instances. We do NOT store your raw biometric video data.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">3. Usage of Information</h2>
                        <p>We use the information we collect to operate, maintain, and provide the features of the App, including personalizing your fitness plan and generating recipes.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">4. Third-Party Services</h2>
                        <p>We may share non-identifiable, aggregated data with analytics partners to improve our service. We do not sell your personal data to third parties.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">5. Data Security</h2>
                        <p>We use commercially reasonable safeguards to preserve the integrity and security of your personal information.</p>
                    </section>
                </div>
            </div>
        </div>
    )
}
