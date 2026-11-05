import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";
import { getCurrentUser } from "@/lib/server/auth";

export const metadata: Metadata = { title: "Open Account | Tenex Market" };
export const dynamic = "force-dynamic";

export default function RegisterPage() {
  if (getCurrentUser()) redirect("/dashboard");
  return (
    <AuthShell title="Open your account" subtitle="Create your trading profile in a few minutes. No deposit required to register.">
      <RegisterForm />
    </AuthShell>
  );
}
