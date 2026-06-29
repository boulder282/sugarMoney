import { formatAmount } from "@/shared/lib/format"
import type { CategoryBreakdownItem } from "../model/useCategoryBreakdown"

const OVER_BUDGET_COLOR = "#F87171"
const REMAINING_COLOR = "#6B7280"

const CategoryBudgetRow = ({
  item,
  onClick,
}: {
  item: CategoryBreakdownItem
  onClick: () => void
}) => {
  const hasBudget = item.budget > 0
  const progress = hasBudget ? Math.min(item.spent / item.budget, 1) : 1
  const remaining = item.budget - item.spent

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 py-2.5 text-left"
    >
      <img src={item.icon} alt="" className="h-9 w-9 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[15px] font-medium text-white">
            {item.name}
          </span>
          <span className="flex-shrink-0 text-[15px] font-semibold text-white">
            {formatAmount(item.spent)}
          </span>
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-[#2A2B2C]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress * 100}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
          {hasBudget && (
            <span
              className="flex-shrink-0 text-[13px]"
              style={{ color: remaining < 0 ? OVER_BUDGET_COLOR : REMAINING_COLOR }}
            >
              {formatAmount(remaining)}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

export default CategoryBudgetRow
