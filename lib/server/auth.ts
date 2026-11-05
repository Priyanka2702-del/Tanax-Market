import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/server/db";
import type { User } from "@/lib/server/queries";

export const SESSION_COOKIE = "tm_session";
const DAY = 24 * 60 * 60 * 1000;

export const hashPassword = (p: string) => bcrypt.hash(p, 12);
export const verifyPassword = (p: string, hash: string) => bcrypt.compare(p, hash);
export const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");
export const newToken = () => randomBytes(32).toString("base64url");

// Pre-computed hash so login timing is similar whether or not the user exists
export const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

/** Creates a DB session and sets the httpOnly cookie. Call only from route handlers. */
export function createSession(userId: number, remember: boolean) {
  const token = newToken();
  const ttl = remember ? 30 * DAY : 1 * DAY;
  getDb().prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)").run(sha256(token), userId, Date.now() + ttl);
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && !(process.env.APP_URL || "").startsWith("http://"),
    path: "/",
    ...(remember ? { maxAge: ttl / 1000 } : {}), // session cookie when "remember me" is off
  });
}

export function destroySession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) getDb().prepare("DELETE FROM sessions WHERE token_hash = ?").run(sha256(token));
  cookies().set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
}

/** Returns the signed-in user or null. Safe to call from server components. */
export function getCurrentUser(): User | null {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const db = getDb();
  const row = db
    .prepare(
      `SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > ?`,
    )
    .get(sha256(token), Date.now()) as User | undefined;
  return row ?? null;
}

/** For server components inside the portal: returns the user or redirects to /login (never null). */
export function requireUser(): User {
  const user = getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export function revokeOtherSessions(userId: number) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  getDb().prepare("DELETE FROM sessions WHERE user_id = ? AND token_hash != ?").run(userId, token ? sha256(token) : "");
}

export function purgeExpired() {
  const db = getDb();
  db.prepare("DELETE FROM sessions WHERE expires_at < ?").run(Date.now());
  db.prepare("DELETE FROM password_resets WHERE expires_at < ?").run(Date.now());
}
