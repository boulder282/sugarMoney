import { useState } from "react"
import { WidgetDeck } from "@/widgets/widget-deck"
import { AccountsSection } from "@/widgets/accounts"
import { ChartPrompt } from "@/widgets/chart-prompt"
import { IncomeExpenseChart } from "@/widgets/income-expense-chart"
import { InsightBanner } from "@/widgets/insight-banner"
import { ExpensesModal } from "@/widgets/expenses-modal"
import { AddOperationModal } from "@/widgets/add-operation"
import type { ChartView } from "@/shared/types/finance"

export default function DashboardPage() {
  const [expensesOpen, setExpensesOpen] = useState(false)
  const [addOperationOpen, setAddOperationOpen] = useState(false)
  const [activeChart, setActiveChart] = useState<ChartView>("income-expense")

  return (
    <div className="min-h-screen bg-[#141415] text-white">
      <div className="mx-auto flex w-full max-w-[430px] flex-col gap-6 pt-12 pb-36">
        <h1 className="px-6 text-center text-[24px] leading-tight font-bold">
          Привет, Вадим! Твой лимит трат на сегодня 2500 ₽
        </h1>

        <WidgetDeck onOpenExpenses={() => setExpensesOpen(true)} />

        <div className="flex flex-col gap-6 px-4">
          <AccountsSection />
          <ChartPrompt activeChart={activeChart} onSelect={setActiveChart} />
          <IncomeExpenseChart chartType={activeChart} />
          <InsightBanner />
        </div>
      </div>

      <ExpensesModal
        open={expensesOpen}
        onOpenChange={setExpensesOpen}
        onAddOperation={() => setAddOperationOpen(true)}
      />

      <AddOperationModal
        open={addOperationOpen}
        onOpenChange={setAddOperationOpen}
      />
    </div>
  )
}
