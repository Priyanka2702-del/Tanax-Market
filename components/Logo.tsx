import { useId } from "react";
import { cn } from "@/lib/cn";

export default function Logo({ light, className }: { light?: boolean; className?: string }) {
  const id = useId();
  return (
    <a href="#home" aria-label="Tenex Market home" className={cn("inline-flex items-center gap-2.5", className)}>
      <svg width="38" height="38" viewBox="0 0 40 40" aria-hidden="true">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0866C5" />
            <stop offset="1" stopColor="#65D4F5" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="11" fill={light ? "#fff" : `url(#${id})`} />
        <path d="M9 12h22M20 12v17" stroke={light ? "#0866C5" : "#fff"} strokeWidth="4" strokeLinecap="round" />
        <path d="M24 26l5-5 3 3" stroke={light ? "#65D4F5" : "#fff"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <span className={cn("text-xl font-extrabold tracking-tight", light ? "text-white" : "text-brand")}>
        Tenex<span className={light ? "text-white/80" : "text-sky"}> Market</span>
      </span>
    </a>
  );
}
