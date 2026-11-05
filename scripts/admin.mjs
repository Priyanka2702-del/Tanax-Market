#!/usr/bin/env node
/**
 * Back-office helper for the client portal (there is no admin web UI yet).
 * Usage: npm run admin -- <command> [args]
 *   tx:list [pending|completed|rejected]    list transactions
 *   tx:approve <REFERENCE>                  complete a deposit (credits balance) or withdrawal (debits balance)
 *   tx:reject <REFERENCE>                   reject a pending transaction
 *   kyc:list                                list KYC documents
 *   kyc:approve <DOC_ID>                    approve a document (user becomes "verified" once ID + address are approved)
 *   kyc:reject <DOC_ID>
 *   ticket:list | ticket:resolve <TCK_REF>
 *   user:list
 */
import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

for (const f of [".env.local", ".env"]) {
  if (fs.existsSync(f)) for (const l of fs.readFileSync(f, "utf8").split("\n")) {
    const m = l.match(/^\s*([A-Z_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
  }
}
const file = path.resolve(process.env.DATABASE_PATH || "./data/tenex.db");
if (!fs.existsSync(file)) { console.error(`Database not found at ${file}. Start the app once (or register a user) first.`); process.exit(1); }
const db = new Database(file);
db.pragma("foreign_keys = ON");
const [cmd, arg] = process.argv.slice(2);

function notify(userId, title, body) { db.prepare("INSERT INTO notifications (user_id,title,body) VALUES (?,?,?)").run(userId, title, body); }
function refreshKyc(userId) {
  const docs = db.prepare("SELECT * FROM kyc_documents WHERE user_id=?").all(userId);
  const ok = (f) => docs.some((d) => d.status === "approved" && f(d.doc_type));
  let status = docs.length ? "pending" : "not_submitted";
  if (docs.length && docs.every((d) => d.status === "rejected")) status = "rejected";
  if (ok((t) => t !== "proof_of_address") && ok((t) => t === "proof_of_address")) status = "verified";
  db.prepare("UPDATE users SET kyc_status=? WHERE id=?").run(status, userId);
  return status;
}

switch (cmd) {
  case "user:list":
    console.table(db.prepare("SELECT id, client_id, email, country, kyc_status, created_at FROM users").all()); break;
  case "tx:list":
    console.table(db.prepare(`SELECT t.reference, u.email, t.type, t.method, t.amount, t.currency, t.status, t.created_at FROM transactions t JOIN users u ON u.id=t.user_id ${arg ? "WHERE t.status=?" : ""} ORDER BY t.id DESC`).all(...(arg ? [arg] : []))); break;
  case "tx:approve":
  case "tx:reject": {
    const tx = db.prepare("SELECT * FROM transactions WHERE reference=?").get(arg);
    if (!tx) { console.error("Transaction not found"); process.exit(1); }
    if (tx.status !== "pending") { console.error(`Transaction is already ${tx.status}`); process.exit(1); }
    db.transaction(() => {
      if (cmd === "tx:approve") {
        if (tx.type === "deposit") db.prepare("UPDATE trading_accounts SET balance=balance+? WHERE id=?").run(tx.amount, tx.account_id);
        else {
          const acc = db.prepare("SELECT balance FROM trading_accounts WHERE id=?").get(tx.account_id);
          if (!acc || acc.balance < tx.amount) throw new Error("Insufficient account balance for this withdrawal");
          db.prepare("UPDATE trading_accounts SET balance=balance-? WHERE id=?").run(tx.amount, tx.account_id);
        }
      }
      db.prepare("UPDATE transactions SET status=? WHERE id=?").run(cmd === "tx:approve" ? "completed" : "rejected", tx.id);
      notify(tx.user_id, `${tx.type === "deposit" ? "Deposit" : "Withdrawal"} ${cmd === "tx:approve" ? "completed" : "rejected"}`, `${tx.reference}: ${tx.amount.toFixed(2)} ${tx.currency}`);
    })();
    console.log(`${tx.reference} -> ${cmd === "tx:approve" ? "completed" : "rejected"}`); break;
  }
  case "kyc:list":
    console.table(db.prepare("SELECT k.id, u.email, k.doc_type, k.original_name, k.status, k.created_at FROM kyc_documents k JOIN users u ON u.id=k.user_id ORDER BY k.id DESC").all()); break;
  case "kyc:approve":
  case "kyc:reject": {
    const d = db.prepare("SELECT * FROM kyc_documents WHERE id=?").get(arg);
    if (!d) { console.error("Document not found"); process.exit(1); }
    db.prepare("UPDATE kyc_documents SET status=? WHERE id=?").run(cmd === "kyc:approve" ? "approved" : "rejected", d.id);
    const status = refreshKyc(d.user_id);
    notify(d.user_id, `Document ${cmd === "kyc:approve" ? "approved" : "rejected"}`, status === "verified" ? "Your account is now fully verified." : "Your verification document was reviewed.");
    console.log(`Document ${d.id} -> ${cmd === "kyc:approve" ? "approved" : "rejected"}; user verification: ${status}`); break;
  }
  case "ticket:list":
    console.table(db.prepare("SELECT t.reference, u.email, t.category, t.subject, t.status, t.created_at FROM tickets t JOIN users u ON u.id=t.user_id ORDER BY t.id DESC").all()); break;
  case "ticket:resolve":
    console.log(db.prepare("UPDATE tickets SET status='resolved' WHERE reference=?").run(arg).changes ? "Resolved" : "Ticket not found"); break;
  default:
    console.log(fs.readFileSync(new URL(import.meta.url), "utf8").split("*/")[0].replace("#!/usr/bin/env node\n/**", "").replace(/^ \* ?/gm, ""));
}
