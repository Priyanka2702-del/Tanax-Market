import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/server/auth";

export const metadata: Metadata = { title: "Log In | Tenex Market" };
export const dynamic = "force-dynamic";

export default function LoginPage({ searchParams }: { searchParams: { next?: string; reset?: string } }) {
  if (getCurrentUser()) redirect("/dashboard");
  return (
    <AuthShell title="Welcome back" subtitle="Log in to your Tenex Market client portal."
      footer={<>Don&rsquo;t have an account? <Link href="/register" className="font-semibold text-brand hover:underline">Open an account</Link></>}>
      <LoginForm next={searchParams.next} notice={searchParams.reset ? "Your password has been updated. Please log in." : undefined} />
    </AuthShell>
  );
}
