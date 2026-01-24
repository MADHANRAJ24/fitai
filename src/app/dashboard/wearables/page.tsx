"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Activity, Heart, Moon, Watch, Smartphone, RefreshCw, CheckCircle2, Bluetooth, Search, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { healthService, type HealthMetrics } from "@/services/health-service"

export default function WearablesPage() {
    const [isScanning, setIsScanning] = useState(false)
    const [foundDevices, setFoundDevices] = useState<any[]>([])
    const [connectedDevice, setConnectedDevice] = useState<string | null>(null)
    const [metrics, setMetrics] = useState<HealthMetrics | null>(null)

    // Load connection state
    useEffect(() => {
        const stored = localStorage.getItem('connected_device_id')
        if (stored) {
            setConnectedDevice(stored)
            fetchMetrics(stored)
        }
    }, [])

    const startScan = () => {
        setIsScanning(true)
        setFoundDevices([])

        // Simulate finding devices over time
        setTimeout(() => {
            setFoundDevices(prev => [...prev, { id: 'apple', name: 'Apple Watch Ultra', type: 'watch', signal: 98 }])
        }, 1500)

        setTimeout(() => {
            setFoundDevices(prev => [...prev, { id: 'samsung', name: 'Galaxy Watch 6', type: 'watch', signal: 85 }])
        }, 3000)

        setTimeout(() => {
            setFoundDevices(prev => [...prev, { id: 'garmin', name: 'Garmin Fenix 7', type: 'watch', signal: 70 }])
            setIsScanning(false)
        }, 4500)
    }

    const connectDevice = (device: any) => {
        toast.loading(`Pairing with ${device.name}...`)
        setTimeout(() => {
            setConnectedDevice(device.id)
            localStorage.setItem('connected_device_id', device.id)
            toast.dismiss()
            toast.success(`Connected to ${device.name}`)
            fetchMetrics(device.id)
        }, 2000)
    }

    const disconnect = () => {
        setConnectedDevice(null)
        localStorage.removeItem('connected_device_id')
        setMetrics(null)
        setFoundDevices([])
        toast.info("Device disconnected")
    }

    const fetchMetrics = async (deviceId: string) => {
        const data = await healthService.getDailyMetrics(deviceId === 'apple' ? 'apple' : 'google')
        setMetrics(data)
    }

    return (
        <div className="space-y-6 h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Bluetooth className="h-8 w-8 text-blue-500" />
                        Device Connectivity
                    </h2>
                    <p className="text-muted-foreground">Scan and pair bluetooth wearables.</p>
                </div>
            </div>

            {/* Radar / Connection Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass border-white/5 relative overflow-hidden min-h-[400px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
                    <CardHeader>
                        <CardTitle>Bluetooth Scanner</CardTitle>
                        <CardDescription>
                            {connectedDevice ? "Device Paired & Active" : "Search for nearby fitness devices"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-8">

                        {connectedDevice ? (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center gap-6"
                            >
                                <div className="h-40 w-40 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center relative">
                                    <div className="absolute inset-0 rounded-full border border-green-500 animate-ping opacity-20" />
                                    <Watch className="h-20 w-20 text-green-500" />
                                    <div className="absolute top-2 right-4 bg-green-500 text-black textxs font-bold px-2 py-0.5 rounded-full">LIVE</div>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-white">Apple Watch Ultra</h3>
                                    <p className="text-green-400 font-mono flex items-center justify-center gap-2 mt-2">
                                        <Wifi className="h-4 w-4" /> Signal Strong
                                    </p>
                                </div>
                                <Button variant="destructive" onClick={disconnect} className="mt-4">
                                    Disconnect Device
                                </Button>
                            </motion.div>
                        ) : (
                            <>
                                {/* Radar Animation */}
                                <div className="relative h-64 w-64 mb-8">
                                    <div className="absolute inset-0 rounded-full border border-white/10" />
                                    <div className="absolute inset-12 rounded-full border border-white/10" />
                                    <div className="absolute inset-24 rounded-full border border-white/10" />

                                    {isScanning && (
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            style={{ clipPath: "polygon(50% 50%, 100% 0, 100% 50%, 50% 50%)" }}
                                        />
                                    )}

                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Button
                                            size="lg"
                                            className={`rounded-full h-20 w-20 ${isScanning ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"}`}
                                            onClick={() => isScanning ? setIsScanning(false) : startScan()}
                                        >
                                            {isScanning ? <Search className="h-8 w-8 animate-pulse" /> : <Bluetooth className="h-8 w-8" />}
                                        </Button>
                                    </div>

                                    {/* Found Devices Popups */}
                                    <AnimatePresence>
                                        {foundDevices.map((device, i) => (
                                            <motion.button
                                                key={device.id}
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{
                                                    scale: 1,
                                                    opacity: 1,
                                                    x: Math.cos(i * 2) * 100, // Scatter around circle
                                                    y: Math.sin(i * 2) * 100
                                                }}
                                                className="absolute inset-0 m-auto h-12 w-auto px-4 bg-gray-900 border border-white/20 rounded-full flex items-center gap-2 shadow-xl hover:bg-gray-800 z-10 whitespace-nowrap"
                                                onClick={() => connectDevice(device)}
                                            >
                                                <Watch className="h-4 w-4 text-blue-400" />
                                                <span className="text-xs font-bold text-white">{device.name}</span>
                                            </motion.button>
                                        ))}
                                    </AnimatePresence>
                                </div>
                                <p className="text-muted-foreground animate-pulse">
                                    {isScanning ? "Scanning for nearby devices..." : "Tap to start scanning"}
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Metrics */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Card className="glass border-white/5 h-full">
                        <CardHeader>
                            <CardTitle>Real-time Telemetry</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {!connectedDevice ? (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                    <Bluetooth className="h-16 w-16 mb-4" />
                                    <p>Connect a device to view live telemetry</p>
                                </div>
                            ) : (
                                <>
                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-red-500 rounded-full text-black"><Heart className="h-6 w-6" /></div>
                                            <div>
                                                <p className="text-sm text-red-400 font-bold uppercase">Heart Rate</p>
                                                <p className="text-2xl font-bold text-white">{metrics?.heartRate || 72} bpm</p>
                                            </div>
                                        </div>
                                        <Activity className="h-12 w-12 text-red-500/20 animate-pulse" />
                                    </div>

                                    <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-orange-500 rounded-full text-black"><Activity className="h-6 w-6" /></div>
                                            <div>
                                                <p className="text-sm text-orange-400 font-bold uppercase">Active Calories</p>
                                                <p className="text-2xl font-bold text-white">{metrics?.calories || 450} kcal</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-indigo-500 rounded-full text-black"><Moon className="h-6 w-6" /></div>
                                            <div>
                                                <p className="text-sm text-indigo-400 font-bold uppercase">Sleep Data</p>
                                                <p className="text-2xl font-bold text-white">7h 45m</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
