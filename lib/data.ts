import type { LucideIcon } from "lucide-react";
import {
  BarChart3, Bitcoin, Calculator, CalendarDays, Coins, Fuel, Gauge, Headphones,
  LineChart, Landmark, Layers, LockKeyhole, Newspaper, ShieldCheck, TrendingUp, Zap, Wallet, DollarSign,
} from "lucide-react";

export interface NavItem { label: string; href: string; children?: { label: string; href: string }[] }

export const NAV: NavItem[] = [
  { label: "Home", href: "#home" },
  {
    label: "Markets", href: "#markets",
    children: [
      { label: "Forex", href: "#markets" }, { label: "Metals", href: "#markets" }, { label: "Crypto", href: "#markets" },
      { label: "Indices", href: "#markets" }, { label: "Stocks", href: "#markets" }, { label: "Commodities", href: "#markets" },
    ],
  },
  {
    label: "Tools", href: "#tools",
    children: [
      { label: "Economic Calendar", href: "#tools" }, { label: "Trading Calculators", href: "#tools" },
      { label: "Market Analysis", href: "#tools" },
    ],
  },
  {
    label: "Accounts", href: "#accounts",
    children: [
      { label: "Standard Account", href: "#accounts" }, { label: "Pro Account", href: "#accounts" }, { label: "ECN Account", href: "#accounts" },
    ],
  },
  {
    label: "Partnership", href: "#cta",
    children: [{ label: "Introducing Broker", href: "#cta" }, { label: "Affiliate Program", href: "#cta" }],
  },
  {
    label: "Company", href: "#why",
    children: [{ label: "Why Tenex Market", href: "#why" }, { label: "Testimonials", href: "#testimonials" }, { label: "Contact Us", href: "#footer" }],
  },
];

export interface Feature { icon: LucideIcon; title: string; text: string }

export const WHY: Feature[] = [
  { icon: TrendingUp, title: "Tight spreads", text: "Trade major pairs with spreads from 0.0 pips on our ECN account." },
  { icon: Zap, title: "Fast execution", text: "Orders are filled in milliseconds on deep institutional liquidity." },
  { icon: ShieldCheck, title: "Protected funds", text: "Client money is held in segregated accounts, separate from company funds." },
  { icon: Layers, title: "200+ instruments", text: "Forex, metals, crypto, indices, stocks and commodities from one account." },
  { icon: Headphones, title: "24/7 support", text: "A multilingual team and chatbot are ready whenever the markets are open." },
  { icon: Wallet, title: "Simple funding", text: "Deposit and withdraw with cards, bank transfer and popular crypto." },
];

export interface Instrument { symbol: string; name: string; price: string; change: number; seed: number }
export interface Market { id: string; label: string; icon: LucideIcon; blurb: string; instruments: Instrument[] }

export const MARKETS: Market[] = [
  {
    id: "forex", label: "Forex", icon: DollarSign,
    blurb: "Trade 40+ currency pairs around the clock, five days a week, with spreads from 0.0 pips.",
    instruments: [
      { symbol: "EUR/USD", name: "Euro vs US Dollar", price: "1.08432", change: 0.12, seed: 11 },
      { symbol: "GBP/USD", name: "British Pound vs US Dollar", price: "1.27105", change: -0.08, seed: 12 },
      { symbol: "USD/JPY", name: "US Dollar vs Japanese Yen", price: "151.842", change: 0.31, seed: 13 },
      { symbol: "AUD/USD", name: "Australian Dollar vs US Dollar", price: "0.65310", change: -0.17, seed: 14 },
    ],
  },
  {
    id: "metals", label: "Metals", icon: Coins,
    blurb: "Gain exposure to gold, silver and other precious metals without owning the physical asset.",
    instruments: [
      { symbol: "XAU/USD", name: "Gold", price: "2,341.60", change: 0.46, seed: 21 },
      { symbol: "XAG/USD", name: "Silver", price: "27.840", change: 0.74, seed: 22 },
      { symbol: "XPT/USD", name: "Platinum", price: "962.40", change: -0.22, seed: 23 },
      { symbol: "XPD/USD", name: "Palladium", price: "1,018.90", change: -0.51, seed: 24 },
    ],
  },
  {
    id: "crypto", label: "Crypto", icon: Bitcoin,
    blurb: "Trade the leading cryptocurrencies as CFDs with leverage, long or short.",
    instruments: [
      { symbol: "BTC/USD", name: "Bitcoin", price: "67,420.50", change: 1.84, seed: 31 },
      { symbol: "ETH/USD", name: "Ethereum", price: "3,512.20", change: 1.12, seed: 32 },
      { symbol: "LTC/USD", name: "Litecoin", price: "84.310", change: -0.63, seed: 33 },
      { symbol: "XRP/USD", name: "Ripple", price: "0.5240", change: 0.29, seed: 34 },
    ],
  },
  {
    id: "indices", label: "Indices", icon: BarChart3,
    blurb: "Follow the performance of whole economies with the world's major stock indices.",
    instruments: [
      { symbol: "US500", name: "S&P 500", price: "5,204.30", change: 0.35, seed: 41 },
      { symbol: "US100", name: "Nasdaq 100", price: "18,176.80", change: 0.58, seed: 42 },
      { symbol: "GER40", name: "DAX 40", price: "18,210.10", change: -0.14, seed: 43 },
      { symbol: "UK100", name: "FTSE 100", price: "7,952.60", change: 0.09, seed: 44 },
    ],
  },
  {
    id: "stocks", label: "Stocks", icon: Landmark,
    blurb: "Trade CFDs on well-known global companies and react to earnings and news as it happens.",
    instruments: [
      { symbol: "AAPL", name: "Apple Inc.", price: "189.84", change: 0.41, seed: 51 },
      { symbol: "TSLA", name: "Tesla Inc.", price: "176.75", change: -1.21, seed: 52 },
      { symbol: "MSFT", name: "Microsoft Corp.", price: "420.55", change: 0.27, seed: 53 },
      { symbol: "AMZN", name: "Amazon.com Inc.", price: "182.15", change: 0.63, seed: 54 },
    ],
  },
  {
    id: "commodities", label: "Commodities", icon: Fuel,
    blurb: "Trade oil, natural gas and other commodities that move with global supply and demand.",
    instruments: [
      { symbol: "USOIL", name: "WTI Crude Oil", price: "82.140", change: 0.88, seed: 61 },
      { symbol: "UKOIL", name: "Brent Crude Oil", price: "86.420", change: 0.74, seed: 62 },
      { symbol: "NATGAS", name: "Natural Gas", price: "1.8420", change: -1.05, seed: 63 },
      { symbol: "COPPER", name: "Copper", price: "4.2310", change: 0.33, seed: 64 },
    ],
  },
];

export interface Plan {
  name: string; tag?: string; text: string; featured?: boolean;
  rows: { label: string; value: string }[]; perks: string[];
}

export const PLANS: Plan[] = [
  {
    name: "Standard", text: "A straightforward account for traders getting started.",
    rows: [{ label: "Minimum deposit", value: "$100" }, { label: "Spread from", value: "1.2 pips" }, { label: "Commission", value: "None" }, { label: "Leverage up to", value: "1:500" }],
    perks: ["Zero commission trading", "Free demo account", "Standard support"],
  },
  {
    name: "Pro", tag: "Most popular", featured: true, text: "Lower spreads and faster service for active traders.",
    rows: [{ label: "Minimum deposit", value: "$1,000" }, { label: "Spread from", value: "0.6 pips" }, { label: "Commission", value: "None" }, { label: "Leverage up to", value: "1:500" }],
    perks: ["Priority execution", "Daily market analysis", "Dedicated account manager"],
  },
  {
    name: "ECN", text: "Raw spreads and direct market access for professionals.",
    rows: [{ label: "Minimum deposit", value: "$5,000" }, { label: "Spread from", value: "0.0 pips" }, { label: "Commission", value: "$3 per lot" }, { label: "Leverage up to", value: "1:200" }],
    perks: ["Raw institutional spreads", "VPS hosting available", "Priority 24/7 support"],
  },
];

export const PLATFORM_POINTS = [
  "Advanced charting with 80+ technical indicators",
  "Nine timeframes and 21 analytical objects",
  "One-click trading and all order types",
  "Expert Advisors for automated strategies",
  "Available on web, desktop, iOS and Android",
];

export const TOOLS: Feature[] = [
  { icon: CalendarDays, title: "Economic calendar", text: "Plan around central bank decisions, jobs data and other events that move markets." },
  { icon: Calculator, title: "Trading calculators", text: "Work out pip value, margin and profit before you place a trade." },
  { icon: Newspaper, title: "Market news", text: "Follow live headlines and daily analysis from our research desk." },
  { icon: LineChart, title: "Advanced charts", text: "Draw, compare and customise charts with professional indicators." },
  { icon: Gauge, title: "Risk controls", text: "Set stop loss, take profit and trailing stops on every position." },
  { icon: LockKeyhole, title: "Account security", text: "Two-factor sign-in and encrypted connections protect your account." },
];

export interface Testimonial { name: string; role: string; text: string; rating: number }

export const TESTIMONIALS: Testimonial[] = [
  { name: "Amira K.", role: "Swing trader, Dubai", text: "Spreads are consistently tight and orders fill instantly, even around news releases.", rating: 5 },
  { name: "Lucas M.", role: "Day trader, Lisbon", text: "Withdrawals arrived the next morning and the support team answered in minutes.", rating: 5 },
  { name: "Sana R.", role: "Gold trader, Karachi", text: "The MT5 setup was simple and the economic calendar helps me plan every week.", rating: 4 },
  { name: "Daniel O.", role: "Part-time trader, Lagos", text: "I started on the demo account and moved to live once I felt ready. No pressure at all.", rating: 5 },
  { name: "Mei L.", role: "Index trader, Singapore", text: "Clean platform, fair pricing and clear account details. Exactly what I wanted.", rating: 5 },
];

export const STEPS = [
  { title: "Create your account", text: "Sign up in minutes with your email and basic details." },
  { title: "Verify and fund", text: "Upload your ID, then deposit using your preferred method." },
  { title: "Start trading", text: "Download MT5, pick a market and place your first trade." },
];

export const FOOTER_COLUMNS: { title: string; links: string[] }[] = [
  { title: "Trading", links: ["Forex", "Metals", "Crypto", "Indices", "Stocks", "Commodities"] },
  { title: "Platforms", links: ["MetaTrader 5", "Web Trader", "Mobile App", "Economic Calendar"] },
  { title: "Accounts", links: ["Standard", "Pro", "ECN", "Demo Account"] },
  { title: "Quick Links", links: ["About Us", "Contact Us", "Partnership", "Privacy Policy", "Terms & Conditions"] },
];

