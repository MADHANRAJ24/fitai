import { supabase } from "@/lib/supabase"
import { STORAGE_KEYS, UserStorageService } from "./user-storage-service"

export class CloudSyncService {
    static async syncDown(email: string): Promise<'FOUND' | 'NOT_FOUND' | 'ERROR'> {
        if (!email || !supabase) return 'ERROR'

        console.log(`[CloudSync] Attempting to sync down for ${email}`)

        try {
            // 1. Fetch Full Data Blob from profiles table
            const { data, error } = await supabase
                .from('profiles')
                .select('data, subscription_status')
                .eq('email', email)
                .single()

            if (data?.data) {
                console.log("[CloudSync] Data found in cloud. Restoring full bundle...")
                // The 'data' field now contains the entire backup object
                const backup = data.data

                // Save specific keys back to localStorage
                if (backup.profile) localStorage.setItem(STORAGE_KEYS.PROFILE, backup.profile)
                if (backup.onboarding) localStorage.setItem(STORAGE_KEYS.ONBOARDING, backup.onboarding)
                if (backup.stats) localStorage.setItem(STORAGE_KEYS.STATS, backup.stats)
                if (backup.workouts) localStorage.setItem(STORAGE_KEYS.WORKOUTS, backup.workouts)
                if (backup.activity) localStorage.setItem(STORAGE_KEYS.ACTIVITY, backup.activity)
                if (backup.trial) localStorage.setItem(STORAGE_KEYS.TRIAL, backup.trial)
                if (backup.expenses) localStorage.setItem(STORAGE_KEYS.EXPENSES, backup.expenses)
                if (backup.habits) localStorage.setItem(STORAGE_KEYS.HABITS, backup.habits)
                if (backup.chat) localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, backup.chat)

                // Also save the combined backup for convenience
                localStorage.setItem(`backup_${email}`, JSON.stringify(backup))

                // Trigger local restore logic to update UI
                UserStorageService.restoreUserData(email)

                window.dispatchEvent(new Event("storage_restored"))
                window.dispatchEvent(new Event("user_updated"))

                return 'FOUND'
            } else {
                console.log("[CloudSync] No data found in cloud.")
                return 'NOT_FOUND'
            }

        } catch (e) {
            console.error("[CloudSync] Sync down failed", e)
            return 'ERROR'
        }
    }

    /**
     * Uploads the entire local data bundle to Supabase.
     */
    static async syncUp(email: string) {
        if (!email || !supabase) return

        const backupStr = localStorage.getItem(`backup_${email}`)
        if (!backupStr) {
            console.log("[CloudSync] No local backup to sync up.")
            return
        }

        try {
            console.log(`[CloudSync] Syncing up full data bundle...`)
            const fullData = JSON.parse(backupStr)

            // Upsert into profiles table
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    email: email,
                    data: fullData,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'email' })

            if (error) throw error
            console.log(`[CloudSync] Sync up complete.`)

        } catch (e) {
            console.error("[CloudSync] Sync up failed", e)
        }
    }
}
