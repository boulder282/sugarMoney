import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import "./app/styles/index.css"
import App from "./app/App"
import { ThemeProvider } from "./app/providers/ThemeProvider"

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename="/sugarMoney/">
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </BrowserRouter>
)
