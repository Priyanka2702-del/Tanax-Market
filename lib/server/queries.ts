import { randomInt } from "node:crypto";
import { getDb } from "@/lib/server/db";

export interface User {
  id: number; client_id: string; first_name: string; last_name: string; email: string; phone: string;
  country: string; date_of_birth: string; address: string; city: string; password_hash: string;
  kyc_status: "not_submitted" | "pending" | "verified" | "rejected";
  notify_email: number; notify_deposits: number; notify_marketing: number; created_at: string;
}
export type PublicUser = Omit<User, "password_hash">;
export interface TradingAccount {
  id: number; user_id: number; login: string; type: string; platform: string; currency: string;
  leverage: number; is_demo: number; balance: number; status: string; created_at: string;
}
export interface Transaction {
  id: number; reference: string; user_id: number; account_id: number | null; type: "deposit" | "withdrawal";
  method: string; amount: number; currency: string; status: "pending" | "completed" | "rejected" | "cancelled";
  details: string; created_at: string; account_login?: string | null;
}
export interface KycDoc { id: number; user_id: number; doc_type: string; original_name: string; stored_name: string; mime: string; size: number; status: string; created_at: string }
export interface Ticket { id: number; reference: string; category: string; subject: string; message: string; status: string; created_at: string }
export interface Notification { id: number; title: string; body: string; is_read: number; created_at: string }

const db = () => getDb();
export const toPublic = ({ password_hash: _ph, ...rest }: User): PublicUser => rest;

function uniqueCode(prefix: string, digits: number, table: string, column: string): string {
  for (let i = 0; i < 20; i++) {
    const code = prefix + String(randomInt(10 ** (digits - 1), 10 ** digits));
    if (!db().prepare(`SELECT 1 FROM ${table} WHERE ${column} = ?`).get(code)) return code;
  }
  throw new Error("Could not generate unique code");
}

/* ---------- users ---------- */
export function findUserByIdentifier(identifier: string): User | undefined {
  return db().prepare("SELECT * FROM users WHERE email = ? COLLATE NOCASE OR client_id = ? COLLATE NOCASE").get(identifier, identifier) as User | undefined;
}
export function findUserByEmail(email: string): User | undefined {
  return db().prepare("SELECT * FROM users WHERE email = ? COLLATE NOCASE").get(email) as User | undefined;
}

export interface NewUser {
  firstName: string; lastName: string; email: string; phone: string; country: string; dateOfBirth: string; passwordHash: string;
}
export function createUser(u: NewUser): User {
  const run = db().transaction(() => {
    const clientId = uniqueCode("TM", 7, "users", "client_id");
    const info = db()
      .prepare("INSERT INTO users (client_id, first_name, last_name, email, phone, country, date_of_birth, password_hash) VALUES (?,?,?,?,?,?,?,?)")
      .run(clientId, u.firstName, u.lastName, u.email, u.phone, u.country, u.dateOfBirth, u.passwordHash);
    const id = Number(info.lastInsertRowid);
    createAccount(id, { type: "Standard", leverage: 500, isDemo: false });
    addNotification(id, "Welcome to Tenex Market", "Your account is ready. Complete identity verification to unlock deposits and withdrawals.");
    return id;
  });
  return db().prepare("SELECT * FROM users WHERE id = ?").get(run()) as User;
}

export function updateProfile(id: number, p: { firstName: string; lastName: string; phone: string; country: string; address: string; city: string }) {
  db().prepare("UPDATE users SET first_name=?, last_name=?, phone=?, country=?, address=?, city=? WHERE id=?")
    .run(p.firstName, p.lastName, p.phone, p.country, p.address, p.city, id);
}
export function updatePasswordHash(id: number, hash: string) {
  db().prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hash, id);
}
export function updateNotificationPrefs(id: number, p: { email: boolean; deposits: boolean; marketing: boolean }) {
  db().prepare("UPDATE users SET notify_email=?, notify_deposits=?, notify_marketing=? WHERE id=?").run(+p.email, +p.deposits, +p.marketing, id);
}

/* ---------- trading accounts ---------- */
export function listAccounts(userId: number): TradingAccount[] {
  return db().prepare("SELECT * FROM trading_accounts WHERE user_id = ? ORDER BY is_demo ASC, id ASC").all(userId) as TradingAccount[];
}
export function createAccount(userId: number, a: { type: string; leverage: number; isDemo: boolean }): TradingAccount {
  const login = uniqueCode(a.isDemo ? "9" : "5", 8, "trading_accounts", "login");
  const info = db()
    .prepare("INSERT INTO trading_accounts (user_id, login, type, leverage, is_demo, balance, status) VALUES (?,?,?,?,?,?,?)")
    .run(userId, login, a.type, a.leverage, +a.isDemo, a.isDemo ? 10000 : 0, "active");
  return db().prepare("SELECT * FROM trading_accounts WHERE id = ?").get(info.lastInsertRowid) as TradingAccount;
}
export function getAccount(userId: number, id: number): TradingAccount | undefined {
  return db().prepare("SELECT * FROM trading_accounts WHERE id = ? AND user_id = ?").get(id, userId) as TradingAccount | undefined;
}
export function countLiveAccounts(userId: number): number {
  return (db().prepare("SELECT COUNT(*) c FROM trading_accounts WHERE user_id = ? AND is_demo = 0").get(userId) as { c: number }).c;
}

/* ---------- transactions ---------- */
export function listTransactions(userId: number, opts: { type?: string; limit?: number } = {}): Transaction[] {
  const where = opts.type ? "AND t.type = ?" : "";
  const params: unknown[] = [userId];
  if (opts.type) params.push(opts.type);
  params.push(opts.limit ?? 500);
  return db()
    .prepare(
      `SELECT t.*, a.login AS account_login FROM transactions t LEFT JOIN trading_accounts a ON a.id = t.account_id
       WHERE t.user_id = ? ${where} ORDER BY t.created_at DESC, t.id DESC LIMIT ?`,
    )
    .all(...params) as Transaction[];
}

export class BusinessError extends Error {}

export function createDeposit(userId: number, input: { accountId: number; method: string; amount: number }): Transaction {
  const acc = getAccount(userId, input.accountId);
  if (!acc) throw new BusinessError("Trading account not found.");
  if (acc.is_demo) throw new BusinessError("Demo accounts cannot be funded.");
  const ref = uniqueCode("DEP", 8, "transactions", "reference");
  const info = db()
    .prepare("INSERT INTO transactions (reference, user_id, account_id, type, method, amount, currency, status) VALUES (?,?,?,?,?,?,?,'pending')")
    .run(ref, userId, acc.id, "deposit", input.method, input.amount, acc.currency);
  addNotification(userId, "Deposit request received", `${ref}: your deposit of ${input.amount.toFixed(2)} ${acc.currency} is pending.`);
  return db().prepare("SELECT * FROM transactions WHERE id = ?").get(info.lastInsertRowid) as Transaction;
}

export function pendingWithdrawals(accountId: number): number {
  return (db().prepare("SELECT COALESCE(SUM(amount),0) s FROM transactions WHERE account_id = ? AND type='withdrawal' AND status='pending'").get(accountId) as { s: number }).s;
}

export function createWithdrawal(user: User, input: { accountId: number; method: string; amount: number; details: string }): Transaction {
  const run = db().transaction(() => {
    const acc = getAccount(user.id, input.accountId);
    if (!acc) throw new BusinessError("Trading account not found.");
    if (acc.is_demo) throw new BusinessError("Demo accounts cannot be withdrawn from.");
    if (user.kyc_status !== "verified") throw new BusinessError("Complete identity verification before requesting a withdrawal.");
    const available = acc.balance - pendingWithdrawals(acc.id);
    if (input.amount > available + 1e-9) throw new BusinessError(`Insufficient balance. Available: ${available.toFixed(2)} ${acc.currency}.`);
    const ref = uniqueCode("WDR", 8, "transactions", "reference");
    const info = db()
      .prepare("INSERT INTO transactions (reference, user_id, account_id, type, method, amount, currency, status, details) VALUES (?,?,?,?,?,?,?,'pending',?)")
      .run(ref, user.id, acc.id, "withdrawal", input.method, input.amount, acc.currency, input.details);
    addNotification(user.id, "Withdrawal request received", `${ref}: your withdrawal of ${input.amount.toFixed(2)} ${acc.currency} is pending review.`);
    return db().prepare("SELECT * FROM transactions WHERE id = ?").get(info.lastInsertRowid) as Transaction;
  });
  return run();
}

export interface Summary {
  totalBalance: number; availableBalance: number; totalDeposits: number; totalWithdrawals: number;
  pendingDeposits: number; pendingWithdrawals: number; liveAccounts: number; demoAccounts: number;
  monthly: { label: string; deposits: number; withdrawals: number }[];
}
export function getSummary(userId: number): Summary {
  const accounts = listAccounts(userId);
  const live = accounts.filter((a) => !a.is_demo);
  const sum = (type: string, status: string) =>
    (db().prepare("SELECT COALESCE(SUM(amount),0) s FROM transactions WHERE user_id=? AND type=? AND status=?").get(userId, type, status) as { s: number }).s;
  const totalBalance = live.reduce((s, a) => s + a.balance, 0);
  const pendW = sum("withdrawal", "pending");

  const monthly: Summary["monthly"] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const key = d.toISOString().slice(0, 7);
    const row = db()
      .prepare(
        `SELECT COALESCE(SUM(CASE WHEN type='deposit' THEN amount END),0) d, COALESCE(SUM(CASE WHEN type='withdrawal' THEN amount END),0) w
         FROM transactions WHERE user_id=? AND status='completed' AND substr(created_at,1,7)=?`,
      )
      .get(userId, key) as { d: number; w: number };
    monthly.push({ label: d.toLocaleString("en", { month: "short", timeZone: "UTC" }), deposits: row.d, withdrawals: row.w });
  }
  return {
    totalBalance, availableBalance: Math.max(0, totalBalance - pendW),
    totalDeposits: sum("deposit", "completed"), totalWithdrawals: sum("withdrawal", "completed"),
    pendingDeposits: sum("deposit", "pending"), pendingWithdrawals: pendW,
    liveAccounts: live.length, demoAccounts: accounts.length - live.length, monthly,
  };
}

/* ---------- KYC ---------- */
export function listKycDocs(userId: number): KycDoc[] {
  return db().prepare("SELECT * FROM kyc_documents WHERE user_id = ? ORDER BY id DESC").all(userId) as KycDoc[];
}
export function addKycDoc(userId: number, d: { docType: string; originalName: string; storedName: string; mime: string; size: number }) {
  db().transaction(() => {
    db().prepare("INSERT INTO kyc_documents (user_id, doc_type, original_name, stored_name, mime, size) VALUES (?,?,?,?,?,?)")
      .run(userId, d.docType, d.originalName, d.storedName, d.mime, d.size);
    refreshKycStatus(userId);
  })();
  addNotification(userId, "Document received", "Your verification document was uploaded and is awaiting review.");
}
export function getKycDoc(userId: number, id: number): KycDoc | undefined {
  return db().prepare("SELECT * FROM kyc_documents WHERE id = ? AND user_id = ?").get(id, userId) as KycDoc | undefined;
}
/** verified = an approved ID document AND an approved proof of address; pending if anything awaits review. */
export function refreshKycStatus(userId: number) {
  const docs = listKycDocs(userId);
  const approved = (pred: (t: string) => boolean) => docs.some((d) => d.status === "approved" && pred(d.doc_type));
  let status = "not_submitted";
  if (docs.length) status = "pending";
  if (docs.length && docs.every((d) => d.status === "rejected")) status = "rejected";
  if (approved((t) => t !== "proof_of_address") && approved((t) => t === "proof_of_address")) status = "verified";
  db().prepare("UPDATE users SET kyc_status = ? WHERE id = ?").run(status, userId);
}

/* ---------- tickets ---------- */
export function listTickets(userId: number): Ticket[] {
  return db().prepare("SELECT * FROM tickets WHERE user_id = ? ORDER BY id DESC").all(userId) as Ticket[];
}
export function createTicket(userId: number, t: { category: string; subject: string; message: string }): Ticket {
  const ref = uniqueCode("TCK", 7, "tickets", "reference");
  const info = db().prepare("INSERT INTO tickets (reference, user_id, category, subject, message) VALUES (?,?,?,?,?)").run(ref, userId, t.category, t.subject, t.message);
  return db().prepare("SELECT * FROM tickets WHERE id = ?").get(info.lastInsertRowid) as Ticket;
}

/* ---------- notifications ---------- */
export function addNotification(userId: number, title: string, body: string) {
  db().prepare("INSERT INTO notifications (user_id, title, body) VALUES (?,?,?)").run(userId, title, body);
}
export function listNotifications(userId: number, limit = 8): Notification[] {
  return db().prepare("SELECT id,title,body,is_read,created_at FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT ?").all(userId, limit) as Notification[];
}
export function markNotificationsRead(userId: number) {
  db().prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?").run(userId);
}
