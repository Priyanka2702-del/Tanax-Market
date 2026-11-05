import { authed, ok, readJson, zodFail } from "@/lib/server/http";
import { updateProfile } from "@/lib/server/queries";
import { profileSchema } from "@/lib/validation";

export const PUT = authed(async ({ req, user }) => {
  const parsed = profileSchema.safeParse(await readJson(req));
  if (!parsed.success) return zodFail(parsed.error);
  const d = parsed.data;
  updateProfile(user.id, { firstName: d.firstName, lastName: d.lastName, phone: `${d.dialCode} ${d.phone}`, country: d.country, address: d.address, city: d.city });
  return ok({ message: "Profile updated." });
});
