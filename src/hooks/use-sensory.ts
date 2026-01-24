"use client"

import { useCallback } from "react"

type FeedbackType = "click" | "success" | "error" | "feature"

export const useSensory = () => {
    const triggerFeedback = useCallback((type: FeedbackType = "click") => {
        // Check User Settings (Default to enabled)
        let hapticsEnabled = true
        let soundEnabled = true

        if (typeof window !== "undefined") {
            try {
                const settings = JSON.parse(localStorage.getItem("fitai_settings") || "{}")
                if (settings.hapticsEnabled === false) hapticsEnabled = false
                if (settings.soundEnabled === false) soundEnabled = false
            } catch (e) {
                // Keep defaults
            }
        }

        // Haptic Feedback (Mobile Only)
        if (hapticsEnabled && typeof navigator !== "undefined" && navigator.vibrate) {
            switch (type) {
                case "click":
                    navigator.vibrate(10) // Short, sharp tap
                    break
                case "success":
                    navigator.vibrate([10, 30, 10]) // Double tap
                    break
                case "error":
                    navigator.vibrate([50, 50, 50]) // Buzz
                    break
                case "feature":
                    navigator.vibrate(20)
                    break
            }
        }

        // Audio Feedback (Web Audio API - Synthesized)
        if (soundEnabled && typeof window !== "undefined" && window.AudioContext) {
            try {
                const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
                const oscillator = audioCtx.createOscillator()
                const gainNode = audioCtx.createGain()

                oscillator.connect(gainNode)
                gainNode.connect(audioCtx.destination)

                const now = audioCtx.currentTime

                switch (type) {
                    case "click":
                        // High-tech blip
                        oscillator.type = "sine"
                        oscillator.frequency.setValueAtTime(800, now)
                        oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.05)
                        gainNode.gain.setValueAtTime(0.05, now)
                        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
                        oscillator.start(now)
                        oscillator.stop(now + 0.05)
                        break

                    case "success":
                        // Positive chime
                        oscillator.type = "triangle"
                        oscillator.frequency.setValueAtTime(400, now)
                        oscillator.frequency.linearRampToValueAtTime(800, now + 0.1)
                        gainNode.gain.setValueAtTime(0.1, now)
                        gainNode.gain.linearRampToValueAtTime(0.001, now + 0.3)
                        oscillator.start(now)
                        oscillator.stop(now + 0.3)
                        break

                    case "error":
                        // Low buzz
                        oscillator.type = "sawtooth"
                        oscillator.frequency.setValueAtTime(150, now)
                        oscillator.frequency.linearRampToValueAtTime(100, now + 0.1)
                        gainNode.gain.setValueAtTime(0.1, now)
                        gainNode.gain.linearRampToValueAtTime(0.001, now + 0.2)
                        oscillator.start(now)
                        oscillator.stop(now + 0.2)
                        break
                }
            } catch (e) {
                // Ignore audio errors (e.g. user interaction policy)
            }
        }
    }, [])

    return { triggerFeedback }
}
