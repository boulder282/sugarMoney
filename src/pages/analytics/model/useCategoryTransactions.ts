import { useMemo } from "react"
import {
  useTransactionStore,
  groupTransactionsByDay,
  type DayGroup,
} from "@/entities/transaction"
import type { TransactionType } from "@/shared/types/finance"

export interface CategoryTransactions {
  groups: DayGroup[]
  total: number
  count: number
}

/**
 * Individual transactions for a single category in a given month, grouped by
 * day for the drill-down list. Returns empty when no category is selected.
 */
export const useCategoryTransactions = (
  type: TransactionType,
  month: number,
  categoryId: string | null
): CategoryTransactions => {
  const transactions = useTransactionStore((state) => state.transactions)

  return useMemo(() => {
    if (!categoryId) return { groups: [], total: 0, count: 0 }

    const filtered = transactions.filter(
      (tx) =>
        tx.type === type &&
        tx.category === categoryId &&
        new Date(tx.date).getMonth() === month
    )
    const total = filtered.reduce((sum, tx) => sum + tx.amount, 0)

    return { groups: groupTransactionsByDay(filtered), total, count: filtered.length }
  }, [transactions, type, month, categoryId])
}
