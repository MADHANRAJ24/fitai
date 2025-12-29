"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Activity, Target, User, ChevronRight, Check } from "lucide-react"

export default function Onboarding() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        name: "",
        weight: "",
        height: "",
        goal: ""
    })

    const totalSteps = 3

    const nextStep = () => {
        if (step < totalSteps) {
            setStep(step + 1)
        } else {
            // Save to LocalStorage for persistence
            if (typeof window !== "undefined") {
                localStorage.setItem("user_onboarding", JSON.stringify(formData))
                // Also trigger a custom event so components update immediately
                window.dispatchEvent(new Event("user_updated"))
            }
            router.push("/dashboard")
        }
    }

    const updateData = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Progress Bar */}
                <div className="flex gap-2 mb-8">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= step ? "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" : "bg-white/10"}`}
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait" custom={step}>
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="space-y-6"
                        >
                            <div className="text-center space-y-2">
                                <div className="h-16 w-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto border border-cyan-500/20 text-cyan-400">
                                    <User className="h-8 w-8" />
                                </div>
                                <h2 className="text-3xl font-bold text-white">Identity Protocol</h2>
                                <p className="text-gray-400">Establish your digital profile.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-widest text-gray-500">Agent Name</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => updateData("name", e.target.value)}
                                        className="bg-white/5 border-white/10 text-lg h-14 focus:border-cyan-500/50 transition-colors"
                                        placeholder="Enter Alias..."
                                    />
                                </div>
                            </div>

                            <Button onClick={nextStep} className="w-full h-14 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-lg shadow-[0_0_20px_rgba(8,145,178,0.4)]">
                                Initialize <ChevronRight className="ml-2" />
                            </Button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="space-y-6"
                        >
                            <div className="text-center space-y-2">
                                <div className="h-16 w-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto border border-purple-500/20 text-purple-400">
                                    <Activity className="h-8 w-8" />
                                </div>
                                <h2 className="text-3xl font-bold text-white">Base Stats</h2>
                                <p className="text-gray-400">Calibrating biometrics.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-widest text-gray-500">Weight (KG)</Label>
                                    <Input
                                        type="number"
                                        value={formData.weight}
                                        onChange={(e) => updateData("weight", e.target.value)}
                                        className="bg-white/5 border-white/10 text-center text-2xl h-20 font-mono focus:border-purple-500/50"
                                        placeholder="00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-widest text-gray-500">Height (CM)</Label>
                                    <Input
                                        type="number"
                                        value={formData.height}
                                        onChange={(e) => updateData("height", e.target.value)}
                                        className="bg-white/5 border-white/10 text-center text-2xl h-20 font-mono focus:border-purple-500/50"
                                        placeholder="000"
                                    />
                                </div>
                            </div>

                            <Button onClick={nextStep} className="w-full h-14 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-lg shadow-[0_0_20px_rgba(147,51,234,0.4)]">
                                Confirm Stats <ChevronRight className="ml-2" />
                            </Button>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="space-y-6"
                        >
                            <div className="text-center space-y-2">
                                <div className="h-16 w-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20 text-emerald-400">
                                    <Target className="h-8 w-8" />
                                </div>
                                <h2 className="text-3xl font-bold text-white">Mission Select</h2>
                                <p className="text-gray-400">Choose your primary directive.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {['Hypertrophy (Muscle)', 'Fat Loss (Shred)', 'Longevity (Health)', 'Hybrid (Athlete)'].map((goal) => (
                                    <button
                                        key={goal}
                                        onClick={() => {
                                            updateData("goal", goal)
                                            setTimeout(nextStep, 300)
                                        }}
                                        className={`h-16 px-6 rounded-xl border flex items-center justify-between transition-all duration-300 ${formData.goal === goal ? "bg-emerald-500/20 border-emerald-500 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/30"}`}
                                    >
                                        <span className="font-medium text-lg">{goal}</span>
                                        {formData.goal === goal && <Check className="text-emerald-400" />}
                                    </button>
                                ))}
                            </div>

                            <Button onClick={nextStep} className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-lg shadow-[0_0_20px_rgba(5,150,105,0.4)]">
                                Deploy System <ChevronRight className="ml-2" />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
