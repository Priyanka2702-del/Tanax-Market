export interface ApiResult { ok: boolean; message?: string; fieldErrors?: Record<string, string>; redirect?: string; [k: string]: unknown }

/** JSON request helper used by all client forms. Never throws; network problems become a normal error result. */
export async function api(url: string, method: "POST" | "PUT", body?: unknown): Promise<ApiResult> {
  try {
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
    const data = (await res.json().catch(() => null)) as ApiResult | null;
    if (!data) return { ok: false, message: "Unexpected server response. Please try again." };
    return data;
  } catch {
    return { ok: false, message: "Network error. Check your connection and try again." };
  }
}

export const money = (n: number, cur = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: cur, minimumFractionDigits: 2 }).format(n);

export const fmtDate = (s: string) =>
  new Date(s.replace(" ", "T") + "Z").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
export const fmtDateTime = (s: string) =>
  new Date(s.replace(" ", "T") + "Z").toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

/** Only allow same-site relative redirects after login. */
export const safeNext = (n: string | null | undefined) => (n && n.startsWith("/dashboard") && !n.startsWith("//") ? n : "/dashboard");
