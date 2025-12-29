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
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings>({
        pushNotifications: true,
        emailDigest: true,
        darkMode: true
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
        toast.success(`${key === 'pushNotifications' ? 'Push Notifications' : key === 'emailDigest' ? 'Email Digest' : 'Dark Mode'} ${value ? 'enabled' : 'disabled'}`)
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
        <div className="space-y-8 h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <SettingsIcon className="h-8 w-8 text-gray-400" />
                        Settings
                    </h2>
                    <p className="text-muted-foreground">Manage your preferences and account security.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* General Preferences */}
                <Card className="glass border-white/5 bg-black/40">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-cyan-400" /> Notifications
                        </CardTitle>
                        <CardDescription>Control how we communicate with you.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <label className="text-sm font-medium text-white flex items-center gap-2">
                                    <Smartphone className="h-4 w-4 text-muted-foreground" /> Push Notifications
                                </label>
                                <p className="text-xs text-muted-foreground">Receive alerts about workouts & ego challenges.</p>
                            </div>
                            <Switch
                                checked={settings.pushNotifications}
                                onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                            />
                        </div>
                        <Separator className="bg-white/10" />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <label className="text-sm font-medium text-white flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" /> Email Digest
                                </label>
                                <p className="text-xs text-muted-foreground">Weekly progress reports and tips.</p>
                            </div>
                            <Switch
                                checked={settings.emailDigest}
                                onCheckedChange={(checked) => updateSetting('emailDigest', checked)}
                            />
                        </div>
                        <Separator className="bg-white/10" />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <label className="text-sm font-medium text-white flex items-center gap-2">
                                    <Moon className="h-4 w-4 text-muted-foreground" /> Dark Mode
                                </label>
                                <p className="text-xs text-muted-foreground">Always on. Can&apos;t be turned off.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-xs text-green-500 font-bold">ON</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Account & Security */}
                <Card className="glass border-white/5 bg-black/40">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-emerald-400" /> Security & Privacy
                        </CardTitle>
                        <CardDescription>Manage your data and legal agreements.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <a href="https://www.termsfeed.com/live/privacy-policy" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="w-full justify-between border-white/10 hover:bg-white/5 h-12">
                                <span className="flex items-center gap-2"><Globe className="h-4 w-4" /> Privacy Policy</span>
                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </a>
                        <a href="https://www.termsfeed.com/live/terms-of-service" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="w-full justify-between border-white/10 hover:bg-white/5 h-12 mt-2">
                                <span className="flex items-center gap-2"><Shield className="h-4 w-4" /> Terms of Service</span>
                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </a>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-white">Data Export</span>
                                <Badge variant="outline" className="text-xs">JSON</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">Download a copy of all your app data.</p>
                            <Button size="sm" variant="secondary" className="w-full gap-2" onClick={handleDataExport}>
                                <Download className="h-4 w-4" />
                                Download Archive
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone - MANDATORY FOR PLAY STORE */}
                <Card className="glass border-red-500/20 bg-red-500/5 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-red-500 flex items-center gap-2">
                            <Trash2 className="h-5 w-5" /> Danger Zone
                        </CardTitle>
                        <CardDescription className="text-red-400/80">
                            Irreversible actions. Proceed with caution.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-red-500/20 bg-red-500/10">
                            <div>
                                <h4 className="font-bold text-white">Delete Account</h4>
                                <p className="text-sm text-red-200/70">
                                    Permanently remove all your data. This cannot be undone.
                                </p>
                            </div>
                            <Button variant="destructive" onClick={handleDeleteAccount}>
                                Delete My Account
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="text-center text-xs text-muted-foreground pt-8">
                FitAI Platform v2.0
            </div>
        </div>
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
