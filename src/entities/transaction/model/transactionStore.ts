import { transactions as mockTransactions } from "@/shared/mocks/mockData"
import type { Transaction } from "@/shared/types/finance"
import { create } from "zustand"

interface TransactionStore {
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, "id">) => void
  removeTransaction: (id: string) => void
}

export const useTransactionStore = create<TransactionStore>()((set) => ({
  transactions: mockTransactions,

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [
        { ...transaction, id: Date.now().toString() },
        ...state.transactions,
      ],
    })),

  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((tx) => tx.id !== id),
    })),
}))
