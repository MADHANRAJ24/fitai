// Body Profile Service - Manages user body metrics and preferences

export interface BodyCondition {
    id: string
    name: string
    description: string
    excludeExercises: string[]
}

export interface BodyProfile {
    height: number // in cm
    weight: number // in kg
    age: number
    gender: 'male' | 'female' | 'other'
    fitnessLevel: 'beginner' | 'intermediate' | 'advanced'
    goal: 'lose_weight' | 'build_muscle' | 'maintain' | 'endurance'
    conditions: string[] // IDs of body conditions
    dietary: {
        preference: 'veg' | 'non-veg' | 'vegan'
        allergies: string[]
        dailyCalorieTarget: number
    }
    createdAt: string
    updatedAt: string
}

// Common body conditions that affect exercise selection
export const BODY_CONDITIONS: BodyCondition[] = [
    { id: 'back_pain', name: 'Back Pain', description: 'Lower or upper back issues', excludeExercises: ['Deadlift', 'Bent Over Row', 'Good Mornings'] },
    { id: 'knee_issues', name: 'Knee Issues', description: 'Knee pain or injuries', excludeExercises: ['Squats', 'Lunges', 'Jump Squats', 'Box Jumps'] },
    { id: 'shoulder_injury', name: 'Shoulder Injury', description: 'Rotator cuff or shoulder problems', excludeExercises: ['Overhead Press', 'Lateral Raises', 'Upright Rows'] },
    { id: 'wrist_pain', name: 'Wrist Pain', description: 'Carpal tunnel or wrist issues', excludeExercises: ['Push-ups', 'Front Squats', 'Wrist Curls'] },
    { id: 'neck_problems', name: 'Neck Problems', description: 'Cervical spine issues', excludeExercises: ['Shrugs', 'Neck Bridges', 'Upright Rows'] },
    { id: 'heart_condition', name: 'Heart Condition', description: 'Cardiovascular limitations', excludeExercises: ['HIIT', 'Burpees', 'Sprint Intervals'] },
]

const STORAGE_KEY = 'fitai_body_profile'

class BodyProfileService {
    getProfile(): BodyProfile | null {
        if (typeof window === 'undefined') return null
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : null
    }

    saveProfile(profile: Omit<BodyProfile, 'createdAt' | 'updatedAt'>): BodyProfile {
        const existingProfile = this.getProfile()
        const fullProfile: BodyProfile = {
            ...profile,
            createdAt: existingProfile?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fullProfile))
        return fullProfile
    }

    calculateBMI(profile: BodyProfile): { value: number; category: string; color: string } {
        const heightInMeters = profile.height / 100
        const bmi = profile.weight / (heightInMeters * heightInMeters)

        let category = 'Normal'
        let color = 'text-green-500'

        if (bmi < 18.5) {
            category = 'Underweight'
            color = 'text-yellow-500'
        } else if (bmi >= 18.5 && bmi < 25) {
            category = 'Normal'
            color = 'text-green-500'
        } else if (bmi >= 25 && bmi < 30) {
            category = 'Overweight'
            color = 'text-orange-500'
        } else {
            category = 'Obese'
            color = 'text-red-500'
        }

        return { value: Math.round(bmi * 10) / 10, category, color }
    }

    getRecommendedCalories(profile: BodyProfile): number {
        // Harris-Benedict Formula for BMR
        let bmr: number
        if (profile.gender === 'male') {
            bmr = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age)
        } else {
            bmr = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age)
        }

        // Activity multiplier based on fitness level
        const multipliers = { beginner: 1.375, intermediate: 1.55, advanced: 1.725 }
        const tdee = bmr * multipliers[profile.fitnessLevel]

        // Adjust based on goal
        switch (profile.goal) {
            case 'lose_weight': return Math.round(tdee - 500)
            case 'build_muscle': return Math.round(tdee + 300)
            case 'endurance': return Math.round(tdee + 200)
            default: return Math.round(tdee)
        }
    }

    getRecommendedIntensity(profile: BodyProfile): 'low' | 'medium' | 'high' {
        const bmi = this.calculateBMI(profile)

        // Consider BMI and fitness level
        if (profile.fitnessLevel === 'beginner' || bmi.value > 30) return 'low'
        if (profile.fitnessLevel === 'advanced' && bmi.value < 25) return 'high'
        return 'medium'
    }

    getExcludedExercises(profile: BodyProfile): string[] {
        const excluded: string[] = []
        profile.conditions.forEach(conditionId => {
            const condition = BODY_CONDITIONS.find(c => c.id === conditionId)
            if (condition) {
                excluded.push(...condition.excludeExercises)
            }
        })
        return [...new Set(excluded)] // Remove duplicates
    }

    getSetsReps(profile: BodyProfile): { sets: number; reps: string } {
        switch (profile.fitnessLevel) {
            case 'beginner':
                return { sets: 2, reps: '8-10' }
            case 'intermediate':
                return { sets: 3, reps: '10-12' }
            case 'advanced':
                return { sets: 4, reps: '12-15' }
            default:
                return { sets: 3, reps: '10-12' }
        }
    }
}

export const bodyProfileService = new BodyProfileService()
