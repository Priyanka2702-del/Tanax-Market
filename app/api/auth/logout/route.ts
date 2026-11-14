import { destroySession } from "@/lib/server/auth";
import { ok, publicRoute } from "@/lib/server/http";

export const POST = publicRoute(() => {
  destroySession();
  return ok({ redirect: "/login" });
});
