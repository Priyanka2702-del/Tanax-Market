import { createSession, hashPassword } from "@/lib/server/auth";
import { clientIp, fail, ok, publicRoute, rateLimit, readJson, zodFail } from "@/lib/server/http";
import { createUser, findUserByEmail } from "@/lib/server/queries";
import { registerSchema } from "@/lib/validation";

export const POST = publicRoute(async (req) => {
  if (!rateLimit(`reg:${clientIp(req)}`, 10, 60 * 60 * 1000)) return fail("Too many attempts. Please try again later.", 429);
  const parsed = registerSchema.safeParse(await readJson(req));
  if (!parsed.success) return zodFail(parsed.error);
  const d = parsed.data;
  if (findUserByEmail(d.email)) return fail("Please correct the highlighted fields.", 409, { email: "An account with this email already exists" });
  const user = createUser({
    firstName: d.firstName, lastName: d.lastName, email: d.email, phone: `${d.dialCode} ${d.phone}`,
    country: d.country, dateOfBirth: d.dateOfBirth, passwordHash: await hashPassword(d.password),
  });
  createSession(user.id, false); // registration signs the user straight in -> dashboard
  return ok({ redirect: "/dashboard", clientId: user.client_id }, 201);
});
