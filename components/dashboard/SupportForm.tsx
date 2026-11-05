"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Field, SelectField, SubmitButton, TextField, inputCls } from "@/components/ui/Form";
import { api } from "@/lib/client";
import { TICKET_CATEGORIES, ticketSchema } from "@/lib/validation";

export default function SupportForm() {
  const router = useRouter();
  const [v, setV] = useState({ category: "Account", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setMsg(null);
    const parsed = ticketSchema.safeParse(v);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const i of parsed.error.issues) fe[i.path.join(".")] ??= i.message;
      setErrors(fe); return;
    }
    setErrors({}); setLoading(true);
    const res = await api("/api/tickets", "POST", v);
    setLoading(false);
    if (res.ok) { setMsg({ kind: "success", text: res.message as string }); setV({ category: "Account", subject: "", message: "" }); router.refresh(); }
    else { setErrors(res.fieldErrors ?? {}); setMsg({ kind: "error", text: res.message ?? "Could not send your request." }); }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {msg && <Alert kind={msg.kind}>{msg.text}</Alert>}
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField label="Category" value={v.category} onChange={(e) => setV({ ...v, category: e.target.value })} error={errors.category}>
          {TICKET_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </SelectField>
        <TextField label="Subject" value={v.subject} onChange={(e) => setV({ ...v, subject: e.target.value })} error={errors.subject} />
      </div>
      <Field label="Message" htmlFor="tk-msg" error={errors.message}>
        <textarea id="tk-msg" rows={5} value={v.message} onChange={(e) => setV({ ...v, message: e.target.value })} className={inputCls(errors.message)} placeholder="Describe your issue in as much detail as possible…" />
      </Field>
      <SubmitButton loading={loading}>{loading ? "Sending…" : "Submit request"}</SubmitButton>
    </form>
  );
}
