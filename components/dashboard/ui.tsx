import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export function PageHeader({ title, text, action }: { title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-[28px]">{title}</h1>
        {text && <p className="mt-1 text-sm text-ink-soft">{text}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ title, action, children, className, pad = true }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string; pad?: boolean }) {
  return (
    <section className={cn("rounded-2xl border border-gray-200/80 bg-white shadow-[0_1px_2px_rgba(11,42,74,0.04)]", className)}>
      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <h2 className="text-[15px] font-bold text-ink">{title}</h2>{action}
        </header>
      )}
      <div className={pad ? "p-5" : ""}>{children}</div>
    </section>
  );
}

export function StatCard({ label, value, icon: Icon, sub, tone = "brand" }: { label: string; value: string; icon: LucideIcon; sub?: string; tone?: "brand" | "green" | "orange" | "ink" }) {
  const tones = { brand: "bg-brand-light text-brand", green: "bg-green-50 text-green-600", orange: "bg-orange-50 text-orange-600", ink: "bg-slate-100 text-ink" }[tone];
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(11,42,74,0.04)] transition hover:shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-ink-soft">{label}</p>
        <span className={cn("grid h-9 w-9 place-items-center rounded-xl", tones)}><Icon size={18} /></span>
      </div>
      <p className="mt-3 text-2xl font-extrabold tracking-tight text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-ink-soft">{sub}</p>}
    </div>
  );
}

const BADGE: Record<string, string> = {
  completed: "bg-green-50 text-green-700 ring-green-600/20", active: "bg-green-50 text-green-700 ring-green-600/20",
  verified: "bg-green-50 text-green-700 ring-green-600/20", approved: "bg-green-50 text-green-700 ring-green-600/20",
  resolved: "bg-green-50 text-green-700 ring-green-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20", open: "bg-blue-50 text-blue-700 ring-blue-600/20",
  rejected: "bg-red-50 text-red-700 ring-red-600/20", cancelled: "bg-gray-100 text-gray-600 ring-gray-500/20",
  not_submitted: "bg-gray-100 text-gray-600 ring-gray-500/20", closed: "bg-gray-100 text-gray-600 ring-gray-500/20",
  demo: "bg-sky-light text-brand-dark ring-brand/20", live: "bg-brand-light text-brand-dark ring-brand/20",
};
export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset", BADGE[status] ?? BADGE.cancelled)}>
      {label ?? status.replace(/_/g, " ")}
    </span>
  );
}

export function EmptyState({ icon: Icon, title, text, action }: { icon: LucideIcon; title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-light text-brand"><Icon size={22} /></span>
      <p className="mt-4 font-bold text-ink">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-ink-soft">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-ink-soft">
            {head.map((h) => <th key={h} className="whitespace-nowrap px-5 py-3 font-semibold">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">{children}</tbody>
      </table>
    </div>
  );
}
export const Td = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <td className={cn("whitespace-nowrap px-5 py-3.5 text-ink", className)}>{children}</td>
);

/** Dependency-free SVG grouped bar chart (deposits vs withdrawals per month). */
export function BarChart({ data }: { data: { label: string; deposits: number; withdrawals: number }[] }) {
  const max = Math.max(1, ...data.flatMap((d) => [d.deposits, d.withdrawals]));
  const H = 160, W = 420, gap = W / data.length, bw = 14;
  const empty = data.every((d) => d.deposits === 0 && d.withdrawals === 0);
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full" role="img" aria-label="Deposits and withdrawals over the last six months">
        {[0, 0.5, 1].map((t) => <line key={t} x1="0" x2={W} y1={H - t * H} y2={H - t * H} stroke="#E5EAF1" strokeDasharray={t ? "3 4" : undefined} />)}
        {data.map((d, i) => {
          const x = i * gap + gap / 2;
          const dh = (d.deposits / max) * H, wh = (d.withdrawals / max) * H;
          return (
            <g key={d.label}>
              <rect x={x - bw - 2} y={H - dh} width={bw} height={dh} rx="3" fill="#0866C5"><title>{`${d.label}: deposits ${d.deposits.toFixed(2)}`}</title></rect>
              <rect x={x + 2} y={H - wh} width={bw} height={wh} rx="3" fill="#65D4F5"><title>{`${d.label}: withdrawals ${d.withdrawals.toFixed(2)}`}</title></rect>
              <text x={x} y={H + 17} textAnchor="middle" fontSize="11" fill="#4A6280">{d.label}</text>
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex items-center justify-between text-xs text-ink-soft">
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-brand" />Deposits</span>
          <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-sky" />Withdrawals</span>
        </div>
        {empty && <span>No completed transactions yet</span>}
      </div>
    </div>
  );
}
