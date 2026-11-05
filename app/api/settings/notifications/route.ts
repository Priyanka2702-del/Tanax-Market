import { authed, ok, readJson, zodFail } from "@/lib/server/http";
import { updateNotificationPrefs } from "@/lib/server/queries";
import { notificationPrefsSchema } from "@/lib/validation";

export const PUT = authed(async ({ req, user }) => {
  const parsed = notificationPrefsSchema.safeParse(await readJson(req));
  if (!parsed.success) return zodFail(parsed.error);
  updateNotificationPrefs(user.id, parsed.data);
  return ok({ message: "Notification preferences saved." });
});
