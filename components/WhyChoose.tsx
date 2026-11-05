"use client";
import { motion, useReducedMotion } from "framer-motion";

export default function WhyChoose() {
  const reduce = useReducedMotion();

  const card = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 36 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: {
            duration: 0.55,
            delay: i * 0.1,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  return (
    <section
      id="why"
      className="relative overflow-hidden bg-gradient-to-b from-[#d6eefc] via-[#e8f4fb] to-white pb-20 pt-16"
    >
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
            Why Traders Choose Tenex Market
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-500 sm:text-lg">
            Trusted by traders for fast execution, tight spreads, live support,
            and transparent operations.
          </p>
        </motion.div>

        {/* ===== CARDS GRID ===== */}
        {/* Row 1 */}
        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-5">
          
          {/* Card 1 — Fast Execution (wide) */}
          <motion.div
            {...card(0)}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-[#e0f2fe] p-7 shadow-sm sm:col-span-1 lg:col-span-3"
          >
            <div className="flex h-full flex-col sm:flex-row sm:items-center">
              <div className="relative z-10 max-w-[280px] flex-shrink-0">
                <h3 className="text-2xl font-extrabold text-[#111]">
                  Fast Execution
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
                  Enjoy lightning-speed order execution with minimal slippage —
                  ideal for scalpers and intraday traders.
                </p>
              </div>
              <div className="mt-5 flex-1 sm:mt-0 sm:ml-4">
                <img
                  src="/images/market-01.png"
                  alt="Fast Execution"
                  className="w-full max-w-[320px] object-contain sm:absolute sm:bottom-0 sm:right-0 sm:max-h-[95%] sm:max-w-[45%]"
                />
              </div>
            </div>
          </motion.div>

          {/* Card 2 — Tight Spreads (narrow) */}
          <motion.div
            {...card(1)}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a73e8] to-[#4fa8ff] p-7 shadow-sm lg:col-span-2"
          >
            <h3 className="text-2xl font-extrabold text-white">
              Tight Spreads
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-white/85">
              Trade with ultra-low spreads on major and minor pairs, helping you
              maximise returns with every pip.
            </p>
            <div className="mt-6 flex justify-center">
              <img
                src="/images/market-02.png"
                alt="Tight Spreads"
                className="w-[200px] object-contain"
              />
            </div>
          </motion.div>
        </div>

        {/* Row 2 */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-5">
          
          {/* Card 3 — 24/5 Support (narrow) */}
          <motion.div
            {...card(2)}
            className="relative overflow-hidden rounded-3xl bg-[#1a1a2e] p-7 shadow-sm lg:col-span-2"
          >
            <img
              src="/images/market-03.png"
              alt="Support"
              className="h-14 w-14 object-contain"
            />
            <h3 className="mt-5 text-2xl font-extrabold text-white">
              24/5 Multi-lingual Support
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-gray-300">
              Get human help when you need it — responsive, multilingual support
              from people who actually know trading.
            </p>
          </motion.div>

          {/* Card 4 — Regular & Transparent (wide) */}
          <motion.div
            {...card(3)}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a73e8] to-[#2b8df0] p-7 shadow-sm lg:col-span-3"
          >
            <div className="flex h-full flex-col sm:flex-row sm:items-center">
              <div className="relative z-10 max-w-[300px] flex-shrink-0">
                <h3 className="text-2xl font-extrabold text-white">
                  Regular & Transparent
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/85">
                  Your funds are held securely with full transparency. We
                  operate under strict regulatory compliance.
                </p>
              </div>
              <div className="mt-5 flex-1 sm:mt-0 sm:ml-4">
                <img
                  src="/images/market-04.png"
                  alt="Regulatory Compliance"
                  className="w-full max-w-[300px] object-contain sm:absolute sm:bottom-0 sm:right-0 sm:max-h-[100%] sm:max-w-[50%]"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}