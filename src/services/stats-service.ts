import { supabase } from "@/lib/supabase"
import { WorkoutService } from "./workout-service"

export interface UserStats {
    calories: number
    activeMinutes: number
    steps: number
    goalsMet: number
    calorieTrend: string
    minutesTrend: string
    stepsTrend: string
}

export const StatsService = {
    async getUserStats(): Promise<UserStats> {
        // 1. Get Base Metabolic Rate (BMR) from Profile
        let bmr = 2000 // Default fallback
        if (typeof window !== 'undefined') {
            const { bodyProfileService } = await import("@/services/body-profile-service")
            const profile = bodyProfileService.getProfile()
            if (profile) {
                // Ensure we get dynamic daily target, not just BMR
                bmr = bodyProfileService.getRecommendedCalories(profile)
            }
        }

        // 2. Get Real Activity Data
        let totalWorkoutCals = 0
        let totalActiveMinutes = 0
        let steps = 0

        if (typeof window !== 'undefined') {
            const { ActivityService } = await import("@/services/activity-service")
            const todayActivities = ActivityService.getTodayActivities()

            todayActivities.forEach(act => {
                if (act.type === 'Workout' || act.type === 'Vision') {
                    totalWorkoutCals += act.calories
                }

                if (act.details.includes('min')) {
                    const match = act.details.match(/(\d+)\s*min/)
                    if (match) totalActiveMinutes += parseInt(match[1])
                } else {
                    if (act.calories > 0) totalActiveMinutes += Math.round(act.calories / 8)
                }
            })

            // Estimate Steps (Approx 120 steps per min of activity, no baseline)
            steps = totalActiveMinutes * 120
        }

        // 3. Calculate Totals (Zero State Rule: Active Only)
        // User requested "start at 0", so we exclude BMR from the dashboard display

        // Goals Met Logic
        let goalsMet = 0
        if (totalWorkoutCals > 500) goalsMet++
        if (totalActiveMinutes > 30) goalsMet++
        if (steps > 6000) goalsMet++

        return {
            calories: totalWorkoutCals, // Active Only
            activeMinutes: totalActiveMinutes,
            steps: Number(steps.toFixed(0)),
            goalsMet: goalsMet,
            calorieTrend: "+0%",
            minutesTrend: "0%",
            stepsTrend: "0%"
        }
    }
}
