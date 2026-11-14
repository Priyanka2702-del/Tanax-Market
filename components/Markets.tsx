"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const MARKET_CARDS = [
  {
    id: "forex",
    title: "Forex",
    text: "Access 60+ currency pairs, tight spreads, and fast execution in the world's most liquid market.",
    icon: "/images/trade-icon1.png",
    btn: "Trade Forex",
  },
  {
    id: "metals",
    title: "Metals",
    text: "Trade gold and silver with precision. Hedge, invest, or speculate with low-cost access.",
    icon: "/images/trade-icon2.png",
    btn: null,
  },
  {
    id: "crypto",
    title: "Crypto",
    text: "Speculate on major crypto pairs 24/7 with flexible leverage and no wallet required.",
    icon: "/images/trade-icon3.png",
    btn: null,
  },
  {
    id: "indices",
    title: "Indices",
    text: "Get exposure to global economies through top indices like S&P 500, NASDAQ, and DAX.",
    icon: "/images/trade-icon4.png",
    btn: null,
  },
  {
    id: "stock",
    title: "Stock",
    text: "Speculate on price movements of major US, UK, and EU-listed companies through CFDs.",
    icon: "/images/trade-icon5.png",
    btn: "Trade Stock",
  },
  {
    id: "commodities",
    title: "Commodities",
    text: "Trade popular commodities like crude oil, natural gas, wheat, and coffee — all from one account.",
    icon: "/images/trade-icon6.png",
    btn: null,
  },
];

export default function Markets() {
  const reduce = useReducedMotion();

  const card = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 32 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-50px" },
          transition: {
            duration: 0.5,
            delay: (i % 3) * 0.1,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  return (
    <section
      id="markets"
      className="relative overflow-hidden pb-20 pt-16"
    >
      {/* ===== CLOUD / SKY BACKGROUND ===== */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/cloud-bg.jpg')",
        }}
      />
      {/* soft blue overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#c8e6fb]/80 via-[#dff0fd]/60 to-white/90" />
      {/* extra cloud glow spots */}
      <div className="pointer-events-none absolute left-1/4 top-20 h-72 w-[500px] rounded-full bg-white/50 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-60 h-56 w-96 rounded-full bg-white/40 blur-3xl" />

      <div className="container-x relative z-10">
        {/* ===== HEADING ===== */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-[#111] sm:text-4xl lg:text-[2.8rem]">
            Trade a Wide Range of Global Markets
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500 sm:text-lg">
            Explore global trading opportunities with broad market access and
            powerful tools.
          </p>
        </motion.div>

        {/* ===== 3×2 CARDS GRID ===== */}
        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MARKET_CARDS.map((m, i) => (
            <motion.div
              key={m.id}
              {...card(i)}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* bottom gradient overlay */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#d0e8fa] to-transparent opacity-70" />

              {/* top: title + icon image */}
              <div className="relative z-10 flex items-start justify-between">
                <h3 className="text-2xl font-bold text-[#111]">
                  {m.title}
                </h3>
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#e8f0fc]">
                  <img
                    src={m.icon}
                    alt={m.title}
                    className="h-8 w-8 object-contain"
                  />
                </div>
              </div>

              {/* description */}
              <p className="relative z-10 mt-5 text-[15px] leading-relaxed text-gray-500">
                {m.text}
              </p>

              {/* bottom: button or arrow */}
              <div className="relative z-10 mt-7">
                {m.btn ? (
                  <a
                    href="#steps"
                    className="inline-flex items-center justify-center rounded-full bg-[#1a73e8] px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
                  >
                    {m.btn}
                  </a>
                ) : (
                  <a
                    href="#steps"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-gray-200 bg-white transition hover:border-[#1a73e8] hover:bg-[#1a73e8] hover:text-white"
                  >
                    <ArrowRight size={18} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}