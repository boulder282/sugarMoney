import type {
  Category,
  Account,
  Transaction,
  MonthlyData,
  BudgetPlan,
  InvestmentPlan,
  DebtPlan,
  ExpenseWidgetData,
} from "@/shared/types/finance"

// ---------- Categories ----------
export const categories: Category[] = [
  {
    id: "apartment",
    name: "Квартира",
    icon: "🏠",
    type: "expense",
    budget: 75000,
  },
  {
    id: "groceries",
    name: "Продукты",
    icon: "🍎",
    type: "expense",
    budget: 57000,
  },
  {
    id: "health",
    name: "Здоровье",
    icon: "💊",
    type: "expense",
    budget: 29000,
  },
  {
    id: "entertainment",
    name: "Развлечения",
    icon: "🎬",
    type: "expense",
    budget: 25000,
  },
  {
    id: "auto",
    name: "Автомобиль",
    icon: "🚗",
    type: "expense",
    budget: 18000,
  },
  {
    id: "clothing",
    name: "Одежда",
    icon: "👕",
    type: "expense",
    budget: 13000,
  },
  { id: "child", name: "Ребенок", icon: "👶", type: "expense", budget: 24000 },
  { id: "pet", name: "Кошка", icon: "🐱", type: "expense", budget: 6000 },
  {
    id: "education",
    name: "Образование",
    icon: "📚",
    type: "expense",
    budget: 4000,
  },
  { id: "travel", name: "Путешествия", icon: "✈️", type: "expense", budget: 0 },
  { id: "repair", name: "Ремонт", icon: "🔧", type: "expense", budget: 15000 },
  { id: "salary", name: "Зарплата", icon: "💰", type: "income" },
  { id: "freelance", name: "Фриланс", icon: "💻", type: "income" },
  { id: "gift", name: "Подарок", icon: "🎁", type: "income" },
]

// ---------- Accounts ----------
export const accounts: Account[] = [
  { id: "main", name: "Основной счёт", balance: 250897, type: "main", bank: "tbank" },
  { id: "credit", name: "Кредитка", balance: 300000, type: "credit", bank: "alfa" },
  { id: "savings", name: "Накопительный счет", balance: 600500, type: "savings", bank: "tbank" },
  { id: "deposit", name: "Вклад", balance: 900000, type: "savings", bank: "alfa" },
  {
    id: "brokerage",
    name: "Брокерский счет",
    balance: 5500256,
    type: "investment",
    bank: "tbank",
    changePercent: 12,
  },
]

// ---------- Transactions (last 30 days mixed) ----------
const generateTransactions = (): Transaction[] => {
  const now = new Date()
  const transactions: Transaction[] = []

  const daysAgo = (days: number, hour = 12): string => {
    const date = new Date(now)
    date.setDate(now.getDate() - days)
    date.setHours(hour, 0, 0, 0)
    return date.toISOString()
  }

  let id = 0
  const push = (
    type: Transaction["type"],
    category: string,
    description: string,
    amount: number,
    date: string,
    place?: string
  ) =>
    transactions.push({
      id: `tx_${id++}`,
      amount,
      type,
      category,
      description,
      date,
      account: "main",
      place,
    })

  // Anchored demo transactions for today/yesterday (match the design mock)
  push("expense", "apartment", "Перевод на счет · 9200", 16000, daysAgo(0, 10), "Т-Банк · Мобильное приложение")
  push("expense", "health", "Ваша аптека", 580, daysAgo(0, 9), "Ваша аптека · ул. Садовая, 3")
  push("expense", "entertainment", "Диво Остров", 4380, daysAgo(1, 19), "Диво Остров · ул. Кораблестроителей, 14")
  push("expense", "groceries", "Самокат", 600, daysAgo(1, 14), "Самокат · Доставка")
  push("expense", "clothing", "Ozon", 5880, daysAgo(1, 11), "Ozon · Пункт выдачи, пр. Ленина, 8")

  // Income: this month is always exactly 125 000 ₽ (salary + freelance),
  // plus last month's salary so older list groups contain income too
  const dayOfMonth = now.getDate()
  push("income", "salary", "Зарплата ООО СБ", 100000, daysAgo(Math.min(dayOfMonth - 1, 7), 9))
  push("income", "freelance", "Проект на фрилансе", 25000, daysAgo(Math.min(dayOfMonth - 1, 3), 16))
  push("income", "salary", "Зарплата ООО СБ", 100000, daysAgo(dayOfMonth + 2, 9))

  // Random everyday expenses, 2-30 days ago, small amounts so the
  // monthly total stays believable next to the 125 000 ₽ income
  const expenseDescriptions: Record<string, string[]> = {
    groceries: ["Самокат", "Магнит", "Пятёрочка", "Ашан", "Перекрёсток"],
    apartment: ["Коммуналка", "Интернет", "Вода", "Электричество", "Газ"],
    health: ["Аптека", "Стоматолог", "Анализы", "Массаж", "Спортзал"],
    entertainment: ["Кино", "Ресторан", "Боулинг", "Концерт", "Подписки"],
    auto: ["Бензин", "Мойка", "Шиномонтаж", "Страховка", "Парковка"],
    clothing: ["Zara", "H&M", "Wildberries", "Ozon", "Decathlon"],
    child: ["Садик", "Школа", "Игрушки", "Одежда", "Кружки"],
    pet: ["Корм", "Наполнитель", "Ветклиника", "Игрушки", "Когтеточка"],
    education: ["Курсы", "Книги", "Вебинар", "Репетитор", "Тренинг"],
    repair: ["Инструменты", "Сантехника", "Краска", "Мебель", "Электрика"],
  }

  // One place per description — used for both current-month and historic transactions.
  const expensePlaces: Record<string, Record<string, string>> = {
    groceries: {
      "Самокат": "Самокат · Доставка",
      "Магнит": "Магнит · ул. Мира, 8",
      "Пятёрочка": "Пятёрочка · пр. Победы, 45",
      "Ашан": "Ашан · ТЦ Мега",
      "Перекрёсток": "Перекрёсток · ул. Садовая, 15",
    },
    apartment: {
      "Коммуналка": "ЖКХ · Личный кабинет",
      "Интернет": "Ростелеком · Личный кабинет",
      "Вода": "Водоканал · Личный кабинет",
      "Электричество": "Энергосбыт · Личный кабинет",
      "Газ": "Газпром · Личный кабинет",
    },
    health: {
      "Аптека": "Вита · ул. Врача Михайлова, 3",
      "Стоматолог": "Стоматология Улыбка · ул. Главная, 10",
      "Анализы": "СМ-Клиника · ул. Медицинская, 5",
      "Массаж": "Спа & Массаж · пр. Курортный, 20",
      "Спортзал": "World Class · ул. Физкультурная, 12",
    },
    entertainment: {
      "Кино": "Синема · ТЦ Галерея, зал 4",
      "Ресторан": "Ресторан Вкусно · ул. Гурмана, 7",
      "Боулинг": "Боулинг Страйк · ул. Развлечений, 4",
      "Концерт": "Ледовый дворец · пл. Спортивная, 1",
      "Подписки": "App Store · Онлайн",
    },
    auto: {
      "Бензин": "АЗС Лукойл · Московское ш., 105",
      "Мойка": "Автомойка Блеск · ул. Техническая, 8",
      "Шиномонтаж": "Шиномонтаж 24 · пр. Гаражный, 3",
      "Страховка": "Росгосстрах · Онлайн",
      "Парковка": "Парковка БЦ Северный · ул. Деловая, 1",
    },
    clothing: {
      "Zara": "Zara · ТЦ Галерея",
      "H&M": "H&M · ТЦ Европейский",
      "Wildberries": "Wildberries · Пункт выдачи, ул. Мира, 22",
      "Ozon": "Ozon · Пункт выдачи, пр. Ленина, 8",
      "Decathlon": "Decathlon · ул. Спортивная, 50",
    },
    child: {
      "Садик": "МДОУ № 15 · ул. Детская, 6",
      "Школа": "Школа № 12 · ул. Школьная, 2",
      "Игрушки": "Детский мир · ТЦ Радуга",
      "Одежда": "H&M Kids · ТЦ Европейский",
      "Кружки": "Центр Творчества · ул. Юных, 9",
    },
    pet: {
      "Корм": "Зоомагазин Хвостик · ул. Животных, 4",
      "Наполнитель": "Petshop · Онлайн",
      "Ветклиника": "Ветклиника Айболит · ул. Ветеринарная, 11",
      "Игрушки": "Четыре лапы · ТЦ Мега",
      "Когтеточка": "Яндекс Маркет · Онлайн",
    },
    education: {
      "Курсы": "Skillbox · Онлайн",
      "Книги": "Лабиринт · Онлайн",
      "Вебинар": "GetCourse · Онлайн",
      "Репетитор": "Репетитор Иванов А.А.",
      "Тренинг": "Бизнес Школа · ул. Образования, 5",
    },
    repair: {
      "Инструменты": "Леруа Мерлен · ул. Строительная, 33",
      "Сантехника": "Сантехника · ул. Водопроводная, 7",
      "Краска": "Строительный рынок · пр. Ремонтный, 15",
      "Мебель": "IKEA · Новорижское ш., 20 км",
      "Электрика": "ЭТМ · ул. Электрическая, 3",
    },
  }

  const categoryIds = Object.keys(expenseDescriptions)

  for (let i = 0; i < 35; i++) {
    const catId = categoryIds[Math.floor(Math.random() * categoryIds.length)]
    const descriptions = expenseDescriptions[catId]
    const desc = descriptions[Math.floor(Math.random() * descriptions.length)]
    const amount = Math.floor(Math.random() * 3800) + 200 // 200 to 4000
    push(
      "expense",
      catId,
      desc,
      amount,
      daysAgo(2 + Math.floor(Math.random() * 28), 8 + (i % 12)),
      expensePlaces[catId]?.[desc]
    )
  }

  // Prior months so the analytics month selector has data to switch between.
  // Each of the previous 11 months gets income plus varied expenses, leaving
  // the current month's anchored figures above untouched.
  for (let monthsBack = 1; monthsBack <= 11; monthsBack++) {
    const ref = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1)
    const dateIn = (day: number, hour = 12) =>
      new Date(ref.getFullYear(), ref.getMonth(), day, hour).toISOString()

    push("income", "salary", "Зарплата ООО СБ", 100000, dateIn(5, 9))
    push(
      "income",
      "freelance",
      "Проект на фрилансе",
      15000 + Math.floor(Math.random() * 20000),
      dateIn(14, 16)
    )

    for (const catId of categoryIds) {
      const count = 2 + Math.floor(Math.random() * 4) // 2-5 per category
      for (let k = 0; k < count; k++) {
        const descriptions = expenseDescriptions[catId]
        const desc = descriptions[Math.floor(Math.random() * descriptions.length)]
        const amount = Math.floor(Math.random() * 9000) + 500 // 500 to 9500
        const day = 1 + Math.floor(Math.random() * 27)
        push(
          "expense",
          catId,
          desc,
          amount,
          dateIn(day, 8 + (k % 12)),
          expensePlaces[catId]?.[desc]
        )
      }
    }
  }

  // Sort by date descending (newest first)
  return transactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export const transactions: Transaction[] = generateTransactions()

// ---------- Monthly Data (last 7 months) ----------
export const monthlyData: MonthlyData[] = [
  { month: "Май", income: 198000, expenses: 188000 },
  { month: "Июн", income: 210000, expenses: 195000 },
  { month: "Июл", income: 218000, expenses: 202000 },
  { month: "Авг", income: 225000, expenses: 198000 },
  { month: "Сент", income: 225000, expenses: 200000 },
  { month: "Окт", income: 225000, expenses: 200000 },
  { month: "Ноя", income: 230000, expenses: 210000 },
  { month: "Дек", income: 245000, expenses: 215000 },
]

// ---------- Budget Plans (actual spent per category from transactions) ----------
const currentMonthTransactions = transactions.filter((t) => {
  const txDate = new Date(t.date)
  const now = new Date()
  return (
    t.type === "expense" &&
    txDate.getMonth() === now.getMonth() &&
    txDate.getFullYear() === now.getFullYear()
  )
})

const actualSpentMap = new Map<string, number>()
currentMonthTransactions.forEach((tx) => {
  const cat = tx.category
  actualSpentMap.set(cat, (actualSpentMap.get(cat) || 0) + tx.amount)
})

export const budgets: BudgetPlan[] = categories
  .filter((c) => c.type === "expense")
  .map((cat) => ({
    categoryId: cat.id,
    planned: cat.budget || 0,
    actual: actualSpentMap.get(cat.id) || 0,
  }))

// ---------- Investments ----------
export const investments: InvestmentPlan[] = [
  { name: "Брокерский счет", amount: 15000 },
  { name: "ИИС", amount: 10000 },
  { name: "Недвижимость", amount: 0 },
]

// ---------- Debts ----------
export const debts: DebtPlan[] = [
  { name: "Кредитная карта", amount: 300000, isOwedToMe: false },
  { name: "Я должен другу", amount: 15000, isOwedToMe: true },
  { name: "Ипотека", amount: 2500000, isOwedToMe: false },
]

// ---------- Widget Data (for Pie Chart) ----------
export const widgetExpenses: ExpenseWidgetData[] = [
  { id: "apartment", name: "Квартира", value: 60000, color: "#FFB020" },
  { id: "groceries", name: "Продукты", value: 45830, color: "#F97316" },
  { id: "health", name: "Здоровье", value: 30300, color: "#F4502B" },
  { id: "entertainment", name: "Развлечения", value: 35000, color: "#EC4899" },
  { id: "auto", name: "Автомобиль", value: 25000, color: "#60A5FA" },
  { id: "other", name: "Другое", value: 28870, color: "#8B5CF6" },
]

// ---------- Helper: get current month totals ----------
export const getCurrentMonthTotals = () => {
  const now = new Date()
  const month = now.getMonth()
  const year = now.getFullYear()
  const monthlyTx = transactions.filter((t) => {
    const d = new Date(t.date)
    return d.getMonth() === month && d.getFullYear() === year
  })
  const totalIncome = monthlyTx
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0)
  const totalExpenses = monthlyTx
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0)
  return { totalIncome, totalExpenses, savings: totalIncome - totalExpenses }
}

// ---------- Helper: get today's spent amount ----------
export const getTodaySpent = () => {
  const today = new Date().toISOString().slice(0, 10)
  return transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(today))
    .reduce((sum, t) => sum + t.amount, 0)
}
