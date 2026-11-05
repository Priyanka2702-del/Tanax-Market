import { KeyRound, ShieldCheck } from "lucide-react";
import { ChangePasswordForm, NotificationPrefs } from "@/components/dashboard/SettingsForms";
import { Card, PageHeader } from "@/components/dashboard/ui";
import { requireUser } from "@/lib/server/auth";

export default function SettingsPage() {
  const user = requireUser();
  return (
    <>
      <PageHeader title="Settings" text="Manage your password, security and notifications." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Change password"><ChangePasswordForm /></Card>
        <div className="space-y-6">
          <Card title="Account security">
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3"><KeyRound size={18} className="mt-0.5 text-brand" /><div><p className="font-bold text-ink">Password protected</p><p className="text-[13px] text-ink-soft">Stored using bcrypt hashing. Changing it signs out your other devices.</p></div></li>
              <li className="flex gap-3"><ShieldCheck size={18} className="mt-0.5 text-brand" /><div><p className="font-bold text-ink">Secure session</p><p className="text-[13px] text-ink-soft">HttpOnly cookie, validated on the server for every request.</p></div></li>
            </ul>
          </Card>
          <Card title="Notification preferences">
            <NotificationPrefs initial={{ email: !!user.notify_email, deposits: !!user.notify_deposits, marketing: !!user.notify_marketing }} />
          </Card>
        </div>
      </div>
    </>
  );
}
