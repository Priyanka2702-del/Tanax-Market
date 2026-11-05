"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { EmptyState, StatusBadge, Table, Td } from "@/components/dashboard/ui";
import { inputCls } from "@/components/ui/Form";
import { fmtDateTime, money } from "@/lib/client";
import type { Transaction } from "@/lib/server/queries";
import { ListOrdered } from "lucide-react";

export default function TransactionsTable({ rows, filters = true, empty }: { rows: Transaction[]; filters?: boolean; empty?: string }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const list = useMemo(() => rows.filter((r) => {
    if (type !== "all" && r.type !== type) return false;
    if (status !== "all" && r.status !== status) return false;
    const day = r.created_at.slice(0, 10);
    if (from && day < from) return false;
    if (to && day > to) return false;
    if (q) { const s = q.toLowerCase(); if (![r.reference, r.method, r.account_login ?? ""].some((v) => v.toLowerCase().includes(s))) return false; }
    return true;
  }), [rows, q, type, status, from, to]);

  return (
    <div>
      {filters && (
        <div className="grid gap-3 border-b border-gray-100 p-5 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input aria-label="Search transactions" placeholder="Search reference, method, account…" value={q} onChange={(e) => setQ(e.target.value)} className={inputCls() + " pl-10"} />
          </div>
          <select aria-label="Type" value={type} onChange={(e) => setType(e.target.value)} className={inputCls()}>
            <option value="all">All types</option><option value="deposit">Deposits</option><option value="withdrawal">Withdrawals</option>
          </select>
          <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls()}>
            <option value="all">All statuses</option><option value="pending">Pending</option><option value="completed">Completed</option><option value="rejected">Rejected</option><option value="cancelled">Cancelled</option>
          </select>
          <input aria-label="From date" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={inputCls()} />
          <input aria-label="To date" type="date" value={to} onChange={(e) => setTo(e.target.value)} className={inputCls()} />
        </div>
      )}
      {list.length === 0 ? (
        <EmptyState icon={ListOrdered} title={rows.length ? "No transactions match your filters" : "No transactions yet"} text={rows.length ? "Try changing or clearing the filters." : empty ?? "Your deposits and withdrawals will appear here."} />
      ) : (
        <Table head={["Reference", "Date", "Type", "Method", "Account", "Amount", "Status"]}>
          {list.map((t) => (
            <tr key={t.id} className="transition hover:bg-gray-50/70">
              <Td className="font-semibold">{t.reference}</Td>
              <Td className="text-ink-soft">{fmtDateTime(t.created_at)}</Td>
              <Td className="capitalize">{t.type}</Td>
              <Td>{t.method}</Td>
              <Td className="text-ink-soft">{t.account_login ?? "—"}</Td>
              <Td className={t.type === "deposit" ? "font-semibold text-green-600" : "font-semibold text-ink"}>{t.type === "deposit" ? "+" : "−"}{money(t.amount, t.currency)}</Td>
              <Td><StatusBadge status={t.status} /></Td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}
