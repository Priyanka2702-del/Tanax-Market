"use client";
import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, BarChart3, Bell, Menu, Star, Wallet } from "lucide-react";
import { CandleChart, Sparkline } from "./TradingChart";
import { cn } from "@/lib/cn";

function useLivePrice(base: number, decimals: number, step: number): number {
  const [price, setPrice] = useState(base);
  useEffect(() => {
    const id = setInterval(() => setPrice((p) => +(p + (Math.random() - 0.5) * step).toFixed(decimals)), 1400);
    return () => clearInterval(id);
  }, [decimals, step]);
  return price;
}

function PhoneFrame({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-[2.4rem] border-[7px] border-white bg-white shadow-lift ring-1 ring-brand/10", className)}>
      <div className="absolute left-1/2 top-1.5 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-ink/90" />
      <div className="h-full overflow-hidden rounded-[1.9rem] bg-[#F5FAFE]">{children}</div>
    </div>
  );
}

function ChartScreen() {
  const price = useLivePrice(1.08432, 5, 0.0004);
  return (
    <div className="flex h-full flex-col px-3.5 pb-4 pt-8 text-ink">
      <div className="flex items-center justify-between text-brand"><Menu size={16} /><span className="text-xs font-bold">Trade</span><Bell size={16} /></div>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold text-ink-soft">EUR/USD</p>
          <p className="text-2xl font-extrabold tabular-nums">{price.toFixed(5)}</p>
        </div>
        <span className="mb-1 inline-flex items-center gap-0.5 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700"><ArrowUpRight size={11} />0.12%</span>
      </div>
      <div className="mt-2 flex gap-1.5 text-[10px] font-semibold">
        {["1H", "4H", "1D", "1W"].map((t, i) => (
          <span key={t} className={cn("rounded-full px-2 py-0.5", i === 1 ? "bg-brand text-white" : "bg-white text-ink-soft")}>{t}</span>
        ))}
      </div>
      <div className="mt-2 min-h-0 flex-1 rounded-xl bg-white p-1.5"><CandleChart seed={7} count={30} drift={0.6} className="h-full w-full" /></div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" tabIndex={-1} className="rounded-xl bg-red-500 py-2 text-xs font-bold text-white">Sell 1.08428</button>
        <button type="button" tabIndex={-1} className="rounded-xl bg-green-600 py-2 text-xs font-bold text-white">Buy 1.08436</button>
      </div>
    </div>
  );
}

const WATCH = [
  { s: "XAU/USD", p: "2,341.60", c: 0.46, seed: 21 },
  { s: "BTC/USD", p: "67,420.5", c: 1.84, seed: 31 },
  { s: "GBP/USD", p: "1.27105", c: -0.08, seed: 12 },
  { s: "US100", p: "18,176.8", c: 0.58, seed: 42 },
  { s: "USOIL", p: "82.140", c: -0.35, seed: 62 },
];

function WatchlistScreen() {
  return (
    <div className="flex h-full flex-col px-3.5 pb-4 pt-8 text-ink">
      <div className="flex items-center justify-between text-brand"><Wallet size={16} /><span className="text-xs font-bold">Watchlist</span><Star size={16} /></div>
      <div className="mt-3 rounded-xl bg-brand-gradient p-3 text-white">
        <p className="text-[10px] font-semibold text-white/80">Account balance</p>
        <p className="text-xl font-extrabold tabular-nums">$12,480.00</p>
        <p className="text-[10px] font-semibold text-white/90">+$214.30 today</p>
      </div>
      <ul className="mt-3 space-y-1.5">
        {WATCH.map((w) => (
          <li key={w.s} className="flex items-center justify-between rounded-xl bg-white px-2.5 py-2">
            <div><p className="text-[11px] font-bold">{w.s}</p><p className="text-[10px] tabular-nums text-ink-soft">{w.p}</p></div>
            <Sparkline seed={w.seed} up={w.c >= 0} className="h-6 w-14" />
            <span className={cn("inline-flex items-center text-[10px] font-bold", w.c >= 0 ? "text-green-600" : "text-red-500")}>
              {w.c >= 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}{Math.abs(w.c)}%
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex justify-around pt-3 text-brand"><BarChart3 size={18} /><Wallet size={18} /><Star size={18} /></div>
    </div>
  );
}

export default function PhoneMockups() {
  return (
    <div className="relative mx-auto h-[460px] w-full max-w-[460px] sm:h-[540px]" aria-hidden="true">
      <div className="absolute inset-x-6 bottom-4 top-10 rounded-full bg-white/15 blur-3xl" />
      <PhoneFrame className="absolute left-0 top-10 h-[420px] w-[205px] animate-float-slow sm:h-[490px] sm:w-[235px]"><WatchlistScreen /></PhoneFrame>
      <PhoneFrame className="absolute right-0 top-0 h-[430px] w-[210px] animate-float sm:h-[500px] sm:w-[240px]"><ChartScreen /></PhoneFrame>
    </div>
  );
}
