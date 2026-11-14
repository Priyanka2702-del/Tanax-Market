"use client";

const SOCIALS = [
  { label: "YouTube", img: "/images/youtube.png" },
  { label: "Instagram", img: "/images/instagram.png" },
  { label: "LinkedIn", img: "/images/linkedin.png" },
  { label: "Facebook", img: "/images/facebook.png" },
  { label: "Telegram", img: "/images/telegram.png" },
];

const COLUMNS = [
  {
    title: "Trading",
    links: ["Forex", "Metals", "Crypto", "Indices", "Stocks", "Commodities"],
  },
  {
    title: "Platforms",
    links: ["Platform", "Economic Calendar"],
  },
  {
    title: "Accounts",
    links: ["Account type", "Deposit Withdrawal"],
  },
  {
    title: "Quick Links",
    links: ["About Us", "Partnership", "Contact Us"],
  },
];

export default function Footer() {
  return (
    <footer id="footer" className="bg-white">
      <div className="container-x pt-16 pb-8">

        {/* ===== TOP: Left text + Right columns ===== */}
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">

          {/* LEFT: Help text + Social icons */}
          <div>
            <h2 className="text-3xl font-extrabold leading-tight text-[#111] sm:text-[2.2rem]">
              We&rsquo;re here to help 24/7!
            </h2>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-gray-500">
              Our chatbot provides round-the-clock assistance, and our support
              team is available from 08:00 to 16:00 GMT+2, Monday to Friday.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href="#footer"
                  aria-label={s.label}
                  className="block transition hover:-translate-y-0.5"
                >
                  <img
                    src={s.img}
                    alt={s.label}
                    className="h-11 w-11 rounded-xl object-contain"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT: 4 Link Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-xl font-extrabold text-[#111]">
                  {col.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#home"
                        className="text-[15px] text-gray-600 transition hover:text-[#1a73e8]"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ===== MIDDLE: Links + Copyright ===== */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row">
          <div className="flex items-center gap-3 text-[15px] font-semibold text-[#111]">
            <a href="#" className="transition hover:text-[#1a73e8]">
              Privacy Policy
            </a>
            <span className="text-gray-300">|</span>
            <a href="#" className="transition hover:text-[#1a73e8]">
              Terms & Condition
            </a>
          </div>
          <p className="text-[13px] text-gray-500">
            &copy; 2025 Tenex Markets Ltd. Is One Of The Most Secure, Fast And
            Trustworthy Trading Platforms In The Industry. All rights reserved.
          </p>
        </div>

        {/* ===== BOTTOM: Legal Info ===== */}
        <div className="mt-8 space-y-4 border-t border-gray-200 pt-8 text-[13px] leading-relaxed text-gray-500">
          <p>
            <strong className="text-[#111]">Registered Address :</strong>{" "}
            Ground Floor, The Sotheby Building, Rodney Village, Rodney Bay,
            Gros-Islet, Saint Lucia.
          </p>
          <p>
            <strong className="text-[#111]">Registration No :</strong> 2025-00197
          </p>
          <p>
            <strong className="text-[#111]">Email :</strong>{" "}
            <a href="mailto:admin@tenexmarket.com" className="text-[#1a73e8]">
              admin@tanaxmarket.com
            </a>
          </p>
          <p>
            <strong className="text-[#111]">License :</strong> Tenex Markets
            Ltd. is a Forex service provider registered in Ground Floor, The
            Sotheby Building, Rodney Village, Rodney Bay, Gros-Islet, Saint Lucia.
          </p>
          <p>
            <strong className="text-[#111]">Risk Warning:</strong> An investment
            in derivatives may mean investors may lose an amount even greater
            than their original investment. Anyone wishing to invest in any of
            the products mentioned in Tenex Market Ltd should seek their own
            financial or professional advice. Trading of securities, forex, stock
            market, commodities, options, and futures may not be suitable for
            everyone and involves the risk of losing part or all of your money.
            Trading in the financial markets has large potential rewards, but
            also large potential risk. You must be aware of the risks and be
            willing to accept them in order to invest in the markets. Don&rsquo;t
            invest and trade with money which you can&rsquo;t afford to lose.
            Forex Trading is not allowed in some countries, before investing your
            money, make sure whether your country is allowing this or not. You
            are strongly advised to obtain independent financial, legal, and tax
            advice before proceeding with any currency or spot metals trade.
            Nothing in this site should be read or construed as constituting
            advice on the part of Tenex Market Ltd Investment or any of its
            affiliates, directors, officers, or employees.
          </p>
          <p>
            <strong className="text-[#111]">
              Jurisdictions and Restrictions:
            </strong>{" "}
            Tenex Market Ltd Investment Ltd does not provide services for
            citizens/residents of the United States, Cuba, Iraq, Myanmar, North
            Korea, Sudan. The services of Tenex Market Ltd Investment Ltd are not
            intended for distribution to, or use by, any person in any country or
            jurisdiction where such distribution or use would be contrary to
            local law or regulation.
          </p>
        </div>
      </div>
    </footer>
  );
}