import { Sparkles } from "lucide-react"

const InsightBanner = () => (
  <div className="flex items-center gap-3 rounded-[20px] bg-[#1F2021] p-4">
    <div
      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
      style={{ background: "linear-gradient(135deg, #22C55E, #15803D)" }}
    >
      <Sparkles size={18} className="text-white" />
    </div>
    <p className="text-[13px] leading-snug text-white">
      Вы тратите меньше чем зарабатываете на 35%. Попробуйте откладывать эту
      сумму в накопления
    </p>
  </div>
)

export default InsightBanner
