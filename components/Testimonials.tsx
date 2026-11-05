"use client";
import { motion, useReducedMotion } from "framer-motion";

const STEPS = [
  {
    id: 1,
    title: "Register",
    text: "Signup with your email and basic details.",
    image: "/images/step1.png",
  },
  {
    id: 2,
    title: "Verify",
    text: "Submit KYC documents for identity confirmation.",
    image: "/images/step2.png",
  },
  {
    id: 3,
    title: "Deposit",
    text: "Find your account and start trading instantly",
    image: "/images/step3.png",
  },
];

export default function Steps() {
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
    <section id="steps" className="section-y bg-white">
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
            Get Started in Just 3 Easy Steps
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-500 sm:text-lg">
            No delays, no complex forms — your account is ready in minutes.
          </p>
        </motion.div>

        {/* ===== 3 CARDS ===== */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.id}
              {...card(i)}
              className="rounded-3xl bg-[#e8f2fb] p-7 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Title */}
              <h3 className="text-2xl font-bold text-[#111]">
                {s.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
                {s.text}
              </p>

              {/* Inner Image */}
              <div className="mt-5 overflow-hidden rounded-2xl">
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full object-contain"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}