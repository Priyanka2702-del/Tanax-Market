import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import ForgotForm from "@/components/auth/ForgotForm";

export const metadata: Metadata = { title: "Forgot Password | Tenex Market" };

export default function ForgotPage() {
  return (
    <AuthShell title="Forgot your password?" subtitle="Enter your email and we’ll send you a link to reset it."
      footer={<Link href="/login" className="font-semibold text-brand hover:underline">← Back to log in</Link>}>
      <ForgotForm />
    </AuthShell>
  );
}
