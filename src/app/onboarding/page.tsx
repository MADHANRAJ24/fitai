"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Activity, Target, User, ChevronRight, Check, RefreshCw } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

export default function Onboarding() {
    const router = useRouter()
    const { signIn, signOut, user, loading, isSyncing } = useAuth()
    const [step, setStep] = useState(1)
    const [isChecking, setIsChecking] = useState(false)

    // AUTO-REDIRECT IF DATA ALREADY EXISTS (Cloud Sync Success)
    useEffect(() => {
        if (!loading && !isSyncing && user) {
            import("@/services/body-profile-service").then(({ bodyProfileService }) => {
                if (bodyProfileService.isProfileComplete()) {
                    router.push("/dashboard")
                }
            })
        }
    }, [user, loading, isSyncing, router])

    const [formData, setFormData] = useState({
        name: "",
        weight: "",
        height: "",
        age: "",
        gender: "male",
        goal: ""
    })

    const totalSteps = 3

    const nextStep = () => {
        if (step === 1 && !formData.name.trim()) {
            return alert("Please enter your Agent Name to proceed.")
        }
        if (step === 2) {
            const w = parseFloat(formData.weight)
            const h = parseFloat(formData.height)
            const a = parseFloat(formData.age)

            if (!w || w <= 20 || w > 300) return alert("Please enter a valid weight (20kg - 300kg).")
            if (!h || h <= 50 || h > 250) return alert("Please enter a valid height (50cm - 250cm).")
            if (!a || a <= 10 || a > 100) return alert("Please enter a valid age (10 - 100).")
        }

        if (step < totalSteps) {
            setStep(step + 1)
        } else {
            // Save to LocalStorage for persistence
            if (typeof window !== "undefined") {
                localStorage.setItem("user_onboarding", JSON.stringify(formData))

                // Initialize Body Profile immediately so they aren't redirected to profile setup
                import("@/services/body-profile-service").then(({ bodyProfileService }) => {
                    bodyProfileService.initializeFromOnboarding(formData)
                })

                // Also trigger a custom event so components update immediately
                window.dispatchEvent(new Event("user_updated"))

                // Backup if logged in
                import("@/services/user-storage-service").then(({ UserStorageService }) => {
                    import("@/lib/supabase").then(({ supabase }) => {
                        if (supabase) {
                            supabase.auth.getSession().then(({ data }) => {
                                if (data.session?.user?.email) {
                                    UserStorageService.saveUserData(data.session.user.email)
                                }
                            })
                        }
                    })
                })
            }
            router.push("/dashboard")
        }
    }

    const updateData = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    const handleCheckBackup = async () => {
        if (!user?.email) return
        setIsChecking(true)
        try {
            const { CloudSyncService } = await import("@/services/cloud-sync-service")
            const result = await CloudSyncService.syncDown(user.email)

            if (result === 'FOUND') {
                toast.success("Backup restored successfully!")
                // Wait a moment for state to settle then redirect
                setTimeout(() => router.push("/dashboard"), 500)
            } else if (result === 'NOT_FOUND') {
                toast.error("No backup found for this account.")
            } else {
                toast.error("Network Error. Could not verify backup. Please check your connection.")
            }
        } catch (e) {
            console.error(e)
            toast.error("An unexpected error occurred.")
        } finally {
            setIsChecking(false)
        }
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

                            {user ? (
                                <div className="space-y-3">
                                    <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
                                        <p className="text-xs text-cyan-400 uppercase tracking-widest mb-1">Active Session</p>
                                        <p className="text-white font-medium truncate">{user.email}</p>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        onClick={handleCheckBackup}
                                        disabled={isChecking}
                                        className="w-full text-xs text-white/60 hover:text-white hover:bg-white/5"
                                    >
                                        {isChecking ? (
                                            <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                                        ) : (
                                            <RefreshCw className="h-3 w-3 mr-2" />
                                        )}
                                        Sync Cloud Data
                                    </Button>

                                    <div className="relative py-2">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-white/10" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-black px-2 text-muted-foreground">Or</span>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        onClick={async () => {
                                            await signOut()
                                            toast.success("Signed out")
                                            setStep(1) // Reset UI
                                        }}
                                        className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                    >
                                        Sign Out / Switch Account
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-white/10" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-black px-2 text-muted-foreground">Or Connect</span>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full h-14 border-white/10 hover:bg-white/5 text-white"
                                        onClick={async () => {
                                            await signIn()
                                        }}
                                    >
                                        <svg className="cancel-icon mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                                        Sign in with Google
                                    </Button>
                                </>
                            )}
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
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-widest text-gray-500">Age</Label>
                                    <Input
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => updateData("age", e.target.value)}
                                        className="bg-white/5 border-white/10 text-center text-2xl h-20 font-mono focus:border-purple-500/50"
                                        placeholder="25"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-widest text-gray-500">Gender</Label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => updateData("gender", e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 text-center text-xl h-20 font-mono focus:border-purple-500/50 rounded-md text-white px-2 appearance-none"
                                    >
                                        <option value="male" className="bg-black">Male</option>
                                        <option value="female" className="bg-black">Female</option>
                                        <option value="other" className="bg-black">Other</option>
                                    </select>
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
