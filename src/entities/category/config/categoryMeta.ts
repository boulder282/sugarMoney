import flatIcon from "@/shared/assets/icons/categories/flat.svg"
import foodIcon from "@/shared/assets/icons/categories/food.svg"
import pillIcon from "@/shared/assets/icons/categories/pill.svg"
import partyIcon from "@/shared/assets/icons/categories/party.svg"
import carIcon from "@/shared/assets/icons/categories/car.svg"
import dressIcon from "@/shared/assets/icons/categories/dress.svg"
import childIcon from "@/shared/assets/icons/categories/child.svg"
import animalsIcon from "@/shared/assets/icons/categories/animals.svg"
import bookIcon from "@/shared/assets/icons/categories/book.svg"
import travelIcon from "@/shared/assets/icons/categories/travel.svg"
import toolIcon from "@/shared/assets/icons/categories/tool.svg"
import moneyIcon from "@/shared/assets/icons/categories/money.svg"

export interface CategoryMeta {
  icon: string
  color: string
}

// Income categories share the muted gray circle from the design
const INCOME_GRAY = "#3F4042"

export const CATEGORY_META: Record<string, CategoryMeta> = {
  apartment: { icon: flatIcon, color: "#EAB308" },
  groceries: { icon: foodIcon, color: "#F97316" },
  health: { icon: pillIcon, color: "#F4502B" },
  entertainment: { icon: partyIcon, color: "#EC4899" },
  auto: { icon: carIcon, color: "#3B82F6" },
  clothing: { icon: dressIcon, color: "#E11D48" },
  child: { icon: childIcon, color: "#8B5CF6" },
  pet: { icon: animalsIcon, color: "#22C55E" },
  education: { icon: bookIcon, color: "#60A5FA" },
  travel: { icon: travelIcon, color: "#06B6D4" },
  repair: { icon: toolIcon, color: "#64748B" },
  salary: { icon: moneyIcon, color: INCOME_GRAY },
  freelance: { icon: moneyIcon, color: INCOME_GRAY },
  gift: { icon: partyIcon, color: INCOME_GRAY },
}

export const FALLBACK_META: CategoryMeta = {
  icon: moneyIcon,
  color: "#4B5563",
}
