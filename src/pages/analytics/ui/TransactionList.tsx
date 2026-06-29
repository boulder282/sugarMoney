import { SPENDING_ICONS, FALLBACK_SPENDING_ICON } from "@/entities/category"
import type { DayGroup } from "@/entities/transaction"
import { categories } from "@/shared/mocks/mockData"
import { formatAmount } from "@/shared/lib/format"
import type { TransactionType } from "@/shared/types/finance"

const CATEGORY_NAMES = new Map(categories.map((category) => [category.id, category.name]))

const TransactionList = ({
  groups,
  type,
}: {
  groups: DayGroup[]
  type: TransactionType
}) => {
  const sign = type === "expense" ? "-" : "+"

  return (
    <div className="flex flex-col">
      {groups.map((group) => {
        const dayTotal = group.transactions.reduce((sum, tx) => sum + tx.amount, 0)
        return (
          <div key={group.key}>
            <div className="flex items-center justify-between pt-4 pb-1">
              <span className="text-[13px] text-gray-500">{group.label}</span>
              <span className="text-[13px] text-gray-500">
                {sign}
                {formatAmount(dayTotal)}
              </span>
            </div>
            {group.transactions.map((tx) => {
              const icon = (SPENDING_ICONS[tx.category] ?? FALLBACK_SPENDING_ICON).filled
              return (
                <div key={tx.id} className="flex items-center gap-3 py-2.5">
                  <img src={icon} alt="" className="h-10 w-10 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[15px] font-medium text-white">
                      {CATEGORY_NAMES.get(tx.category) ?? tx.category}
                    </div>
                    <div className="truncate text-[13px] text-gray-500">
                      {tx.description}
                    </div>
                  </div>
                  <span className="flex-shrink-0 text-[15px] font-medium text-white">
                    {sign}
                    {formatAmount(tx.amount)}
                  </span>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default TransactionList
