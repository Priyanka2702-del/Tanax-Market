# Tenex Market – Public website + Client Portal

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Lucide.
The original marketing site is unchanged. This release adds **Open Account, Log In, Forgot/Reset Password** and a private **Client Portal** (`/dashboard`).

## Quick start
```bash
npm install
cp .env.example .env.local      # optional – every variable has a sensible default
npm run dev                     # http://localhost:3000
```
Production: `npm run build && npm start`. Checks: `npm run typecheck`, `npm run lint`.

Requires **Node.js 18.17+** (tested on Node 22). `better-sqlite3` ships prebuilt binaries for common platforms; if your platform needs a compile step you will need a C/C++ toolchain.

## Pages
| Route | Purpose |
|---|---|
| `/` | Existing public website (only the *Open Account* / *Log In* / *Get Started* buttons now link to `/register` and `/login`) |
| `/register` | Open Account form (validation, password-strength meter, country + phone code, 18+ check) |
| `/login` | Email **or** Client ID + password, remember me, forgot password |
| `/forgot-password`, `/reset-password?token=…` | Password reset flow |
| `/dashboard` | Overview: balances, deposits/withdrawals totals, accounts, 6-month chart, recent transactions |
| `/dashboard/profile` · `accounts` · `deposit` · `withdraw` · `transactions` · `platforms` · `verification` · `support` · `settings` | Portal sections. Logout is in the sidebar and profile menu |

The public site and portal use separate layouts. Portal pages are `noindex`.

## Environment variables (`.env.example`)
| Variable | Default | Description |
|---|---|---|
| `DATABASE_PATH` | `./data/tenex.db` | SQLite file; created and migrated automatically on first request |
| `UPLOAD_DIR` | `./storage/kyc` | KYC uploads – stored outside `/public`, served only through the authenticated `/api/kyc/:id` route |
| `APP_URL` | request origin | Public site URL used in password-reset emails. Use `https://…` in production (cookies are `Secure` unless this is `http://`) |
| `RESEND_API_KEY`, `MAIL_FROM` | empty | Optional. If set, reset emails are sent through [Resend](https://resend.com). If empty, the reset link is **printed in the server console** (development) |
| `MT5_SERVER` | `TenexMarket-Live` | Server name shown on the Trading Platforms page |

## Database
No setup commands are needed: SQLite is created at `DATABASE_PATH` with tables `users, sessions, password_resets, trading_accounts, transactions, kyc_documents, tickets, notifications` (see `lib/server/db.ts`). Back up the `data/` and `storage/` folders.
All data access lives in `lib/server/queries.ts`, so moving to PostgreSQL/MySQL later means replacing that layer only.

> **Hosting note:** SQLite needs a persistent disk (VPS, Docker volume, Railway/Fly volume). It will **not** persist on serverless hosts such as Vercel – swap the DB layer for a hosted database there.

## Security design
- Passwords hashed with **bcrypt (cost 12)**; never stored or logged in plain text. Strength rules enforced on client **and** server (zod).
- Sessions: random 256-bit token in an **HttpOnly, SameSite=Lax** cookie (`Secure` in production); only its SHA-256 hash is stored server-side. "Remember me" = 30 days, otherwise 1 day / browser session. Logout deletes the session; changing or resetting a password signs out other devices.
- Protected routes: `middleware.ts` blocks `/dashboard/*` without a cookie, and the portal layout/pages **and every API route** validate the session against the database.
- Reset tokens are single-use, expire in 1 hour, stored hashed; the forgot-password response never reveals whether an email exists.
- Login/registration/reset/ticket endpoints are rate-limited (in-memory – use Redis/Upstash if you run several instances). Cross-origin POSTs are rejected.
- KYC uploads: PDF/JPG/PNG only (checked by file signature), max 5 MB, random file names, private storage, owner-only download.
- Registration rejects the restricted jurisdictions listed in the site footer (US, Cuba, Iraq, Myanmar, North Korea, Sudan).

## What is real and what needs your integration
This is a working client portal with real accounts, sessions and data, but it is **not connected to MetaTrader 5 or a payment provider**. Be aware before going live:
1. **Trading accounts**: a first live *Standard / MT5 / USD / 1:500* account is created on sign-up, and clients can add more (or demo accounts). The 8-digit logins are generated locally; creating the real MT5 login and trading password requires the **MetaQuotes Manager/Web API** (or your CRM).
2. **Deposits / withdrawals** are *requests* with status `pending`. Balances only change when a request is approved. There is no payment gateway; connect one (or approve manually, below).
3. **Verification (KYC)**: documents are uploaded and listed; a person (or KYC vendor) must review them. A user becomes `verified` once an ID document **and** a proof of address are approved. Withdrawals require `verified`.
4. Payment-method lists, limits, account rules (min deposits, leverage caps) are in `lib/validation.ts`.
5. There is no admin web UI. Use the back-office CLI:

```bash
npm run admin -- user:list
npm run admin -- tx:list pending
npm run admin -- tx:approve DEP12345678     # credits (deposit) or debits (withdrawal) the account
npm run admin -- tx:reject  WDR12345678
npm run admin -- kyc:list
npm run admin -- kyc:approve 1              # reviews a document
npm run admin -- ticket:list
npm run admin -- ticket:resolve TCK1234567
```
(`DATABASE_PATH` is read from `.env`/`.env.local` or the environment.) Run it on the server that hosts the database.

## Project structure (new files)
```
app/login · register · forgot-password · reset-password   auth pages
app/dashboard/**                                           portal pages (+ layout with sidebar/topbar)
app/api/**                                                 route handlers (auth, profile, accounts, deposits, withdrawals, kyc, tickets, settings, notifications)
components/auth/*  components/dashboard/*  components/ui/Form.tsx
lib/server/{db,auth,queries,http,mailer,uploads}.ts        server-only code
lib/{validation,countries,client}.ts                        shared validation, country list, fetch helpers
middleware.ts   scripts/admin.mjs   .env.example
```
Modified existing files (link targets only): `components/Navbar.tsx`, `Hero.tsx`, `CTA.tsx`, `Accounts.tsx` (Open Account / Log In / Get Started buttons), and `next.config.mjs` (marks `better-sqlite3` as an external server package). New dependencies: `better-sqlite3`, `bcryptjs`, `zod`.

## Content notes (unchanged from the original site)
Brand tokens live in `tailwind.config.ts`; copy lives in `lib/data.ts`. Prices, ratings, legal text and contact details are placeholders – replace them before publishing. Note the site mixes the names *Tenex Market* and *Tanax Market* (e.g. footer email) – worth making consistent.
