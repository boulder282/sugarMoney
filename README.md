# sugarMoney

Personal finance dashboard built with React, TypeScript, Vite, Tailwind and shadcn/ui.

## Project structure

The codebase follows [Feature-Sliced Design](https://feature-sliced.design/) layers. Code may only import from layers **below** its own (`app` → `pages` → `widgets` → `entities` → `shared`), never sideways or upwards.

```
src/
├── app/                  # App initialization: root component, providers, global styles
│   ├── App.tsx
│   ├── providers/        # ThemeProvider, future router/query providers
│   └── styles/           # Global CSS (Tailwind entry)
├── pages/                # Route-level screens, composed from widgets
│   └── dashboard/
├── widgets/              # Self-contained UI blocks of the dashboard
│   ├── widget-deck/      # Carousel of cards: Streak, ExpenseChart, BudgetOverview
│   ├── accounts/         # Accounts / savings / investments section
│   ├── chart-prompt/     # "Build a chart..." AI prompt input
│   ├── income-expense-chart/
│   ├── insight-banner/
│   └── bottom-nav/
├── entities/             # Business entities: domain state and logic
│   └── expense/          # Zustand expense store
└── shared/               # Reusable, business-agnostic code
    ├── ui/               # shadcn/ui components + small shared icons
    ├── lib/              # Helpers (cn, formatAmount)
    ├── types/            # Domain type contracts
    ├── mocks/            # Mock API data
    └── assets/icons/     # Static SVG icons (categories, banks)
```

Each slice (e.g. `widgets/accounts/`) exposes its public API through an `index.ts` barrel — import from the slice root, not from files inside it:

```tsx
import { AccountsSection } from "@/widgets/accounts" // ✅
import AccountsSection from "@/widgets/accounts/ui/AccountsSection" // ❌
```

## Adding shadcn/ui components

```bash
npx shadcn@latest add button
```

Components are generated into `src/shared/ui` (configured in `components.json`) and imported as:

```tsx
import { Button } from "@/shared/ui/button"
```

## Scripts

```bash
npm run dev      # start dev server
npm run build    # type-check + production build
npm run lint     # eslint
```
