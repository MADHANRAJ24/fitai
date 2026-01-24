// Trial Service - Manages free trial with device fingerprinting protection

import FingerprintJS from '@fingerprintjs/fingerprintjs'

const TRIAL_KEY = 'fitai_trial_data'
const TRIAL_DURATION_DAYS = 7

export interface TrialData {
    deviceId: string
    trialStarted: string
    trialEndsAt: string
    isActive: boolean
    email?: string
}

class TrialService {
    private fpPromise: Promise<any> | null = null

    constructor() {
        if (typeof window !== 'undefined') {
            this.fpPromise = FingerprintJS.load()
        }
    }

    async getDeviceId(): Promise<string> {
        if (!this.fpPromise) return 'unknown'

        const fp = await this.fpPromise
        const result = await fp.get()
        return result.visitorId
    }

    async getTrialData(): Promise<TrialData | null> {
        if (typeof window === 'undefined') return null

        const stored = localStorage.getItem(TRIAL_KEY)
        if (!stored) return null

        const data: TrialData = JSON.parse(stored)

        // Check if trial has expired
        const now = new Date()
        const endsAt = new Date(data.trialEndsAt)

        if (now > endsAt) {
            data.isActive = false
            localStorage.setItem(TRIAL_KEY, JSON.stringify(data))
        }

        return data
    }

    async canStartTrial(): Promise<{ allowed: boolean; reason?: string; existingTrial?: TrialData }> {
        const deviceId = await this.getDeviceId()
        const existingTrial = await this.getTrialData()

        // Check if trial already exists for this device
        if (existingTrial && existingTrial.deviceId === deviceId) {
            if (existingTrial.isActive) {
                return {
                    allowed: false,
                    reason: 'Trial already active on this device',
                    existingTrial
                }
            } else {
                return {
                    allowed: false,
                    reason: 'Trial already used on this device. Please upgrade to continue.',
                    existingTrial
                }
            }
        }

        return { allowed: true }
    }

    async startTrial(email?: string): Promise<{ success: boolean; data?: TrialData; error?: string }> {
        const canStart = await this.canStartTrial()

        if (!canStart.allowed) {
            return { success: false, error: canStart.reason }
        }

        const deviceId = await this.getDeviceId()
        const now = new Date()
        const endsAt = new Date(now.getTime() + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000)

        const trialData: TrialData = {
            deviceId,
            trialStarted: now.toISOString(),
            trialEndsAt: endsAt.toISOString(),
            isActive: true,
            email
        }

        localStorage.setItem(TRIAL_KEY, JSON.stringify(trialData))

        return { success: true, data: trialData }
    }

    async getTrialDaysRemaining(): Promise<number> {
        const trial = await this.getTrialData()
        if (!trial || !trial.isActive) return 0

        const now = new Date()
        const endsAt = new Date(trial.trialEndsAt)
        const diffMs = endsAt.getTime() - now.getTime()
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

        return Math.max(0, diffDays)
    }

    getFallbackFeatures(trial: TrialData): {
        smartSchedule: boolean,
        dailyAIChat: number
    } | null {
        if (trial.isActive) {
            // Full access during trial
            return { smartSchedule: true, dailyAIChat: Infinity }
        }

        // Freemium Fallback (Ads enabled, Features limited)
        if (!trial.isActive) {
            return {
                smartSchedule: false, // Locked
                dailyAIChat: 0 // Locked
            }
        }

        return null
    }

    isTrialExpired(trial: TrialData): boolean {
        return new Date() > new Date(trial.trialEndsAt)
    }
}

export const trialService = new TrialService()
