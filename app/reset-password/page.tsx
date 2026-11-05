import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import ResetForm from "@/components/auth/ResetForm";
import { Alert } from "@/components/ui/Form";

export const metadata: Metadata = { title: "Reset Password | Tenex Market" };

export default function ResetPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token;
  return (
    <AuthShell title="Choose a new password" subtitle="Your new password must be different from previous ones."
      footer={<Link href="/login" className="font-semibold text-brand hover:underline">← Back to log in</Link>}>
      {token ? <ResetForm token={token} /> : (
        <Alert kind="error">This reset link is invalid. <Link href="/forgot-password" className="underline">Request a new one</Link>.</Alert>
      )}
    </AuthShell>
  );
}
