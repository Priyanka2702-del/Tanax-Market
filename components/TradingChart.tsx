import { useId } from "react";
import { makeCandles, makeSeries } from "@/lib/chart";

interface CandleChartProps { seed: number; count?: number; drift?: number; className?: string; grid?: boolean }

export function CandleChart({ seed, count = 38, drift = 0.4, className, grid = true }: CandleChartProps) {
  const candles = makeCandles(seed, count, drift);
  const all = candles.flatMap((c) => [c.h, c.l]);
  const min = Math.min(...all), max = Math.max(...all);
  const W = 400, H = 200, pad = 8;
  const y = (v: number) => pad + (1 - (v - min) / (max - min)) * (H - pad * 2);
  const step = W / count;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={className} role="img" aria-label="Price chart">
      {grid && [0.2, 0.4, 0.6, 0.8].map((g) => (
        <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="#0866C5" strokeOpacity="0.1" strokeDasharray="3 4" />
      ))}
      {candles.map((c, i) => {
        const up = c.c >= c.o;
        const color = up ? "#16A34A" : "#EF4444";
        const x = i * step + step / 2;
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={y(c.h)} y2={y(c.l)} stroke={color} strokeWidth="1.2" />
            <rect x={x - step * 0.3} width={step * 0.6} y={y(Math.max(c.o, c.c))} height={Math.max(1.5, Math.abs(y(c.o) - y(c.c)))} fill={color} rx="0.8" />
          </g>
        );
      })}
    </svg>
  );
}

interface SparkProps { seed: number; up: boolean; className?: string }

export function Sparkline({ seed, up, className }: SparkProps) {
  const id = useId();
  const s = makeSeries(seed, 24, up ? 1.2 : -1.2);
  const min = Math.min(...s), max = Math.max(...s);
  const W = 120, H = 40;
  const pts = s.map((v, i) => `${(i / (s.length - 1)) * W},${3 + (1 - (v - min) / (max - min || 1)) * (H - 6)}`);
  const color = up ? "#16A34A" : "#EF4444";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.25" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${H} ${pts.join(" ")} ${W},${H}`} fill={`url(#${id})`} />
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
