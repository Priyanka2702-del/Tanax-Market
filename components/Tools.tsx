"use client";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    num: "01",
    title: "IB Program",
    text: "Earn competitive commissions by referring new traders to the Tenex Market. As an Introducing Broker, you gain access to real-time tracking tools, transparent reporting, and flexible payout structures. Focus on building your network while we provide the technology, support, and rewards to help grow your business.",
    image: "/images/slide-01.png",
  },
  {
    id: 2,
    num: "02",
    title: "PAMM",
    text: "Let clients invest directly in your trading strategy while we manage all allocation and accounting tasks. Our PAMM system handles performance tracking, profit distribution, and risk management automatically, allowing you to focus on trading while investors follow your expertise with complete transparency.",
    image: "/images/slide-02.png",
  },
  {
    id: 3,
    num: "03",
    title: "Copy Trading",
    text: "Access our powerful copy trading platform and mirror the strategies of experienced traders with a single click. Choose from a wide range of verified signal providers, set your risk parameters, and let the system execute trades on your behalf. Perfect for beginners and busy professionals looking to grow their portfolios hands-free.",
    image: "/images/slide-03.png",
  },
  {
    id: 4,
    num: "04",
    title: "Artificial Intelligence",
    text: "Utilise advanced AI tools designed to enhance decision-making through smart trend detection, market pattern recognition, and actionable trade suggestions. The system analyses live data to highlight opportunities, reduce noise, and support traders of all skill levels with insights rooted in real-time analytics.",
    image: "/images/slide-04.png",
  },
];

export default function Tools() {
  const [current, setCurrent] = useState(0);
  const reduce = useReducedMotion();
  const slide = SLIDES[current];

  const goNext = () => setCurrent((c) => (c + 1) % SLIDES.length);
  const goPrev = () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);

  return (
    <section id="tools" className="overflow-hidden bg-[#0f1e2e] py-16">
      <div className="container-x">
        <div className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">

          {/* ===== LEFT: Heading + CTA ===== */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-[2.2rem] font-extrabold leading-[1.12] tracking-tight text-white sm:text-[2.6rem] lg:text-[3rem]">
              Smart Trading Tools & Growth Opportunities
            </h2>
            <p className="mt-5 max-w-[380px] text-[15px] leading-[1.7] text-gray-300">
              Boost your performance and earning potential with cutting-edge
              solutions and revenue programs.
            </p>
            <a
              href="#steps"
              className="mt-7 inline-flex items-center justify-center rounded-full bg-[#1a73e8] px-8 py-3 text-[15px] font-semibold text-white shadow-lg transition hover:bg-blue-600"
            >
              Become a Partner
            </a>
          </motion.div>

          {/* ===== CENTER + RIGHT: Slider ===== */}
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-8">

            {/* CENTER: Image Card — height kam ki */}
            <div className="relative flex-shrink-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={reduce ? false : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="w-[240px] overflow-hidden rounded-2xl border-4 border-white/20 sm:w-[280px]"
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-[300px] w-full object-cover sm:h-[340px]"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* RIGHT: Slide Content + Arrows */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.35 }}
                >
                  {/* Slide Number */}
                  <p className="text-4xl font-extrabold text-white/30 sm:text-5xl">
                    {slide.num}
                  </p>

                  {/* Slide Title */}
                  <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                    {slide.title}
                  </h3>

                  {/* Slide Description */}
                  <p className="mt-3 max-w-lg text-[14px] leading-[1.7] text-gray-300">
                    {slide.text}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous slide"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#111] shadow-lg transition hover:bg-gray-100"
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next slide"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1a73e8] text-white shadow-lg transition hover:bg-blue-600"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}