import { useState, useMemo } from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { CalendarDays, ChevronDown, Plus, MapPin, Clock, CreditCard } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { useTransactionStore, groupTransactionsByDay } from "@/entities/transaction"
import { categories, accounts } from "@/shared/mocks/mockData"
import type { Transaction, TransactionType } from "@/shared/types/finance"
import { formatAmount } from "@/shared/lib/format"
import { useBackButtonClose } from "@/shared/lib/useBackButtonClose"
import { CATEGORY_META, FALLBACK_META } from "@/entities/category"

const CATEGORY_NAMES = new Map(categories.map((cat) => [cat.id, cat.name]))
const ACCOUNT_NAMES = new Map(accounts.map((acc) => [acc.id, acc.name]))

const MONTHS_SHORT = [
  "янв", "фев", "март", "апр", "май", "июнь",
  "июль", "авг", "сент", "окт", "ноя", "дек",
]

const MIN_BAR_PERCENT = 12

type PeriodFilter = "month" | "3m" | "6m" | "year"

const PERIOD_CHIPS: Array<{ id: Exclude<PeriodFilter, "month">; label: string }> = [
  { id: "3m", label: "последние три месяца" },
  { id: "6m", label: "последние пол года" },
  { id: "year", label: "последний год" },
]

const DONUT_SIZE = 48
const DONUT_STROKE = 8
// Increased padding prevents round stroke caps from being clipped by SVG bounds.
const DONUT_EDGE_PADDING = 4
const DONUT_RADIUS = (DONUT_SIZE - DONUT_STROKE) / 2 - DONUT_EDGE_PADDING
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS
const DONUT_GAP = 4

const MiniDonut = ({
  segments,
}: {
  segments: Array<{ value: number; color: string }>
}) => {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0)
  let offset = 0

  return (
    <svg
      width={DONUT_SIZE}
      height={DONUT_SIZE}
      className="-rotate-90 overflow-visible"
    >
      <circle
        cx={DONUT_SIZE / 2}
        cy={DONUT_SIZE / 2}
        r={DONUT_RADIUS}
        fill="none"
        stroke="#2A2B2C"
        strokeWidth={DONUT_STROKE}
      />
      {total > 0 &&
        segments.map((seg, idx) => {
          const arc = (seg.value / total) * DONUT_CIRCUMFERENCE
          const visible = Math.max(arc - DONUT_GAP, 1)
          const dashOffset = -offset
          offset += arc
          return (
            <circle
              key={idx}
              cx={DONUT_SIZE / 2}
              cy={DONUT_SIZE / 2}
              r={DONUT_RADIUS}
              fill="none"
              stroke={seg.color}
              strokeWidth={DONUT_STROKE}
              strokeDasharray={`${visible} ${DONUT_CIRCUMFERENCE - visible}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          )
        })}
    </svg>
  )
}

interface SummaryCardProps {
  label: string
  amount: number
  chart: React.ReactNode
  isActive: boolean
  onClick: () => void
}

const SummaryCard = ({ label, amount, chart, isActive, onClick }: SummaryCardProps) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center justify-between rounded-[20px] p-4 text-left transition-colors ${
      isActive ? "bg-[#2A2B2C] ring-1 ring-white/10" : "bg-[#1F2021] hover:bg-[#252627]"
    }`}
  >
    <div>
      <div className="text-[13px] text-gray-500">{label}</div>
      <div className="mt-1 text-[19px] font-bold text-white">
        {formatAmount(amount)}
      </div>
    </div>
    {chart}
  </button>
)

interface MonthBarProps {
  selectedMonth: number
  onSelect: (month: number) => void
  totals: number[]
}

const MonthBar = ({ selectedMonth, onSelect, totals }: MonthBarProps) => {
  const maxTotal = Math.max(...totals, 1)

  return (
    <div className="flex items-end justify-between gap-1">
      {MONTHS_SHORT.map((label, month) => {
        const isSelected = month === selectedMonth
        const heightPercent = Math.max(
          (totals[month] / maxTotal) * 100,
          MIN_BAR_PERCENT,
        )
        return (
          <button
            key={label}
            onClick={() => onSelect(month)}
            className="flex flex-1 flex-col items-center gap-1.5"
          >
            <div className="flex h-9 w-full max-w-[20px] items-end">
              <span
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-[6px] transition-all ${
                  isSelected ? "bg-[#22C55E]" : "bg-[#2A2B2C]"
                }`}
              />
            </div>
            <span
              className={`text-[10px] ${
                isSelected ? "text-white" : "text-gray-500"
              }`}
            >
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

const TransactionRow = ({
  transaction,
  onClick,
}: {
  transaction: Transaction
  onClick: () => void
}) => {
  const meta = CATEGORY_META[transaction.category] ?? FALLBACK_META
  const sign = transaction.type === "expense" ? "-" : "+"

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 py-2.5 text-left"
    >
      <span
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: meta.color }}
      >
        <img src={meta.icon} alt="" className="h-4 w-4 invert" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-medium text-white">
          {CATEGORY_NAMES.get(transaction.category) ?? transaction.category}
        </div>
        <div className="truncate text-[13px] text-gray-500">
          {transaction.description}
        </div>
      </div>
      <span className="flex-shrink-0 text-[15px] font-medium text-white">
        {sign}
        {formatAmount(transaction.amount)}
      </span>
    </button>
  )
}

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) => (
  <div className="flex items-center gap-3">
    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#2A2B2C] text-gray-400">
      {icon}
    </span>
    <div>
      <div className="text-[11px] text-gray-500">{label}</div>
      <div className="text-[14px] font-medium text-white">{value}</div>
    </div>
  </div>
)

const TransactionDetailSheet = ({
  transaction,
  onClose,
}: {
  transaction: Transaction
  onClose: () => void
}) => {
  const meta = CATEGORY_META[transaction.category] ?? FALLBACK_META
  const sign = transaction.type === "expense" ? "-" : "+"
  const categoryName = CATEGORY_NAMES.get(transaction.category) ?? transaction.category
  const accountName = ACCOUNT_NAMES.get(transaction.account) ?? transaction.account
  const date = new Date(transaction.date)
  const dateStr = format(date, "d MMMM yyyy", { locale: ru })
  const timeStr = format(date, "HH:mm")

  return (
    <div
      className="absolute inset-0 z-10 flex items-end bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full animate-in slide-in-from-bottom duration-200 rounded-t-[28px] bg-[#1A1B1C] px-5 pb-10 pt-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-[#3A3B3C]" />

        {/* Icon + amount */}
        <div className="mb-5 flex flex-col items-center gap-3">
          <span
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: meta.color }}
          >
            <img src={meta.icon} alt="" className="h-7 w-7 invert" />
          </span>
          <div className="text-center">
            <div className="text-[28px] font-bold text-white">
              {sign}{formatAmount(transaction.amount)}
            </div>
            <div className="mt-0.5 text-[14px] text-gray-400">{categoryName}</div>
            {transaction.description && (
              <div className="mt-0.5 text-[13px] text-gray-600">
                {transaction.description}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4 h-px bg-[#2A2B2C]" />

        {/* Detail rows */}
        <div className="flex flex-col gap-3">
          {transaction.type === "expense" && transaction.place && (
            <DetailRow
              icon={<MapPin size={15} />}
              label="Место"
              value={transaction.place}
            />
          )}
          <DetailRow
            icon={<Clock size={15} />}
            label="Дата и время"
            value={`${dateStr} · ${timeStr}`}
          />
          <DetailRow
            icon={<CreditCard size={15} />}
            label="Счёт"
            value={accountName}
          />
        </div>
      </div>
    </div>
  )
}

interface ExpensesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddOperation?: () => void
}

const monthName = (month: number) => {
  const name = new Date(2020, month, 1).toLocaleString("ru-RU", { month: "long" })
  return name.charAt(0).toUpperCase() + name.slice(1)
}

const isInPeriod = (date: Date, period: PeriodFilter, selectedMonth: number): boolean => {
  if (period === "month") {
    return date.getMonth() === selectedMonth
  }
  const monthsBack = period === "3m" ? 3 : period === "6m" ? 6 : 12
  const now = new Date()
  const cutoff = new Date(now.getFullYear(), now.getMonth() - monthsBack + 1, 1)
  return date >= cutoff
}

const ExpensesModal = ({
  open,
  onOpenChange,
  onAddOperation,
}: ExpensesModalProps) => {
  useBackButtonClose(open, () => onOpenChange(false))

  const [activeType, setActiveType] = useState<TransactionType>("expense")
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth())
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("month")
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)

  const transactions = useTransactionStore((state) => state.transactions)

  // Per-month totals (index 0–11) for the MonthBar height proportions.
  const monthlyTotals = useMemo(() => {
    const expense = new Array(12).fill(0)
    const income = new Array(12).fill(0)
    for (const tx of transactions) {
      const m = new Date(tx.date).getMonth()
      if (tx.type === "expense") expense[m] += tx.amount
      else income[m] += tx.amount
    }
    return { expense, income } as Record<TransactionType, number[]>
  }, [transactions])

  // Totals and donut segments for the selected period.
  const { totalExpenses, totalIncome, expenseSegments, incomeSegments } = useMemo(() => {
    const expByCategory = new Map<string, number>()
    const incByCategory = new Map<string, number>()
    let expenses = 0
    let income = 0

    for (const tx of transactions) {
      if (!isInPeriod(new Date(tx.date), periodFilter, selectedMonth)) continue
      if (tx.type === "expense") {
        expenses += tx.amount
        expByCategory.set(tx.category, (expByCategory.get(tx.category) ?? 0) + tx.amount)
      } else {
        income += tx.amount
        incByCategory.set(tx.category, (incByCategory.get(tx.category) ?? 0) + tx.amount)
      }
    }

    const toSegments = (map: Map<string, number>) =>
      [...map.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([categoryId, value]) => ({
          value,
          color: (CATEGORY_META[categoryId] ?? FALLBACK_META).color,
        }))

    return {
      totalExpenses: expenses,
      totalIncome: income,
      expenseSegments: toSegments(expByCategory),
      incomeSegments: toSegments(incByCategory),
    }
  }, [transactions, selectedMonth, periodFilter])

  // Transactions for the active type in the selected period, grouped by day.
  const dayGroups = useMemo(() => {
    const filtered = transactions.filter(
      (tx) =>
        tx.type === activeType &&
        isInPeriod(new Date(tx.date), periodFilter, selectedMonth),
    )
    return groupTransactionsByDay(filtered)
  }, [transactions, activeType, selectedMonth, periodFilter])

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month)
    setPeriodFilter("month")
  }

  const handlePeriodChipClick = (id: Exclude<PeriodFilter, "month">) => {
    setPeriodFilter((prev) => (prev === id ? "month" : id))
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content className="fixed inset-0 z-50 mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-[#141415] duration-300 outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom">
          <DialogPrimitive.Title className="sr-only">Расходы</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Расходы и доходы
          </DialogPrimitive.Description>

          <div className="flex flex-col gap-4 px-4 pt-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-[24px] font-bold text-white">
                {formatAmount(totalIncome - totalExpenses)}
              </span>
              <div className="flex items-center gap-2">
                
                <DialogPrimitive.Close
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2A2B2C] text-gray-400 hover:bg-[#333435]"
                  aria-label="Закрыть"
                >
                  <ChevronDown size={18} />
                </DialogPrimitive.Close>
              </div>
            </div>

            {/* Summary cards — click to switch between expense/income list */}
            <div className="grid grid-cols-2 gap-3">
              <SummaryCard
                label="Расходы"
                amount={totalExpenses}
                chart={<MiniDonut segments={expenseSegments} />}
                isActive={activeType === "expense"}
                onClick={() => setActiveType("expense")}
              />
              <SummaryCard
                label="Доходы"
                amount={totalIncome}
                chart={<MiniDonut segments={incomeSegments} />}
                isActive={activeType === "income"}
                onClick={() => setActiveType("income")}
              />
            </div>

            {/* Month bar — hidden when a multi-month period is active */}
            {periodFilter === "month" && (
              <MonthBar
                selectedMonth={selectedMonth}
                onSelect={handleMonthSelect}
                totals={monthlyTotals[activeType]}
              />
            )}

            {/* Filter chips */}
            <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                onClick={() => setPeriodFilter("month")}
                className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
                  periodFilter === "month"
                    ? "bg-white/10 text-white"
                    : "bg-[#1F2021] text-gray-500 hover:bg-[#262728]"
                }`}
              >
                <CalendarDays size={13} />
                {monthName(selectedMonth)}
              </button>
              {PERIOD_CHIPS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => handlePeriodChipClick(id)}
                  className={`flex-shrink-0 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
                    periodFilter === id
                      ? "bg-white/10 text-white"
                      : "bg-[#1F2021] text-gray-500 hover:bg-[#262728]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Transactions list */}
          <div className="mt-2 flex-1 overflow-y-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {dayGroups.length === 0 ? (
              <p className="py-10 text-center text-[14px] text-gray-500">
                Нет операций за этот период
              </p>
            ) : (
              dayGroups.map((group) => (
                <div key={group.key}>
                  <div className="flex items-center justify-between pt-4 pb-1">
                    <span className="text-[13px] text-gray-500">{group.label}</span>
                    {group.expenseTotal > 0 && (
                      <span className="text-[13px] text-gray-500">
                        -{formatAmount(group.expenseTotal)}
                      </span>
                    )}
                  </div>
                  {group.transactions.map((tx) => (
                    <TransactionRow
                      key={tx.id}
                      transaction={tx}
                      onClick={() => setSelectedTx(tx)}
                    />
                  ))}
                </div>
              ))
            )}
          </div>

          <button
            onClick={onAddOperation}
            className="absolute right-4 bottom-6 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#22C55E] text-white shadow-lg shadow-black/40 hover:bg-[#1FAD53]"
            aria-label="Добавить операцию"
          >
            <Plus size={24} strokeWidth={2.5} />
          </button>

          {selectedTx && (
            <TransactionDetailSheet
              transaction={selectedTx}
              onClose={() => setSelectedTx(null)}
            />
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export default ExpensesModal
