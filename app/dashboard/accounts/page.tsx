import { Wallet } from "lucide-react";
import CreateAccountForm from "@/components/dashboard/CreateAccountForm";
import { Card, EmptyState, PageHeader, StatusBadge, Table, Td } from "@/components/dashboard/ui";
import { fmtDate, money } from "@/lib/client";
import { requireUser } from "@/lib/server/auth";
import { listAccounts } from "@/lib/server/queries";

export default function AccountsPage() {
  const user = requireUser();
  const accounts = listAccounts(user.id);
  return (
    <>
      <PageHeader title="My Trading Accounts" text="Your MetaTrader 5 accounts and their details." action={<CreateAccountForm />} />
      <Card pad={false}>
        {accounts.length === 0 ? <EmptyState icon={Wallet} title="No trading accounts" text="Create your first account to start trading." /> : (
          <Table head={["Account ID", "Type", "Platform", "Currency", "Leverage", "Balance", "Status", "Opened"]}>
            {accounts.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50/70">
                <Td className="font-bold">{a.login}</Td>
                <Td>{a.type} <StatusBadge status={a.is_demo ? "demo" : "live"} /></Td>
                <Td>{a.platform}</Td>
                <Td>{a.currency}</Td>
                <Td>1:{a.leverage}</Td>
                <Td className="font-semibold">{money(a.balance, a.currency)}</Td>
                <Td><StatusBadge status={a.status} /></Td>
                <Td className="text-ink-soft">{fmtDate(a.created_at)}</Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </>
  );
}
