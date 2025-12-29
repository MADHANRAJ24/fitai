// Expense Service - Manages fitness-related expenses in localStorage

export interface Expense {
    id: number
    category: 'supplements' | 'gear' | 'food' | 'memberships'
    amount: number
    description: string
    date: string // ISO string
}

export interface ExpenseStats {
    totalSpent: number
    categoryTotals: Record<string, number>
    topCategory: string
    topCategoryPercent: number
    costPerWorkout: number
    healthROI: number
}

const STORAGE_KEY = 'fitness_expenses'

class ExpenseService {
    private getStoredExpenses(): Expense[] {
        if (typeof window === 'undefined') return []
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : []
    }

    private saveToStorage(expenses: Expense[]): void {
        if (typeof window === 'undefined') return
        localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
    }

    // Get all expenses
    getExpenses(): Expense[] {
        return this.getStoredExpenses()
    }

    // Add a new expense
    addExpense(expense: Omit<Expense, 'id'>): Expense {
        const expenses = this.getStoredExpenses()
        const newExpense: Expense = {
            ...expense,
            id: Date.now()
        }
        expenses.push(newExpense)
        this.saveToStorage(expenses)

        // Dispatch event for UI updates
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('expense_added'))
        }

        return newExpense
    }

    // Delete an expense
    deleteExpense(id: number): void {
        const expenses = this.getStoredExpenses()
        const filtered = expenses.filter(e => e.id !== id)
        this.saveToStorage(filtered)
    }

    // Calculate stats
    getStats(workoutCount: number = 24): ExpenseStats {
        const expenses = this.getStoredExpenses()

        // Calculate totals by category
        const categoryTotals: Record<string, number> = {
            supplements: 0,
            gear: 0,
            food: 0,
            memberships: 0
        }

        let totalSpent = 0
        expenses.forEach(exp => {
            categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount
            totalSpent += exp.amount
        })

        // Find top category
        let topCategory = 'food'
        let topAmount = 0
        Object.entries(categoryTotals).forEach(([cat, amount]) => {
            if (amount > topAmount) {
                topAmount = amount
                topCategory = cat
            }
        })

        const topCategoryPercent = totalSpent > 0 ? Math.round((topAmount / totalSpent) * 100) : 0
        const costPerWorkout = workoutCount > 0 ? Math.round((totalSpent / workoutCount) * 100) / 100 : 0

        // Simulated ROI based on workout frequency
        const healthROI = workoutCount > 0 ? Math.round((workoutCount * 50 / Math.max(totalSpent, 1)) * 10) / 10 : 0

        return {
            totalSpent,
            categoryTotals,
            topCategory,
            topCategoryPercent,
            costPerWorkout,
            healthROI
        }
    }

    // Seed with demo data if empty
    seedDemoData(): void {
        const existing = this.getStoredExpenses()
        if (existing.length > 0) return

        const demoExpenses: Omit<Expense, 'id'>[] = [
            { category: 'supplements', amount: 120, description: 'Protein Powder', date: new Date().toISOString() },
            { category: 'gear', amount: 85, description: 'Resistance Bands', date: new Date().toISOString() },
            { category: 'food', amount: 350, description: 'Weekly Groceries', date: new Date().toISOString() },
            { category: 'memberships', amount: 50, description: 'Gym Membership', date: new Date().toISOString() },
        ]

        demoExpenses.forEach(exp => this.addExpense(exp))
    }
}

export const expenseService = new ExpenseService()
