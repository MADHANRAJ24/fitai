import { supabase } from "@/lib/supabase"

export interface Workout {
    id: number | string
    title: string
    date: string
    duration: string
    calories: string
    intensity: string
    exercises: string[]
}

const MOCK_WORKOUTS: Workout[] = [
    {
        id: 1,
        title: "Full Body Crush",
        date: "Today",
        duration: "45 min",
        calories: "420 gal",
        intensity: "High",
        exercises: ["Squats", "Pushups", "Burpees", "Plank"],
    },
    {
        id: 2,
        title: "Morning Yoga Flow",
        date: "Yesterday",
        duration: "30 min",
        calories: "150 gal",
        intensity: "Low",
        exercises: ["Sun Salutation", "Warrior I", "Tree Pose"],
    },
    {
        id: 3,
        title: "HIIT Cardio",
        date: "Mon, Dec 22",
        duration: "20 min",
        calories: "300 gal",
        intensity: "High",
        exercises: ["Sprints", "Jumping Jacks", "Mountain Climbers"],
    },
]

export const WorkoutService = {
    async getRecentWorkouts(): Promise<Workout[]> {
        if (supabase) {
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                const { data, error } = await supabase
                    .from('workouts')
                    .select('*')
                    .eq('user_id', user.id) // Filter by User
                    .order('created_at', { ascending: false })
                    .limit(5)

                if (!error && data && data.length > 0) return data as unknown as Workout[]
            }
        }

        // Fallback to mock data if no DB connection or no data
        return MOCK_WORKOUTS
    },

    async logWorkout(workout: Omit<Workout, 'id' | 'date'>) {
        if (supabase) {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                return await supabase.from('workouts').insert([
                    {
                        ...workout,
                        date: new Date().toISOString(),
                        user_id: user.id // Attach User ID
                    }
                ])
            }
        }
        console.log("Mock Log:", workout)
        return { error: null }
    }
}
