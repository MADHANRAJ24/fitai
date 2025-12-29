import { Capacitor } from "@capacitor/core"

// Define standard Health Metrics interface
export interface HealthMetrics {
    steps: number
    calories: number
    distance: number // in meters
    heartRate: number
    sleepMinutes: number
}

// Define specific platform sources
export type HealthSource = 'apple' | 'google' | 'native'

class HealthService {
    private isNative = Capacitor.isNativePlatform()

    /**
     * Request permissions (Scaffold)
     * In a real app, this calls HealthKit/GoogleFit authorization
     */
    async requestPermissions(): Promise<boolean> {
        if (this.isNative) {
            console.log("Requesting Native Health Permissions...")
            // NOTE: For Native HealthKit/Google Fit integration, use @capacitor-community/health-kit
            // Currently using simulated data for demonstration purposes.
            return true
        } else {
            console.log("Web Mode: Simulating Permissions Grant")
            return new Promise(resolve => setTimeout(() => resolve(true), 1000))
        }
    }

    /**
     * Fetch standard daily metrics
     */
    async getDailyMetrics(source: HealthSource = 'apple'): Promise<HealthMetrics> {
        if (this.isNative) {
            // Placeholder for Real Native Call
            // const data = await HealthKit.query(...)
            return this.getSimulatedData()
        } else {
            return this.getSimulatedData()
        }
    }

    /**
     * Simulation Logic for Web/Dev
     */
    private getSimulatedData(): HealthMetrics {
        // Return somewhat randomized "realistic" data
        const now = new Date()
        const hour = now.getHours()

        // Activity scales with time of day
        const progress = Math.max(0.1, hour / 24)

        return {
            steps: Math.floor(10000 * progress) + Math.floor(Math.random() * 500),
            calories: Math.floor(2500 * progress) + Math.floor(Math.random() * 100),
            distance: Math.floor(8000 * progress),
            heartRate: 60 + Math.floor(Math.random() * 40), // 60-100 bpm
            sleepMinutes: 420 + Math.floor(Math.random() * 60) // ~7-8 hours
        }
    }
}

export const healthService = new HealthService()
