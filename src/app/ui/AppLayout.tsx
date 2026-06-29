import { Outlet } from "react-router"
import { BottomNav } from "@/widgets/bottom-nav"

// Shared shell: every routed page renders into the Outlet, with the bottom
// navigation persisting across route changes.
export function AppLayout() {
  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  )
}
