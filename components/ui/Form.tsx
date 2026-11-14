"use client";
import { useId, useState } from "react";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { PASSWORD_RULES, passwordScore } from "@/lib/validation";

export const inputCls = (error?: string) =>
  cn(
    "w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-ink placeholder:text-gray-400 outline-none transition",
    "focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:bg-gray-50 disabled:text-gray-500",
    error ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-gray-200 hover:border-gray-300",
  );

export function Field({ label, error, hint, children, htmlFor, className }: {
  label: string; error?: string; hint?: string; children: React.ReactNode; htmlFor?: string; className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-ink">{label}</label>
      {children}
      {error ? (
        <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-red-600"><AlertCircle size={14} />{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[13px] text-ink-soft">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextField({ label, error, hint, className, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string }) {
  const id = useId();
  return (
    <Field label={label} error={error} hint={hint} htmlFor={id} className={className}>
      <input id={id} aria-invalid={!!error} className={inputCls(error)} {...rest} />
    </Field>
  );
}

export function SelectField({ label, error, hint, className, children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string; hint?: string }) {
  const id = useId();
  return (
    <Field label={label} error={error} hint={hint} htmlFor={id} className={className}>
      <select id={id} aria-invalid={!!error} className={cn(inputCls(error), "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22 stroke=%22%234A6280%22 stroke-width=%222%22><path d=%22M4 6l4 4 4-4%22/></svg>')] bg-[length:16px] bg-[right_14px_center] bg-no-repeat pr-10")} {...rest}>
        {children}
      </select>
    </Field>
  );
}

export function PasswordField({ label, error, showStrength, className, value, ...rest }: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string; error?: string; showStrength?: boolean; value: string;
}) {
  const id = useId();
  const [show, setShow] = useState(false);
  const score = passwordScore(value);
  const bar = ["bg-gray-200", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"][score];
  return (
    <Field label={label} error={error} htmlFor={id} className={className}>
      <div className="relative">
        <input id={id} type={show ? "text" : "password"} value={value} aria-invalid={!!error} className={cn(inputCls(error), "pr-12")} {...rest} />
        <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-ink">
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {showStrength && value.length > 0 && (
        <div className="mt-2.5" aria-live="polite">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => <span key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors", i <= score ? bar : "bg-gray-200")} />)}
          </div>
          <ul className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
            {PASSWORD_RULES.map((r) => (
              <li key={r.id} className={cn("flex items-center gap-1.5 text-xs", r.test(value) ? "text-green-600" : "text-ink-soft")}>
                <CheckCircle2 size={13} className={r.test(value) ? "" : "opacity-30"} />{r.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Field>
  );
}

export function Alert({ kind, children }: { kind: "error" | "success" | "info"; children: React.ReactNode }) {
  const styles = { error: "border-red-200 bg-red-50 text-red-800", success: "border-green-200 bg-green-50 text-green-800", info: "border-brand/20 bg-brand-light text-brand-dark" }[kind];
  const Icon = kind === "success" ? CheckCircle2 : AlertCircle;
  return (
    <div role={kind === "error" ? "alert" : "status"} className={cn("flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium", styles)}>
      <Icon size={18} className="mt-0.5 shrink-0" /><div>{children}</div>
    </div>
  );
}

export function SubmitButton({ loading, children, className, variant = "primary", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean; variant?: "primary" | "dark" | "outline" }) {
  const v = { primary: "bg-brand text-white hover:bg-brand-dark", dark: "bg-ink text-white hover:bg-black", outline: "border border-gray-300 bg-white text-ink hover:bg-gray-50" }[variant];
  return (
    <button type="submit" disabled={loading || rest.disabled} {...rest}
      className={cn("inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[15px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60", v, className)}>
      {loading && <Loader2 size={17} className="animate-spin" />}{children}
    </button>
  );
}
