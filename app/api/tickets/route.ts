import { authed, ok, rateLimit, fail, readJson, zodFail } from "@/lib/server/http";
import { createTicket } from "@/lib/server/queries";
import { ticketSchema } from "@/lib/validation";

export const POST = authed(async ({ req, user }) => {
  const parsed = ticketSchema.safeParse(await readJson(req));
  if (!parsed.success) return zodFail(parsed.error);
  if (!rateLimit(`ticket:${user.id}`, 10, 60 * 60 * 1000)) return fail("You are sending requests too quickly. Please try again later.", 429);
  const t = createTicket(user.id, parsed.data);
  return ok({ message: `Ticket ${t.reference} created. Our team will reply by email.`, reference: t.reference }, 201);
});
