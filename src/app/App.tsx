import { Routes, Route } from "react-router"
import { DashboardPage } from "@/pages/dashboard"
import { AnalyticsPage } from "@/pages/analytics"
import { AppLayout } from "./ui/AppLayout"

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Route>
    </Routes>
  )
}

export default App
