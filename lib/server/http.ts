import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import { getCurrentUser } from "@/lib/server/auth";
import type { User } from "@/lib/server/queries";

export type FieldErrors = Record<string, string>;

export const ok = <T extends object>(data: T = {} as T, status = 200) => NextResponse.json({ ok: true, ...data }, { status });
export const fail = (message: string, status = 400, fieldErrors?: FieldErrors) =>
  NextResponse.json({ ok: false, message, fieldErrors }, { status });

export function zodFail(err: ZodError) {
  const fieldErrors: FieldErrors = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "_";
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fail("Please correct the highlighted fields.", 422, fieldErrors);
}

/** Basic CSRF defence for cookie-authenticated POSTs: Origin must match Host. */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser clients / same-origin GET-style navigations
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

export async function readJson(req: Request): Promise<unknown | null> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

type Handler = (ctx: { req: Request; user: User }) => Promise<Response> | Response;

/** Wraps a route handler: origin check + authentication + error boundary. */
export function authed(handler: Handler) {
  return async (req: Request) => {
    try {
      if (!sameOrigin(req)) return fail("Invalid request origin.", 403);
      const user = getCurrentUser();
      if (!user) return fail("Your session has expired. Please sign in again.", 401);
      return await handler({ req, user });
    } catch (e) {
      console.error("[api]", e);
      return fail("Something went wrong. Please try again.", 500);
    }
  };
}

export function publicRoute(handler: (req: Request) => Promise<Response> | Response) {
  return async (req: Request) => {
    try {
      if (!sameOrigin(req)) return fail("Invalid request origin.", 403);
      return await handler(req);
    } catch (e) {
      console.error("[api]", e);
      return fail("Something went wrong. Please try again.", 500);
    }
  };
}

// Tiny in-memory rate limiter (per server instance). Use Redis/Upstash for multi-instance deployments.
const hits = new Map<string, { n: number; reset: number }>();
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const h = hits.get(key);
  if (!h || h.reset < now) {
    hits.set(key, { n: 1, reset: now + windowMs });
    return true;
  }
  h.n++;
  return h.n <= max;
}
export const clientIp = (req: Request) => (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
