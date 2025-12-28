"use client"

import React, { useRef, useState, useCallback } from "react"
import Webcam from "react-webcam"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, RefreshCw, Upload, X, ScanLine, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ScannerProps {
    type: "food" | "body"
    onScanComplete: (result: any) => void
}

export function Scanner({ type, onScanComplete }: ScannerProps) {
    const webcamRef = useRef<Webcam>(null)
    const [imgSrc, setImgSrc] = useState<string | null>(null)
    const [isScanning, setIsScanning] = useState(false)

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot()
        if (imageSrc) {
            setImgSrc(imageSrc)
            setIsScanning(true)

            // Simulate AI Processing
            setTimeout(() => {
                setIsScanning(false)
                const mockResult = type === "food"
                    ? { name: "Avocado Toast", calories: 350, protein: "12g", fats: "18g", carbs: "45g" }
                    : { posture: "Good", alignment: "98%", issues: ["None detected"], correction: "Keep shoulders back" }
                onScanComplete(mockResult)
            }, 3000)
        }
    }, [webcamRef, onScanComplete, type])

    const retake = () => {
        setImgSrc(null)
        onScanComplete(null)
    }

    return (
        <div className="relative w-full max-w-md mx-auto aspect-[3/4] bg-black rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
            {!imgSrc ? (
                <>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-full object-cover"
                        videoConstraints={{ facingMode: "user" }}
                    />
                    <div className="absolute inset-x-0 bottom-0 p-6 flex justify-center items-center gap-8 bg-gradient-to-t from-black/80 to-transparent">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                            <Upload className="h-6 w-6" />
                        </Button>
                        <button
                            onClick={capture}
                            className="h-16 w-16 rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur-sm transition-transform active:scale-95"
                        >
                            <div className="h-12 w-12 rounded-full bg-white" />
                        </button>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                            <RefreshCw className="h-6 w-6" />
                        </Button>
                    </div>
                    {/* Overlay Guide */}
                    <div className="absolute inset-0 border-[30px] border-black/30 pointer-events-none rounded-3xl">
                        <div className="w-full h-full border-2 border-white/30 rounded-xl relative">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
                        </div>
                    </div>
                </>
            ) : (
                <div className="relative w-full h-full">
                    <img src={imgSrc} alt="captured" className="w-full h-full object-cover" />

                    {isScanning && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-sm z-10">
                            <motion.div
                                animate={{ y: [-20, 20, -20] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-full h-1 bg-primary shadow-[0_0_15px_#22c55e] absolute top-1/2"
                            />
                            <ScanLine className="h-12 w-12 text-primary mb-4 animate-pulse" />
                            <p className="font-medium tracking-widest uppercase text-sm">Analyzing...</p>
                        </div>
                    )}

                    {!isScanning && (
                        <div className="absolute top-4 right-4 z-20">
                            <Button onClick={retake} size="icon" variant="destructive" className="rounded-full h-8 w-8">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
