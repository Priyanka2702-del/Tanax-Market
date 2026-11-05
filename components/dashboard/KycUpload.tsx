"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Alert, SelectField, SubmitButton } from "@/components/ui/Form";
import { KYC_DOC_TYPES, KYC_MAX_BYTES } from "@/lib/validation";

export default function KycUpload() {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  function pick(f: File | null) {
    setFile(f);
    if (f && f.size > KYC_MAX_BYTES) setErrors((e) => ({ ...e, file: "File is too large (max 5 MB)" }));
    else setErrors((e) => ({ ...e, file: "" }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setMsg(null);
    const fe: Record<string, string> = {};
    if (!docType) fe.docType = "Select a document type";
    if (!file) fe.file = "Choose a file to upload";
    else if (file.size > KYC_MAX_BYTES) fe.file = "File is too large (max 5 MB)";
    setErrors(fe);
    if (Object.keys(fe).length) return;
    setLoading(true);
    const body = new FormData();
    body.set("docType", docType); body.set("file", file!);
    try {
      const res = await fetch("/api/kyc", { method: "POST", body });
      const data = await res.json();
      if (data.ok) { setMsg({ kind: "success", text: data.message }); setFile(null); setDocType(""); if (input.current) input.current.value = ""; router.refresh(); }
      else { setErrors(data.fieldErrors ?? {}); setMsg({ kind: "error", text: data.message ?? "Upload failed." }); }
    } catch { setMsg({ kind: "error", text: "Network error. Please try again." }); }
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {msg && <Alert kind={msg.kind}>{msg.text}</Alert>}
      <SelectField label="Document type" value={docType} onChange={(e) => setDocType(e.target.value)} error={errors.docType}>
        <option value="">Select a document</option>
        {KYC_DOC_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
      </SelectField>
      <div>
        <label htmlFor="kyc-file" className={`flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition hover:border-brand hover:bg-brand-light/40 ${errors.file ? "border-red-400" : "border-gray-300"}`}>
          <UploadCloud size={28} className="text-brand" />
          <span className="mt-2 text-sm font-semibold text-ink">{file ? file.name : "Click to choose a file"}</span>
          <span className="text-xs text-ink-soft">PDF, JPG or PNG · max 5 MB</span>
        </label>
        <input ref={input} id="kyc-file" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" className="sr-only" onChange={(e) => pick(e.target.files?.[0] ?? null)} />
        {errors.file && <p role="alert" className="mt-1.5 text-[13px] font-medium text-red-600">{errors.file}</p>}
      </div>
      <SubmitButton loading={loading}>{loading ? "Uploading…" : "Upload document"}</SubmitButton>
    </form>
  );
}
