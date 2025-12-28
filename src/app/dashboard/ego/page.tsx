"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Upload, AlertTriangle, Flame, ArrowRight, History, Share2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function EgoPage() {
    const [photos, setPhotos] = useState<string[]>([])
    const [streak, setStreak] = useState(0)
    const [showWarning, setShowWarning] = useState(true) // Simulate strict mode
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPhotos([url, ...photos])
            setStreak(s => s + 1)
            setShowWarning(false)
        }
    }

    return (
        <div className="space-y-8 h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
            {/* Strict Mode Warning */}
            <AnimatePresence>
                {showWarning && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-4 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
                        <div className="p-2 bg-red-500/20 rounded-lg z-10">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                        </div>
                        <div className="z-10 flex-1">
                            <h3 className="font-bold text-red-500">EGO ACTIVATION REQUIRED</h3>
                            <p className="text-sm text-red-400/80 mt-1">
                                You haven&apos;t logged your physique today. Your past self is laughing at you.
                                Upload now to maintain the standard.
                            </p>
                        </div>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="z-10"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Upload Proof
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Flame className="h-8 w-8 text-orange-500" />
                        Ego Chamber
                    </h2>
                    <p className="text-muted-foreground">Visual proof of your evolution. No excuses.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-2xl font-bold text-white flex items-center justify-end gap-2">
                            {streak} <span className="text-sm font-normal text-muted-foreground">DAYS</span>
                        </div>
                        <div className="text-xs text-orange-500 font-bold uppercase tracking-wider">Current Streak</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Upload Section */}
                <Card className="glass border-white/5 md:col-span-2">
                    <CardHeader>
                        <CardTitle>Daily Log</CardTitle>
                        <CardDescription>Capture your physique in consistent lighting.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                        />
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-white/10 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-all group"
                        >
                            <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Camera className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <p className="text-lg font-medium text-white group-hover:text-primary transition-colors">Take Daily Photo</p>
                            <p className="text-sm text-muted-foreground mt-2">or drag and drop here</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Progress Gallery */}
                <Card className="glass border-white/5 h-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Evolution Gallery</CardTitle>
                            <CardDescription>Your visual timeline.</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon">
                            <History className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </CardHeader>
                    <CardContent className="h-[400px] overflow-y-auto custom-scrollbar p-2">
                        <div className="grid grid-cols-2 gap-2">
                            {photos.length > 0 ? (
                                photos.map((photo, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="aspect-[3/4] rounded-lg bg-black/50 overflow-hidden relative group"
                                    >
                                        <img src={photo} alt="Progress" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button size="icon" variant="secondary" className="rounded-full h-8 w-8">
                                                <Share2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 rounded text-[10px] font-mono text-white">
                                            DAY {streak - i}
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-2 h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                    <Camera className="h-12 w-12 mb-2" />
                                    <p>No logs yet</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Comparison / Motivation */}
                <Card className="glass border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent pointer-events-none" />
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" /> Reality Check
                        </CardTitle>
                        <CardDescription>AI-generated motivation based on lack of activity.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                            <p className="text-sm font-medium text-orange-200 italic">
                                &quot;Success is rented, and the rent is due every day. You haven&apos;t paid today.&quot;
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                <span>Discipline Level</span>
                                <span className="text-red-400">Low</span>
                            </div>
                            <Progress value={35} className="bg-white/10" indicatorClassName="bg-red-500" />
                            <p className="text-xs text-muted-foreground text-right pt-1">Danger Zone</p>
                        </div>

                        <Button className="w-full bg-white text-black hover:bg-white/90 font-bold">
                            ACTIVATE BEAST MODE <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
