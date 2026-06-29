import { useState } from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CreditCard,
  MapPin,
  MinusCircle,
  PlusCircle,
  ArrowLeftRight,
} from "lucide-react"
import { useTransactionStore } from "@/entities/transaction"
import { useAccountStore } from "@/entities/account"
import { SPENDING_ICONS, FALLBACK_SPENDING_ICON } from "@/entities/category"
import { categories } from "@/shared/mocks/mockData"
import type { TransactionType } from "@/shared/types/finance"
import { formatLongDate } from "@/shared/lib/format"
import { useBackButtonClose } from "@/shared/lib/useBackButtonClose"
import PaymentMethodSheet from "./PaymentMethodSheet"

const todayValue = () => new Date().toISOString().slice(0, 10)

const firstCategoryOf = (type: TransactionType) =>
  categories.find((category) => category.type === type)?.id ?? null

const TYPE_TABS: Array<{
  type: TransactionType | "transfer"
  label: string
  icon: typeof MinusCircle
  color: string
  enabled: boolean
}> = [
  { type: "expense", label: "Расход", icon: MinusCircle, color: "#F4502B", enabled: true },
  { type: "income", label: "Доход", icon: PlusCircle, color: "#22C55E", enabled: true },
  // Transfer moves money between accounts, which the Transaction model
  // doesn't represent yet — shown for parity with the design, disabled.
  { type: "transfer", label: "Перевод", icon: ArrowLeftRight, color: "#3B82F6", enabled: false },
]

interface AddOperationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const AddOperationModal = ({ open, onOpenChange }: AddOperationModalProps) => {
  const addTransaction = useTransactionStore((state) => state.addTransaction)
  const accounts = useAccountStore((state) => state.accounts)
  const updateBalance = useAccountStore((state) => state.updateBalance)

  const [type, setType] = useState<TransactionType>("expense")
  const [amountStr, setAmountStr] = useState("")
  const [categoryId, setCategoryId] = useState<string | null>(firstCategoryOf("expense"))
  const [accountId, setAccountId] = useState("main")
  const [dateValue, setDateValue] = useState(todayValue)
  const [place, setPlace] = useState("")
  const [sheetOpen, setSheetOpen] = useState(false)

  // Investment accounts aren't spendable, so they're left out of the picker.
  const paymentAccounts = accounts.filter((account) => account.type !== "investment")
  const selectedAccount = accounts.find((account) => account.id === accountId)
  const visibleCategories = categories.filter((category) => category.type === type)

  const amount = Number(amountStr)
  const canSubmit = amount > 0 && categoryId !== null

  // "Payment" wording only fits expenses; income is credited to / sourced from.
  const accountLabel = type === "income" ? "Счёт зачисления" : "Способ оплаты"
  const placeLabel = type === "income" ? "Источник" : "Место платежа"

  const resetForm = () => {
    setType("expense")
    setAmountStr("")
    setCategoryId(firstCategoryOf("expense"))
    setAccountId("main")
    setDateValue(todayValue())
    setPlace("")
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) resetForm()
    onOpenChange(next)
  }

  useBackButtonClose(open, () => handleOpenChange(false))

  const switchType = (next: TransactionType) => {
    setType(next)
    setCategoryId(firstCategoryOf(next))
  }

  const handleSubmit = () => {
    if (!canSubmit || !categoryId) return

    const categoryName = categories.find((c) => c.id === categoryId)?.name ?? ""
    addTransaction({
      amount,
      type,
      category: categoryId,
      description: place.trim() || categoryName,
      date: new Date(`${dateValue}T12:00:00`).toISOString(),
      account: accountId,
    })

    if (selectedAccount) {
      const delta = type === "income" ? amount : -amount
      updateBalance(accountId, selectedAccount.balance + delta)
    }

    handleOpenChange(false)
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[55] bg-black/60 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content className="fixed inset-0 z-[55] mx-auto flex h-dvh w-full max-w-[430px] flex-col bg-[#141415] outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom">
          <DialogPrimitive.Description className="sr-only">
            Форма добавления новой операции
          </DialogPrimitive.Description>

          {/* Header */}
          <div className="relative flex items-center justify-center px-4 pt-5 pb-2">
            <DialogPrimitive.Close
              className="absolute left-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-300 hover:bg-[#1F2021]"
              aria-label="Назад"
            >
              <ChevronLeft size={22} />
            </DialogPrimitive.Close>
            <DialogPrimitive.Title className="text-[17px] font-semibold text-white">
              Добавить операцию
            </DialogPrimitive.Title>
          </div>

          {/* Type tabs */}
          <div className="flex items-center justify-center gap-2 px-4 pt-2">
            {TYPE_TABS.map((tab) => {
              const isActive = tab.enabled && tab.type === type
              return (
                <button
                  key={tab.type}
                  disabled={!tab.enabled}
                  onClick={() => tab.enabled && switchType(tab.type as TransactionType)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors ${
                    isActive ? "bg-[#2A2B2C] text-white" : "text-gray-400"
                  } ${tab.enabled ? "" : "opacity-40"}`}
                >
                  <tab.icon size={16} color={tab.color} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* Amount */}
            <div className="flex items-center justify-center gap-1 px-6 pt-10 pb-8 text-[44px] font-bold text-white">
              <span>{type === "income" ? "+" : "-"}</span>
              <input
                autoFocus
                inputMode="numeric"
                value={amountStr}
                onChange={(event) =>
                  setAmountStr(event.target.value.replace(/\D/g, ""))
                }
                placeholder="0"
                size={Math.max(amountStr.length, 1)}
                className="min-w-0 bg-transparent text-center caret-[#22C55E] outline-none placeholder:text-gray-600"
              />
              <span>₽</span>
            </div>

            {/* Category picker */}
            <div className="flex gap-3 overflow-x-auto px-4 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {visibleCategories.map((category) => {
                const icons = SPENDING_ICONS[category.id] ?? FALLBACK_SPENDING_ICON
                const isSelected = category.id === categoryId
                return (
                  <button
                    key={category.id}
                    onClick={() => setCategoryId(category.id)}
                    className="flex w-14 flex-shrink-0 flex-col items-center gap-1.5"
                  >
                    <img
                      src={isSelected ? icons.outline : icons.filled}
                      alt=""
                      className="h-12 w-12"
                    />
                    <span
                      className={`w-full truncate text-center text-[11px] ${
                        isSelected ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {category.name}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Date / payment method / place */}
            <div className="mx-4 overflow-hidden rounded-[16px] bg-[#1F2021]">
              <label className="flex w-full cursor-pointer items-center justify-between px-4 py-3.5">
                <span className="flex items-center gap-3 text-[15px] text-gray-400">
                  <CalendarDays size={18} />
                  Дата
                </span>
                <span className="text-[15px] font-medium text-white">
                  {formatLongDate(dateValue)}
                </span>
                <input
                  type="date"
                  value={dateValue}
                  onChange={(event) => setDateValue(event.target.value)}
                  className="sr-only"
                />
              </label>

              <div className="mx-4 h-px bg-white/5" />

              <button
                onClick={() => setSheetOpen(true)}
                className="flex w-full items-center justify-between px-4 py-3.5"
              >
                <span className="flex items-center gap-3 text-[15px] text-gray-400">
                  <CreditCard size={18} />
                  {accountLabel}
                </span>
                <span className="flex items-center gap-1 text-[15px] font-medium text-white">
                  {selectedAccount?.name}
                  <ChevronRight size={16} className="text-gray-500" />
                </span>
              </button>

              <div className="mx-4 h-px bg-white/5" />

              <div className="flex w-full items-center justify-between px-4 py-3.5">
                <span className="flex flex-shrink-0 items-center gap-3 text-[15px] text-gray-400">
                  <MapPin size={18} />
                  {placeLabel}
                </span>
                <input
                  value={place}
                  onChange={(event) => setPlace(event.target.value)}
                  placeholder="Не указано"
                  className="min-w-0 flex-1 bg-transparent text-right text-[15px] font-medium text-white outline-none placeholder:text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="px-4 pt-3 pb-6">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="h-[52px] w-full rounded-full bg-[#22C55E] text-[16px] font-semibold text-white transition-colors hover:bg-[#1FAD53] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {type === "income" ? "Добавить доход" : "Добавить расход"}
            </button>
          </div>

          <PaymentMethodSheet
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            title={accountLabel}
            accounts={paymentAccounts}
            value={accountId}
            onChange={setAccountId}
          />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export default AddOperationModal
