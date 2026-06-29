import { Pencil, CircleMinus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { DotsIcon } from "@/shared/ui/icons"

interface WidgetMenuProps {
  onEdit?: () => void
  onRemove?: () => void
}

const WidgetMenu = ({ onEdit, onRemove }: WidgetMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        onClick={(e) => e.stopPropagation()}
        className="absolute top-[14px] right-4 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#2A2B2C] text-gray-400 hover:bg-[#333435] focus:ring-1 focus:ring-gray-500 focus:outline-none data-[state=open]:bg-[#333435]"
        aria-label="Меню виджета"
      >
        <DotsIcon />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      sideOffset={6}
      className="w-auto min-w-[190px] rounded-[16px] bg-[#2F3031]/90 p-1.5 shadow-2xl ring-0 backdrop-blur-md"
    >
      <DropdownMenuItem
        onClick={onEdit}
        className="gap-2.5 rounded-[10px] px-2.5 py-2 text-[14px] font-medium text-white focus:bg-white/10 focus:text-white"
      >
        <Pencil size={15} className="text-white" />
        Изменить виджет
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={onRemove}
        className="gap-2.5 rounded-[10px] px-2.5 py-2 text-[14px] font-medium text-white focus:bg-white/10 focus:text-white"
      >
        <CircleMinus size={15} className="text-white" />
        Убрать с главной
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

export default WidgetMenu
