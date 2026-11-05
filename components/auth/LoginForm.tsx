"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, PasswordField, SubmitButton, TextField } from "@/components/ui/Form";
import { api, safeNext } from "@/lib/client";

export default function LoginForm({ next, notice }: { next?: string; notice?: string }) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const local: Record<string, string> = {};
    if (!identifier.trim()) local.identifier = "Email or Client ID is required";
    if (!password) local.password = "Password is required";
    setErrors(local); setError("");
    if (Object.keys(local).length) return;
    setLoading(true);
    const res = await api("/api/auth/login", "POST", { identifier, password, remember });
    if (res.ok) { router.replace(safeNext(next)); router.refresh(); return; }
    setLoading(false);
    setErrors(res.fieldErrors ?? {});
    setError(res.message ?? "Unable to sign in.");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {notice && <Alert kind="success">{notice}</Alert>}
      {error && <Alert kind="error">{error}</Alert>}
      <TextField label="Email address or Client ID" name="identifier" autoComplete="username" placeholder="you@example.com or TM1234567"
        value={identifier} onChange={(e) => setIdentifier(e.target.value)} error={errors.identifier} />
      <PasswordField label="Password" name="password" autoComplete="current-password" placeholder="Enter your password"
        value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border-gray-300 accent-brand" />
          Remember me
        </label>
        <Link href="/forgot-password" className="text-sm font-semibold text-brand hover:underline">Forgot password?</Link>
      </div>
      <SubmitButton loading={loading} className="w-full">{loading ? "Signing in…" : "Log In"}</SubmitButton>
    </form>
  );
}
