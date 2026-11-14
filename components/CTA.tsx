"use client";
import { motion, useReducedMotion } from "framer-motion";

export default function CTA() {
  const reduce = useReducedMotion();

  return (
    <section id="cta" className="overflow-hidden bg-gradient-to-br from-[#d6eefc] via-[#e8f4fb] to-white">
      <div className="container-x">
        <div className="grid items-center gap-10 lg:grid-cols-2">

          {/* LEFT: Text + Button */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="py-16 lg:py-24"
          >
            <h2 className="text-[2.2rem] font-extrabold leading-[1.15] tracking-tight text-[#111] sm:text-[2.8rem] lg:text-[3.4rem]">
              Ready to Trade with Confidence?
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-[1.75] text-gray-500">
              Join thousands of traders who rely on Tenex Market for
              transparency, speed, and results. Open your account today and
              access the markets on your terms.
            </p>
            <a
              href="/register"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#1a73e8] px-8 py-3.5 text-[15px] font-semibold text-white shadow-lg transition hover:bg-blue-700"
            >
              Open Account Now
            </a>
          </motion.div>

          {/* RIGHT: Phone Image */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center lg:justify-end"
          >
            <img
              src="/images/cta-phone.png"
              alt="Tenex Market App"
              className="w-full max-w-[550px] object-contain"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}