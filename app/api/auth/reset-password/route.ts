import { hashPassword, sha256 } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";
import { fail, ok, publicRoute, readJson, zodFail } from "@/lib/server/http";
import { addNotification, updatePasswordHash } from "@/lib/server/queries";
import { resetSchema } from "@/lib/validation";

export const POST = publicRoute(async (req) => {
  const parsed = resetSchema.safeParse(await readJson(req));
  if (!parsed.success) return zodFail(parsed.error);
  const db = getDb();
  const row = db
    .prepare("SELECT user_id FROM password_resets WHERE token_hash = ? AND used = 0 AND expires_at > ?")
    .get(sha256(parsed.data.token), Date.now()) as { user_id: number } | undefined;
  if (!row) return fail("This reset link is invalid or has expired. Please request a new one.", 400);
  const hash = await hashPassword(parsed.data.password);
  db.transaction(() => {
    updatePasswordHash(row.user_id, hash);
    db.prepare("UPDATE password_resets SET used = 1 WHERE token_hash = ?").run(sha256(parsed.data.token));
    db.prepare("DELETE FROM sessions WHERE user_id = ?").run(row.user_id); // sign out everywhere
    addNotification(row.user_id, "Password changed", "Your password was reset. If this wasn't you, contact support immediately.");
  })();
  return ok({ message: "Password updated. You can now sign in." });
});
