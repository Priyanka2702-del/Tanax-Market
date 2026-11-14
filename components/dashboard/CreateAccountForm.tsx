"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Alert, SelectField, SubmitButton } from "@/components/ui/Form";
import { api } from "@/lib/client";
import { ACCOUNT_RULES, ACCOUNT_TYPES, LEVERAGES } from "@/lib/validation";

export default function CreateAccountForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<(typeof ACCOUNT_TYPES)[number]>("Standard");
  const [leverage, setLeverage] = useState(500);
  const [isDemo, setDemo] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const max = ACCOUNT_RULES[type].maxLeverage;

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setLoading(true);
    const res = await api("/api/accounts", "POST", { type, leverage: Math.min(leverage, max), isDemo });
    setLoading(false);
    if (res.ok) { setOpen(false); router.refresh(); } else setErr(res.fieldErrors?.leverage ?? res.message ?? "Could not create the account.");
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"><Plus size={16} />New trading account</button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true" aria-label="Create trading account">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} aria-hidden />
          <form onSubmit={submit} className="relative w-full max-w-md space-y-5 rounded-2xl bg-white p-6 shadow-lift">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-ink">Create trading account</h2>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-ink-soft hover:bg-gray-100" aria-label="Close"><X size={18} /></button>
            </div>
            {err && <Alert kind="error">{err}</Alert>}
            <SelectField label="Account type" value={type} onChange={(e) => { const t = e.target.value as typeof type; setType(t); setLeverage((l) => Math.min(l, ACCOUNT_RULES[t].maxLeverage)); }}
              hint={`Minimum deposit $${ACCOUNT_RULES[type].minDeposit.toLocaleString()} · leverage up to 1:${max}`}>
              {ACCOUNT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </SelectField>
            <SelectField label="Platform" disabled value="MT5"><option>MT5</option></SelectField>
            <SelectField label="Leverage" value={Math.min(leverage, max)} onChange={(e) => setLeverage(Number(e.target.value))}>
              {LEVERAGES.filter((l) => l <= max).map((l) => <option key={l} value={l}>1:{l}</option>)}
            </SelectField>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
              <input type="checkbox" checked={isDemo} onChange={(e) => setDemo(e.target.checked)} className="h-4 w-4 rounded accent-brand" />
              Demo account (virtual $10,000, no real funds)
            </label>
            <div className="flex justify-end gap-3">
              <SubmitButton type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</SubmitButton>
              <SubmitButton loading={loading}>{loading ? "Creating…" : "Create account"}</SubmitButton>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
