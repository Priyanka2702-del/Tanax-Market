import { authed, fail, ok, readJson, zodFail } from "@/lib/server/http";
import { BusinessError, createWithdrawal } from "@/lib/server/queries";
import { WITHDRAW_METHODS, withdrawSchema } from "@/lib/validation";

export const POST = authed(async ({ req, user }) => {
  const parsed = withdrawSchema.safeParse(await readJson(req));
  if (!parsed.success) return zodFail(parsed.error);
  const d = parsed.data;
  const m = WITHDRAW_METHODS.find((x) => x.id === d.method)!;
  if (d.amount < m.min) return fail("Please correct the highlighted fields.", 422, { amount: `Minimum withdrawal for ${m.label} is ${m.min}` });
  try {
    const tx = createWithdrawal(user, { accountId: d.accountId, method: m.label, amount: d.amount, details: d.details });
    return ok({ message: `Withdrawal request ${tx.reference} submitted for review.`, reference: tx.reference }, 201);
  } catch (e) {
    if (e instanceof BusinessError) return fail(e.message, 409);
    throw e;
  }
});
