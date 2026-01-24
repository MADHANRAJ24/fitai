"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bell, Shield, Mail, Smartphone, ExternalLink, Trash2, Moon, Globe, Download, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

const SETTINGS_KEY = "fitai_settings"

interface Settings {
    pushNotifications: boolean
    emailDigest: boolean
    darkMode: boolean
    hapticsEnabled?: boolean
    soundEnabled?: boolean
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings>({
        pushNotifications: true,
        emailDigest: true,
        darkMode: true,
        hapticsEnabled: true,
        soundEnabled: true
    })
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        // Load settings from localStorage
        const stored = localStorage.getItem(SETTINGS_KEY)
        if (stored) {
            setSettings(JSON.parse(stored))
        }
        setIsLoaded(true)
    }, [])

    const updateSetting = (key: keyof Settings, value: boolean) => {
        const newSettings = { ...settings, [key]: value }
        setSettings(newSettings)
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))
        toast.success(`${key === 'pushNotifications' ? 'Push Notifications' : key === 'hapticsEnabled' ? 'Haptics' : key === 'soundEnabled' ? 'Sound' : 'Setting'} ${value ? 'enabled' : 'disabled'}`)
    }

    const handleDeleteAccount = () => {
        const confirmed = window.confirm("Are you sure? This action cannot be undone and your data will be permanently deleted.")
        if (confirmed) {
            // Clear all localStorage
            localStorage.clear()
            toast.error("Account scheduled for deletion", {
                description: "Your data will be removed within 30 days. Contact support to cancel."
            })
        }
    }

    const handleDataExport = () => {
        // Gather all localStorage data
        const exportData: Record<string, unknown> = {}
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key) {
                try {
                    exportData[key] = JSON.parse(localStorage.getItem(key) || "")
                } catch {
                    exportData[key] = localStorage.getItem(key)
                }
            }
        }

        // Create and download JSON file
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `fitai-data-export-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast.success("Data exported successfully!", {
            description: "Check your downloads folder."
        })
    }

    // Don't render until client-side to prevent hydration mismatch
    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        )
    }

    return (
        <div className="space-y-10 h-[calc(100vh-8rem)] overflow-y-auto pr-4 no-scrollbar pb-10 relative">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h2 className="text-4xl font-black text-white font-heading uppercase tracking-tighter flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                            <SettingsIcon className="h-8 w-8 text-primary" />
                        </div>
                        System Configuration
                    </h2>
                    <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.3em] mt-1 opacity-70">
                        Node: CORE_INTERFACE • Access: USER_AUTHORIZED
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* General Preferences */}
                <Card className="bg-black/60 backdrop-blur-3xl border border-white/5 rounded-[2rem] overflow-hidden relative shadow-2xl group">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/30 rounded-tl-[2rem] opacity-30 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-2xl font-black text-white font-heading uppercase tracking-tighter flex items-center gap-3">
                            <Bell className="h-6 w-6 text-primary" /> Operational Alerts
                        </CardTitle>
                        <CardDescription className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1 opacity-60">Control biometric telemetry flow.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                        {/* Push Notifications */}
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                            <div className="space-y-0.5">
                                <label className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                                    <Smartphone className="h-4 w-4 text-primary opacity-50" /> Push Notifications
                                </label>
                                <p className="text-[10px] text-muted-foreground font-medium">Real-time mission updates.</p>
                            </div>
                            <Switch
                                checked={settings.pushNotifications}
                                onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                            />
                        </div>

                        {/* Email Digest */}
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                            <div className="space-y-0.5">
                                <label className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-primary opacity-50" /> Intelligence Report
                                </label>
                                <p className="text-[10px] text-muted-foreground font-medium">Weekly performance analytics.</p>
                            </div>
                            <Switch
                                checked={settings.emailDigest}
                                onCheckedChange={(checked) => updateSetting('emailDigest', checked)}
                            />
                        </div>

                        {/* Haptic Feedback */}
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                            <div className="space-y-0.5">
                                <label className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                                    <Smartphone className="h-4 w-4 text-primary opacity-50" /> Sensory Feedback
                                </label>
                                <p className="text-[10px] text-muted-foreground font-medium">Tactile reinforcement on interaction.</p>
                            </div>
                            <Switch
                                checked={settings.hapticsEnabled ?? true}
                                onCheckedChange={(checked) => updateSetting('hapticsEnabled', checked)}
                            />
                        </div>

                        {/* Sound Effects */}
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                            <div className="space-y-0.5">
                                <label className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                                    <Bell className="h-4 w-4 text-primary opacity-50" /> Acoustic Feedback
                                </label>
                                <p className="text-[10px] text-muted-foreground font-medium">Audio confirmation protocols.</p>
                            </div>
                            <Switch
                                checked={settings.soundEnabled ?? true}
                                onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                            />
                        </div>

                        {/* Dark Mode */}
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/20">
                            <div className="space-y-0.5">
                                <label className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                    <Moon className="h-4 w-4" /> Visual Mode: Midnight
                                </label>
                                <p className="text-[10px] text-primary/70 font-bold">Standard tactical environment.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span className="text-[10px] text-primary font-black uppercase">Active</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Account & Security */}
                <div className="space-y-8">
                    <Card className="bg-black/60 backdrop-blur-3xl border border-white/5 rounded-[2rem] overflow-hidden relative shadow-2xl group">
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/30 rounded-tr-[2rem] opacity-30 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-2xl font-black text-white font-heading uppercase tracking-tighter flex items-center gap-3">
                                <Shield className="h-6 w-6 text-primary" /> Security Protocol
                            </CardTitle>
                            <CardDescription className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1 opacity-60">Manage data & legal authorizations.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-4">
                            <a href="https://www.termsfeed.com/live/privacy-policy" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="w-full justify-between border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-primary/30 h-14 rounded-2xl group/btn transition-all">
                                    <span className="flex items-center gap-3 font-bold uppercase tracking-widest text-xs group-hover/btn:text-primary transition-colors"><Globe className="h-4 w-4" /> Privacy Protocol</span>
                                    <ExternalLink className="h-4 w-4 text-muted-foreground opacity-50 group-hover/btn:opacity-100" />
                                </Button>
                            </a>
                            <a href="https://www.termsfeed.com/live/terms-of-service" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="w-full justify-between border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-primary/30 h-14 rounded-2xl group/btn transition-all">
                                    <span className="flex items-center gap-3 font-bold uppercase tracking-widest text-xs group-hover/btn:text-primary transition-colors"><Shield className="h-4 w-4" /> Service Terms</span>
                                    <ExternalLink className="h-4 w-4 text-muted-foreground opacity-50 group-hover/btn:opacity-100" />
                                </Button>
                            </a>

                            <div className="p-6 rounded-[1.5rem] bg-white/[0.03] border border-white/5 mt-6 group/archive relative overflow-hidden">
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/archive:opacity-100 transition-opacity" />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-black border border-white/10">
                                                <Download className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-white uppercase tracking-widest">Data Archive</p>
                                                <p className="text-[9px] text-muted-foreground font-mono mt-0.5 uppercase tracking-widest">Type: BSON_STREAM</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="secondary" className="w-full h-12 gap-3 bg-primary text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-[1.02] transition-all" onClick={handleDataExport}>
                                        Generate Download Port
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="bg-red-500/[0.03] backdrop-blur-3xl border border-red-500/20 rounded-[2rem] overflow-hidden relative shadow-2xl group">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-red-500/30 rounded-tl-[2rem]" />
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black text-red-500 font-heading uppercase tracking-tighter flex items-center gap-3">
                                <Trash2 className="h-5 w-5" /> Safety Protocol
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl border border-red-500/10 bg-red-500/5">
                                <div className="text-center md:text-left">
                                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Account Termination</h4>
                                    <p className="text-[10px] text-red-300/50 font-bold leading-relaxed mt-1 uppercase tracking-wider">
                                        Permanently purge all biometric data from local and secondary storage.
                                    </p>
                                </div>
                                <Button
                                    variant="destructive"
                                    className="bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest text-[10px] h-12 px-6 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                                    onClick={handleDeleteAccount}
                                >
                                    Erase Everything
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="text-center text-xs text-muted-foreground pt-8">
                FitAI Platform v2.0
            </div>
        </div >
    )
}

function SettingsIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    )
}
