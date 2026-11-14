"use client";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const PLANS = [
  {
    id: "regular",
    name: "Regular Account",
    text: "A low-barrier entry for new or casual traders who want access to core trading features.",
    icon: "/images/plan-01.png",
    featured: false,
    features: [
      { label: "Minimum Deposit", value: "$50" },
      { label: "Leverage", value: "Up to 1:500" },
      { label: "Spread", value: "2.0 Pips" },
      { label: "Commission Charges", value: "None" },
      { label: "Swaps", value: "Free" },
    ],
  },
  {
    id: "premium",
    name: "Premium Account",
    text: "Ideal for growing traders who want tighter spreads and more control over trade costs.",
    icon: "/images/plan-02.png",
    featured: false,
    features: [
      { label: "Minimum Deposit", value: "$500" },
      { label: "Leverage", value: "Up to 1:500" },
      { label: "Spread", value: "1.5 Pips" },
      { label: "Commission Charges", value: "None" },
      { label: "Swaps", value: "Free" },
    ],
  },
  {
    id: "pro",
    name: "Pro Account",
    text: "Built for high-volume or experienced traders who need peak performance conditions.",
    icon: "/images/plan-03.png",
    featured: true,
    features: [
      { label: "Minimum Deposit", value: "$2000" },
      { label: "Leverage", value: "Up to 1:400" },
      { label: "Spread", value: "1.0 Pips" },
      { label: "Commission Charges", value: "None" },
      { label: "Swaps", value: "Free" },
    ],
  },
];

export default function Accounts() {
  const reduce = useReducedMotion();

  const card = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 36 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-50px" },
          transition: {
            duration: 0.55,
            delay: i * 0.12,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  return (
    <section id="accounts" className="section-y">
      <div className="container-x">
        {/* ===== HEADING ===== */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-[#111] sm:text-4xl lg:text-[2.8rem]">
            Flexible Accounts for Every Trader
          </h2>
        </motion.div>

        {/* ===== 3 CARDS ===== */}
        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <motion.article
              key={p.id}
              {...card(i)}
              className={`relative flex h-full flex-col rounded-[1.5rem] p-8 transition duration-300 hover:-translate-y-1 ${
                p.featured
                  ? "bg-gradient-to-br from-[#1565d8] to-[#2b8df0] text-white shadow-xl lg:scale-[1.03]"
                  : "bg-[#f4f7fb] border border-gray-100 shadow-sm hover:shadow-md"
              }`}
            >
              {/* 3D ICON IMAGE */}
              <div className="mb-5">
                <img
                  src={p.icon}
                  alt={p.name}
                  className="h-16 w-16 object-contain"
                />
              </div>

              {/* TITLE */}
              <h3 className="text-2xl font-bold">
                {p.name}
              </h3>

              {/* DESCRIPTION */}
              <p
                className={`mt-3 text-[15px] leading-relaxed ${
                  p.featured ? "text-white/85" : "text-gray-500"
                }`}
              >
                {p.text}
              </p>

              {/* FEATURES LIST */}
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f.label} className="flex items-center gap-2.5">
                    <CheckCircle2
                      size={20}
                      className={`shrink-0 ${
                        p.featured ? "text-white" : "text-[#1a73e8]"
                      }`}
                      fill="currentColor"
                    />
                    <span
                      className={`text-[15px] ${
                        p.featured ? "text-white/90" : "text-gray-600"
                      }`}
                    >
                      {f.label}{" "}
                      <span
                        className={`font-bold ${
                          p.featured ? "text-white" : "text-[#1a73e8]"
                        }`}
                      >
                        {f.value}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA BUTTON */}
              <div className="mt-auto pt-8">
                {p.featured ? (
                  <a
                    href="/register"
                    className="block w-full rounded-full bg-white py-3.5 text-center text-[15px] font-semibold text-[#1565d8] shadow-md transition hover:bg-gray-50"
                  >
                    Get Started Now
                  </a>
                ) : (
                  <a
                    href="/register"
                    className="block w-full rounded-full bg-[#1a73e8] py-3.5 text-center text-[15px] font-semibold text-white shadow-md transition hover:bg-blue-700"
                  >
                    Get Started Now
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Account terms shown are sample values for demonstration.
        </p>
      </div>
    </section>
  );
}