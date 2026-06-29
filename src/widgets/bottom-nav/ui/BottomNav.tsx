import { Home, ChartPie, CalendarDays, User, Sparkles } from "lucide-react"
import type { ComponentType } from "react"
import { useLocation, useNavigate } from "react-router"

const ICON_SIZE = 20

const ACTIVE_TAB_BG = "#1F2021"
const ASSISTANT_GRADIENT = "linear-gradient(135deg, #1E7A33 0%, #0C3A18 100%)"
const ASSISTANT_GLOW = "0 0 28px rgba(34, 197, 94, 0.35)"
const ASSISTANT_SPARKLE = "#7CF59B"

interface NavTab {
  label: string
  icon: ComponentType<{ size?: number }>
  // Tabs without a path are placeholders until their pages exist.
  path?: string
}

const NAV_TABS: NavTab[] = [
  { label: "Главная", icon: Home, path: "/" },
  { label: "Аналитика", icon: ChartPie, path: "/analytics" },
  { label: "Календарь", icon: CalendarDays },
  { label: "Профиль", icon: User },
]

const TabButton = ({ tab, isActive }: { tab: NavTab; isActive: boolean }) => {
  const navigate = useNavigate()

  return (
    <button
      className={`flex h-12 w-12 items-center justify-center rounded-full ${
        isActive ? "text-white" : "text-gray-500 hover:text-gray-300"
      }`}
      style={isActive ? { backgroundColor: ACTIVE_TAB_BG } : undefined}
      onClick={() => tab.path && navigate(tab.path)}
      aria-label={tab.label}
      aria-current={isActive ? "page" : undefined}
    >
      <tab.icon size={ICON_SIZE} />
    </button>
  )
}

const BottomNav = () => {
  const { pathname } = useLocation()
  const [home, analytics, calendar, profile] = NAV_TABS

  const isActive = (tab: NavTab) => tab.path === pathname

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-black via-black/90 to-transparent pt-8"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex w-full max-w-[430px] items-center justify-between px-6">
        <TabButton tab={home} isActive={isActive(home)} />
        <TabButton tab={analytics} isActive={isActive(analytics)} />

        <button
          className="flex h-12 items-center gap-2 rounded-full px-5 text-[15px] font-semibold text-white"
          style={{ background: ASSISTANT_GRADIENT, boxShadow: ASSISTANT_GLOW }}
          aria-label="Sugar Ai"
        >
          <Sparkles size={16} style={{ color: ASSISTANT_SPARKLE }} />
          Sugar Ai
        </button>

        <TabButton tab={calendar} isActive={isActive(calendar)} />
        <TabButton tab={profile} isActive={isActive(profile)} />
      </div>
    </nav>
  )
}

export default BottomNav
