import { authed, fail, ok, readJson, zodFail } from "@/lib/server/http";
import { BusinessError, createDeposit } from "@/lib/server/queries";
import { DEPOSIT_METHODS, depositSchema } from "@/lib/validation";

export const POST = authed(async ({ req, user }) => {
  const parsed = depositSchema.safeParse(await readJson(req));
  if (!parsed.success) return zodFail(parsed.error);
  const d = parsed.data;
  const m = DEPOSIT_METHODS.find((x) => x.id === d.method)!;
  if (d.amount < m.min || d.amount > m.max) return fail("Please correct the highlighted fields.", 422, { amount: `Amount for ${m.label} must be between ${m.min} and ${m.max}` });
  try {
    const tx = createDeposit(user.id, { accountId: d.accountId, method: m.label, amount: d.amount });
    return ok({ message: `Deposit request ${tx.reference} submitted. It will be credited once the payment is confirmed.`, reference: tx.reference }, 201);
  } catch (e) {
    if (e instanceof BusinessError) return fail(e.message, 409);
    throw e;
  }
});
