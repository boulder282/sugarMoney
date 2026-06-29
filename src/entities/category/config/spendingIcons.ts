import bookOn from "@/shared/assets/icons/spendingsEarning/Type=Book, Fill=On.svg"
import bookOff from "@/shared/assets/icons/spendingsEarning/Type=Book, Fill=Off.svg"
import childOn from "@/shared/assets/icons/spendingsEarning/Type=Child, Fill=On.svg"
import childOff from "@/shared/assets/icons/spendingsEarning/Type=Child, Fill=Off.svg"
import moneyOn from "@/shared/assets/icons/spendingsEarning/Type=Money, Fill=On.svg"
import moneyOff from "@/shared/assets/icons/spendingsEarning/Type=Money, Fill=Off.svg"
import toolOn from "@/shared/assets/icons/spendingsEarning/Type=Tool, Fill=On.svg"
import toolOff from "@/shared/assets/icons/spendingsEarning/Type=Tool, Fill=Off.svg"
import carOn from "@/shared/assets/icons/spendingsEarning/Type=car, Fill=On.svg"
import carOff from "@/shared/assets/icons/spendingsEarning/Type=car, Fill=Off.svg"
import dressOn from "@/shared/assets/icons/spendingsEarning/Type=dress, Fill=On.svg"
import dressOff from "@/shared/assets/icons/spendingsEarning/Type=dress, Fill=Off.svg"
import foodOn from "@/shared/assets/icons/spendingsEarning/Type=food, Fill=On.svg"
import foodOff from "@/shared/assets/icons/spendingsEarning/Type=food, Fill=Off.svg"
import homeOn from "@/shared/assets/icons/spendingsEarning/Type=home, Fill=On.svg"
import homeOff from "@/shared/assets/icons/spendingsEarning/Type=home, Fill=Off.svg"
import partyOn from "@/shared/assets/icons/spendingsEarning/Type=party, Fill=On.svg"
import partyOff from "@/shared/assets/icons/spendingsEarning/Type=party, Fill=Off.svg"
import petOn from "@/shared/assets/icons/spendingsEarning/Type=pet, Fill=On.svg"
import petOff from "@/shared/assets/icons/spendingsEarning/Type=pet, Fill=Off.svg"
import pillOn from "@/shared/assets/icons/spendingsEarning/Type=pill, Fill=On.svg"
import pillOff from "@/shared/assets/icons/spendingsEarning/Type=pill, Fill=Off.svg"
import travelOn from "@/shared/assets/icons/spendingsEarning/Type=travel, Fill=On.svg"
import travelOff from "@/shared/assets/icons/spendingsEarning/Type=travel, Fill=Off.svg"

export interface SpendingIcon {
  filled: string // default look, shown when the category is not selected
  outline: string // shown when the category is selected
}

export const SPENDING_ICONS: Record<string, SpendingIcon> = {
  apartment: { filled: homeOn, outline: homeOff },
  groceries: { filled: foodOn, outline: foodOff },
  health: { filled: pillOn, outline: pillOff },
  entertainment: { filled: partyOn, outline: partyOff },
  auto: { filled: carOn, outline: carOff },
  clothing: { filled: dressOn, outline: dressOff },
  child: { filled: childOn, outline: childOff },
  pet: { filled: petOn, outline: petOff },
  education: { filled: bookOn, outline: bookOff },
  travel: { filled: travelOn, outline: travelOff },
  repair: { filled: toolOn, outline: toolOff },
  salary: { filled: moneyOn, outline: moneyOff },
  freelance: { filled: moneyOn, outline: moneyOff },
  gift: { filled: partyOn, outline: partyOff },
}

export const FALLBACK_SPENDING_ICON: SpendingIcon = {
  filled: moneyOn,
  outline: moneyOff,
}
