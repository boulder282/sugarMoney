export const formatAmount = (amount: number) =>
  `${amount.toLocaleString("ru-RU")} ₽`

export const currentMonthName = () => {
  const month = new Date().toLocaleString("ru-RU", { month: "long" })
  return month.charAt(0).toUpperCase() + month.slice(1)
}

// e.g. "27 декабря 2025" — drops the trailing "г." that ru locale adds.
export const formatLongDate = (iso: string) =>
  new Date(iso)
    .toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .replace(/\s*г\.$/, "")
