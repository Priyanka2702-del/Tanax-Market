import { z } from "zod";
import { COUNTRY_NAMES, DIAL_CODES } from "@/lib/countries";

export const PASSWORD_RULES = [
  { id: "len", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { id: "upper", label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { id: "lower", label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { id: "num", label: "One number", test: (p: string) => /\d/.test(p) },
  { id: "sym", label: "One special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export function passwordScore(p: string): number {
  return PASSWORD_RULES.filter((r) => r.test(p)).length;
}

const password = z
  .string()
  .max(72, "Password must be 72 characters or fewer")
  .refine((p) => PASSWORD_RULES.every((r) => r.test(p)), {
    message: "Password must be 8+ characters with upper & lower case, a number and a special character",
  });

const name = (label: string) =>
  z.string().trim().min(2, `${label} must be at least 2 characters`).max(50, `${label} is too long`)
    .regex(/^[\p{L}\p{M}' .-]+$/u, `${label} contains invalid characters`);

const email = z.string().trim().toLowerCase().min(1, "Email is required").email("Enter a valid email address").max(120);

export function isAdult(dob: string): boolean {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age >= 18 && age <= 110;
}

export const registerSchema = z
  .object({
    firstName: name("First name"),
    lastName: name("Last name"),
    email,
    dialCode: z.string().refine((v) => DIAL_CODES.includes(v), "Select a country code"),
    phone: z.string().trim().regex(/^\d{5,14}$/, "Enter digits only (5–14 digits)"),
    country: z.string().refine((v) => COUNTRY_NAMES.includes(v), "Select a country from the list"),
    dateOfBirth: z.string().min(1, "Date of birth is required").refine(isAdult, "You must be at least 18 years old"),
    password,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.literal(true, { errorMap: () => ({ message: "You must accept the Terms & Conditions" }) }),
  })
  .refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" });

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Email or Client ID is required").max(120),
  password: z.string().min(1, "Password is required").max(200),
  remember: z.boolean().optional(),
});

export const forgotSchema = z.object({ email });

export const resetSchema = z
  .object({ token: z.string().min(20), password, confirmPassword: z.string().min(1, "Please confirm your password") })
  .refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" });

export const profileSchema = z.object({
  firstName: name("First name"),
  lastName: name("Last name"),
  dialCode: z.string().refine((v) => DIAL_CODES.includes(v), "Select a country code"),
  phone: z.string().trim().regex(/^\d{5,14}$/, "Enter digits only (5–14 digits)"),
  country: z.string().refine((v) => COUNTRY_NAMES.includes(v), "Select a country from the list"),
  address: z.string().trim().max(160).optional().default(""),
  city: z.string().trim().max(80).optional().default(""),
});

export const changePasswordSchema = z
  .object({ currentPassword: z.string().min(1, "Current password is required"), newPassword: password, confirmPassword: z.string().min(1, "Please confirm your password") })
  .refine((d) => d.newPassword === d.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" })
  .refine((d) => d.newPassword !== d.currentPassword, { path: ["newPassword"], message: "New password must differ from the current one" });

export const notificationPrefsSchema = z.object({ email: z.boolean(), deposits: z.boolean(), marketing: z.boolean() });

export const ACCOUNT_TYPES = ["Standard", "Pro", "ECN"] as const;
export const LEVERAGES = [50, 100, 200, 300, 500] as const;
export const ACCOUNT_RULES: Record<(typeof ACCOUNT_TYPES)[number], { minDeposit: number; maxLeverage: number }> = {
  Standard: { minDeposit: 100, maxLeverage: 500 },
  Pro: { minDeposit: 1000, maxLeverage: 500 },
  ECN: { minDeposit: 5000, maxLeverage: 200 },
};

export const createAccountSchema = z
  .object({
    type: z.enum(ACCOUNT_TYPES),
    leverage: z.number().refine((v) => (LEVERAGES as readonly number[]).includes(v), "Select a valid leverage"),
    isDemo: z.boolean().default(false),
  })
  .refine((d) => d.leverage <= ACCOUNT_RULES[d.type].maxLeverage, { path: ["leverage"], message: "Leverage is too high for this account type" });

export const DEPOSIT_METHODS = [
  { id: "card", label: "Credit / Debit Card", fee: "0%", time: "Instant", min: 20, max: 10000 },
  { id: "bank", label: "Bank Transfer", fee: "0%", time: "1–3 business days", min: 100, max: 100000 },
  { id: "usdt", label: "Crypto (USDT TRC20)", fee: "0%", time: "10–30 minutes", min: 50, max: 100000 },
  { id: "skrill", label: "Skrill", fee: "0%", time: "Instant", min: 20, max: 10000 },
  { id: "neteller", label: "Neteller", fee: "0%", time: "Instant", min: 20, max: 10000 },
] as const;

export const WITHDRAW_METHODS = [
  { id: "bank", label: "Bank Transfer", time: "1–3 business days", min: 50 },
  { id: "usdt", label: "Crypto (USDT TRC20)", time: "Within 24 hours", min: 30 },
  { id: "skrill", label: "Skrill", time: "Within 24 hours", min: 20 },
  { id: "neteller", label: "Neteller", time: "Within 24 hours", min: 20 },
] as const;

const amount = z.number({ invalid_type_error: "Enter an amount" }).positive("Enter an amount greater than 0").finite().max(1_000_000);

export const depositSchema = z.object({
  accountId: z.number().int().positive("Select a trading account"),
  method: z.enum(DEPOSIT_METHODS.map((m) => m.id) as [string, ...string[]]),
  amount,
});

export const withdrawSchema = z.object({
  accountId: z.number().int().positive("Select a trading account"),
  method: z.enum(WITHDRAW_METHODS.map((m) => m.id) as [string, ...string[]]),
  amount,
  details: z.string().trim().min(4, "Enter the destination account / wallet details").max(200),
});

export const TICKET_CATEGORIES = ["Account", "Deposit", "Withdrawal", "Trading platform", "Verification", "Other"] as const;
export const ticketSchema = z.object({
  category: z.enum(TICKET_CATEGORIES),
  subject: z.string().trim().min(5, "Subject must be at least 5 characters").max(120),
  message: z.string().trim().min(20, "Please describe your issue in at least 20 characters").max(3000),
});

export const KYC_DOC_TYPES = [
  { id: "passport", label: "Passport" },
  { id: "national_id", label: "National ID card" },
  { id: "drivers_license", label: "Driver's licence" },
  { id: "proof_of_address", label: "Proof of address (utility bill / bank statement, < 3 months)" },
] as const;
export const KYC_MAX_BYTES = 5 * 1024 * 1024;
