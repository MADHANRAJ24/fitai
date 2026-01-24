export interface Habit {
    id: number
    title: string
    iconName: string // Store icon name as string to persist
    color: string
    bg: string
    completed: boolean[] // 7 days
}

const STORAGE_KEY = 'user_habits'

export const HabitService = {
    getHabits(): Habit[] {
        if (typeof window === 'undefined') return []
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) {
            // Default Habits
            const defaults: Habit[] = [
                { id: 1, title: "Drink 3L Water", iconName: "Droplets", color: "text-sky-400", bg: "bg-sky-400/10", completed: [false, false, false, false, false, false, false] },
                { id: 2, title: "8h Sleep", iconName: "Moon", color: "text-indigo-400", bg: "bg-indigo-400/10", completed: [false, false, false, false, false, false, false] },
                { id: 3, title: "Meditation", iconName: "BrainCircuit", color: "text-rose-400", bg: "bg-rose-400/10", completed: [false, false, false, false, false, false, false] },
            ]
            this.saveAll(defaults)
            return defaults
        }
        return JSON.parse(stored)
    },

    saveAll(habits: Habit[]) {
        if (typeof window === 'undefined') return
        localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
    },

    toggleDay(id: number, dayIndex: number) {
        const habits = this.getHabits()
        const habit = habits.find(h => h.id === id)
        if (habit) {
            habit.completed[dayIndex] = !habit.completed[dayIndex]
            this.saveAll(habits)
        }
        return habits
    },

    addHabit(title: string) {
        const habits = this.getHabits()
        const newId = (Math.max(...habits.map(h => h.id), 0) || 0) + 1
        const newHabit: Habit = {
            id: newId,
            title,
            iconName: "Book",
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
            completed: Array(7).fill(false)
        }
        this.saveAll([newHabit, ...habits])
        return this.getHabits()
    },

    deleteHabit(id: number) {
        const habits = this.getHabits().filter(h => h.id !== id)
        this.saveAll(habits)
        return habits
    }
}
