// ---------- Core Entities ----------

export type TransactionType = "expense" | "income"

export interface Transaction {
  id: string
  amount: number
  type: TransactionType
  category: string // category id
  description: string
  date: string // ISO string
  account: string // account id
  place?: string // merchant / location, expenses only
}

export interface Category {
  id: string
  name: string
  icon: string
  type: TransactionType
  budget?: number // only for expense categories
}

export type AccountType = "main" | "credit" | "savings" | "investment"

export interface Account {
  id: string
  name: string
  balance: number
  type: AccountType
  bank?: "tbank" | "alfa"
  changePercent?: number // monthly performance, investment accounts only
}

// ---------- Budget & Planning ----------

export interface BudgetPlan {
  categoryId: string
  planned: number
  actual: number
}

export interface InvestmentPlan {
  name: string
  amount: number
}

export interface DebtPlan {
  name: string
  amount: number
  isOwedToMe?: boolean // true = I owe this amount to someone
}

// ---------- Analytics & Dashboard ----------

export interface MonthlyData {
  month: string // e.g., "Июн", "Июл"
  income: number
  expenses: number
}

export interface ExpenseWidgetData {
  id: string
  name: string
  value: number
  color: string
}

export interface TodayLimit {
  total: number
  remaining: number
}

export interface SpendingByCategory {
  categoryId: string
  categoryName: string
  spent: number
  budget: number
  icon: string
  color?: string
}

// ---------- Store State (Zustand / Context) ----------

export interface FinanceState {
  transactions: Transaction[]
  categories: Category[]
  accounts: Account[]
  budgets: BudgetPlan[]
  investments: InvestmentPlan[]
  debts: DebtPlan[]
  isLoading: boolean
  error: string | null
}

export interface FinanceActions {
  addTransaction: (transaction: Omit<Transaction, "id">) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  updateBudget: (categoryId: string, planned: number) => void
  updateInvestment: (name: string, amount: number) => void
  updateDebt: (name: string, amount: number, isOwedToMe?: boolean) => void
  resetData: () => void
}

export type FinanceStore = FinanceState & FinanceActions

// ---------- Helper Types ----------

export type ChartView = "income-expense" | "cash-flow" | "savings"

export type Period = "day" | "week" | "month" | "year"

export interface DateRange {
  start: Date
  end: Date
}

export interface FilterOptions {
  type?: TransactionType
  category?: string
  account?: string
  dateRange?: DateRange
  minAmount?: number
  maxAmount?: number
}

// ---------- Component Props (reusable) ----------

export interface BaseCardProps {
  className?: string
  children?: React.ReactNode
}

export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}
