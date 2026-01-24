"use client"

import React, { useRef, useState, useCallback } from "react"
import Webcam from "react-webcam"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, RefreshCw, Upload, X, ScanLine, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface ScannerProps {
    type: "food" | "body"
    onScanComplete: (result: any) => void
}

export function Scanner({ type, onScanComplete }: ScannerProps) {
    const webcamRef = useRef<Webcam>(null)
    const [imgSrc, setImgSrc] = useState<string | null>(null)
    const [isScanning, setIsScanning] = useState(false)
    const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const toggleCamera = () => {
        setFacingMode(prev => prev === "user" ? "environment" : "user")
    }

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot()
        if (imageSrc) {
            processImage(imageSrc)
        }
    }, [webcamRef])

    const retake = () => {
        setImgSrc(null)
        setIsScanning(false)
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                processImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const processImage = async (src: string) => {
        setImgSrc(src)
        setIsScanning(true)

        try {
            // REAL AI IMPLEMENTATION (Server-Side Grok) on Client
            // We verify if the API route works, if not we fall back to demo

            const response = await fetch('/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: src, // Send full data URL
                    type: type
                })
            })


            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.details || "Validation Failed")
            }

            if (result.error) {
                toast.error(result.error)
                setImgSrc(null) // Reset to retake
            } else {
                onScanComplete(result)
            }

        } catch (error) {
            console.log("Using Demo Mode (API Failed)", error)

            // DEMO MODE - Simulate AI Analysis with realistic delays
            setTimeout(() => {
                toast.info("Demo Mode: Simulating AI Analysis", { description: "Add API Key for real-time results." })

                if (type === "food") {
                    const demoFoods = [
                        { name: "Grilled Chicken Salad", calories: 350, protein: "40g", fats: "15g", carbs: "12g" },
                        { name: "Oatmeal & Berries", calories: 280, protein: "8g", fats: "5g", carbs: "45g" },
                        { name: "Protein Shake", calories: 180, protein: "25g", fats: "3g", carbs: "8g" }
                    ]
                    onScanComplete(demoFoods[Math.floor(Math.random() * demoFoods.length)])
                } else {
                    onScanComplete({
                        posture: "Good",
                        alignment: "88%",
                        issues: ["Slight Forward Head", "Uneven Shoulders"],
                        correction: "Focus on chin tucks and shoulder blade squeezes.",
                        suggested_workout: "Posture Corrector A"
                    })
                }
            }, 1000)
        } finally {
            setIsScanning(false)
        }
    }
    return (
        <div className="relative w-full max-w-md mx-auto aspect-[3/4] bg-black rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl group">
            {!imgSrc ? (
                <>
                    <Webcam
                        key={facingMode} // CRITICAL: Forces component remount on camera switch
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-full object-cover"
                        videoConstraints={{ facingMode }}
                        onUserMediaError={(err) => {
                            toast.error("Camera access denied. Please allow camera permissions.")
                        }}
                    />

                    {/* Sci-Fi Grid Overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                        <div className="w-full h-full bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                    </div>

                    {/* Animated Scanning Reticle */}
                    <div className="absolute inset-x-8 inset-y-16 border border-primary/20 rounded-2xl pointer-events-none">
                        {/* Corners */}
                        <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                        <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                        <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />

                        {/* Side Data Decorations */}
                        <div className="absolute top-1/2 -left-3 w-1 h-12 bg-primary/50 rounded-full -translate-y-1/2" />
                        <div className="absolute top-1/2 -right-3 w-1 h-12 bg-primary/50 rounded-full -translate-y-1/2" />

                        {/* Moving Laser Line */}
                        <motion.div
                            className="absolute top-0 left-0 right-0 h-0.5 bg-primary/80 shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Top Badge */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black/80 px-4 py-1 rounded-full border border-primary/30 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[10px] text-primary font-mono tracking-[0.2em] font-bold">SYSTEM ACTIVE</span>
                        </div>

                        {/* Random Tech Data (Static for now, can be animated later) */}
                        <div className="absolute bottom-4 left-4 text-[8px] text-primary/70 font-mono leading-tight">
                            <p>ISO: 800</p>
                            <p>EXP: +0.7</p>
                            <p>F-STOP: 1.8</p>
                        </div>
                        <div className="absolute bottom-4 right-4 text-[8px] text-primary/70 font-mono leading-tight text-right">
                            <p>AI: ON</p>
                            <p>NET: 5G</p>
                            <p>LAT: 45ms</p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="absolute inset-x-0 bottom-0 p-6 flex justify-center items-center gap-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-20">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10 hover:text-primary transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="h-6 w-6" />
                        </Button>

                        <button
                            onClick={capture}
                            className="h-20 w-20 rounded-full border-[3px] border-white/50 flex items-center justify-center bg-white/10 backdrop-blur-md transition-all active:scale-95 hover:border-primary hover:bg-primary/10 group-hover:scale-105"
                        >
                            <div className="h-16 w-16 rounded-full bg-white transition-colors group-hover:bg-primary shadow-[0_0_20px_rgba(255,255,255,0.3)]" />
                        </button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10 hover:text-primary transition-colors"
                            onClick={toggleCamera}
                        >
                            <RefreshCw className={`h-6 w-6 transition-transform duration-500 ${facingMode === "environment" ? "rotate-180" : ""}`} />
                        </Button>
                    </div>

                    {/* Hidden File Input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                    />
                </>
            ) : (
                <div className="relative w-full h-full">
                    <img src={imgSrc} alt="captured" className="w-full h-full object-cover" />

                    {isScanning && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white backdrop-blur-sm z-10 font-mono">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                <Loader2 className="h-12 w-12 text-primary mb-4" />
                            </motion.div>
                            <p className="tracking-[0.2em] text-primary animate-pulse text-sm">PROCESSING NEURAL DATA...</p>
                        </div>
                    )}

                    {!isScanning && (
                        <div className="absolute top-4 right-4 z-20">
                            <Button onClick={retake} size="icon" variant="destructive" className="rounded-full h-10 w-10 shadow-lg border-2 border-white/20">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
