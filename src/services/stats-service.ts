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
        // 1. Try to get real data from Supabase
        if (supabase) {
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                // Fetch workouts for this user
                const { data: workouts } = await supabase
                    .from('workouts')
                    .select('calories, duration, date')
                    .eq('user_id', user.id)
                // .gte('date', startOfMonth) // Real logic would filter by date

                if (workouts && workouts.length > 0) {
                    // Calculate totals
                    let totalCals = 0
                    let totalMins = 0

                    workouts.forEach(w => {
                        // Parse "450" from "450 gal" or just number
                        const calVal = parseInt(w.calories.toString().replace(/\D/g, '')) || 0
                        const durVal = parseInt(w.duration.toString().replace(/\D/g, '')) || 0
                        totalCals += calVal
                        totalMins += durVal
                    })

                    // Mock steps based on activity (approx 100 steps per min of exercise + base)
                    const calculatedSteps = 3500 + (totalMins * 120)

                    return {
                        calories: totalCals,
                        activeMinutes: totalMins,
                        steps: calculatedSteps,
                        goalsMet: 3, // Mock goal
                        calorieTrend: "+12%",
                        minutesTrend: "+5%",
                        stepsTrend: "+8%"
                    }
                }
            }
        }

        // 2. Fallback to mock data (if no user or no DB)
        // We will randomized it slightly so it feels "alive" on refresh
        const randomBase = Math.floor(Math.random() * 500)
        return {
            calories: 2350 + randomBase,
            activeMinutes: 145 + Math.floor(Math.random() * 30),
            steps: 8500 + (randomBase * 10),
            goalsMet: 3,
            calorieTrend: "+20.1%",
            minutesTrend: "+15.2%",
            stepsTrend: "+5.4%"
        }
    }
}
