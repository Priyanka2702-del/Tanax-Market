import { authed, fail, ok, readJson, zodFail } from "@/lib/server/http";
import { countLiveAccounts, createAccount, listAccounts } from "@/lib/server/queries";
import { createAccountSchema } from "@/lib/validation";

export const POST = authed(async ({ req, user }) => {
  const parsed = createAccountSchema.safeParse(await readJson(req));
  if (!parsed.success) return zodFail(parsed.error);
  const d = parsed.data;
  if (!d.isDemo && countLiveAccounts(user.id) >= 5) return fail("You can have up to 5 live trading accounts.", 409);
  if (d.isDemo && listAccounts(user.id).filter((a) => a.is_demo).length >= 2) return fail("You can have up to 2 demo accounts.", 409);
  const acc = createAccount(user.id, d);
  return ok({ message: `Account ${acc.login} created.`, account: { id: acc.id, login: acc.login } }, 201);
});
