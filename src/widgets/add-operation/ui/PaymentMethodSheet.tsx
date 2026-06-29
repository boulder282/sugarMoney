import { useState } from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { Check, X } from "lucide-react"
import type { Account } from "@/shared/types/finance"
import { ACCOUNT_VISUALS } from "../lib/accountVisuals"

interface PaymentMethodSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  accounts: Account[]
  value: string
  onChange: (accountId: string) => void
}

// Body lives in its own component so Radix mounts it fresh on each open,
// which resets the pending selection to the committed value for free.
const SheetBody = ({
  title,
  accounts,
  value,
  onSave,
}: {
  title: string
  accounts: Account[]
  value: string
  onSave: (accountId: string) => void
}) => {
  const [pendingId, setPendingId] = useState(value)

  return (
    <>
      <div className="flex items-center justify-between">
        <DialogPrimitive.Title className="text-[20px] font-bold text-white">
          {title}
        </DialogPrimitive.Title>
        <DialogPrimitive.Close
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2A2B2C] text-gray-400 hover:bg-[#333435]"
          aria-label="Закрыть"
        >
          <X size={18} />
        </DialogPrimitive.Close>
      </div>
      <DialogPrimitive.Description className="sr-only">
        Выберите счёт для оплаты
      </DialogPrimitive.Description>

      <div className="flex flex-col">
        {accounts.map((account) => {
          const { Icon, color } = ACCOUNT_VISUALS[account.type]
          const isSelected = account.id === pendingId
          return (
            <button
              key={account.id}
              onClick={() => setPendingId(account.id)}
              className={`flex items-center gap-3 rounded-[16px] px-2 py-3 text-left transition-colors ${
                isSelected ? "bg-[#262728]" : "hover:bg-[#222324]"
              }`}
            >
              <span
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: color }}
              >
                <Icon size={18} color="#FFFFFF" />
              </span>
              <span className="flex-1 text-[15px] font-medium text-white">
                {account.name}
              </span>
              {isSelected && <Check size={20} className="text-[#22C55E]" />}
            </button>
          )
        })}
      </div>

      <button
        onClick={() => onSave(pendingId)}
        className="mt-1 h-[52px] w-full rounded-full bg-[#22C55E] text-[16px] font-semibold text-white hover:bg-[#1FAD53]"
      >
        Сохранить
      </button>
    </>
  )
}

const PaymentMethodSheet = ({
  open,
  onOpenChange,
  title,
  accounts,
  value,
  onChange,
}: PaymentMethodSheetProps) => {
  const handleSave = (accountId: string) => {
    onChange(accountId)
    onOpenChange(false)
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/60 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content className="fixed inset-x-0 bottom-0 z-[60] mx-auto flex w-full max-w-[430px] flex-col gap-4 rounded-t-[24px] bg-[#1C1D1E] px-4 pt-5 pb-8 outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom">
          <SheetBody
            title={title}
            accounts={accounts}
            value={value}
            onSave={handleSave}
          />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export default PaymentMethodSheet
