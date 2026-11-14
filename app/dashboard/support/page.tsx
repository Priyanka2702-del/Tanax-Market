import { Clock, Mail, MessageSquare } from "lucide-react";
import SupportForm from "@/components/dashboard/SupportForm";
import { Card, EmptyState, PageHeader, StatusBadge, Table, Td } from "@/components/dashboard/ui";
import { fmtDateTime } from "@/lib/client";
import { requireUser } from "@/lib/server/auth";
import { listTickets } from "@/lib/server/queries";

export default function SupportPage() {
  const user = requireUser();
  const tickets = listTickets(user.id);
  return (
    <>
      <PageHeader title="Support" text="Contact our team or follow up on an existing request." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Contact support" className="h-fit">
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3"><Mail size={18} className="mt-0.5 text-brand" /><div><p className="text-xs text-ink-soft">Email</p><a className="font-semibold text-ink hover:text-brand" href="mailto:admin@tanaxmarket.com">admin@tanaxmarket.com</a></div></li>
            <li className="flex gap-3"><Clock size={18} className="mt-0.5 text-brand" /><div><p className="text-xs text-ink-soft">Support hours</p><p className="font-semibold text-ink">08:00–16:00 GMT+2, Mon–Fri</p></div></li>
            <li className="flex gap-3"><MessageSquare size={18} className="mt-0.5 text-brand" /><div><p className="text-xs text-ink-soft">Include</p><p className="font-semibold text-ink">Your Client ID: {user.client_id}</p></div></li>
          </ul>
        </Card>
        <Card title="New support request" className="lg:col-span-2"><SupportForm /></Card>
      </div>
      <Card title="Ticket history" className="mt-6" pad={false}>
        {tickets.length === 0 ? <EmptyState icon={MessageSquare} title="No tickets yet" text="Your support requests will appear here." /> : (
          <Table head={["Ticket", "Subject", "Category", "Created", "Status"]}>
            {tickets.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50/70">
                <Td className="font-semibold">{t.reference}</Td><Td className="max-w-[320px] truncate">{t.subject}</Td><Td>{t.category}</Td>
                <Td className="text-ink-soft">{fmtDateTime(t.created_at)}</Td><Td><StatusBadge status={t.status} /></Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </>
  );
}
