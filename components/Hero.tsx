"use client";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationControls,
  useReducedMotion,
  type MotionProps,
  type MotionStyle,
} from "framer-motion";

// Eyedropper se video ka blue
const VIDEO_BG = "#0062c5";

// Phone center mein kitni der rukega (video ka flip dikhne ke liye)
const INTRO_HOLD_MS = 2800;

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const reduce = useReducedMotion();
  const controls = useAnimationControls();
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false); // video play ke liye ready
  const [showText, setShowText] = useState(false); // left content reveal
  const [aspect, setAspect] = useState(9 / 16); // video width/height (metadata se update hota hai)

  // Video ready hone ka wait (fallback: 2s)
  useEffect(() => {
    const v = videoRef.current;
    if (v && v.videoWidth && v.videoHeight) {
      setAspect(v.videoWidth / v.videoHeight);
    }
    if (v && v.readyState >= 3) setReady(true);
    const t = setTimeout(() => setReady(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Intro sequence: center me phone -> right slide + text reveal
  useEffect(() => {
    if (!ready) return;

    if (reduce) {
      controls.set({ opacity: 1, x: 0, scale: 1 });
      setShowText(true);
      return;
    }

    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    let cancelled = false;

    (async () => {
      try {
        if (!desktop) {
          controls.set({ opacity: 0, x: 0, scale: 1 });
          setShowText(true);
          await controls.start({ opacity: 1, transition: { duration: 0.8 } });
          return;
        }

        // Step 1: video box ka center = section ka center (pixel-accurate)
        const el = wrapRef.current;
        const sec = el?.parentElement;
        const dx = el && sec ? (el.offsetWidth - sec.offsetWidth) / 2 : 0;

        controls.set({ opacity: 0, x: dx, scale: 1.06 });
        await controls.start({ opacity: 1, transition: { duration: 0.6 } });
        await new Promise((r) => setTimeout(r, INTRO_HOLD_MS));
        if (cancelled) return;

        // Step 2: phone right par slide + text left par aaye
        setShowText(true);
        await controls.start({
          x: 0,
          scale: 1,
          transition: { duration: 1.1, ease: EASE },
        });
      } catch {
        /* unmounted */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ready, reduce, controls]);

  // Left content — showText true hone par staggered fade-in
  const item = (i: number): MotionProps =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: showText
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 14 },
          transition: { duration: 0.7, delay: i * 0.12, ease: EASE },
        };

  // Dono taraf fade => box ka edge nahi dikhta
  const fadeMask =
    "linear-gradient(to right, transparent 0%, black 14%, black 90%, transparent 100%)";

  return (
    <section
      id="home"
      // 100px = navbar height. Hero viewport ke barabar
      className="relative overflow-hidden text-white lg:h-[calc(100svh-100px)] lg:min-h-[600px]"
      style={{
        background: `linear-gradient(to right, #0a58c4 0%, ${VIDEO_BG} 55%, ${VIDEO_BG} 100%)`,
      }}
    >
      {/* ========== VIDEO ========== */}
      {/*
        Desktop: video portrait hai, to hero se ~1.9x tall rakha + bottom align.
        Upar ka khaali blue hissa crop ho jaata hai => phones bade aur poore dikhte hain.
        Phone upar kat raha ho to lg:h-[190%] kam karo (170%), chhota lage to badhao (210%).
      */}
      <motion.div
        ref={wrapRef}
        className="relative mx-auto mt-8 aspect-[4/5] w-[88%] max-w-[460px] lg:absolute lg:bottom-0 lg:right-0 lg:mx-0 lg:mt-0 lg:h-[190%] lg:w-auto lg:max-w-none lg:aspect-[var(--ar)]"
        initial={{ opacity: 0 }}
        animate={controls}
        style={
          {
            "--ar": aspect,
            transformOrigin: "50% 100%",
            WebkitMaskImage: fadeMask,
            maskImage: fadeMask,
          } as MotionStyle
        }
      >
        <video
          ref={videoRef}
          src="/images/hero-trading.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            if (v.videoWidth && v.videoHeight) {
              setAspect(v.videoWidth / v.videoHeight);
            }
          }}
          onCanPlay={() => setReady(true)}
          className="h-full w-full object-cover object-bottom"
          style={{ backgroundColor: VIDEO_BG }}
        />
      </motion.div>

      {/* ========== LEFT CONTENT (desktop, video ke upar) ========== */}
      <div className="container-x pointer-events-none absolute inset-0 hidden items-center lg:flex">
        <div className="pointer-events-auto relative z-10 max-w-xl">
          <Content item={item} />
        </div>
      </div>

      {/* Mobile: content video ke upar, normal flow */}
      <div className="container-x order-first pb-6 pt-10 lg:hidden">
        <Content item={item} />
      </div>
    </section>
  );
}

function Content({ item }: { item: (i: number) => MotionProps }) {
  return (
    <>
      <motion.h1
        {...item(0)}
        className="text-[2.6rem] font-extrabold leading-[1.08] tracking-tight sm:text-[3.2rem] lg:text-[3.6rem]"
      >
        <span className="block text-white">Trade Smart.</span>
        <span className="mt-1 block whitespace-nowrap text-[#7dd3fc]">
          Grow with Confidence.
        </span>
      </motion.h1>

      <motion.p
        {...item(1)}
        className="mt-6 max-w-[440px] text-[15.5px] leading-[1.7] text-white/90 sm:text-[16.5px]"
      >
        Access advanced trading tools, ultra-low spreads, and a secure,
        intuitive platform designed to help you trade smarter and grow with
        confidence—whether you&apos;re just starting out or scaling your
        strategy for long-term success.
      </motion.p>

      <motion.div {...item(2)} className="mt-8">
        <a
          href="/register"
          className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-[15px] font-semibold text-[#0b6bcb] shadow-lg transition hover:bg-blue-50 hover:shadow-xl"
        >
          Open Account
        </a>
      </motion.div>

      <motion.div
        {...item(3)}
        className="mt-8 flex flex-wrap items-center gap-3"
      >
        <img
          src="/images/google-reviews.png"
          alt="Google Verified Reviews"
          className="h-12 w-auto object-contain"
        />
        <img
          src="/images/trustpilot.png"
          alt="Trustpilot Reviews"
          className="h-12 w-auto object-contain"
        />
      </motion.div>
    </>
  );
}