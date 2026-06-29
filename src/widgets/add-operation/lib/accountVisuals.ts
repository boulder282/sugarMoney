import { Wallet, PiggyBank, CreditCard, TrendingUp } from "lucide-react"
import type { ComponentType } from "react"
import type { AccountType } from "@/shared/types/finance"

interface AccountVisual {
  Icon: ComponentType<{ size?: number; color?: string }>
  color: string
}

// Icon and circle color shown next to each account in the payment picker.
export const ACCOUNT_VISUALS: Record<AccountType, AccountVisual> = {
  main: { Icon: Wallet, color: "#EAB308" },
  savings: { Icon: PiggyBank, color: "#06B6D4" },
  credit: { Icon: CreditCard, color: "#F4502B" },
  investment: { Icon: TrendingUp, color: "#22C55E" },
}
