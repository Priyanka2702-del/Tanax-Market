"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, PasswordField, SubmitButton } from "@/components/ui/Form";
import { api } from "@/lib/client";
import { resetSchema } from "@/lib/validation";

export default function ResetForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const parsed = resetSchema.safeParse({ token, password, confirmPassword });
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const i of parsed.error.issues) fe[i.path.join(".")] ??= i.message;
      setErrors(fe); return;
    }
    setErrors({}); setLoading(true);
    const res = await api("/api/auth/reset-password", "POST", { token, password, confirmPassword });
    if (res.ok) { router.replace("/login?reset=1"); return; }
    setLoading(false); setErrors(res.fieldErrors ?? {}); setError(res.message ?? "Unable to reset password.");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {error && <Alert kind="error">{error}</Alert>}
      <PasswordField label="New password" autoComplete="new-password" showStrength value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
      <PasswordField label="Confirm new password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirm(e.target.value)} error={errors.confirmPassword} />
      <SubmitButton loading={loading} className="w-full">{loading ? "Updating…" : "Update password"}</SubmitButton>
    </form>
  );
}
