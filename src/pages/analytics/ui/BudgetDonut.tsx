import { formatAmount } from "@/shared/lib/format"

const SIZE = 200
const STROKE = 14
const CENTER = SIZE / 2
// Padding keeps the stroke's round caps from being clipped by the SVG bounds.
const EDGE_PADDING = 8
const RADIUS = (SIZE - STROKE) / 2 - EDGE_PADDING
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
// Visual gap between segments. Round caps extend each segment by STROKE/2 per
// end, so the drawn dash is shrunk by GAP + STROKE to leave a real gap.
const SEGMENT_GAP = 8
const MIN_DASH = 1

interface BudgetDonutProps {
  segments: Array<{ value: number; color: string }>
  /** Denominator the segments are measured against (budget, or total spent). */
  total: number
  centerValue: number
  caption?: string
}

const DOT_RADIUS = STROKE / 2 + 2

const BudgetDonut = ({
  segments,
  total,
  centerValue,
  caption,
}: BudgetDonutProps) => {
  let cursor = 0

  const spentValue = segments.reduce((sum, segment) => sum + segment.value, 0)

  // Fixed white anchor at the 3 o'clock point where the spent arc begins.
  const dotX = CENTER + RADIUS
  const dotY = CENTER

  // Smallest first so the largest segment ends near the top of the ring.
  const orderedSegments = [...segments].sort((a, b) => a.value - b.value)

  return (
    <div className="relative flex justify-center">
      <svg width={SIZE} height={SIZE}>
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="#2A2B2C"
          strokeWidth={STROKE}
        />
        {total > 0 &&
          orderedSegments.map((segment, index) => {
            const arc = (segment.value / total) * CIRCUMFERENCE
            const dash = Math.max(arc - SEGMENT_GAP - STROKE, MIN_DASH)
            // Center the (cap-extended) dash within its arc slot.
            const start = cursor + (arc - dash) / 2
            cursor += arc
            return (
              <circle
                key={index}
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke={segment.color}
                strokeWidth={STROKE}
                strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
                strokeDashoffset={-start}
                strokeLinecap="round"
              />
            )
          })}
        {spentValue > 0 && (
          <circle cx={dotX} cy={dotY} r={DOT_RADIUS} fill="#FFFFFF" />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[28px] font-bold text-white">
          {formatAmount(centerValue)}
        </span>
        {caption && (
          <span className="mt-1 text-[14px] text-gray-500">{caption}</span>
        )}
      </div>
    </div>
  )
}

export default BudgetDonut
