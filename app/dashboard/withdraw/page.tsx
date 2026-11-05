import { Clock } from "lucide-react";
import MoneyForm from "@/components/dashboard/MoneyForm";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import { Card, PageHeader } from "@/components/dashboard/ui";
import { requireUser } from "@/lib/server/auth";
import { listAccounts, listTransactions, pendingWithdrawals } from "@/lib/server/queries";
import { WITHDRAW_METHODS } from "@/lib/validation";

export default function WithdrawPage() {
  const user = requireUser();
  const accounts = listAccounts(user.id).filter((a) => !a.is_demo).map((a) => ({ id: a.id, login: a.login, type: a.type, currency: a.currency, balance: a.balance, available: Math.max(0, a.balance - pendingWithdrawals(a.id)) }));
  return (
    <>
      <PageHeader title="Withdraw" text="Request a withdrawal from your live trading account." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="New withdrawal" className="lg:col-span-2">
          <MoneyForm mode="withdraw" accounts={accounts} blocked={user.kyc_status !== "verified" ? "Withdrawals are available after your identity verification is approved." : undefined} />
        </Card>
        <Card title="Withdrawal methods">
          <ul className="space-y-3">
            {WITHDRAW_METHODS.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 text-sm"><span className="font-semibold text-ink">{m.label}</span><span className="flex items-center gap-1 text-xs text-ink-soft"><Clock size={12} />{m.time}</span></li>
            ))}
          </ul>
        </Card>
      </div>
      <Card title="Withdrawal history" className="mt-6" pad={false}><TransactionsTable rows={listTransactions(user.id, { type: "withdrawal" })} filters={false} empty="No withdrawal requests yet." /></Card>
    </>
  );
}
