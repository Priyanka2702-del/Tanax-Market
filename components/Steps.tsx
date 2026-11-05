"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const REVIEWS = [
  {
    id: 1,
    stars: "/images/stars.png",
    date: "27 Jul 2025",
    title: "Tenex Market combines transparency",
    text: "Tenex Market combines transparency, stability, and great support. I felt confident trading here thanks to their consistence performance.",
    name: "Nathan Young",
  },
  {
    id: 2,
    stars: "/images/stars.png",
    date: "26 Jul 2025",
    title: "I was skeptical at first",
    text: "I was skeptical at first, but Tenex Market proved trustworthy. Their system is simple yet powerful, with top-notch performance.",
    name: "James",
  },
  {
    id: 3,
    stars: "/images/stars.png",
    date: "26 Jul 2025",
    title: "What sets Tenex Market apart is their...",
    text: "What sets Tenex Market apart is their consistent reliability. No lag, no errors-just straightforward trading. Their policies are clear, and they deliver on time.",
    name: "Isaac Clark",
  },
  {
    id: 4,
    stars: "/images/stars.png",
    date: "25 Jul 2025",
    title: "Tenex Market's platform feels modern",
    text: "Tenex Market's platform feels modern, secure, and robust. From deposit to analytics, everything flows smoothly.",
    name: "David",
  },
  {
    id: 5,
    stars: "/images/stars.png",
    date: "24 Jul 2025",
    title: "Great support and fast execution",
    text: "The customer support team is always available and incredibly helpful. Execution speeds are impressive and spreads are among the best I've seen.",
    name: "Sarah Williams",
  },
  {
    id: 6,
    stars: "/images/stars.png",
    date: "23 Jul 2025",
    title: "Best platform I have used",
    text: "After trying several brokers, Tenex Market stands out with its clean interface, reliable platform, and genuine customer care. Highly recommended.",
    name: "Michael Chen",
  },
];

export default function Testimonials() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(4);

  useEffect(() => {
    const calc = () =>
      setPerView(
        window.innerWidth >= 1280 ? 4 : window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1
      );
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const last = Math.max(0, REVIEWS.length - perView);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i >= last ? 0 : i + 1)), 5000);
    return () => clearInterval(id);
  }, [last]);

  const go = (dir: 1 | -1) => setIndex((c) => (c + dir < 0 ? last : c + dir > last ? 0 : c + dir));

  return (
    <section id="testimonials" className="overflow-hidden bg-[#0f1e2e] py-12">
      <div className="container-x">

        {/* ===== HEADER ROW ===== */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          {/* Left: Trustpilot header */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start gap-3">
              {/* Trustpilot Logo */}
              <img
                src="/images/trustpilot1.png"
                alt="Trustpilot"
                className="h-20 w-auto"
              />

              {/* "Excellent" + Stars (stacked vertically) */}
              <div>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Excellent
                </h2>
                <img
                  src="/images/stars.png"
                  alt="4.4 rating"
                  className="mt-1 h-5 w-auto"
                />
              </div>
            </div>
          </motion.div>

          {/* Right: Navigation Arrows */}
          <div className="flex items-center gap-3 sm:mt-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00b67a] text-white transition hover:bg-[#009e68]"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00b67a] text-white transition hover:bg-[#009e68]"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* ===== CARDS SLIDER ===== */}
        <div className="mt-8 overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={{ x: `-${index * (100 / perView)}%` }}
            transition={{ type: "spring", stiffness: 140, damping: 22 }}
          >
            {REVIEWS.map((r) => (
              <div
                key={r.id}
                className="shrink-0"
                style={{ flexBasis: `calc(${100 / perView}% - 12px)` }}
              >
                <div className="flex h-full flex-col rounded-xl bg-[#1e3347] p-5">
                  {/* Green Stars — chhoti & compact */}
                  <img
                    src={r.stars}
                    alt="5 stars"
                    className="h-3 max-w-[70px] w-auto object-contain"
                  />

                  {/* Date */}
                  <p className="mt-2 text-xs text-gray-400">{r.date}</p>

                  {/* Title */}
                  <h3 className="mt-1 text-[14px] font-bold leading-snug text-white">
                    {r.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-1.5 flex-1 text-[13px] leading-[1.55] text-gray-300">
                    {r.text}
                  </p>

                  {/* Name */}
                  <p className="mt-3 text-xs text-gray-400">
                    {r.name}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}