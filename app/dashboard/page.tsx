import Link from "next/link";
import { ArrowDownToLine, ArrowUpFromLine, Banknote, ShieldCheck, TrendingUp, Wallet } from "lucide-react";
import { BarChart, Card, StatCard, StatusBadge } from "@/components/dashboard/ui";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import { money } from "@/lib/client";
import { requireUser } from "@/lib/server/auth";
import { getSummary, listAccounts, listTransactions } from "@/lib/server/queries";

export default function Overview() {
  const user = requireUser();
  const s = getSummary(user.id);
  const accounts = listAccounts(user.id);
  const recent = listTransactions(user.id, { limit: 6 });
  const hour = new Date().getUTCHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink p-6 text-white sm:p-8">
        <div>
          <p className="text-sm text-white/60">{greet},</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Welcome, {user.first_name}!</h1>
          <p className="mt-2 text-sm text-white/70">Manage your trading accounts, funds and verification from one place.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/deposit" className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold transition hover:bg-brand-dark"><ArrowDownToLine size={16} />Deposit</Link>
          <Link href="/dashboard/withdraw" className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/20"><ArrowUpFromLine size={16} />Withdraw</Link>
        </div>
      </div>

      {user.kyc_status !== "verified" && (
        <Link href="/dashboard/verification" className="flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 transition hover:bg-amber-100/70">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700"><ShieldCheck size={20} /></span>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-900">{user.kyc_status === "pending" ? "Verification in review" : user.kyc_status === "rejected" ? "Verification needs attention" : "Verify your identity"}</p>
            <p className="text-[13px] text-amber-800/80">Withdrawals are enabled once your identity and address documents are approved.</p>
          </div>
          <span className="hidden text-sm font-semibold text-amber-900 sm:block">Open →</span>
        </Link>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total account balance" value={money(s.totalBalance)} icon={Wallet} sub={`${s.liveAccounts} live account${s.liveAccounts === 1 ? "" : "s"}`} />
        <StatCard label="Available balance" value={money(s.availableBalance)} icon={Banknote} tone="green" sub={s.pendingWithdrawals ? `${money(s.pendingWithdrawals)} in pending withdrawals` : "Ready to withdraw"} />
        <StatCard label="Total deposits" value={money(s.totalDeposits)} icon={ArrowDownToLine} tone="ink" sub={s.pendingDeposits ? `${money(s.pendingDeposits)} pending` : "Completed deposits"} />
        <StatCard label="Total withdrawals" value={money(s.totalWithdrawals)} icon={ArrowUpFromLine} tone="orange" sub={s.pendingWithdrawals ? `${money(s.pendingWithdrawals)} pending` : "Completed withdrawals"} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card title="Trading account summary" className="xl:col-span-2" action={<Link href="/dashboard/accounts" className="text-sm font-semibold text-brand hover:underline">Manage</Link>} pad={false}>
          <ul className="divide-y divide-gray-100">
            {accounts.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-light text-brand"><TrendingUp size={18} /></span>
                  <div>
                    <p className="text-sm font-bold text-ink">{a.login} <span className="font-medium text-ink-soft">· {a.type}</span></p>
                    <p className="text-xs text-ink-soft">{a.platform} · 1:{a.leverage} · {a.currency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={a.is_demo ? "demo" : "live"} />
                  <p className="min-w-[96px] text-right text-sm font-extrabold text-ink">{money(a.balance, a.currency)}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Account statistics">
          <BarChart data={s.monthly} />
          <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 text-sm">
            <div><dt className="text-ink-soft">Live accounts</dt><dd className="font-bold text-ink">{s.liveAccounts}</dd></div>
            <div><dt className="text-ink-soft">Demo accounts</dt><dd className="font-bold text-ink">{s.demoAccounts}</dd></div>
            <div><dt className="text-ink-soft">Net funding</dt><dd className="font-bold text-ink">{money(s.totalDeposits - s.totalWithdrawals)}</dd></div>
            <div><dt className="text-ink-soft">Verification</dt><dd><StatusBadge status={user.kyc_status} /></dd></div>
          </dl>
        </Card>
      </div>

      <Card title="Recent transactions" action={<Link href="/dashboard/transactions" className="text-sm font-semibold text-brand hover:underline">View all</Link>} pad={false}>
        <TransactionsTable rows={recent} filters={false} empty="Make your first deposit to get started." />
      </Card>
    </div>
  );
}
