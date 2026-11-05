/** Sends email via Resend's HTTP API when configured; otherwise logs to the server console (development). */
export async function sendMail(to: string, subject: string, text: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`\n[mail:dev] To: ${to}\n[mail:dev] Subject: ${subject}\n${text}\n`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.MAIL_FROM || "Tenex Market <no-reply@example.com>", to, subject, text }),
  });
  if (!res.ok) console.error("[mail] Resend error", res.status, await res.text());
}
