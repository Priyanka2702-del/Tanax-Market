import { Clock, ShieldCheck } from "lucide-react";
import MoneyForm from "@/components/dashboard/MoneyForm";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import { Card, PageHeader } from "@/components/dashboard/ui";
import { requireUser } from "@/lib/server/auth";
import { listAccounts, listTransactions, pendingWithdrawals } from "@/lib/server/queries";
import { DEPOSIT_METHODS } from "@/lib/validation";

export default function DepositPage() {
  const user = requireUser();
  const accounts = listAccounts(user.id).filter((a) => !a.is_demo).map((a) => ({ id: a.id, login: a.login, type: a.type, currency: a.currency, balance: a.balance, available: a.balance - pendingWithdrawals(a.id) }));
  return (
    <>
      <PageHeader title="Deposit" text="Add funds to your live trading account." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="New deposit" className="lg:col-span-2"><MoneyForm mode="deposit" accounts={accounts} /></Card>
        <div className="space-y-6">
          <Card title="Payment methods">
            <ul className="space-y-3">
              {DEPOSIT_METHODS.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 text-sm"><span className="font-semibold text-ink">{m.label}</span><span className="flex items-center gap-1 text-xs text-ink-soft"><Clock size={12} />{m.time}</span></li>
              ))}
            </ul>
          </Card>
          <Card><p className="flex gap-2.5 text-[13px] leading-relaxed text-ink-soft"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-brand" />Deposits are credited after payment confirmation. Requests stay <b className="text-ink">Pending</b> until then. Only deposit from accounts in your own name.</p></Card>
        </div>
      </div>
      <Card title="Deposit history" className="mt-6" pad={false}><TransactionsTable rows={listTransactions(user.id, { type: "deposit" })} filters={false} empty="No deposit requests yet." /></Card>
    </>
  );
}
