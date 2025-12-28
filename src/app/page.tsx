"use client"

import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Sparkles, Activity, ShieldCheck, Zap } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <main className="min-h-screen bg-black relative overflow-hidden selection:bg-cyan-500/30">
      {/* Animated Matrix/Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-cyan-500/10 to-transparent blur-[100px] pointer-events-none" />

      <Navbar />

      <div className="container mx-auto px-4 pt-40 pb-20 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">

          {/* Glitch Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] backdrop-blur-md"
          >
            <Zap className="h-4 w-4 animate-pulse" />
            <span className="tracking-widest uppercase text-xs">System Online // v2.0</span>
          </motion.div>

          {/* Hero Title with Scale Animation */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40"
          >
            EVOLVE YOUR <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">GENETICS</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-400 max-w-2xl leading-relaxed font-light"
          >
            The world's first <span className="text-white font-medium">Bio-Hacking Operating System</span>.
            Powered by Grok AI to optimize your sleep, training, and longevity in real-time.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-4 pt-8"
          >
            <Link href="/onboarding">
              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold h-14 px-10 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all hover:scale-105">
                Initialize System
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="ghost" className="h-14 px-8 text-gray-400 hover:text-white hover:bg-white/5 rounded-full border border-white/5">
              Protocol Demo
            </Button>
          </motion.div>
        </div>

        {/* Floating Holo-Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-40">
          {[
            {
              icon: Activity,
              title: "Neural Analysis",
              desc: "Real-time biometric scanning via AI Vision.",
              color: "text-cyan-400",
              border: "group-hover:border-cyan-500/50"
            },
            {
              icon: Sparkles,
              title: "Auto-Regulation",
              desc: "Workouts that adapt to your daily recovery score.",
              color: "text-purple-400",
              border: "group-hover:border-purple-500/50"
            },
            {
              icon: ShieldCheck,
              title: "Longevity Engine",
              desc: "Predictive modeling for lifespan optimization.",
              color: "text-emerald-400",
              border: "group-hover:border-emerald-500/50"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className={`bg-black/40 backdrop-blur-xl border-white/10 ${feature.border} transition-all duration-500 group overflow-hidden`}>
                <CardContent className="p-8 space-y-4 relative">
                  <div className={`absolute top-0 right-0 p-32 bg-${feature.color.split('-')[1]}-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-${feature.color.split('-')[1]}-500/10 transition-all`} />

                  <div className={`h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center ${feature.color} border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:translate-x-1 transition-transform">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}

