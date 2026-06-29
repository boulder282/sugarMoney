import { useMemo } from "react"
import { useTransactionStore } from "@/entities/transaction"
import {
  CATEGORY_META,
  FALLBACK_META,
  SPENDING_ICONS,
  FALLBACK_SPENDING_ICON,
} from "@/entities/category"
import { categories } from "@/shared/mocks/mockData"
import type { TransactionType } from "@/shared/types/finance"

export interface CategoryBreakdownItem {
  id: string
  name: string
  spent: number
  budget: number // 0 for income categories
  color: string
  icon: string
}

export interface CategoryBreakdown {
  items: CategoryBreakdownItem[]
  totalSpent: number
  totalBudget: number
}

/**
 * Aggregates a given month's transactions of the given type into per-category
 * totals, paired with each category's budget, colour and icon. Reads from the
 * transaction store, so operations added elsewhere are reflected here too.
 *
 * `month` is a 0-based month index; the trailing 12 months of mock data cover
 * each month exactly once, so matching on the month index alone is enough.
 */
export const useCategoryBreakdown = (
  type: TransactionType,
  month: number
): CategoryBreakdown => {
  const transactions = useTransactionStore((state) => state.transactions)

  return useMemo(() => {
    const spentByCategory = new Map<string, number>()
    for (const tx of transactions) {
      if (tx.type !== type || new Date(tx.date).getMonth() !== month) continue
      spentByCategory.set(
        tx.category,
        (spentByCategory.get(tx.category) ?? 0) + tx.amount
      )
    }

    const items = categories
      .filter((category) => category.type === type)
      .map((category) => ({
        id: category.id,
        name: category.name,
        spent: spentByCategory.get(category.id) ?? 0,
        budget: category.budget ?? 0,
        color: (CATEGORY_META[category.id] ?? FALLBACK_META).color,
        icon: (SPENDING_ICONS[category.id] ?? FALLBACK_SPENDING_ICON).filled,
      }))
      // Hide categories with neither a budget nor any spending this month.
      .filter((item) => item.budget > 0 || item.spent > 0)
      .sort((a, b) => b.spent - a.spent)

    const totalSpent = items.reduce((sum, item) => sum + item.spent, 0)
    const totalBudget = items.reduce((sum, item) => sum + item.budget, 0)

    return { items, totalSpent, totalBudget }
  }, [transactions, type, month])
}
