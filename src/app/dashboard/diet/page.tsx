"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Utensils, ChefHat, Sparkles, Clock, Flame, Leaf, ArrowRight, Loader2 } from "lucide-react"

export default function DietPage() {
    const [ingredients, setIngredients] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [recipe, setRecipe] = useState<any>(null)

    const generateRecipe = () => {
        setIsLoading(true)
        // Simulate AI Generation with a "thinking" delay
        setTimeout(() => {
            setRecipe({
                title: "Pan-Seared Lemon Garlic Chicken",
                description: "A high-protein, low-carb meal perfect for post-workout recovery.",
                time: "20 mins",
                calories: "450 kcal",
                protein: "42g",
                tags: ["High Protein", "Keto Friendly", "Quick Prep"],
                instructions: [
                    "Season chicken breast with salt, pepper, and lemon zest.",
                    "Heat olive oil in a pan over medium-high heat.",
                    "Sear chicken for 6-7 minutes per side until golden.",
                    "Add minced garlic and spinach to the pan for the last 2 minutes.",
                    "Serve immediately with a squeeze of fresh lemon."
                ]
            })
            setIsLoading(false)
        }, 2500)
    }

    return (
        <div className="space-y-8 h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <ChefHat className="h-8 w-8 text-primary" />
                        AI Diet Chef
                    </h2>
                    <p className="text-muted-foreground">Turn your fridge contents into fuel.</p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                >
                    <Card className="glass border-white/5 relative overflow-hidden">
                        <CardHeader>
                            <CardTitle>What's in your kitchen?</CardTitle>
                            <CardDescription>Enter available ingredients.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                placeholder="e.g. Chicken, Spinach, Rice..."
                                value={ingredients}
                                onChange={(e) => setIngredients(e.target.value)}
                                className="bg-white/5 border-white/10 text-white h-12"
                            />
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    className="w-full h-11 text-md font-bold"
                                    variant="neon"
                                    disabled={!ingredients || isLoading}
                                    onClick={generateRecipe}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Chef is thinking...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-4 w-4 mr-2" /> Generate Recipe
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2 text-orange-400 font-bold">
                                <Flame className="h-5 w-5" /> Pro Tip
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Prioritize protein in every meal to maximize muscle recovery. The AI Chef will always suggest macro-balanced options optimized for your goals.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Results Section */}
                <div className="lg:col-span-2 min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full flex flex-col items-center justify-center text-center space-y-4"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                                    <ChefHat className="h-16 w-16 text-primary relative z-10 animate-bounce" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Designing Your Meal...</h3>
                                <p className="text-muted-foreground max-w-sm">
                                    Analyzing flavors, calculating macros, and ensuring a perfect fit for your diet.
                                </p>
                            </motion.div>
                        ) : recipe ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: "spring", duration: 0.6 }}
                            >
                                <Card className="glass border-white/5 overflow-hidden">
                                    <div className="h-56 bg-gray-900 w-full relative group overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10" />
                                        {/* Mock Image Placeholder with visual interest */}
                                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c')] bg-cover bg-center opacity-60 group-hover:scale-105 transition-transform duration-700" />

                                        <div className="absolute bottom-4 left-6 z-20">
                                            <motion.h3
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                                className="text-3xl font-bold text-white mb-1"
                                            >
                                                {recipe.title}
                                            </motion.h3>
                                            <motion.p
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.3 }}
                                                className="text-white/80 text-sm max-w-lg"
                                            >
                                                {recipe.description}
                                            </motion.p>
                                        </div>
                                    </div>

                                    <CardContent className="pt-8 space-y-8 p-6">
                                        {/* Macros Row */}
                                        <div className="flex gap-4 flex-wrap">
                                            {[
                                                { icon: Clock, val: recipe.time, color: "text-blue-400", border: "border-blue-400/20", bg: "bg-blue-400/10" },
                                                { icon: Flame, val: recipe.calories, color: "text-orange-400", border: "border-orange-400/20", bg: "bg-orange-400/10" },
                                                { icon: Leaf, val: `${recipe.protein} Protein`, color: "text-emerald-400", border: "border-emerald-400/20", bg: "bg-emerald-400/10" }
                                            ].map((item, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                                    className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${item.border} ${item.bg}`}
                                                >
                                                    <item.icon className={`h-4 w-4 ${item.color}`} />
                                                    <span className="text-sm font-bold text-white">{item.val}</span>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Instructions */}
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-white text-lg flex items-center gap-2">
                                                <Utensils className="h-5 w-5 text-primary" /> Instructions
                                            </h4>
                                            <div className="space-y-4">
                                                {recipe.instructions.map((step: string, i: number) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.5 + (i * 0.1) }}
                                                        className="flex gap-4 group"
                                                    >
                                                        <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:bg-primary group-hover:text-black transition-colors mt-0.5 shrink-0">
                                                            {i + 1}
                                                        </div>
                                                        <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-white transition-colors">{step}</p>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex gap-2 pt-4 border-t border-white/5">
                                            {recipe.tags.map((tag: string, i: number) => (
                                                <span key={i} className="text-xs px-3 py-1 rounded-full bg-white/5 text-muted-foreground border border-white/10">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-white/5 rounded-xl min-h-[400px] bg-white/[0.02]"
                            >
                                <Utensils className="h-16 w-16 mb-4 opacity-20" />
                                <p className="text-lg font-medium">Your personal chef is ready.</p>
                                <p className="text-sm opacity-50">Enter ingredients to begin.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
