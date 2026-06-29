import { accounts as mockAccounts } from "@/shared/mocks/mockData"
import type { Account } from "@/shared/types/finance"
import { create } from "zustand"

interface AccountStore {
  accounts: Account[]
  updateBalance: (id: string, balance: number) => void
}

export const useAccountStore = create<AccountStore>()((set) => ({
  accounts: mockAccounts,

  updateBalance: (id, balance) =>
    set((state) => ({
      accounts: state.accounts.map((acc) =>
        acc.id === id ? { ...acc, balance } : acc
      ),
    })),
}))
