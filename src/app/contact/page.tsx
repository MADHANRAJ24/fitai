"use client"

import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone, Send } from "lucide-react"
import { motion } from "framer-motion"

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            <Navbar />

            {/* Background Effects */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="fixed top-0 right-0 h-[500px] w-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

            <main className="container mx-auto px-4 pt-32 pb-20 max-w-6xl relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-start">

                    {/* Left Column: Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-6">
                                Get in Touch
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Have questions about FitAI? We're here to help you achieve your fitness goals.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <Card className="bg-white/5 border-white/10 glass">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-cyan-500/20 text-cyan-400">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email Us</p>
                                        <p className="text-lg font-medium">support@fitai.com</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/5 border-white/10 glass">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-purple-500/20 text-purple-400">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Headquarters</p>
                                        <p className="text-lg font-medium">Chennai, India</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>

                    {/* Right Column: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="bg-zinc-900/50 border-white/10">
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Name</label>
                                    <Input placeholder="John Doe" className="bg-black/50 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input placeholder="john@example.com" type="email" className="bg-black/50 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Message</label>
                                    <Textarea placeholder="How can we help?" className="min-h-[150px] bg-black/50 border-white/10" />
                                </div>
                                <Button className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-6">
                                    <Send className="h-4 w-4 mr-2" /> Send Message
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>

                </div>
            </main>
        </div>
    )
}
