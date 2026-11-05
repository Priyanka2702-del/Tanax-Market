import TransactionsTable from "@/components/dashboard/TransactionsTable";
import { Card, PageHeader } from "@/components/dashboard/ui";
import { requireUser } from "@/lib/server/auth";
import { listTransactions } from "@/lib/server/queries";

export default function TransactionsPage() {
  const user = requireUser();
  return (
    <>
      <PageHeader title="Transactions" text="Your complete deposit and withdrawal history." />
      <Card pad={false}><TransactionsTable rows={listTransactions(user.id)} /></Card>
    </>
  );
}
