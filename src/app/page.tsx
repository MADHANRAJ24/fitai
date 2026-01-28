"use client"

import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Sparkles, Activity, ShieldCheck, Zap } from "lucide-react"
import { motion } from "framer-motion"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading || user) return null

  return (
    <main className="min-h-screen bg-black relative overflow-hidden selection:bg-cyan-500/30">
      {/* Animated Matrix/Grid Background - WARP SPEED EFFECT */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none perspective-[1000px] transform-gpu">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      </div>

      {/* Ambient Nebula Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full animate-pulse-slow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/20 blur-[120px] rounded-full animate-pulse-slow" />

      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-cyan-500/5 to-transparent blur-[100px] pointer-events-none" />

      <Navbar />

      <div className="container mx-auto px-4 pt-40 pb-20 relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-10">

          {/* Glitch Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] backdrop-blur-md hover:bg-cyan-500/20 transition-colors cursor-crosshair"
          >
            <Zap className="h-3 w-3 animate-pulse text-yellow-400" />
            <span className="tracking-[0.2em] uppercase text-[10px] font-bold">System Online // v2.1 (BUILD V4 SUCCESS)</span>
          </motion.div>

          {/* Hero Title with Scale Animation */}
          <div className="relative">
            <motion.h1
              initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl font-black tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 font-heading"
            >
              EVOLVE YOUR <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">GENETICS</span>
            </motion.h1>

            {/* Decorative HUD Elements around title */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100px" }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute -top-6 -left-6 h-[1px] bg-cyan-500/50 hidden md:block"
            />
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "40px" }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute -top-6 -left-6 w-[1px] bg-cyan-500/50 hidden md:block"
            />
          </div>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-400 max-w-lg leading-relaxed font-light"
          >
            The world's first <span className="text-white font-medium border-b border-cyan-500/30">Bio-Hacking Operating System</span>.
            Powered by Advanced AI to optimize your sleep, training, and longevity in real-time.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-8"
          >
            <Link href="/onboarding">
              <Button size="default" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold h-12 px-8 text-base rounded-full shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:scale-110 hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center">
                  Initialize System
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            <Button size="lg" variant="ghost" className="h-12 px-8 text-gray-400 hover:text-white hover:bg-white/5 rounded-full border border-white/5 hover:border-white/20 transition-all">
              Protocol Demo
            </Button>
          </motion.div>
        </div>

        {/* Floating Holo-Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32">
          {[
            {
              icon: Activity,
              title: "Neural Analysis",
              desc: "Real-time biometric scanning via AI Vision.",
              color: "text-cyan-400",
              border: "group-hover:border-cyan-500/50",
              glow: "group-hover:shadow-[0_0_40px_rgba(34,211,238,0.2)]",
              bgGlow: "bg-cyan-500/5",
              bgGlowHover: "group-hover:bg-cyan-500/15"
            },
            {
              icon: Sparkles,
              title: "Auto-Regulation",
              desc: "Workouts that adapt to your daily recovery score.",
              color: "text-purple-400",
              border: "group-hover:border-purple-500/50",
              glow: "group-hover:shadow-[0_0_40px_rgba(168,85,247,0.2)]",
              bgGlow: "bg-purple-500/5",
              bgGlowHover: "group-hover:bg-purple-500/15"
            },
            {
              icon: ShieldCheck,
              title: "Longevity Engine",
              desc: "Predictive modeling for lifespan optimization.",
              color: "text-emerald-400",
              border: "group-hover:border-emerald-500/50",
              glow: "group-hover:shadow-[0_0_40px_rgba(52,211,153,0.2)]",
              bgGlow: "bg-emerald-500/5",
              bgGlowHover: "group-hover:bg-emerald-500/15"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card className={`bg-black/40 backdrop-blur-xl border-white/10 ${feature.border} ${feature.glow} transition-all duration-500 group overflow-hidden relative h-full`}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardContent className="p-8 space-y-4 relative z-10 flex flex-col items-center text-center">
                  <div className={`absolute top-0 right-0 p-32 ${feature.bgGlow} blur-[80px] rounded-full pointer-events-none ${feature.bgGlowHover} transition-all duration-700`} />

                  <div className={`h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center ${feature.color} border border-white/5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                    <feature.icon className="h-8 w-8 drop-shadow-md" />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:translate-y-[-2px] transition-transform font-heading tracking-wide uppercase">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">
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

