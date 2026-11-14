import Link from "next/link";
import { BadgeCheck, Lock, Zap } from "lucide-react";

const POINTS = [
  { icon: Zap, text: "Fast execution on MetaTrader 5" },
  { icon: Lock, text: "Segregated client funds & encrypted connections" },
  { icon: BadgeCheck, text: "Spreads from 0.0 pips, 200+ instruments" },
];

export default function AuthShell({ title, subtitle, children, footer }: {
  title: string; subtitle?: string; children: React.ReactNode; footer?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink p-12 text-white lg:flex">
        <div aria-hidden className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-sky/10 blur-3xl" />
        <Link href="/" className="relative inline-flex w-fit rounded-xl bg-white px-4 py-2.5">
          <img src="/images/logo.png" alt="Tenex Market" className="h-9 w-auto" />
        </Link>
        <div className="relative">
          <h2 className="max-w-md text-4xl font-extrabold leading-tight tracking-tight">Trade the global markets with a broker you can trust.</h2>
          <ul className="mt-8 space-y-4">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-[15px] text-white/85">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10"><Icon size={18} className="text-sky" /></span>{text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative max-w-md text-xs leading-relaxed text-white/50">
          Risk warning: trading derivatives involves a high level of risk and may result in the loss of more than your initial investment.
        </p>
      </aside>

      <main className="flex flex-col bg-white">
        <div className="flex items-center justify-between px-6 py-5 lg:justify-end lg:px-12">
          <Link href="/" className="lg:hidden"><img src="/images/logo.png" alt="Tenex Market" className="h-8 w-auto" /></Link>
          <Link href="/" className="text-sm font-semibold text-ink-soft transition hover:text-brand">← Back to website</Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-[520px]">
            <h1 className="text-3xl font-extrabold tracking-tight text-ink">{title}</h1>
            {subtitle && <p className="mt-2 text-[15px] text-ink-soft">{subtitle}</p>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-6 text-center text-sm text-ink-soft">{footer}</div>}
          </div>
        </div>
      </main>
    </div>
  );
}
