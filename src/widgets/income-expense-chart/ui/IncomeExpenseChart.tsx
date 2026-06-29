import { useMemo } from "react"
import {
  CalendarDays,
  Plus,
  RotateCcw,
  CircleCheck,
  Trash2,
} from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { monthlyData } from "@/shared/mocks/mockData"
import { DotsIcon } from "@/shared/ui/icons"
import { formatAmount } from "@/shared/lib/format"
import type { ChartView } from "@/shared/types/finance"

const FULL_MONTHS: Record<string, string> = {
  Май: "Май",
  Июн: "Июнь",
  Июл: "Июль",
  Авг: "Август",
  Сент: "Сентябрь",
  Окт: "Октябрь",
  Ноя: "Ноябрь",
  Дек: "Декабрь",
}

const CHART_TITLES: Record<ChartView, string> = {
  "income-expense": "Доходы vs Расходы",
  "cash-flow": "Движение средств",
  savings: "Накопления",
}

const SERIES_META: Record<string, { label: string; color: string }> = {
  income: { label: "Доходы", color: "#4ADE80" },
  expenses: { label: "Расходы", color: "#F472B6" },
  savings: { label: "Накопления", color: "#EAB308" },
}

interface TooltipEntry {
  dataKey?: string | number
  value?: number | string
}

const ChartTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-[12px] bg-[#2A2B2C]/95 px-3 py-2 shadow-xl backdrop-blur-sm">
      <div className="text-[11px] text-gray-400">
        {FULL_MONTHS[label ?? ""] ?? label}
      </div>
      {payload.map((entry) => {
        const key = String(entry.dataKey)
        const value = Number(entry.value)

        // Cash-flow bars get dynamic color based on sign
        if (key === "net") {
          const color = value >= 0 ? "#4ADE80" : "#F472B6"
          return (
            <div key={key} className="mt-1 flex items-center gap-1.5 text-[12px] text-white">
              <span className="h-[7px] w-[7px] rounded-full" style={{ backgroundColor: color }} />
              Движение
              <span className="text-gray-500">·</span>
              <span className="font-medium">{formatAmount(value)}</span>
            </div>
          )
        }

        const series = SERIES_META[key]
        if (!series) return null
        return (
          <div key={key} className="mt-1 flex items-center gap-1.5 text-[12px] text-white">
            <span
              className="h-[7px] w-[7px] rounded-full"
              style={{ backgroundColor: series.color }}
            />
            {series.label}
            <span className="text-gray-500">·</span>
            <span className="font-medium">{formatAmount(value)}</span>
          </div>
        )
      })}
    </div>
  )
}

const commonAxisStyle = {
  axisLine: false as const,
  tickLine: false as const,
  tick: { fill: "#6B7280", fontSize: 10 },
}

const formatYTick = (v: number) => `${Math.round(v / 1000)}к`
const commonMargin = { top: 5, right: 5, bottom: 0, left: 0 }

interface IncomeExpenseChartProps {
  chartType: ChartView
}

const IncomeExpenseChart = ({ chartType }: IncomeExpenseChartProps) => {
  const cashFlowData = useMemo(
    () => monthlyData.map((d) => ({ month: d.month, net: d.income - d.expenses })),
    [],
  )

  const savingsData = useMemo(() => {
    let cumulative = 0
    return monthlyData.map((d) => {
      cumulative += d.income - d.expenses
      return { month: d.month, savings: cumulative }
    })
  }, [])

  const renderChart = () => {
    const xAxis = (
      <XAxis
        dataKey="month"
        {...commonAxisStyle}
        tickFormatter={(v: string) => v.toLowerCase()}
        interval={0}
      />
    )

    if (chartType === "income-expense") {
      return (
        <LineChart data={monthlyData} margin={commonMargin}>
          <CartesianGrid vertical={false} stroke="#2A2B2C" />
          {xAxis}
          <YAxis
            domain={[100000, 300000]}
            ticks={[100000, 150000, 200000, 250000, 300000]}
            {...commonAxisStyle}
            tickFormatter={formatYTick}
            width={38}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: "#FFFFFF", strokeWidth: 1.5 }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#4ADE80"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#F472B6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
            isAnimationActive={false}
          />
        </LineChart>
      )
    }

    if (chartType === "cash-flow") {
      return (
        <BarChart data={cashFlowData} margin={commonMargin}>
          <CartesianGrid vertical={false} stroke="#2A2B2C" />
          {xAxis}
          <YAxis {...commonAxisStyle} tickFormatter={formatYTick} width={38} />
          <ReferenceLine y={0} stroke="#3A3B3C" />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
          />
          <Bar dataKey="net" radius={[4, 4, 2, 2]} isAnimationActive={false}>
            {cashFlowData.map((entry, i) => (
              <Cell key={i} fill={entry.net >= 0 ? "#4ADE80" : "#F472B6"} />
            ))}
          </Bar>
        </BarChart>
      )
    }

    // savings
    return (
      <AreaChart data={savingsData} margin={commonMargin}>
        <defs>
          <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#EAB308" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#2A2B2C" />
        {xAxis}
        <YAxis {...commonAxisStyle} tickFormatter={formatYTick} width={38} />
        <Tooltip
          content={<ChartTooltip />}
          cursor={{ stroke: "#FFFFFF", strokeWidth: 1.5 }}
        />
        <Area
          type="monotone"
          dataKey="savings"
          stroke="#EAB308"
          strokeWidth={2}
          fill="url(#savingsGradient)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0, fill: "#EAB308" }}
          isAnimationActive={false}
        />
      </AreaChart>
    )
  }

  return (
    <div className="rounded-[24px] bg-[#1F2021] p-4 pt-[18px]">
      <div className="flex items-start justify-between">
        <h3 className="text-[18px] font-bold text-white">{CHART_TITLES[chartType]}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2A2B2C] text-gray-400 hover:bg-[#333435] focus:outline-none data-[state=open]:bg-[#333435]"
              aria-label="Меню графика"
            >
              <DotsIcon />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={6}
            className="w-auto min-w-[210px] rounded-[16px] bg-[#2F3031]/90 p-1.5 shadow-2xl ring-0 backdrop-blur-md"
          >
            <DropdownMenuItem
              className="gap-2.5 rounded-[10px] px-2.5 py-2 text-[14px] font-medium text-white focus:bg-white/10 focus:text-white"
            >
              <RotateCcw size={15} className="text-white" />
              Сгенерировать еще раз
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2.5 rounded-[10px] px-2.5 py-2 text-[14px] font-medium text-white focus:bg-white/10 focus:text-white"
            >
              <CircleCheck size={15} className="text-white" />
              Сохранить виджет
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2.5 rounded-[10px] px-2.5 py-2 text-[14px] font-medium text-[#F87171] focus:bg-white/10 focus:text-[#F87171]"
            >
              <Trash2 size={15} className="text-[#F87171]" />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button className="flex items-center gap-1.5 rounded-full bg-[#2A2B2C] px-3 py-1.5 text-[13px] font-medium text-white hover:bg-[#333435]">
          <CalendarDays size={13} className="text-gray-400" />
          2025
        </button>
        <button
          className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#2A2B2C] text-gray-400 hover:bg-[#333435]"
          aria-label="Добавить период"
        >
          <Plus size={15} />
        </button>
      </div>

      <div className="mt-4 h-[210px] w-full outline-none [&_*]:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default IncomeExpenseChart
