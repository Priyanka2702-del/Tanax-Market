"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Field, SelectField, SubmitButton, TextField, inputCls } from "@/components/ui/Form";
import { api } from "@/lib/client";
import { COUNTRIES, DIAL_CODES } from "@/lib/countries";
import { profileSchema } from "@/lib/validation";
import type { PublicUser } from "@/lib/server/queries";

export default function ProfileForm({ user }: { user: PublicUser }) {
  const router = useRouter();
  const [dial, ...rest] = user.phone.split(" ");
  const [v, setV] = useState({ firstName: user.first_name, lastName: user.last_name, dialCode: dial, phone: rest.join(""), country: user.country, address: user.address, city: user.city });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const set = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => setV((p) => ({ ...p, [k]: val }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setMsg(null);
    const parsed = profileSchema.safeParse(v);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const i of parsed.error.issues) fe[i.path.join(".")] ??= i.message;
      setErrors(fe); return;
    }
    setErrors({}); setLoading(true);
    const res = await api("/api/profile", "PUT", v);
    setLoading(false);
    if (res.ok) { setMsg({ kind: "success", text: res.message as string }); router.refresh(); }
    else { setErrors(res.fieldErrors ?? {}); setMsg({ kind: "error", text: res.message ?? "Update failed." }); }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {msg && <Alert kind={msg.kind}>{msg.text}</Alert>}
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="First name" value={v.firstName} onChange={(e) => set("firstName", e.target.value)} error={errors.firstName} />
        <TextField label="Last name" value={v.lastName} onChange={(e) => set("lastName", e.target.value)} error={errors.lastName} />
        <TextField label="Email address" value={user.email} disabled hint="Contact support to change your email." />
        <TextField label="Date of birth" value={user.date_of_birth} disabled />
        <Field label="Phone number" htmlFor="p-phone" error={errors.phone || errors.dialCode}>
          <div className="flex gap-3">
            <select aria-label="Country code" value={v.dialCode} onChange={(e) => set("dialCode", e.target.value)} className={inputCls(errors.dialCode) + " w-[120px] shrink-0"}>
              {DIAL_CODES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <input id="p-phone" inputMode="numeric" value={v.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))} className={inputCls(errors.phone)} />
          </div>
        </Field>
        <SelectField label="Country" value={v.country} onChange={(e) => set("country", e.target.value)} error={errors.country}>
          {COUNTRIES.map((c) => <option key={c.iso} value={c.name}>{c.name}</option>)}
        </SelectField>
        <TextField label="Address" value={v.address} onChange={(e) => set("address", e.target.value)} error={errors.address} placeholder="Street and number" />
        <TextField label="City" value={v.city} onChange={(e) => set("city", e.target.value)} error={errors.city} />
      </div>
      <SubmitButton loading={loading}>{loading ? "Saving…" : "Save changes"}</SubmitButton>
    </form>
  );
}
