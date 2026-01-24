"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Capacitor } from '@capacitor/core'
import { PushService } from "@/services/push-service"
import { AdMob } from '@capacitor-community/admob'
import { toast } from "sonner"
import { UserStorageService } from "@/services/user-storage-service"
import { LoginSuccessOverlay } from "@/components/ui/login-success-overlay"

type User = any

interface AuthContextType {
    user: User | null
    loading: boolean
    isSyncing: boolean
    signIn: () => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isSyncing: false,
    signIn: async () => { },
    signOut: async () => { },
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [isSyncing, setIsSyncing] = useState(false)
    const [showWelcome, setShowWelcome] = useState(false)

    useEffect(() => {
        if (!supabase) {
            setLoading(false)
            return
        }

        // Initialize Google Auth only on native devices
        // Initialize Google Auth only on native devices
        if (Capacitor.isNativePlatform()) {
            try {
                // FORCE CONFIGURATION (Fix for Error 10)
                GoogleAuth.initialize({
                    clientId: '149062085555-j6r5ednpkjmc1s5oh1agrjjmsck66am3.apps.googleusercontent.com',
                    scopes: ['profile', 'email'],
                    grantOfflineAccess: true,
                }).catch(e => console.error("Google Auth Init Failed:", e));

                PushService.init().catch(e => console.error("Push Init Failed:", e));
                AdMob.initialize().catch(e => console.error("AdMob Init Failed:", e));
            } catch (e) {
                console.error("Native Plugin Init Error:", e);
            }
        }

        // Check active session
        // Check active session with strict async handling
        const initSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)

            if (session?.user?.email) {
                UserStorageService.restoreUserData(session.user.email)
                setIsSyncing(true)

                try {
                    const { CloudSyncService } = await import("@/services/cloud-sync-service")
                    // Wait up to 5 seconds for sync, then proceed (Offline Fallback)
                    const syncPromise = CloudSyncService.syncDown(session.user.email)
                    const timeoutPromise = new Promise(resolve => setTimeout(resolve, 5000))

                    await Promise.race([syncPromise, timeoutPromise])
                } catch (e) {
                    console.error("Auto-sync failed:", e)
                } finally {
                    setIsSyncing(false)
                }
            }
            setLoading(false) // Only set false AFTER sync attempt
        }

        initSession()

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            if (_event === 'SIGNED_IN' && session?.user?.email) {
                setIsSyncing(true)
                import("@/services/cloud-sync-service").then(async ({ CloudSyncService }) => {
                    await CloudSyncService.syncDown(session.user.email!)
                    setIsSyncing(false)
                })
            }
            if (_event === 'SIGNED_OUT') {
                UserStorageService.clearActiveData()
            }
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const signIn = async () => {
        if (!supabase) return alert("Supabase not configured")

        try {
            if (Capacitor.isNativePlatform()) {
                // Native Google Sign In
                try {
                    const googleUser = await GoogleAuth.signIn();
                    if (googleUser) {
                        const { error } = await supabase.auth.signInWithIdToken({
                            provider: 'google',
                            token: googleUser.authentication.idToken,
                            nonce: (googleUser.authentication as any).nonce,
                        });
                        if (error) {
                            console.error("Supabase Auth Error:", error);
                            alert(`Supabase Error: ${error.message}`);
                            throw error;
                        } else {
                            // RESTORE DATA
                            if (googleUser.email) {
                                setIsSyncing(true)
                                const { CloudSyncService } = await import("@/services/cloud-sync-service");
                                await CloudSyncService.syncDown(googleUser.email!);
                                setIsSyncing(false)
                            }
                            // TRIGGER IMMERSIVE OVERLAY
                            setShowWelcome(true)
                            setTimeout(() => setShowWelcome(false), 2500)
                        }
                    }
                } catch (nativeError) {
                    console.error("Native Google Login Failed:", nativeError);
                    alert(`Login Error: ${JSON.stringify(nativeError)}. \n\n Please take a screenshot of this.`);
                }
            } else {
                // Web Fallback
                const { data, error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: `${window.location.origin}/dashboard`
                    }
                })
                if (!error) {
                    // Note: Web redirect happens immediately, so restore might happen on mount
                    // We handle mount restore in useEffect
                }
            }
        } catch (error) {
            console.error("Login Failed:", error);
        }
    }

    const signOut = async () => {
        if (!supabase) return
        await supabase.auth.signOut()
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, isSyncing, signIn, signOut }}>
            {children}
            <LoginSuccessOverlay isVisible={showWelcome} />
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
