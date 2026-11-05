"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Field, PasswordField, SelectField, SubmitButton, TextField, inputCls } from "@/components/ui/Form";
import { api } from "@/lib/client";
import { COUNTRIES } from "@/lib/countries";
import { registerSchema } from "@/lib/validation";

const today = new Date();
const maxDob = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString().slice(0, 10);

export default function RegisterForm() {
  const router = useRouter();
  const [v, setV] = useState({ firstName: "", lastName: "", email: "", dialCode: "", phone: "", country: "", dateOfBirth: "", password: "", confirmPassword: "", terms: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => setV((p) => ({ ...p, [k]: val }));
  const onCountry = (name: string) => {
    const c = COUNTRIES.find((x) => x.name === name);
    setV((p) => ({ ...p, country: name, dialCode: p.dialCode || c?.dial || "" }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const parsed = registerSchema.safeParse(v);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const i of parsed.error.issues) fe[i.path.join(".")] ??= i.message;
      setErrors(fe);
      return;
    }
    setErrors({}); setLoading(true);
    const res = await api("/api/auth/register", "POST", v);
    if (res.ok) { setDone(true); setTimeout(() => { router.replace(res.redirect ?? "/dashboard"); router.refresh(); }, 900); return; }
    setLoading(false);
    setErrors(res.fieldErrors ?? {});
    setError(res.message ?? "Unable to create your account.");
  }

  if (done) return <Alert kind="success">Account created successfully! Redirecting you to your dashboard…</Alert>;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {error && <Alert kind="error">{error}</Alert>}
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="First name" autoComplete="given-name" value={v.firstName} onChange={(e) => set("firstName", e.target.value)} error={errors.firstName} />
        <TextField label="Last name" autoComplete="family-name" value={v.lastName} onChange={(e) => set("lastName", e.target.value)} error={errors.lastName} />
      </div>
      <TextField label="Email address" type="email" autoComplete="email" placeholder="you@example.com" value={v.email} onChange={(e) => set("email", e.target.value)} error={errors.email} />
      <SelectField label="Country of residence" autoComplete="country-name" value={v.country} onChange={(e) => onCountry(e.target.value)} error={errors.country}>
        <option value="">Select your country</option>
        {COUNTRIES.map((c) => <option key={c.iso} value={c.name}>{c.name}</option>)}
      </SelectField>
      <Field label="Phone number" htmlFor="phone" error={errors.phone || errors.dialCode}>
        <div className="flex gap-3">
          <select aria-label="Country code" value={v.dialCode} onChange={(e) => set("dialCode", e.target.value)} className={inputCls(errors.dialCode) + " w-[120px] shrink-0"}>
            <option value="">Code</option>
            {Array.from(new Set(COUNTRIES.map((c) => c.dial))).sort((a, b) => a.length - b.length || a.localeCompare(b)).map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <input id="phone" inputMode="numeric" autoComplete="tel-national" placeholder="Phone number" value={v.phone}
            onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))} className={inputCls(errors.phone)} />
        </div>
      </Field>
      <TextField label="Date of birth" type="date" max={maxDob} autoComplete="bday" value={v.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} error={errors.dateOfBirth} hint="You must be 18 or older to trade." />
      <PasswordField label="Password" autoComplete="new-password" showStrength value={v.password} onChange={(e) => set("password", e.target.value)} error={errors.password} />
      <PasswordField label="Confirm password" autoComplete="new-password" value={v.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} error={errors.confirmPassword} />
      <div>
        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-ink-soft">
          <input type="checkbox" checked={v.terms} onChange={(e) => set("terms", e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-brand" />
          <span>I confirm I am 18+ and agree to the <a href="/#footer" className="font-semibold text-brand hover:underline">Terms &amp; Conditions</a> and <a href="/#footer" className="font-semibold text-brand hover:underline">Privacy Policy</a>, and I understand trading CFDs carries a high risk of loss.</span>
        </label>
        {errors.terms && <p role="alert" className="mt-1.5 text-[13px] font-medium text-red-600">{errors.terms}</p>}
      </div>
      <SubmitButton loading={loading} className="w-full">{loading ? "Creating account…" : "Open Account"}</SubmitButton>
      <p className="text-center text-sm text-ink-soft">Already have an account? <Link href="/login" className="font-semibold text-brand hover:underline">Log in</Link></p>
    </form>
  );
}
