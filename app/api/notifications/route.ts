import { authed, ok } from "@/lib/server/http";
import { markNotificationsRead } from "@/lib/server/queries";

export const POST = authed(({ user }) => {
  markNotificationsRead(user.id);
  return ok();
});
