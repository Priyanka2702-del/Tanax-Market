import type { Metadata } from "next";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getCurrentUser } from "@/lib/server/auth";
import { listNotifications, toPublic } from "@/lib/server/queries";

export const metadata: Metadata = { title: "Client Portal | Tenex Market", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = getCurrentUser();
  if (!user) redirect("/login");
  return (
    <DashboardShell user={toPublic(user)} notifications={listNotifications(user.id)}>
      {children}
    </DashboardShell>
  );
}
