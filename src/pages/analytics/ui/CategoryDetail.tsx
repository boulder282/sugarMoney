import { ChevronLeft, CalendarDays, Plus } from "lucide-react"
import { CATEGORY_META, FALLBACK_META } from "@/entities/category"
import { categories } from "@/shared/mocks/mockData"
import { formatAmount } from "@/shared/lib/format"
import { useCategoryTransactions } from "../model/useCategoryTransactions"
import MiniRing from "./MiniRing"
import TransactionList from "./TransactionList"

const findCategory = (id: string) => categories.find((c) => c.id === id)

const SummaryCard = ({
  label,
  amount,
  progress,
  color,
}: {
  label: string
  amount: number
  progress: number
  color: string
}) => (
  <div className="flex items-center justify-between rounded-[20px] bg-[#1F2021] p-4">
    <div>
      <div className="text-[13px] text-gray-500">{label}</div>
      <div className="mt-1 text-[19px] font-bold text-white">
        {formatAmount(amount)}
      </div>
    </div>
    <MiniRing progress={progress} color={color} />
  </div>
)

interface CategoryDetailProps {
  categoryId: string
  month: number
  monthLabel: string
  onBack: () => void
}

const CategoryDetail = ({
  categoryId,
  month,
  monthLabel,
  onBack,
}: CategoryDetailProps) => {
  const category = findCategory(categoryId)
  const type = category?.type ?? "expense"
  const color = (CATEGORY_META[categoryId] ?? FALLBACK_META).color

  const { groups, total, count } = useCategoryTransactions(type, month, categoryId)

  const isExpense = type === "expense"
  const budget = category?.budget ?? 0
  const progress = budget > 0 ? total / budget : total > 0 ? 1 : 0

  return (
    <div className="min-h-screen bg-[#141415] text-white">
      <div className="mx-auto flex w-full max-w-[430px] flex-col gap-4 px-4 pt-5 pb-32">
        {/* Header */}
        <div className="relative flex items-center justify-center">
          <button
            onClick={onBack}
            className="absolute left-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#1F2021] text-gray-300 hover:bg-[#262728]"
            aria-label="Назад"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-[18px] font-bold text-white">
            {category?.name ?? categoryId}
          </h1>
        </div>

        {/* Expense / income summary */}
        <div className="grid grid-cols-2 gap-3">
          <SummaryCard
            label="Расходы"
            amount={isExpense ? total : 0}
            progress={isExpense ? progress : 0}
            color={color}
          />
          <SummaryCard
            label="Доходы"
            amount={isExpense ? 0 : total}
            progress={isExpense ? 0 : progress}
            color={color}
          />
        </div>

        {/* Month chip */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-[#1F2021] px-3.5 py-2 text-[13px] font-medium text-white">
            <CalendarDays size={13} className="text-gray-400" />
            {monthLabel}
          </span>
          <button
            className="flex h-[33px] w-[33px] items-center justify-center rounded-full bg-[#1F2021] text-gray-400 hover:bg-[#262728]"
            aria-label="Добавить фильтр"
          >
            <Plus size={15} />
          </button>
        </div>

        {/* Transactions */}
        {count === 0 ? (
          <p className="py-10 text-center text-[14px] text-gray-500">
            Нет операций за этот месяц
          </p>
        ) : (
          <TransactionList groups={groups} type={type} />
        )}
      </div>
    </div>
  )
}

export default CategoryDetail
