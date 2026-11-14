import { CheckCircle2, Circle, FileText } from "lucide-react";
import KycUpload from "@/components/dashboard/KycUpload";
import { Card, EmptyState, PageHeader, StatusBadge, Table, Td } from "@/components/dashboard/ui";
import { fmtDateTime } from "@/lib/client";
import { requireUser } from "@/lib/server/auth";
import { listKycDocs } from "@/lib/server/queries";
import { KYC_DOC_TYPES } from "@/lib/validation";

export default function VerificationPage() {
  const user = requireUser();
  const docs = listKycDocs(user.id);
  const has = (pred: (t: string) => boolean, status?: string) => docs.some((d) => pred(d.doc_type) && (!status || d.status === status));
  const steps = [
    { label: "Identity document", text: "Passport, national ID or driver's licence", sent: has((t) => t !== "proof_of_address"), approved: has((t) => t !== "proof_of_address", "approved") },
    { label: "Proof of address", text: "Utility bill or bank statement (< 3 months)", sent: has((t) => t === "proof_of_address"), approved: has((t) => t === "proof_of_address", "approved") },
  ];
  const labelOf = (id: string) => KYC_DOC_TYPES.find((t) => t.id === id)?.label ?? id;
  return (
    <>
      <PageHeader title="Verification / KYC" text="Verify your identity to enable withdrawals and full account access." action={<StatusBadge status={user.kyc_status} label={user.kyc_status === "verified" ? "Verified" : undefined} />} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Verification steps" className="h-fit">
          <ol className="space-y-5">
            {steps.map((s) => (
              <li key={s.label} className="flex gap-3">
                {s.approved ? <CheckCircle2 className="mt-0.5 shrink-0 text-green-600" size={20} /> : <Circle className={`mt-0.5 shrink-0 ${s.sent ? "text-amber-500" : "text-gray-300"}`} size={20} />}
                <div><p className="text-sm font-bold text-ink">{s.label}</p><p className="text-xs text-ink-soft">{s.text}</p>
                  <p className="mt-1 text-xs font-semibold text-ink-soft">{s.approved ? "Approved" : s.sent ? "Submitted — awaiting review" : "Not submitted"}</p></div>
              </li>
            ))}
          </ol>
          <p className="mt-6 border-t border-gray-100 pt-4 text-xs leading-relaxed text-ink-soft">Documents must be clear, in colour, and show your full name. Files are stored privately and only used for compliance checks.</p>
        </Card>
        <Card title="Upload a document" className="lg:col-span-2"><KycUpload /></Card>
      </div>
      <Card title="Document submissions" className="mt-6" pad={false}>
        {docs.length === 0 ? <EmptyState icon={FileText} title="No documents submitted" text="Upload your identity document and proof of address above." /> : (
          <Table head={["Document", "File", "Submitted", "Status"]}>
            {docs.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50/70">
                <Td className="font-semibold">{labelOf(d.doc_type).split(" (")[0]}</Td>
                <Td><a href={`/api/kyc/${d.id}`} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">{d.original_name}</a></Td>
                <Td className="text-ink-soft">{fmtDateTime(d.created_at)}</Td>
                <Td><StatusBadge status={d.status} /></Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </>
  );
}
