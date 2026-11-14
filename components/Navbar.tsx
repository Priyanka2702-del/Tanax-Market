"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { NAV } from "@/lib/data";
import { cn } from "@/lib/cn";
// import Logo from "./Logo"; // Hata diya gaya hai
// import Button from "./ui/Button"; // Hata diya gaya hai, inline use kiya hai taaki exact design match ho

export default function Navbar() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileSub, setMobileSub] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(null); setMobile(false); } };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const closeAll = () => { setOpen(null); setMobile(false); };

  return (
    <header 
      ref={navRef} 
      className={cn(
        "sticky top-0 z-50 bg-white transition-shadow duration-300", 
        scrolled && "shadow-md"
      )}
    >
      <div className="container-x flex h-[80px] items-center justify-between px-4 lg:px-8">
        
        {/* LOGO SECTION - Yahan apne logo ka path dalein */}
        <a href="/" className="flex items-center">
          <img 
            src="/images/logo.png" // <-- Yahan apna logo lagayein (e.g. /images/logo.svg)
            alt="Logo" 
            className="h-10 w-auto object-contain" // Height apne hisaab se adjust kar lena
          />
        </a>

        {/* DESKTOP NAVIGATION */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8"> {/* Gap badha diya image jaisa dikhne ke liye */}
            {NAV.map((item) => (
              <li 
                key={item.label} 
                className="relative" 
                onMouseEnter={() => item.children && setOpen(item.label)} 
                onMouseLeave={() => setOpen(null)}
              >
                {item.children ? (
                  <button
                    type="button"
                    aria-expanded={open === item.label}
                    aria-haspopup="true"
                    onClick={() => setOpen(open === item.label ? null : item.label)}
 className="flex items-center gap-1.5 py-2 text-[15px] font-semibold text-gray-800 transition-colors hover:text-[#0066FF]"                  >
                    {item.label}
                    <ChevronDown size={14} className={cn("text-gray-500 transition-transform", open === item.label && "rotate-180")} />
                  </button>
                ) : (
                  <a 
                    href={item.href} 
                    className="block py-2 text-[15px] font-semibold text-gray-800 transition-colors hover:text-[#0066FF]"
                  >
                    {item.label}
                  </a>
                )}

                {/* DROPDOWN MENU */}
                <AnimatePresence>
                  {item.children && open === item.label && (
                    <motion.ul
                      initial={{ opacity: 0, y: 8 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: 8 }} 
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full w-48 rounded-xl border border-gray-100 bg-white p-2 shadow-lg"
                    >
                      {item.children.map((c) => (
                        <li key={c.label}>
                          <a 
                            href={c.href} 
                            onClick={closeAll} 
                            className="block rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-[#0066FF]"
                          >
                            {c.label}
                          </a>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </nav>

        {/* DESKTOP BUTTONS (Exactly like the image) */}
        <div className="hidden items-center gap-4 lg:flex">
          <a 
            href="/register" 
            className="rounded-full bg-[#0066FF] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Open Account
          </a>
          <a 
            href="/login" 
            className="rounded-full bg-black px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
          >
            Log In
          </a>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          type="button" 
          className="rounded-lg p-2 text-gray-800 lg:hidden" 
          aria-label={mobile ? "Close menu" : "Open menu"}
          aria-expanded={mobile} 
          onClick={() => setMobile((m) => !m)}
        >
          {mobile ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-100 bg-white lg:hidden"
          >
            <ul className="container-x space-y-1 px-4 py-4">
              {NAV.map((item) => (
                <li key={item.label}>
                  {item.children ? (
                    <>
                      <button
                        type="button" 
                        aria-expanded={mobileSub === item.label}
                        onClick={() => setMobileSub(mobileSub === item.label ? null : item.label)}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-3 font-semibold text-gray-800 hover:bg-gray-50"
                      >
                        {item.label}
                        <ChevronDown size={18} className={cn("transition-transform", mobileSub === item.label && "rotate-180")} />
                      </button>
                      {mobileSub === item.label && (
                        <ul className="ml-3 border-l-2 border-gray-100 pl-3">
                          {item.children.map((c) => (
                            <li key={c.label}>
                              <a href={c.href} onClick={closeAll} className="block rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:text-[#0066FF]">
                                {c.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <a href={item.href} onClick={closeAll} className="block rounded-xl px-3 py-3 font-semibold text-gray-800 hover:bg-gray-50">
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
              <li className="flex flex-col gap-3 pt-4">
                <a href="/register" className="w-full rounded-full bg-[#0066FF] px-6 py-3 text-center text-sm font-semibold text-white">
                  Open Account
                </a>
                <a href="/login" className="w-full rounded-full bg-black px-6 py-3 text-center text-sm font-semibold text-white">
                  Log In
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}