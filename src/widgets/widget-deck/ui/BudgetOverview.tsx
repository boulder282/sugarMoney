import { Home, Gamepad2, ShoppingCart, Cat, type LucideIcon } from "lucide-react"
import WidgetMenu from "./WidgetMenu"
import { formatAmount } from "@/shared/lib/format"

interface ExpenseItem {
  name: string
  Icon: LucideIcon
  spent: number
  limit: number
  color: string
}

const MOCK_EXPENSES: ExpenseItem[] = [
  { name: "Квартира", Icon: Home, spent: 60000, limit: 60000, color: "#F97316" },
  { name: "Развлечения", Icon: Gamepad2, spent: 18000, limit: 18000, color: "#EC4899" },
  { name: "Продукты", Icon: ShoppingCart, spent: 40000, limit: 45830, color: "#EAB308" },
  { name: "Кошка", Icon: Cat, spent: 4500, limit: 7330, color: "#22C55E" },
]

const BudgetOverview = ({ onOpen }: { onOpen?: () => void }) => {
  const displayed = MOCK_EXPENSES.slice(0, 4)

  return (
    <div
      className="relative flex h-[295px] w-[225px] flex-col justify-between rounded-[24px] bg-[#1F2021] pt-[21px] pr-4 pb-4 pl-4 shadow-xl"
      style={{
        border: "1px solid transparent",
        backgroundImage:
          "linear-gradient(#1F2021, #1F2021), linear-gradient(135deg, rgba(255,255,255,0.04), #6666FF)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      <WidgetMenu />

      {/* Title */}
      <h3 className="text-[22px] font-bold leading-tight text-white">
        Обзор
        <br />
        расходов
      </h3>

      {/* Expense rows */}
      <div className="space-y-[10px]">
        {displayed.map((expense) => {
          const remaining = expense.limit - expense.spent
          const percent = Math.min(expense.spent / expense.limit, 1)
          return (
            <div key={expense.name} className="flex items-center gap-[10px]">
              {/* Colored icon circle */}
              <div
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: expense.color }}
              >
                <expense.Icon size={16} color="#FFFFFF" strokeWidth={2.25} />
              </div>

              {/* Name + amounts */}
              <div className="min-w-0 flex-1">
                <div className="text-[11px] leading-none text-gray-500">
                  {expense.name}
                </div>
                <div className="mt-[3px] text-[12px] leading-none text-white">
                  {formatAmount(expense.spent)}
                  <span className="mx-[3px] text-gray-600">·</span>
                  <span style={{ color: remaining > 0 ? "#F87171" : "#6B7280" }}>
                    {formatAmount(remaining)}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-[5px] w-[48px] flex-shrink-0 overflow-hidden rounded-full bg-[#2A2B2C]">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${percent * 100}%`,
                    backgroundColor: expense.color,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Больше button */}
      <button
        onClick={onOpen}
        className="self-start text-sm text-gray-400 transition-colors hover:text-gray-200"
      >
        Больше
      </button>
    </div>
  )
}

export default BudgetOverview
