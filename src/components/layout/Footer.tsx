import { Link } from "react-router-dom";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import saladaLogo from "@/assets/SALADA_LOGO.png";

export function Footer() {
  const year = new Date().getFullYear();
  const { t, isRTL } = useLanguageStore();
  const isAr = isRTL();

  const cols = [
    {
      heading: t("footer.solutions"),
      links: [
        { label: t("footer.landFreight"), href: "/solutions#land" },
        { label: t("footer.seaFreight"), href: "/solutions#sea" },
        { label: t("footer.airFreight"), href: "/solutions#air" },
        { label: t("footer.storageUnits"), href: "/solutions#storage" },
        { label: t("footer.spareParts"), href: "/solutions#spare" },
        { label: t("footer.customEng"), href: "/solutions#custom" },
      ],
    },
    {
      heading: t("footer.company"),
      links: [
        { label: t("footer.aboutUs"), href: "/about" },
        { label: t("footer.whySalada"), href: "/why-salada" },
        { label: t("footer.industriesServed"), href: "/industries" },
        { label: t("footer.contactUs"), href: "/contact" },
      ],
    },
    {
      heading: t("footer.support"),
      links: [
        { label: t("footer.faqLink"), href: "/faq" },
        { label: t("footer.shippingInfo"), href: "/shipping" },
        { label: t("footer.privacyPolicy"), href: "/policy" },
      ],
    },
  ];

  const contactItems = [
    { Icon: Mail, text: "Hello@salada.sa" },
    { Icon: Phone, text: "050 016 5914" },
    { Icon: MapPin, text: isAr ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia" },
  ];

  const certs = [t("footer.isoCertified"), t("footer.dnvApproved"), isAr ? "صنع في السعودية" : "Saudi Made"];

  return (
    <footer dir={isAr ? "rtl" : "ltr"} className="bg-foreground text-background">
      {/* ── NEWSLETTER ───────────────────────── */}
      <div className="border-b border-background/10">
        <div className="industrial-container py-10 md:py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: text */}
            <div className="rtl:text-right">
              <div className="flex items-center gap-2.5 mb-3 rtl:flex-row-reverse rtl:justify-end">
                <span
                  className="block shrink-0"
                  style={{ width: "1.2rem", height: "1.5px", background: "hsl(var(--primary)/0.8)" }}
                />
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] font-bold text-primary">
                  {t("footer.newsletter")}
                </span>
              </div>
              <h3
                className="font-black uppercase tracking-[-0.02em] leading-tight mb-2 text-background"
                style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)" }}
              >
                {t("footer.stayUpdated")}
              </h3>
              <p className="text-sm leading-relaxed text-background/50">{t("footer.newsletterDesc")}</p>
            </div>

            {/* Right: form */}
            <div className="flex rtl:flex-row-reverse">
              <input
                type="email"
                dir="ltr"
                placeholder={t("footer.emailPlaceholder")}
                className="
                  flex-1 min-w-0 bg-transparent border border-background/15
                  px-4 py-3 text-sm font-mono text-background
                  placeholder:text-background/25
                  focus:outline-none focus:border-primary/60
                  transition-colors duration-200
                "
              />
              <button
                className="
                  inline-flex items-center gap-2 shrink-0
                  bg-primary text-primary-foreground
                  font-mono text-[0.7rem] font-bold uppercase tracking-[0.18em]
                  px-5 py-3 hover:opacity-90 transition-opacity
                  whitespace-nowrap rtl:flex-row-reverse
                "
                style={{ minHeight: "44px" }}
              >
                {t("footer.subscribe")}
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────── */}
      <div className="industrial-container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 rtl:text-right">
            <Link to="/" className="inline-block mb-5">
              <img
                src={saladaLogo}
                alt="Salada Metal Industries"
                className="h-12 w-auto object-contain"
                style={{ filter: "brightness(0) invert(1)", opacity: 0.88 }}
              />
            </Link>

            <p className="text-sm leading-relaxed mb-6 text-background/45">{t("footer.tagline")}</p>

            {/* Contact items */}
            <ul className="space-y-2.5">
              {contactItems.map(({ Icon, text }, i) => (
                <li key={i} className="flex items-start gap-2.5 rtl:flex-row-reverse">
                  <Icon className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary" />
                  <span className="text-sm leading-snug text-background/50">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          {cols.map((col, i) => (
            <div key={i} className="rtl:text-right">
              <h4 className="font-mono text-[0.65rem] uppercase tracking-[0.22em] font-bold mb-5 text-background/35">
                {col.heading}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-background/55 hover:text-primary transition-colors duration-200 leading-snug"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM BAR ───────────────────────── */}
      <div className="border-t border-background/10">
        <div className="industrial-container py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rtl:sm:flex-row-reverse">
            {/* Copyright */}
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-background/28 rtl:text-right">
              © {year} SALADA. {t("footer.rights")}
            </p>

            {/* Certifications */}
            <div
              className="flex items-center rtl:flex-row-reverse"
              style={{ gap: "1px", background: "hsl(var(--background)/0.1)" }}
            >
              {certs.map((cert, i) => (
                <span
                  key={i}
                  className="font-mono text-[0.6rem] uppercase tracking-[0.15em] font-bold px-3 py-1.5 text-primary bg-foreground"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
