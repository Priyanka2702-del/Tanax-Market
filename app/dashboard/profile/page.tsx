import { Mail, Phone, ShieldCheck, UserCircle } from "lucide-react";
import ProfileForm from "@/components/dashboard/ProfileForm";
import { Card, PageHeader, StatusBadge } from "@/components/dashboard/ui";
import { fmtDate } from "@/lib/client";
import { requireUser } from "@/lib/server/auth";
import { toPublic } from "@/lib/server/queries";

export default function ProfilePage() {
  const user = toPublic(requireUser());
  const rows = [
    { icon: UserCircle, label: "Client ID", value: user.client_id },
    { icon: Mail, label: "Email", value: user.email },
    { icon: Phone, label: "Phone", value: user.phone },
  ];
  return (
    <>
      <PageHeader title="My Profile" text="View and update your personal information." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="h-fit">
          <div className="flex flex-col items-center text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-brand text-2xl font-extrabold text-white">{(user.first_name[0] + user.last_name[0]).toUpperCase()}</span>
            <p className="mt-4 text-lg font-extrabold text-ink">{user.first_name} {user.last_name}</p>
            <p className="text-sm text-ink-soft">{user.country}</p>
            <div className="mt-3"><StatusBadge status={user.kyc_status} label={user.kyc_status === "verified" ? "Verified" : undefined} /></div>
          </div>
          <ul className="mt-6 space-y-4 border-t border-gray-100 pt-5">
            {rows.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-start gap-3"><Icon size={17} className="mt-0.5 text-brand" /><div className="min-w-0"><p className="text-xs text-ink-soft">{label}</p><p className="truncate text-sm font-semibold text-ink">{value}</p></div></li>
            ))}
            <li className="flex items-start gap-3"><ShieldCheck size={17} className="mt-0.5 text-brand" /><div><p className="text-xs text-ink-soft">Member since</p><p className="text-sm font-semibold text-ink">{fmtDate(user.created_at)}</p></div></li>
          </ul>
        </Card>
        <Card title="Personal information" className="lg:col-span-2"><ProfileForm user={user} /></Card>
      </div>
    </>
  );
}
