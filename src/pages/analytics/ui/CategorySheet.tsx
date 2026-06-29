import { Dialog as DialogPrimitive } from "radix-ui"
import { Check, X, LayoutGrid } from "lucide-react"
import { formatAmount } from "@/shared/lib/format"
import type { CategoryBreakdownItem } from "../model/useCategoryBreakdown"

interface CategorySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: CategoryBreakdownItem[]
  selectedId: string | null
  onSelect: (categoryId: string | null) => void
}

const CategorySheet = ({
  open,
  onOpenChange,
  items,
  selectedId,
  onSelect,
}: CategorySheetProps) => {
  const choose = (categoryId: string | null) => {
    onSelect(categoryId)
    onOpenChange(false)
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/60 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content className="fixed inset-x-0 bottom-0 z-[60] mx-auto flex max-h-[80dvh] w-full max-w-[430px] flex-col gap-4 rounded-t-[24px] bg-[#1C1D1E] px-4 pt-5 pb-8 outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom">
          <div className="flex items-center justify-between">
            <DialogPrimitive.Title className="text-[20px] font-bold text-white">
              Категории
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2A2B2C] text-gray-400 hover:bg-[#333435]"
              aria-label="Закрыть"
            >
              <X size={18} />
            </DialogPrimitive.Close>
          </div>
          <DialogPrimitive.Description className="sr-only">
            Выберите категорию для фильтра
          </DialogPrimitive.Description>

          <div className="flex flex-col overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              onClick={() => choose(null)}
              className={`flex items-center gap-3 rounded-[16px] px-2 py-3 text-left transition-colors ${
                selectedId === null ? "bg-[#262728]" : "hover:bg-[#222324]"
              }`}
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#3A3B3C]">
                <LayoutGrid size={18} className="text-white" />
              </span>
              <span className="flex-1 text-[15px] font-medium text-white">
                Все категории
              </span>
              {selectedId === null && <Check size={20} className="text-[#22C55E]" />}
            </button>

            {items.map((item) => {
              const isSelected = item.id === selectedId
              return (
                <button
                  key={item.id}
                  onClick={() => choose(item.id)}
                  className={`flex items-center gap-3 rounded-[16px] px-2 py-3 text-left transition-colors ${
                    isSelected ? "bg-[#262728]" : "hover:bg-[#222324]"
                  }`}
                >
                  <img src={item.icon} alt="" className="h-9 w-9 flex-shrink-0" />
                  <span className="flex-1 truncate text-[15px] font-medium text-white">
                    {item.name}
                  </span>
                  <span className="flex-shrink-0 text-[14px] text-gray-400">
                    {formatAmount(item.spent)}
                  </span>
                  {isSelected && <Check size={20} className="text-[#22C55E]" />}
                </button>
              )
            })}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export default CategorySheet
