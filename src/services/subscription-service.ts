
import { supabase } from "@/lib/supabase"

export interface Subscription {
    id?: string
    user_id?: string
    plan_name: string
    status: 'active' | 'expired' | 'canceled'
    start_date: string
    end_date: string
    payment_id?: string // Razorpay Order ID
    provider: 'razorpay' | 'stripe' | 'manual'
}

export const SubscriptionService = {
    async getCurrentSubscription(): Promise<Subscription | null> {
        if (!supabase) return null

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return null

            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single()

            if (error) {
                // Ignore "no rows" error
                if (error.code !== 'PGRST116') console.error("Subscription Fetch Error:", error)
                return null
            }

            return data as Subscription
        } catch (e) {
            console.error("Subscription Service Error:", e)
            return null
        }
    },

    async saveSubscription(sub: Omit<Subscription, 'id' | 'user_id'>) {
        if (!supabase) return { error: "Supabase not configured" }

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return { error: "User not logged in" }

            // Upsert or Insert - For now, we'll just insert a new record for history
            const { data, error } = await supabase
                .from('subscriptions')
                .insert([
                    {
                        ...sub,
                        user_id: user.id,
                        created_at: new Date().toISOString()
                    }
                ])
                .select()

            return { data, error }
        } catch (e) {
            return { error: e }
        }
    },

    async checkExpirationStatus(): Promise<{ expiringSoon: boolean; daysLeft: number; expired: boolean }> {
        const sub = await this.getCurrentSubscription()
        if (!sub) return { expiringSoon: false, daysLeft: 0, expired: false }

        const now = new Date()
        const end = new Date(sub.end_date)
        const diffTime = end.getTime() - now.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        return {
            expiringSoon: diffDays <= 3 && diffDays > 0,
            daysLeft: Math.max(0, diffDays),
            expired: diffDays <= 0
        }
    }
}
