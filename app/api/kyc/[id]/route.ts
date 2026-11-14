import fs from "node:fs";
import path from "node:path";
import { getCurrentUser } from "@/lib/server/auth";
import { getKycDoc } from "@/lib/server/queries";
import { uploadRoot } from "@/lib/server/uploads";

export const runtime = "nodejs";

/** Authenticated download: a user can only fetch their own documents. */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const user = getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const doc = getKycDoc(user.id, Number(params.id));
  if (!doc) return new Response("Not found", { status: 404 });
  const file = path.join(uploadRoot(), String(user.id), path.basename(doc.stored_name));
  if (!fs.existsSync(file)) return new Response("Not found", { status: 404 });
  return new Response(fs.readFileSync(file), {
    headers: { "Content-Type": doc.mime, "Content-Disposition": `inline; filename="${doc.original_name}"`, "X-Content-Type-Options": "nosniff", "Cache-Control": "private, no-store" },
  });
}
