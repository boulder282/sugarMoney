import { widgetExpenses } from "@/shared/mocks/mockData"
import type { ExpenseWidgetData } from "@/shared/types/finance"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ExpenseStore {
  expenses: ExpenseWidgetData[]
  totalBudget: number
  addExpense: (expense: Omit<ExpenseWidgetData, "id">) => void
  updateExpense: (id: string, updates: Partial<ExpenseWidgetData>) => void
  removeExpense: (id: string) => void
  resetToMock: () => void
}

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set) => ({
      expenses: widgetExpenses,
      totalBudget: 250000, // can also be imported from mockData if defined there

      addExpense: (expense) =>
        set((state) => ({
          expenses: [
            ...state.expenses,
            { ...expense, id: Date.now().toString() },
          ],
        })),

      updateExpense: (id, updates) =>
        set((state) => ({
          expenses: state.expenses.map((exp) =>
            exp.id === id ? { ...exp, ...updates } : exp
          ),
        })),

      removeExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((exp) => exp.id !== id),
        })),

      resetToMock: () => set({ expenses: widgetExpenses, totalBudget: 250000 }),
    }),
    {
      name: "sugar-expense-storage", // localStorage key
      version: 2, // bump to invalidate cached colors from older versions
    }
  )
)
