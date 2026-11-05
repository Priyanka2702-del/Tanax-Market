import { newToken, sha256 } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";
import { clientIp, fail, ok, publicRoute, rateLimit, readJson, zodFail } from "@/lib/server/http";
import { sendMail } from "@/lib/server/mailer";
import { findUserByEmail } from "@/lib/server/queries";
import { forgotSchema } from "@/lib/validation";

export const POST = publicRoute(async (req) => {
  const parsed = forgotSchema.safeParse(await readJson(req));
  if (!parsed.success) return zodFail(parsed.error);
  if (!rateLimit(`forgot:${clientIp(req)}`, 5, 60 * 60 * 1000)) return fail("Too many requests. Please try again later.", 429);
  const user = findUserByEmail(parsed.data.email);
  if (user) {
    const token = newToken();
    const db = getDb();
    db.prepare("DELETE FROM password_resets WHERE user_id = ?").run(user.id);
    db.prepare("INSERT INTO password_resets (token_hash, user_id, expires_at) VALUES (?,?,?)").run(sha256(token), user.id, Date.now() + 60 * 60 * 1000);
    const base = process.env.APP_URL || new URL(req.url).origin;
    await sendMail(
      user.email,
      "Reset your Tenex Market password",
      `Hi ${user.first_name},\n\nUse the link below to choose a new password. It expires in 1 hour.\n\n${base}/reset-password?token=${token}\n\nIf you did not request this, you can ignore this email.`,
    );
  }
  // Same response whether or not the account exists (prevents email enumeration)
  return ok({ message: "If an account exists for that email, a reset link has been sent." });
});
