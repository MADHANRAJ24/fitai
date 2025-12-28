"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
// import { User } from "@supabase/supabase-js" // Temporarily avoiding type import issues if not installed fully, but it is installed.

type User = any // Using any for simplicity in this step, to prevent type errors if keys are missing.

interface AuthContextType {
    user: User | null
    loading: boolean
    signIn: () => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signIn: async () => { },
    signOut: async () => { },
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!supabase) {
            setLoading(false)
            return
        }

        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const signIn = async () => {
        if (!supabase) return alert("Supabase not configured")
        await supabase.auth.signInWithOAuth({
            provider: 'google',
        })
    }

    const signOut = async () => {
        if (!supabase) return
        await supabase.auth.signOut()
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
