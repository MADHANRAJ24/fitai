import { Workout } from "./workout-service"

export interface ActivityItem {
    id: string
    type: "Workout" | "Nutrition" | "Scan" | "Vision"
    title: string
    details: string
    calories: number
    date: string
    timestamp: number
}

const STORAGE_KEY = "user_activities"

export const ActivityService = {
    saveActivity(activity: Omit<ActivityItem, "id" | "date" | "timestamp">) {
        if (typeof window === "undefined") return

        const newActivity: ActivityItem = {
            ...activity,
            id: crypto.randomUUID(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            timestamp: Date.now()
        }

        const existing = this.getActivities()
        const updated = [newActivity, ...existing].slice(0, 50) // Keep last 50
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

        // Notify listeners
        window.dispatchEvent(new Event("activity_logged"))
    },

    getActivities(): ActivityItem[] {
        if (typeof window === "undefined") return []
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : []
    },

    getRecentWorkouts(): Workout[] {
        // Convert generic activities to Workout format for dashboard compatibility
        return this.getActivities()
            .filter(a => a.type === "Workout" || a.type === "Vision")
            .map(a => ({
                id: a.id,
                title: a.title,
                duration: "N/A", // Could be stored in details
                calories: `${a.calories} kcal`,
                date: a.date,
                intensity: "High",
                exercises: [] // Placeholder to satisfy interface
            }))
    }
}
