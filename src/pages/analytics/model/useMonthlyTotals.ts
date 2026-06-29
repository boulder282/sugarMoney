import { useMemo } from "react"
import { useTransactionStore } from "@/entities/transaction"
import type { TransactionType } from "@/shared/types/finance"

/**
 * Total amount of the given type per calendar month (index 0–11), used to size
 * the month-selector bars. Reactive to the transaction store.
 */
export const useMonthlyTotals = (type: TransactionType): number[] => {
  const transactions = useTransactionStore((state) => state.transactions)

  return useMemo(() => {
    const totals = new Array(12).fill(0)
    for (const tx of transactions) {
      if (tx.type !== type) continue
      totals[new Date(tx.date).getMonth()] += tx.amount
    }
    return totals
  }, [transactions, type])
}
