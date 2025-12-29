"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Scale, Ruler, Activity, Heart, Utensils, ChevronRight, ChevronLeft, Check, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { bodyProfileService, BodyProfile, BODY_CONDITIONS } from "@/services/body-profile-service"

const STEPS = [
    { id: 1, title: "Basic Info", icon: User },
    { id: 2, title: "Body Metrics", icon: Scale },
    { id: 3, title: "Fitness Level", icon: Activity },
    { id: 4, title: "Health Conditions", icon: Heart },
    { id: 5, title: "Diet Preferences", icon: Utensils },
]

export default function ProfilePage() {
    const [step, setStep] = useState(1)
    const [profile, setProfile] = useState<Partial<BodyProfile>>({
        height: 170,
        weight: 70,
        age: 25,
        gender: 'male',
        fitnessLevel: 'intermediate',
        goal: 'maintain',
        conditions: [],
        dietary: {
            preference: 'non-veg',
            allergies: [],
            dailyCalorieTarget: 2000
        }
    })
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const existingProfile = bodyProfileService.getProfile()
        if (existingProfile) {
            setProfile(existingProfile)
        }
        setIsLoaded(true)
    }, [])

    const updateProfile = (updates: Partial<BodyProfile>) => {
        setProfile(prev => ({ ...prev, ...updates }))
    }

    const handleSave = () => {
        try {
            const savedProfile = bodyProfileService.saveProfile(profile as Omit<BodyProfile, 'createdAt' | 'updatedAt'>)
            console.log("Profile saved:", savedProfile)
            toast.success("Profile saved! Your workouts are now personalized 💪", {
                description: `BMI: ${bodyProfileService.calculateBMI(savedProfile).value} | Calories: ${bodyProfileService.getRecommendedCalories(savedProfile)}`
            })
        } catch (error) {
            console.error("Failed to save profile:", error)
            toast.error("Failed to save profile")
        }
    }

    const nextStep = () => setStep(s => Math.min(s + 1, STEPS.length))
    const prevStep = () => setStep(s => Math.max(s - 1, 1))

    const bmiData = profile.height && profile.weight ? bodyProfileService.calculateBMI(profile as BodyProfile) : null
    const recommendedCalories = profile.height && profile.weight && profile.age && profile.gender && profile.fitnessLevel && profile.goal
        ? bodyProfileService.getRecommendedCalories(profile as BodyProfile)
        : null

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        )
    }

    return (
        <div className="space-y-8 h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <User className="h-8 w-8 text-primary" />
                        Body Profile
                    </h2>
                    <p className="text-muted-foreground">Tell us about yourself for personalized workouts.</p>
                </div>
                {bmiData && (
                    <div className="text-right">
                        <div className={`text-2xl font-bold ${bmiData.color}`}>{bmiData.value}</div>
                        <div className="text-xs text-muted-foreground">BMI: {bmiData.category}</div>
                    </div>
                )}
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
                {STEPS.map((s, i) => (
                    <div key={s.id} className="flex items-center">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setStep(s.id)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${step === s.id
                                ? "bg-primary text-black"
                                : step > s.id
                                    ? "bg-green-500 text-white"
                                    : "bg-white/10 text-muted-foreground"
                                }`}
                        >
                            {step > s.id ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                        </motion.div>
                        {i < STEPS.length - 1 && (
                            <div className={`w-12 md:w-24 h-1 mx-2 rounded ${step > s.id ? "bg-green-500" : "bg-white/10"}`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <Card className="glass border-white/5">
                <CardHeader>
                    <CardTitle>{STEPS[step - 1].title}</CardTitle>
                    <CardDescription>Step {step} of {STEPS.length}</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[300px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Age</label>
                                        <input
                                            type="number"
                                            value={profile.age}
                                            onChange={e => updateProfile({ age: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Gender</label>
                                        <div className="flex gap-3">
                                            {['male', 'female', 'other'].map(g => (
                                                <button
                                                    key={g}
                                                    onClick={() => updateProfile({ gender: g as BodyProfile['gender'] })}
                                                    className={`flex-1 py-3 rounded-xl border transition-all capitalize ${profile.gender === g
                                                        ? "bg-primary text-black border-primary font-bold"
                                                        : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                                                        }`}
                                                >
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Height (cm)</label>
                                        <input
                                            type="number"
                                            value={profile.height}
                                            onChange={e => updateProfile({ height: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">{Math.round((profile.height || 0) / 30.48)} ft {Math.round(((profile.height || 0) % 30.48) / 2.54)} in</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Weight (kg)</label>
                                        <input
                                            type="number"
                                            value={profile.weight}
                                            onChange={e => updateProfile({ weight: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">{Math.round((profile.weight || 0) * 2.205)} lbs</p>
                                    </div>
                                    {bmiData && (
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-muted-foreground">Your BMI</span>
                                                <span className={`text-xl font-bold ${bmiData.color}`}>{bmiData.value}</span>
                                            </div>
                                            <p className={`text-sm ${bmiData.color}`}>{bmiData.category}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-3 block">Fitness Level</label>
                                        <div className="space-y-3">
                                            {[
                                                { id: 'beginner', label: 'Beginner', desc: 'New to fitness, building habits' },
                                                { id: 'intermediate', label: 'Intermediate', desc: 'Regular exercise, 3-4x per week' },
                                                { id: 'advanced', label: 'Advanced', desc: 'Experienced, 5+ sessions weekly' }
                                            ].map(level => (
                                                <button
                                                    key={level.id}
                                                    onClick={() => updateProfile({ fitnessLevel: level.id as BodyProfile['fitnessLevel'] })}
                                                    className={`w-full p-4 rounded-xl border text-left transition-all ${profile.fitnessLevel === level.id
                                                        ? "bg-primary/20 border-primary"
                                                        : "bg-white/5 border-white/10 hover:bg-white/10"
                                                        }`}
                                                >
                                                    <div className="font-bold text-white">{level.label}</div>
                                                    <div className="text-sm text-muted-foreground">{level.desc}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-3 block">Goal</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { id: 'lose_weight', label: '🔥 Lose Weight' },
                                                { id: 'build_muscle', label: '💪 Build Muscle' },
                                                { id: 'maintain', label: '⚖️ Maintain' },
                                                { id: 'endurance', label: '🏃 Endurance' }
                                            ].map(goal => (
                                                <button
                                                    key={goal.id}
                                                    onClick={() => updateProfile({ goal: goal.id as BodyProfile['goal'] })}
                                                    className={`p-3 rounded-xl border transition-all ${profile.goal === goal.id
                                                        ? "bg-primary/20 border-primary"
                                                        : "bg-white/5 border-white/10 hover:bg-white/10"
                                                        }`}
                                                >
                                                    {goal.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">Select any conditions that apply:</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {BODY_CONDITIONS.map(condition => (
                                            <button
                                                key={condition.id}
                                                onClick={() => {
                                                    const conditions = profile.conditions || []
                                                    const newConditions = conditions.includes(condition.id)
                                                        ? conditions.filter(c => c !== condition.id)
                                                        : [...conditions, condition.id]
                                                    updateProfile({ conditions: newConditions })
                                                }}
                                                className={`p-4 rounded-xl border text-left transition-all ${profile.conditions?.includes(condition.id)
                                                    ? "bg-red-500/20 border-red-500"
                                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                                                    }`}
                                            >
                                                <div className="font-bold text-white">{condition.name}</div>
                                                <div className="text-xs text-muted-foreground">{condition.description}</div>
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-4">
                                        * Exercises that may aggravate these conditions will be excluded from your workouts.
                                    </p>
                                </div>
                            )}

                            {step === 5 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-3 block">Dietary Preference</label>
                                        <div className="flex gap-3">
                                            {[
                                                { id: 'non-veg', label: '🥩 Non-Veg' },
                                                { id: 'veg', label: '🥗 Vegetarian' },
                                                { id: 'vegan', label: '🌱 Vegan' }
                                            ].map(pref => (
                                                <button
                                                    key={pref.id}
                                                    onClick={() => updateProfile({
                                                        dietary: { ...profile.dietary!, preference: pref.id as BodyProfile['dietary']['preference'] }
                                                    })}
                                                    className={`flex-1 py-3 rounded-xl border transition-all ${profile.dietary?.preference === pref.id
                                                        ? "bg-primary text-black border-primary font-bold"
                                                        : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                                                        }`}
                                                >
                                                    {pref.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {recommendedCalories && (
                                        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-muted-foreground">Recommended Daily Calories</span>
                                                <span className="text-2xl font-bold text-green-400">{recommendedCalories}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">Based on your goal: {profile.goal?.replace('_', ' ')}</p>
                                        </div>
                                    )}

                                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                                        <h4 className="font-bold text-white mb-2">Profile Summary</h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="text-muted-foreground">Age:</div>
                                            <div className="text-white">{profile.age} years</div>
                                            <div className="text-muted-foreground">Height:</div>
                                            <div className="text-white">{profile.height} cm</div>
                                            <div className="text-muted-foreground">Weight:</div>
                                            <div className="text-white">{profile.weight} kg</div>
                                            <div className="text-muted-foreground">Level:</div>
                                            <div className="text-white capitalize">{profile.fitnessLevel}</div>
                                            <div className="text-muted-foreground">Conditions:</div>
                                            <div className="text-white">{profile.conditions?.length || 0} selected</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === 1}
                    className="gap-2"
                >
                    <ChevronLeft className="h-4 w-4" /> Previous
                </Button>

                {step === STEPS.length ? (
                    <Button onClick={handleSave} className="gap-2">
                        <Save className="h-4 w-4" /> Save Profile
                    </Button>
                ) : (
                    <Button onClick={nextStep} className="gap-2">
                        Next <ChevronRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}
