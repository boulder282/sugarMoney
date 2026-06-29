import { useExpenseStore } from "@/entities/expense"
import React, { useMemo } from "react"
import { CalendarDays } from "lucide-react"
import WidgetMenu from "./WidgetMenu"
import { DotsIcon } from "@/shared/ui/icons"
import { formatAmount, currentMonthName } from "@/shared/lib/format"

const SIZE = 153
const STROKE = 10
const CENTER = SIZE / 2
// Padding keeps the stroke's round caps from being clipped by the SVG bounds.
const EDGE_PADDING = 6
const RADIUS = (SIZE - STROKE) / 2 - EDGE_PADDING
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
// Round line caps extend strokeWidth/2 past each dash end, so the
// visible gap between segments is SEGMENT_GAP minus the stroke width
const SEGMENT_GAP = 20

interface PieChartProps {
  segments: Array<{
    value: number
    color: string
    strokeDasharray: string
    strokeDashoffset: number
  }>
  totalUsed: number
}

const PieChart: React.FC<PieChartProps> = ({ segments, totalUsed }) => (
  <div className="relative flex justify-center">
    <svg width={SIZE} height={SIZE} className="-rotate-90">
      <circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        fill="none"
        stroke="#2A2B2C"
        strokeWidth={STROKE}
      />
      {segments.map((seg, idx) => (
        <circle
          key={idx}
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke={seg.color}
          strokeWidth={STROKE}
          strokeDasharray={seg.strokeDasharray}
          strokeDashoffset={seg.strokeDashoffset}
          strokeLinecap="round"
        />
      ))}
      <circle cx={CENTER} cy={CENTER + RADIUS} r="3.5" fill="#FFFFFF" />
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
      <span className="text-[20px] font-bold text-white">
        {formatAmount(totalUsed)}
      </span>
      <span className="flex items-center gap-1.5 rounded-full bg-[#2A2B2C] px-3 py-[5px] text-[12px] font-medium text-gray-300">
        <CalendarDays size={12} className="text-gray-400" />
        {currentMonthName()}
      </span>
    </div>
  </div>
)

const ExpenseChart: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { expenses, totalBudget } = useExpenseStore()

  const totalUsed = useMemo(
    () => expenses.reduce((sum, exp) => sum + exp.value, 0),
    [expenses]
  )

  type Segment = {
    value: number
    color: string
    strokeDasharray: string
    strokeDashoffset: number
  }

  const segments = useMemo((): Segment[] => {
    return expenses.reduce<{ offset: number; segs: Segment[] }>(
      (acc, expense) => {
        const arcLength = (expense.value / totalBudget) * CIRCUMFERENCE
        const visibleArc = Math.max(arcLength - SEGMENT_GAP, 1)
        const seg: Segment = {
          value: expense.value,
          color: expense.color,
          strokeDasharray: `${visibleArc} ${CIRCUMFERENCE - visibleArc}`,
          strokeDashoffset: -acc.offset,
        }
        return { offset: acc.offset + arcLength, segs: [...acc.segs, seg] }
      },
      { offset: 0, segs: [] }
    ).segs
  }, [expenses, totalBudget])

  return (
    <div
      className={`relative flex h-[295px] w-[225px] flex-col justify-between rounded-[24px] bg-[#1F2021] pt-[21px] pr-4 pb-4 pl-4 shadow-xl ${className}`}
      style={{
        border: "1px solid transparent",
        backgroundImage:
          "linear-gradient(#1F2021, #1F2021), linear-gradient(135deg, rgba(255,255,255,0.04), #6666FF)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      <WidgetMenu
        onEdit={() => console.log("Edit widget clicked")}
        onRemove={() => console.log("Remove widget clicked")}
      />

      <PieChart segments={segments} totalUsed={totalUsed} />

      <div className="flex flex-col items-start gap-[6px]">
        {expenses.slice(0, 3).map((expense) => (
          <div
            key={expense.id}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-[#1A1B1C] py-[6px] pr-3 pl-2"
          >
            <div
              className="h-[13px] w-[4px] flex-shrink-0 rounded-full"
              style={{ backgroundColor: expense.color }}
              aria-hidden="true"
            />
            <span className="text-[12px] leading-none text-white">
              {expense.name}
              <span className="mx-[4px] text-gray-500">·</span>
              <span className="font-medium">{formatAmount(expense.value)}</span>
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => console.log("Bottom-right dots clicked")}
        className="absolute right-4 bottom-4 flex h-7 w-7 items-center justify-center rounded-full bg-[#2A2B2C] text-gray-400 hover:bg-[#333435] focus:outline-none"
        aria-label="Дополнительные действия"
      >
        <DotsIcon />
      </button>
    </div>
  )
}

export default ExpenseChart
