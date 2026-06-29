const MONTHS_SHORT = [
  "янв",
  "фев",
  "март",
  "апр",
  "май",
  "июнь",
  "июль",
  "авг",
  "сент",
  "окт",
  "ноя",
  "дек",
]

// Shortest bar so months with little or no spending stay visible.
const MIN_BAR_PERCENT = 12

interface MonthSelectorProps {
  selectedMonth: number
  onSelect: (month: number) => void
  /** Spending per month (index 0–11); drives bar heights. */
  totals: number[]
}

const MonthSelector = ({ selectedMonth, onSelect, totals }: MonthSelectorProps) => {
  const maxTotal = Math.max(...totals, 1)

  return (
    <div className="flex items-end justify-between gap-1">
      {MONTHS_SHORT.map((label, month) => {
        const isSelected = month === selectedMonth
        const heightPercent = Math.max(
          (totals[month] / maxTotal) * 100,
          MIN_BAR_PERCENT
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

export default MonthSelector
