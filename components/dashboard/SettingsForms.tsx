"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, PasswordField, SubmitButton } from "@/components/ui/Form";
import { api } from "@/lib/client";
import { changePasswordSchema } from "@/lib/validation";

type Msg = { kind: "success" | "error"; text: string } | null;

export function ChangePasswordForm() {
  const [v, setV] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<Msg>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setMsg(null);
    const parsed = changePasswordSchema.safeParse(v);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const i of parsed.error.issues) fe[i.path.join(".")] ??= i.message;
      setErrors(fe); return;
    }
    setErrors({}); setLoading(true);
    const res = await api("/api/settings/password", "PUT", v);
    setLoading(false);
    if (res.ok) { setMsg({ kind: "success", text: res.message as string }); setV({ currentPassword: "", newPassword: "", confirmPassword: "" }); }
    else { setErrors(res.fieldErrors ?? {}); setMsg({ kind: "error", text: res.message ?? "Could not change password." }); }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {msg && <Alert kind={msg.kind}>{msg.text}</Alert>}
      <PasswordField label="Current password" autoComplete="current-password" value={v.currentPassword} onChange={(e) => setV({ ...v, currentPassword: e.target.value })} error={errors.currentPassword} />
      <PasswordField label="New password" autoComplete="new-password" showStrength value={v.newPassword} onChange={(e) => setV({ ...v, newPassword: e.target.value })} error={errors.newPassword} />
      <PasswordField label="Confirm new password" autoComplete="new-password" value={v.confirmPassword} onChange={(e) => setV({ ...v, confirmPassword: e.target.value })} error={errors.confirmPassword} />
      <SubmitButton loading={loading}>{loading ? "Updating…" : "Change password"}</SubmitButton>
    </form>
  );
}

export function NotificationPrefs({ initial }: { initial: { email: boolean; deposits: boolean; marketing: boolean } }) {
  const router = useRouter();
  const [p, setP] = useState(initial);
  const [msg, setMsg] = useState<Msg>(null);
  const [loading, setLoading] = useState(false);
  const rows: { key: keyof typeof p; title: string; text: string }[] = [
    { key: "email", title: "Account & security emails", text: "Sign-in alerts, password changes and account updates." },
    { key: "deposits", title: "Transaction updates", text: "Status changes for deposits and withdrawals." },
    { key: "marketing", title: "News & promotions", text: "Market analysis, product news and offers." },
  ];

  async function save() {
    setLoading(true); setMsg(null);
    const res = await api("/api/settings/notifications", "PUT", p);
    setLoading(false);
    setMsg(res.ok ? { kind: "success", text: res.message as string } : { kind: "error", text: res.message ?? "Could not save." });
    if (res.ok) router.refresh();
  }

  return (
    <div className="space-y-4">
      {msg && <Alert kind={msg.kind}>{msg.text}</Alert>}
      <ul className="divide-y divide-gray-100">
        {rows.map((r) => (
          <li key={r.key} className="flex items-center justify-between gap-4 py-3.5">
            <div><p className="text-sm font-bold text-ink">{r.title}</p><p className="text-[13px] text-ink-soft">{r.text}</p></div>
            <button type="button" role="switch" aria-checked={p[r.key]} aria-label={r.title} onClick={() => setP({ ...p, [r.key]: !p[r.key] })}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${p[r.key] ? "bg-brand" : "bg-gray-300"}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${p[r.key] ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </li>
        ))}
      </ul>
      <SubmitButton type="button" loading={loading} onClick={save}>Save preferences</SubmitButton>
    </div>
  );
}
