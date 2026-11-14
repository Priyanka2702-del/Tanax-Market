"use client";
import { motion, useReducedMotion } from "framer-motion";

export default function Platforms() {
  const reduce = useReducedMotion();

  const fadeUp = (i: number) =>
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
    <section id="platforms" className="section-y">
      <div className="container-x">

        {/* ===== TOP: VIDEO ===== */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-3xl shadow-xl"
        >
          <video
            src="/images/MT5-Video.mp4"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/mt5-poster.jpg"
            className="h-[280px] w-full object-cover sm:h-[400px] lg:h-[500px]"
          />
        </motion.div>

        {/* ===== BOTTOM ROW: MT5 Card + 4 Download Cards ===== */}
        <div className="relative z-10 -mt-20 grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">

          {/* ---------- LEFT: MT5 Card (with outer border) ---------- */}
          <motion.div
            {...fadeUp(0)}
            className="relative"
          >
            {/* OUTER BORDER RING */}
            <div className="absolute -inset-2 rounded-[1.75rem] border-2 border-[#c4dff2]" />

            {/* CARD CONTENT */}
            <div className="relative rounded-3xl bg-gradient-to-b from-white via-white to-[#d8edf9] p-8 shadow-xl sm:p-10">
              <div className="flex items-start gap-5">
                {/* MT5 Logo */}
                <img
                  src="/images/MT5.png"
                  alt="MetaTrader 5"
                  className="h-20 w-20 shrink-0 object-contain"
                />
                <div>
                  <h2 className="text-3xl font-extrabold leading-tight text-[#111] sm:text-[2.5rem]">
                    Your Edge Begins
                    <br />
                    with MT5
                  </h2>
                </div>
              </div>

              {/* Description */}
              <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-gray-600">
                Tenex Market gives you full access to MetaTrader 5 — the
industry&apos;s most advanced, multi-asset trading platform. Use
                smart analysis tools, automated trading, and deep liquidity
                with zero compromise.
              </p>

              {/* Rating Stats */}
              <div className="mt-7 flex items-center gap-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-extrabold text-[#111]">4.7</span>
                    <span className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="h-4 w-4 text-amber-400"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">App rating</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#111]">70K</p>
                  <p className="mt-1 text-sm text-gray-500">Downloads</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ---------- RIGHT: 4 Download Cards ---------- */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">

            <motion.a
              href="#steps"
              {...fadeUp(1)}
              className="block transition hover:-translate-y-1 hover:shadow-md"
            >
              <img
                src="/images/windows.png"
                alt="Get it on Windows"
                className="w-full rounded-2xl object-contain"
              />
            </motion.a>

            <motion.a
              href="#steps"
              {...fadeUp(2)}
              className="block transition hover:-translate-y-1 hover:shadow-md"
            >
              <img
                src="/images/wentrader.png"
                alt="Download on the WebTrader"
                className="w-full rounded-2xl object-contain"
              />
            </motion.a>

            <motion.a
              href="#steps"
              {...fadeUp(3)}
              className="block transition hover:-translate-y-1 hover:shadow-md"
            >
              <img
                src="/images/playstore.png"
                alt="Get it on Google Play"
                className="w-full rounded-2xl object-contain"
              />
            </motion.a>

            <motion.a
              href="#steps"
              {...fadeUp(4)}
              className="block transition hover:-translate-y-1 hover:shadow-md"
            >
              <img
                src="/images/appstore.png"
                alt="Download on the App Store"
                className="w-full rounded-2xl object-contain"
              />
            </motion.a>
          </div>

        </div>
      </div>
    </section>
  );
}