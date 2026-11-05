import { DUMMY_HASH, createSession, purgeExpired, verifyPassword } from "@/lib/server/auth";
import { clientIp, fail, ok, publicRoute, rateLimit, readJson, zodFail } from "@/lib/server/http";
import { findUserByIdentifier } from "@/lib/server/queries";
import { loginSchema } from "@/lib/validation";

export const POST = publicRoute(async (req) => {
  const parsed = loginSchema.safeParse(await readJson(req));
  if (!parsed.success) return zodFail(parsed.error);
  const { identifier, password, remember } = parsed.data;
  if (!rateLimit(`login:${clientIp(req)}:${identifier.toLowerCase()}`, 8, 15 * 60 * 1000)) {
    return fail("Too many failed attempts. Please wait 15 minutes and try again.", 429);
  }
  const user = findUserByIdentifier(identifier);
  const valid = await verifyPassword(password, user?.password_hash ?? DUMMY_HASH);
  if (!user || !valid) return fail("Incorrect email / Client ID or password.", 401);
  purgeExpired();
  createSession(user.id, !!remember);
  return ok({ redirect: "/dashboard" });
});
