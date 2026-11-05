"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine, ArrowUpFromLine, Bell, ChevronDown, Headphones, LayoutDashboard, ListOrdered, LogOut, Menu,
  Monitor, Settings, ShieldCheck, User, Wallet, X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { api, fmtDateTime } from "@/lib/client";
import type { Notification, PublicUser } from "@/lib/server/queries";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
  { href: "/dashboard/accounts", label: "My Trading Accounts", icon: Wallet },
  { href: "/dashboard/deposit", label: "Deposit", icon: ArrowDownToLine },
  { href: "/dashboard/withdraw", label: "Withdraw", icon: ArrowUpFromLine },
  { href: "/dashboard/transactions", label: "Transactions", icon: ListOrdered },
  { href: "/dashboard/platforms", label: "Trading Platforms", icon: Monitor },
  { href: "/dashboard/verification", label: "Verification / KYC", icon: ShieldCheck },
  { href: "/dashboard/support", label: "Support", icon: Headphones },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function useOutside(ref: React.RefObject<HTMLElement>, close: () => void) {
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) close(); };
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("mousedown", h); document.addEventListener("keydown", k);
    return () => { document.removeEventListener("mousedown", h); document.removeEventListener("keydown", k); };
  }, [ref, close]);
}

export default function DashboardShell({ user, notifications, children }: { user: PublicUser; notifications: Notification[]; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawer, setDrawer] = useState(false);
  const [menu, setMenu] = useState<"profile" | "bell" | null>(null);
  const [unread, setUnread] = useState(notifications.filter((n) => !n.is_read).length);
  const [loggingOut, setLoggingOut] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  useOutside(topRef, () => setMenu(null));
  useEffect(() => { setDrawer(false); setMenu(null); }, [pathname]);
  useEffect(() => setUnread(notifications.filter((n) => !n.is_read).length), [notifications]);

  const initials = (user.first_name[0] + user.last_name[0]).toUpperCase();
  const active = (href: string) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href));

  async function logout() {
    setLoggingOut(true);
    await api("/api/auth/logout", "POST");
    router.replace("/login");
    router.refresh();
  }
  async function openBell() {
    const next = menu === "bell" ? null : "bell";
    setMenu(next);
    if (next && unread) { setUnread(0); await api("/api/notifications", "POST"); }
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-ink text-white">
      <div className="flex h-[72px] shrink-0 items-center justify-between px-5">
        <Link href="/dashboard" className="rounded-lg bg-white px-3 py-1.5"><img src="/images/logo.png" alt="Tenex Market" className="h-7 w-auto" /></Link>
        <button className="rounded-lg p-2 text-white/70 hover:bg-white/10 lg:hidden" onClick={() => setDrawer(false)} aria-label="Close menu"><X size={20} /></button>
      </div>
      <nav aria-label="Dashboard" className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link href={href} aria-current={active(href) ? "page" : undefined}
                className={cn("flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-semibold transition",
                  active(href) ? "bg-brand text-white shadow-lg shadow-brand/25" : "text-white/70 hover:bg-white/10 hover:text-white")}>
                <Icon size={18} />{label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="shrink-0 border-t border-white/10 p-3">
        <button onClick={logout} disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-semibold text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-60">
          <LogOut size={18} />{loggingOut ? "Signing out…" : "Logout"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F6FA]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] lg:block">{sidebar}</aside>
      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setDrawer(false)} aria-hidden />
          <aside className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] shadow-2xl">{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-20 border-b border-gray-200/80 bg-white/90 backdrop-blur">
          <div ref={topRef} className="flex h-[72px] items-center justify-between gap-4 px-4 sm:px-8">
            <div className="flex items-center gap-3">
              <button className="rounded-lg p-2 text-ink hover:bg-gray-100 lg:hidden" onClick={() => setDrawer(true)} aria-label="Open menu"><Menu size={22} /></button>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Client ID</p>
                <p className="text-sm font-bold text-ink">{user.client_id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <button onClick={openBell} aria-label="Notifications" aria-expanded={menu === "bell"}
                  className="relative grid h-10 w-10 place-items-center rounded-xl text-ink transition hover:bg-gray-100">
                  <Bell size={20} />
                  {unread > 0 && <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{unread}</span>}
                </button>
                {menu === "bell" && (
                  <div className="absolute right-0 top-12 w-[320px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lift">
                    <p className="border-b border-gray-100 px-4 py-3 text-sm font-bold text-ink">Notifications</p>
                    <ul className="max-h-80 divide-y divide-gray-100 overflow-y-auto">
                      {notifications.length === 0 && <li className="px-4 py-8 text-center text-sm text-ink-soft">You&rsquo;re all caught up.</li>}
                      {notifications.map((n) => (
                        <li key={n.id} className="px-4 py-3">
                          <p className="text-sm font-semibold text-ink">{n.title}</p>
                          <p className="mt-0.5 text-[13px] leading-snug text-ink-soft">{n.body}</p>
                          <p className="mt-1 text-[11px] text-gray-400">{fmtDateTime(n.created_at)}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="relative">
                <button onClick={() => setMenu(menu === "profile" ? null : "profile")} aria-expanded={menu === "profile"} aria-haspopup="menu"
                  className="flex items-center gap-2.5 rounded-xl py-1.5 pl-1.5 pr-2.5 transition hover:bg-gray-100">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-sm font-bold text-white">{initials}</span>
                  <span className="hidden text-left sm:block">
                    <span className="block text-sm font-bold leading-tight text-ink">{user.first_name} {user.last_name}</span>
                    <span className="block text-xs text-ink-soft">{user.email}</span>
                  </span>
                  <ChevronDown size={16} className="text-ink-soft" />
                </button>
                {menu === "profile" && (
                  <div role="menu" className="absolute right-0 top-14 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white p-1.5 shadow-lift">
                    {[{ href: "/dashboard/profile", label: "My Profile", icon: User }, { href: "/dashboard/settings", label: "Settings", icon: Settings }, { href: "/dashboard/support", label: "Support", icon: Headphones }].map(({ href, label, icon: Icon }) => (
                      <Link key={href} href={href} role="menuitem" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink hover:bg-gray-50"><Icon size={16} />{label}</Link>
                    ))}
                    <button role="menuitem" onClick={logout} className="mt-1 flex w-full items-center gap-2.5 rounded-xl border-t border-gray-100 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"><LogOut size={16} />Logout</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
