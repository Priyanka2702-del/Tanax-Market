"use client";
import { useState } from "react";
import { Alert, SubmitButton, TextField } from "@/components/ui/Form";
import { api } from "@/lib/client";

export default function ForgotForm() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setMsg("");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) { setErr("Enter a valid email address"); return; }
    setLoading(true);
    const res = await api("/api/auth/forgot-password", "POST", { email });
    setLoading(false);
    if (res.ok) setMsg(res.message as string); else setErr(res.fieldErrors?.email ?? res.message ?? "Request failed.");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {msg && <Alert kind="success">{msg} Check your inbox (and spam folder).</Alert>}
      <TextField label="Email address" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} error={err} />
      <SubmitButton loading={loading} className="w-full">{loading ? "Sending…" : "Send reset link"}</SubmitButton>
    </form>
  );
}
