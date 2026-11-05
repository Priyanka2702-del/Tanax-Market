import fs from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { authed, fail, ok, rateLimit } from "@/lib/server/http";
import { addKycDoc, listKycDocs } from "@/lib/server/queries";
import { uploadRoot } from "@/lib/server/uploads";
import { KYC_DOC_TYPES, KYC_MAX_BYTES } from "@/lib/validation";

export const runtime = "nodejs";


/** Detects the real file type from its magic bytes (never trust the browser-supplied MIME). */
function sniff(buf: Buffer): { mime: string; ext: string } | null {
  if (buf.length > 4 && buf.subarray(0, 4).toString("latin1") === "%PDF") return { mime: "application/pdf", ext: "pdf" };
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { mime: "image/jpeg", ext: "jpg" };
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { mime: "image/png", ext: "png" };
  return null;
}

export const POST = authed(async ({ req, user }) => {
  if (!rateLimit(`kyc:${user.id}`, 12, 60 * 60 * 1000)) return fail("Too many uploads. Please try again later.", 429);
  const form = await req.formData().catch(() => null);
  if (!form) return fail("Invalid upload.", 400);
  const docType = String(form.get("docType") || "");
  const file = form.get("file");
  if (!KYC_DOC_TYPES.some((t) => t.id === docType)) return fail("Select a document type.", 422, { docType: "Select a document type" });
  if (!(file instanceof File) || file.size === 0) return fail("Choose a file to upload.", 422, { file: "Choose a file to upload" });
  if (file.size > KYC_MAX_BYTES) return fail("File is too large (max 5 MB).", 422, { file: "File is too large (max 5 MB)" });
  const buf = Buffer.from(await file.arrayBuffer());
  const kind = sniff(buf);
  if (!kind) return fail("Only PDF, JPG or PNG files are accepted.", 422, { file: "Only PDF, JPG or PNG files are accepted" });

  const dir = path.join(uploadRoot(), String(user.id));
  fs.mkdirSync(dir, { recursive: true });
  const stored = `${Date.now()}-${randomBytes(8).toString("hex")}.${kind.ext}`;
  fs.writeFileSync(path.join(dir, stored), buf, { mode: 0o600 });
  const safeName = path.basename(file.name).replace(/[^\w.\- ]/g, "_").slice(0, 120) || `document.${kind.ext}`;
  addKycDoc(user.id, { docType, originalName: safeName, storedName: stored, mime: kind.mime, size: buf.length });
  return ok({ message: "Document uploaded. Review usually takes 1–2 business days.", count: listKycDocs(user.id).length }, 201);
});
