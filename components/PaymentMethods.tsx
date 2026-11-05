"use client";
import { motion, useReducedMotion } from "framer-motion";

const LOGOS = [
  { id: 1, img: "/images/pay1.svg", alt: "Mastercard" },
  { id: 2, img: "/images/pay2.svg", alt: "Skrill" },
  { id: 3, img: "/images/pay3.svg", alt: "Binance" },
  { id: 4, img: "/images/pay4.svg", alt: "Apple Pay" },
  { id: 5, img: "/images/pay5.svg", alt: "Google Pay" },
  { id: 6, img: "/images/pay6.svg", alt: "Bank Transfers" },
  { id: 7, img: "/images/pay7.svg", alt: "Crypto" },
  { id: 8, img: "/images/pay8.svg", alt: "Pix" },
    { id: 9, img: "/images/pay9.svg", alt: "Visa" },
      { id: 10, img: "/images/pay10.svg", alt: "neteller" },


];

export default function PaymentMarquee() {
  const reduce = useReducedMotion();

  return (
    <section className="overflow-hidden bg-white py-14">
      <div className="relative">
        {/* Gradient fade left */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent" />
        {/* Gradient fade right */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent" />

        {/* Marquee */}
        <motion.div
          className="flex w-max gap-6"
          animate={
            reduce
              ? {}
              : {
                  x: ["0%", "-50%"],
                }
          }
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
        >
          {/* Repeat logos 2x for seamless loop */}
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            <div
              key={`${logo.id}-${i}`}
              className="flex h-[72px] w-[160px] shrink-0 items-center justify-center rounded-2xl bg-[#eef4fb] px-6 sm:w-[190px]"
            >
              <img
                src={logo.img}
                alt={logo.alt}
                className="h-10 w-auto object-contain sm:h-12"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}