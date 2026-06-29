import { useState } from "react"
import { useNavigate } from "react-router"
import { ChevronLeft, HelpCircle, CalendarDays, Plus } from "lucide-react"
import type { TransactionType } from "@/shared/types/finance"
import { formatAmount } from "@/shared/lib/format"
import { useCategoryBreakdown } from "../model/useCategoryBreakdown"
import { useMonthlyTotals } from "../model/useMonthlyTotals"
import BudgetDonut from "./BudgetDonut"
import MonthSelector from "./MonthSelector"
import CategoryBudgetRow from "./CategoryBudgetRow"
import CategorySheet from "./CategorySheet"
import CategoryDetail from "./CategoryDetail"

const TABS: Array<{ type: TransactionType; label: string }> = [
  { type: "expense", label: "Расходы" },
  { type: "income", label: "Доходы" },
]

const monthLabel = (month: number) => {
  const name = new Date(2020, month, 1).toLocaleString("ru-RU", { month: "long" })
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export default function AnalyticsPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<TransactionType>("expense")
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth())
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [categorySheetOpen, setCategorySheetOpen] = useState(false)

  const breakdown = useCategoryBreakdown(tab, selectedMonth)
  const monthlyTotals = useMonthlyTotals(tab)

  // A selected category opens its own detail screen.
  if (selectedCategoryId !== null) {
    return (
      <CategoryDetail
        categoryId={selectedCategoryId}
        month={selectedMonth}
        monthLabel={monthLabel(selectedMonth)}
        onBack={() => setSelectedCategoryId(null)}
      />
    )
  }

  const segments = breakdown.items
    .filter((item) => item.spent > 0)
    .map((item) => ({ value: item.spent, color: item.color }))
  // Use the larger of budget/spent so over-budget months don't overflow the ring.
  const donutTotal = Math.max(breakdown.totalBudget, breakdown.totalSpent)

  return (
    <div className="min-h-screen bg-[#141415] text-white">
      <div className="mx-auto flex w-full max-w-[430px] flex-col gap-5 px-4 pt-5 pb-32">
        {/* Header */}
        <div className="relative flex items-center justify-center">
          <button
            onClick={() => navigate("/")}
            className="absolute left-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#1F2021] text-gray-300 hover:bg-[#262728]"
            aria-label="Назад"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-5">
            {TABS.map(({ type, label }) => (
              <button
                key={type}
                onClick={() => setTab(type)}
                className={`text-[18px] font-bold transition-colors ${
                  tab === type ? "text-white" : "text-gray-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            className="absolute right-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#1F2021] text-gray-400 hover:bg-[#262728]"
            aria-label="Помощь"
          >
            <HelpCircle size={18} />
          </button>
        </div>

        {/* Budget donut */}
        <BudgetDonut
          segments={segments}
          total={donutTotal}
          centerValue={breakdown.totalSpent}
          caption={
            breakdown.totalBudget > 0
              ? `из ${formatAmount(breakdown.totalBudget)}`
              : undefined
          }
        />

        <MonthSelector
          selectedMonth={selectedMonth}
          onSelect={setSelectedMonth}
          totals={monthlyTotals}
        />

        {/* Filter chips */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-[#1F2021] px-3.5 py-2 text-[13px] font-medium text-white">
            <CalendarDays size={13} className="text-gray-400" />
            {monthLabel(selectedMonth)}
          </span>
          <button
            onClick={() => setCategorySheetOpen(true)}
            className="rounded-full bg-[#1F2021] px-3.5 py-2 text-[13px] font-medium text-white hover:bg-[#262728]"
          >
            {tab === "expense" ? "Категории" : "Источники"}
          </button>
          <button
            className="flex h-[33px] w-[33px] items-center justify-center rounded-full bg-[#1F2021] text-gray-400 hover:bg-[#262728]"
            aria-label="Добавить фильтр"
          >
            <Plus size={15} />
          </button>
        </div>

        {/* Category breakdown */}
        {breakdown.items.length === 0 ? (
          <p className="py-10 text-center text-[14px] text-gray-500">
            Нет операций за этот месяц
          </p>
        ) : (
          <div className="flex flex-col">
            {breakdown.items.map((item) => (
              <CategoryBudgetRow
                key={item.id}
                item={item}
                onClick={() => setSelectedCategoryId(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      <CategorySheet
        open={categorySheetOpen}
        onOpenChange={setCategorySheetOpen}
        items={breakdown.items}
        selectedId={selectedCategoryId}
        onSelect={setSelectedCategoryId}
      />
    </div>
  )
}
