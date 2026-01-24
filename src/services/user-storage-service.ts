
export const STORAGE_KEYS = {
    PROFILE: 'fitai_body_profile',
    ONBOARDING: 'user_onboarding',
    STATS: 'fitai_user_stats',
    WORKOUTS: 'fitai_workout_history',
    ACTIVITY: 'fitai_activity_log',
    TRIAL: 'fitai_user_trial',
    EXPENSES: 'fitai_expenses_log',
    HABITS: 'fitai_habits_log',
    CHAT_HISTORY: 'fitai_chat_history'
}

export class UserStorageService {
    static saveUserData(email: string) {
        if (!email) return
        if (typeof window === 'undefined') return

        const backup = {
            profile: localStorage.getItem(STORAGE_KEYS.PROFILE),
            onboarding: localStorage.getItem(STORAGE_KEYS.ONBOARDING),
            stats: localStorage.getItem(STORAGE_KEYS.STATS),
            workouts: localStorage.getItem(STORAGE_KEYS.WORKOUTS),
            activity: localStorage.getItem(STORAGE_KEYS.ACTIVITY),
            trial: localStorage.getItem(STORAGE_KEYS.TRIAL),
            expenses: localStorage.getItem(STORAGE_KEYS.EXPENSES),
            habits: localStorage.getItem(STORAGE_KEYS.HABITS),
            chat: localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY)
        }

        localStorage.setItem(`backup_${email}`, JSON.stringify(backup))
        console.log(`[UserStorage] Data backed up for ${email}`)

        // Trigger Cloud Sync
        import("./cloud-sync-service").then(({ CloudSyncService }) => {
            CloudSyncService.syncUp(email)
        }).catch(err => console.error("Cloud Sync failed to load", err))
    }

    static restoreUserData(email: string) {
        if (!email) return
        if (typeof window === 'undefined') return

        const backupStr = localStorage.getItem(`backup_${email}`)
        if (!backupStr) {
            console.log(`[UserStorage] No backup found for ${email}`)
            return
        }

        try {
            const backup = JSON.parse(backupStr)

            if (backup.profile) localStorage.setItem(STORAGE_KEYS.PROFILE, backup.profile)
            if (backup.onboarding) localStorage.setItem(STORAGE_KEYS.ONBOARDING, backup.onboarding)
            if (backup.stats) localStorage.setItem(STORAGE_KEYS.STATS, backup.stats)
            if (backup.workouts) localStorage.setItem(STORAGE_KEYS.WORKOUTS, backup.workouts)
            if (backup.activity) localStorage.setItem(STORAGE_KEYS.ACTIVITY, backup.activity)
            if (backup.trial) localStorage.setItem(STORAGE_KEYS.TRIAL, backup.trial)
            if (backup.expenses) localStorage.setItem(STORAGE_KEYS.EXPENSES, backup.expenses)
            if (backup.habits) localStorage.setItem(STORAGE_KEYS.HABITS, backup.habits)
            if (backup.chat) localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, backup.chat)

            console.log(`[UserStorage] Data restored for ${email}`)

            // SMART RESTORE: If we have onboarding data but no profile, try to bridge the gap
            if (localStorage.getItem(STORAGE_KEYS.ONBOARDING) && !localStorage.getItem(STORAGE_KEYS.PROFILE)) {
                try {
                    const onboarding = JSON.parse(localStorage.getItem(STORAGE_KEYS.ONBOARDING) || '{}')
                    if (onboarding.name) {
                        // We can't fully create a profile without age/gender/height/weight if they are missing
                        // But we can at least save what we have to avoid a total reset if the user visited onboarding
                        console.log("[UserStorage] Attempting to restore profile from onboarding data...")
                        // The actual conversion happens in BodyProfileService or we can leave it to the UI to handle "partial" profiles
                    }
                } catch (e) {
                    console.warn("Failed to smart-restore profile", e)
                }
            }

            // Trigger update event
            window.dispatchEvent(new Event("storage_restored"))
            window.dispatchEvent(new Event("user_updated"))
        } catch (e) {
            console.error("Failed to restore user data", e)
        }
    }

    static clearActiveData() {
        Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
    }
}
