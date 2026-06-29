import { Mic, ChartColumn, ArrowRightLeft, PiggyBank, type LucideIcon } from "lucide-react"
import type { ChartView } from "@/shared/types/finance"

interface Suggestion {
  id: ChartView
  label: string
  Icon: LucideIcon
  color: string
}

const SUGGESTIONS: Suggestion[] = [
  { id: "income-expense", label: "Доходы vs Расходы", Icon: ChartColumn, color: "#22C55E" },
  { id: "cash-flow", label: "Движение средств", Icon: ArrowRightLeft, color: "#EC4899" },
  { id: "savings", label: "Накопления", Icon: PiggyBank, color: "#EAB308" },
]

interface ChartPromptProps {
  activeChart: ChartView
  onSelect: (chart: ChartView) => void
}

const ChartPrompt = ({ activeChart, onSelect }: ChartPromptProps) => (
  <section className="flex flex-col gap-3">
    <div className="flex items-center gap-2 rounded-[18px] bg-[#1F2021] px-4">
      <input
        type="text"
        placeholder="Построй график..."
        className="h-12 min-w-0 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-gray-500"
      />
      <button
        className="flex-shrink-0 text-gray-400 hover:text-gray-200"
        aria-label="Голосовой ввод"
      >
        <Mic size={18} />
      </button>
    </div>

    <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {SUGGESTIONS.map(({ id, label, Icon, color }) => {
        const isActive = activeChart === id
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`flex flex-shrink-0 items-center gap-2 rounded-full py-2 pr-3.5 pl-2.5 transition-colors ${
              isActive
                ? "bg-[#2A2B2C] ring-1 ring-white/10"
                : "bg-[#1A1B1C] hover:bg-[#242526]"
            }`}
          >
            <span
              className="flex h-[18px] w-[18px] items-center justify-center rounded-[5px]"
              style={{ backgroundColor: color }}
            >
              <Icon size={12} color="#FFFFFF" strokeWidth={2.5} />
            </span>
            <span className="text-[13px] font-medium whitespace-nowrap text-white">
              {label}
            </span>
          </button>
        )
      })}
    </div>
  </section>
)

export default ChartPrompt
