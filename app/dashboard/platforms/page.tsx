import { Apple, Globe, Monitor, Smartphone } from "lucide-react";
import { Card, PageHeader, StatusBadge } from "@/components/dashboard/ui";
import { requireUser } from "@/lib/server/auth";
import { listAccounts } from "@/lib/server/queries";
import { PLATFORM_POINTS } from "@/lib/data";

const DOWNLOADS = [
  { icon: Monitor, label: "Windows", note: "Desktop terminal", href: "https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/mt5setup.exe" },
  { icon: Apple, label: "macOS", note: "Desktop terminal", href: "https://www.metatrader5.com/en/terminal/help/start_advanced/install_mac" },
  { icon: Smartphone, label: "iOS", note: "App Store", href: "https://apps.apple.com/app/metatrader-5/id413251709" },
  { icon: Smartphone, label: "Android", note: "Google Play", href: "https://play.google.com/store/apps/details?id=net.metaquotes.metatrader5" },
  { icon: Globe, label: "WebTrader", note: "Trade in your browser", href: "https://trade.mql5.com/trade" },
];

export default function PlatformsPage() {
  const user = requireUser();
  const accounts = listAccounts(user.id);
  const server = process.env.MT5_SERVER || "TenexMarket-Live";
  return (
    <>
      <PageHeader title="Trading Platforms" text="Download MetaTrader 5 and log in with your trading account details." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="About MetaTrader 5" className="lg:col-span-2">
          <p className="text-sm leading-relaxed text-ink-soft">MetaTrader 5 is the multi-asset platform we offer for forex, metals, crypto, indices, stocks and commodities.</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {PLATFORM_POINTS.map((p) => <li key={p} className="flex gap-2 text-sm text-ink"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{p}</li>)}
          </ul>
        </Card>
        <Card title="Server details">
          <dl className="space-y-3 text-sm">
            <div><dt className="text-ink-soft">Platform</dt><dd className="font-bold text-ink">MetaTrader 5</dd></div>
            <div><dt className="text-ink-soft">Server</dt><dd className="font-bold text-ink">{server}</dd></div>
            <div><dt className="text-ink-soft">Password</dt><dd className="font-semibold text-ink">Your MT5 trading password (separate from your portal password)</dd></div>
          </dl>
        </Card>
      </div>
      <Card title="Download MT5" className="mt-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {DOWNLOADS.map(({ icon: Icon, label, note, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="group rounded-xl border border-gray-200 p-4 transition hover:border-brand hover:shadow-card">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-light text-brand transition group-hover:bg-brand group-hover:text-white"><Icon size={20} /></span>
              <p className="mt-3 font-bold text-ink">{label}</p><p className="text-xs text-ink-soft">{note}</p>
            </a>
          ))}
        </div>
      </Card>
      <Card title="Your platform access" className="mt-6" pad={false}>
        <ul className="divide-y divide-gray-100">
          {accounts.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm">
              <div><p className="font-bold text-ink">Login: {a.login}</p><p className="text-xs text-ink-soft">{a.type} · {a.is_demo ? "Demo" : "Live"} · Server: {a.is_demo ? server.replace("Live", "Demo") : server}</p></div>
              <StatusBadge status={a.status} />
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
