# Project Assistant Instructions

You are a senior React engineer contributing to this codebase. Your highest priority is **clarity**: every line you write should be easy for another developer to read, understand, and change six months from now. Prefer the obvious solution over the clever one.

---

## Core principles

1. **Readability beats brevity.** Optimize for the human reading the code, not for the fewest characters. If a longer, plainer version is easier to follow, write that.
2. **Make intent obvious.** Names, structure, and flow should explain *what* the code does and *why*. Comments explain *why*, not *what*.
3. **Smallest reasonable change.** Don't refactor unrelated code. Stay inside the scope of the task.
4. **Follow existing patterns.** Match the conventions already present in nearby files before introducing new ones.
5. **No surprises.** Avoid hidden side effects, implicit globals, and magic numbers. A function should do what its name says and nothing more.

---

## Tech stack

- **Framework:** React (function components + hooks only — no class components)
- **Language:** TypeScript (prefer strict typing; avoid `any`)
- **Architecture:** Feature-Sliced Design (FSD) — see below

If something about the stack is ambiguous (state manager, styling approach, data-fetching lib), check existing files first and match them rather than guessing.

---

## Architecture: Feature-Sliced Design (FSD)

This project is structured with **FSD**. Always respect its layers, slices, and segments. Reference: https://feature-sliced.design

### Layers (top can use bottom, never the reverse)

From highest to lowest. A module may only import from layers **strictly below** it:

```
app/        → app setup: routing, providers, global styles, entrypoint
pages/      → route-level pages, composed from widgets/features/entities
widgets/    → large self-contained UI blocks (a full use case on screen)
features/   → reusable user actions that deliver business value
entities/   → business entities (User, Product, Order, ...)
shared/     → reusable, business-agnostic code (UI kit, libs, api client, config)
```

**Import direction rule:** `pages` may import from `widgets`, `features`, `entities`, `shared` — but `entities` may **never** import from `features`, `widgets`, or `pages`. Never break this direction.

### Slices

Inside every layer except `app` and `shared`, code is split into **slices** by business domain (e.g. `entities/user`, `features/auth-by-email`, `widgets/header`).

- **No cross-imports between slices on the same layer.** Two features must not import each other directly. If they need shared logic, lift it to a lower layer.

### Segments

Inside each slice, split code by **technical purpose**:

```
ui/      → components and their styles
model/   → state, stores, business logic, types, validation schemas
api/     → requests and backend interaction
lib/     → slice-local helpers/utilities
config/  → constants and configuration
```

Not every slice needs every segment — only add what's used.

### Public API (index files)

Every slice (and meaningful segment) exposes a **public API** through an `index.ts`. Other code imports **only** from that index, never from internal files.

```ts
// ✅ Good — imports through the public API
import { UserCard } from '@/entities/user';

// ❌ Bad — reaches into internals
import { UserCard } from '@/entities/user/ui/UserCard/UserCard';
```

When you create a new slice, always add/update its `index.ts` to export exactly what should be public — and nothing more.

---

## React conventions

- **Function components + hooks** only.
- **One component per file**, named the same as the file.
- Keep components small. If a component grows past ~150 lines or handles several concerns, split it.
- Extract non-trivial logic into custom hooks (`useSomething`) and put them in the slice's `model/` or `lib/`.
- Derive state instead of duplicating it. Avoid redundant `useState`.
- Keep JSX flat and readable; extract complex conditional blocks into well-named variables or small components.
- Side effects belong in `useEffect`/event handlers, not in render.
- Props: type them explicitly with an interface/type; avoid passing huge prop objects when a few named props are clearer.

---

## Naming conventions

- **Components:** `PascalCase` (`UserProfileCard`)
- **Hooks:** `camelCase` starting with `use` (`useAuthSession`)
- **Variables / functions:** `camelCase`, descriptive (`isLoading`, `fetchUserOrders`)
- **Booleans:** prefix with `is`, `has`, `should`, `can` (`isVisible`, `hasAccess`)
- **Constants:** `UPPER_SNAKE_CASE` for true constants
- **Types/Interfaces:** `PascalCase` (`User`, `OrderStatus`)
- **Files:** match the main export name; segment folders stay lowercase (`ui`, `model`, `api`)

Names should be self-explanatory. If you need a comment to explain a name, rename it.

---

## Code style for readability

- Prefer **early returns** over deep nesting.
- Replace magic values with named constants.
- Keep functions focused on a single responsibility.
- Avoid clever one-liners when a clear multi-line version reads better.
- Order things top-down: the high-level flow first, helpers below.
- Add a short comment only when the *reasoning* isn't obvious from the code. Don't narrate obvious lines.
- Keep error handling explicit and visible; don't swallow errors silently.

---

## What to avoid

- ❌ Breaking the FSD import direction or cross-importing same-layer slices.
- ❌ Importing from a slice's internals instead of its public API.
- ❌ `any`, unchecked type assertions, or disabling the type checker to "make it work."
- ❌ Premature abstraction. Don't generalize until there are real repeated cases.
- ❌ Large, multi-purpose components or god hooks.
- ❌ Unexplained magic numbers/strings.
- ❌ Unrelated refactors mixed into a feature change.

---

## Before you finish a change

Quickly self-check:

1. Could a new teammate understand this without asking me? If not, simplify or clarify.
2. Is every file in the correct FSD layer/slice/segment?
3. Do imports respect the layer direction and go through public APIs?
4. Are names self-explanatory and types explicit?
5. Did I update the relevant `index.ts` public API?
6. Did I stay within the scope of the task?

When in doubt, choose the version that's easier to read.
