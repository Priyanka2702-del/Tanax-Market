"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Field, SelectField, SubmitButton, TextField, inputCls } from "@/components/ui/Form";
import { api, money } from "@/lib/client";
import { DEPOSIT_METHODS, WITHDRAW_METHODS } from "@/lib/validation";

interface Acc { id: number; login: string; type: string; currency: string; balance: number; available: number }

export default function MoneyForm({ mode, accounts, blocked }: { mode: "deposit" | "withdraw"; accounts: Acc[]; blocked?: string }) {
  const router = useRouter();
  const methods = mode === "deposit" ? DEPOSIT_METHODS : WITHDRAW_METHODS;
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? 0);
  const [method, setMethod] = useState<string>(methods[0].id);
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const m = methods.find((x) => x.id === method)!;
  const acc = accounts.find((a) => a.id === accountId);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setMsg(null);
    const n = Number(amount);
    const fe: Record<string, string> = {};
    if (!accountId) fe.accountId = "Select a trading account";
    if (!amount || !Number.isFinite(n) || n <= 0) fe.amount = "Enter an amount greater than 0";
    else if (n < m.min) fe.amount = `Minimum for ${m.label} is ${m.min}`;
    else if (mode === "deposit" && "max" in m && n > m.max) fe.amount = `Maximum for ${m.label} is ${m.max.toLocaleString()}`;
    else if (mode === "withdraw" && acc && n > acc.available) fe.amount = `Exceeds available balance (${money(acc.available, acc.currency)})`;
    if (mode === "withdraw" && details.trim().length < 4) fe.details = "Enter the destination account / wallet details";
    setErrors(fe);
    if (Object.keys(fe).length) return;
    setLoading(true);
    const res = await api(mode === "deposit" ? "/api/deposits" : "/api/withdrawals", "POST", { accountId, method, amount: n, ...(mode === "withdraw" ? { details } : {}) });
    setLoading(false);
    if (res.ok) { setMsg({ kind: "success", text: res.message as string }); setAmount(""); setDetails(""); router.refresh(); }
    else { setErrors(res.fieldErrors ?? {}); setMsg({ kind: "error", text: res.message ?? "Request failed." }); }
  }

  if (accounts.length === 0) return <Alert kind="info">You need a live trading account first. Create one under My Trading Accounts.</Alert>;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {blocked && <Alert kind="info">{blocked}</Alert>}
      {msg && <Alert kind={msg.kind}>{msg.text}</Alert>}
      <SelectField label={mode === "deposit" ? "Deposit to" : "Withdraw from"} value={accountId} onChange={(e) => setAccountId(Number(e.target.value))} error={errors.accountId}
        hint={acc ? (mode === "withdraw" ? `Available: ${money(acc.available, acc.currency)}` : `Balance: ${money(acc.balance, acc.currency)}`) : undefined}>
        {accounts.map((a) => <option key={a.id} value={a.id}>{a.login} · {a.type} · {a.currency}</option>)}
      </SelectField>
      <SelectField label="Payment method" value={method} onChange={(e) => setMethod(e.target.value)}
        hint={`Processing time: ${m.time}${"fee" in m ? ` · Fee: ${m.fee}` : ""}`}>
        {methods.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
      </SelectField>
      <Field label={`Amount (${acc?.currency ?? "USD"})`} htmlFor="amt" error={errors.amount} hint={`Minimum ${m.min}${"max" in m ? ` · Maximum ${m.max.toLocaleString()}` : ""}`}>
        <input id="amt" inputMode="decimal" type="number" min="0" step="0.01" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls(errors.amount)} />
      </Field>
      {mode === "withdraw" && (
        <TextField label="Destination details" placeholder="IBAN / wallet address / Skrill email" value={details} onChange={(e) => setDetails(e.target.value)} error={errors.details}
          hint="Funds can only be returned to a method in your own name." />
      )}
      <SubmitButton loading={loading} disabled={!!blocked} className="w-full sm:w-auto">{loading ? "Submitting…" : mode === "deposit" ? "Submit deposit request" : "Request withdrawal"}</SubmitButton>
    </form>
  );
}
