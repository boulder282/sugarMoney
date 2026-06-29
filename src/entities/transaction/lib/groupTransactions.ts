import { format, isToday, isYesterday } from "date-fns"
import { ru } from "date-fns/locale"
import type { Transaction } from "@/shared/types/finance"

export interface DayGroup {
  key: string // yyyy-MM-dd
  label: string
  expenseTotal: number
  transactions: Transaction[]
}

const dayLabel = (date: Date) => {
  if (isToday(date)) return "Сегодня"
  if (isYesterday(date)) return "Вчера"
  const label = format(date, "EEEEEE, d MMMM", { locale: ru })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export const groupTransactionsByDay = (
  transactions: Transaction[]
): DayGroup[] => {
  const groups = new Map<string, DayGroup>()

  for (const tx of transactions) {
    const date = new Date(tx.date)
    const key = format(date, "yyyy-MM-dd")
    let group = groups.get(key)
    if (!group) {
      group = { key, label: dayLabel(date), expenseTotal: 0, transactions: [] }
      groups.set(key, group)
    }
    group.transactions.push(tx)
    if (tx.type === "expense") group.expenseTotal += tx.amount
  }

  return [...groups.values()].sort((a, b) => b.key.localeCompare(a.key))
}
