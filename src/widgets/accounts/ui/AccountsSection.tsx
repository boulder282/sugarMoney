import { useState } from "react"
import { ArrowUp } from "lucide-react"
import { useAccountStore } from "@/entities/account"
import type { Account, AccountType } from "@/shared/types/finance"
import { DotsIcon } from "@/shared/ui/icons"
import { formatAmount } from "@/shared/lib/format"
import tbankLogo from "@/shared/assets/icons/banks/tbank.svg"
import alfaLogo from "@/shared/assets/icons/banks/alfa.svg"

const TABS: Array<{ label: string; types: AccountType[] }> = [
  { label: "Счета", types: ["main", "credit"] },
  { label: "Накопления", types: ["savings"] },
  { label: "Инвестиции", types: ["investment"] },
]

const BANK_LOGOS: Record<NonNullable<Account["bank"]>, string> = {
  tbank: tbankLogo,
  alfa: alfaLogo,
}

const AccountCard = ({ account, wide }: { account: Account; wide: boolean }) => (
  <div
    className={`rounded-[20px] bg-[#1F2021] p-4 ${wide ? "col-span-2" : ""}`}
  >
    <div className="text-[13px] text-gray-500">{account.name}</div>
    <div className="mt-1.5 flex items-center gap-1.5">
      {account.bank && (
        <img
          src={BANK_LOGOS[account.bank]}
          alt=""
          className="h-5 w-5 flex-shrink-0 rounded-full"
        />
      )}
      <span className="truncate text-[19px] font-bold text-white">
        {formatAmount(account.balance)}
      </span>
    </div>
    <div className="mt-5 flex items-end justify-between">
      <button
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2A2B2C] text-gray-400 hover:bg-[#333435]"
        aria-label={`Действия со счётом ${account.name}`}
      >
        <DotsIcon />
      </button>
      {account.changePercent !== undefined && (
        <span className="flex items-center gap-0.5 text-[14px] font-medium text-[#4ADE80]">
          {account.changePercent > 0 ? "+" : ""}
          {account.changePercent}%
          <ArrowUp size={14} strokeWidth={2.5} />
        </span>
      )}
    </div>
  </div>
)

const AccountsSection = () => {
  const [activeTab, setActiveTab] = useState(0)
  const accounts = useAccountStore((state) => state.accounts)
  const visibleAccounts = accounts.filter((acc) =>
    TABS[activeTab].types.includes(acc.type)
  )

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {TABS.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className={`text-[22px] font-bold transition-colors ${
              activeTab === i ? "text-white" : "text-[#525355] hover:text-gray-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {visibleAccounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            wide={visibleAccounts.length === 1}
          />
        ))}
      </div>

      <button className="w-full rounded-[18px] bg-[#1F2021] py-3.5 text-center text-[15px] font-medium text-white hover:bg-[#262728]">
        Смотреть все
      </button>
    </section>
  )
}

export default AccountsSection
