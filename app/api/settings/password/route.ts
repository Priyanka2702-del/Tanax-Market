import { hashPassword, revokeOtherSessions, verifyPassword } from "@/lib/server/auth";
import { authed, fail, ok, rateLimit, readJson, zodFail } from "@/lib/server/http";
import { addNotification, updatePasswordHash } from "@/lib/server/queries";
import { changePasswordSchema } from "@/lib/validation";

export const PUT = authed(async ({ req, user }) => {
  const parsed = changePasswordSchema.safeParse(await readJson(req));
  if (!parsed.success) return zodFail(parsed.error);
  if (!rateLimit(`chpw:${user.id}`, 6, 15 * 60 * 1000)) return fail("Too many attempts. Please try again later.", 429);
  if (!(await verifyPassword(parsed.data.currentPassword, user.password_hash))) {
    return fail("Please correct the highlighted fields.", 422, { currentPassword: "Current password is incorrect" });
  }
  updatePasswordHash(user.id, await hashPassword(parsed.data.newPassword));
  revokeOtherSessions(user.id);
  addNotification(user.id, "Password changed", "Your password was changed. Other devices have been signed out.");
  return ok({ message: "Password changed. Other devices have been signed out." });
});
