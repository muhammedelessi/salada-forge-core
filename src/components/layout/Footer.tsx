import { Link } from "react-router-dom";
import { ArrowRight, ArrowUp, Mail, Phone, MapPin, Clock, MessageCircle, ShieldCheck, Factory, Target } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import saladaLogo from "@/assets/SALADA_LOGO.png";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("شركة صلادة للصناعات المعدنية، أحمد بن محمد العيالي، حي النور، الرياض 14321");

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t, isRTL } = useLanguageStore();
  const isAr = isRTL();

  const footerLinks = {
    solutions: [
      { label: t("footer.landFreight"), href: "/solutions#land" },
      { label: t("footer.seaFreight"), href: "/solutions#sea" },
      { label: t("footer.airFreight"), href: "/solutions#air" },
      { label: t("footer.storageUnits"), href: "/solutions#storage" },
      { label: t("footer.spareParts"), href: "/solutions#spare" },
    ],
    company: [
      { label: isAr ? "المنتجات" : "Products", href: "/shop" },
      { label: t("footer.aboutUs"), href: "/about" },
      { label: t("footer.whySalada"), href: "/why-salada" },
      { label: t("footer.industriesServed"), href: "/industries" },
      { label: t("footer.faqLink"), href: "/faq" },
      { label: t("footer.contactUs"), href: "/contact" },
    ],
  };

  const legalLinks = [
    { label: isAr ? "سياسة الخصوصية" : "Privacy Policy", href: "/privacy" },
    { label: isAr ? "الشروط والأحكام" : "Terms of Service", href: "/terms" },
    { label: isAr ? "سياسة الاسترجاع" : "Return Policy", href: "/returns" },
  ];

  const badges = [
    { Icon: ShieldCheck, label: isAr ? "معتمد DNV" : "DNV Approved" },
    { Icon: Factory, label: isAr ? "صناعة سعودية 100%" : "100% Saudi Made" },
    { Icon: Target, label: isAr ? "رؤية 2030" : "Vision 2030" },
  ];

  const companyName = isAr ? "شركة صلادة للصناعات المعدنية" : "Salada Metal Industries Co.";

  return (
    <footer className="bg-secondary border-t border-border" dir={isAr ? "rtl" : "ltr"}>
      {/* Brand accent line */}
      <div
        className="h-[2px] w-full"
        style={{
          background:
            "linear-gradient(to right, transparent, hsl(var(--primary)/0.55) 30%, hsl(var(--primary)/0.55) 70%, transparent)",
        }}
        aria-hidden
      />

      {/* Main Footer Content */}
      <div className="industrial-container py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 rtl:text-right">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="mb-5 flex items-center hover-lift">
              <img src={saladaLogo} alt="Salada Metal Industries logo" className="h-8 md:h-10 w-auto object-contain" />
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">{t("footer.tagline")}</p>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">{t("footer.solutions")}</h4>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">{t("footer.company")}</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">{isAr ? "تواصل معنا" : "Contact"}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  {isAr ? "الرياض، حي النور، أحمد بن محمد العيالي" : "Ahmed bin Mohammed Al-Ayal, Al Noor, Riyadh"}
                  <br />
                  <span dir="ltr">RNNA7850, 14321</span>
                  <br />
                  <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {isAr ? "عرض على الخريطة" : "View on map"}
                  </a>
                </span>
              </li>
              <li>
                <a href="tel:+966500165914" className="flex items-center gap-2.5 transition-colors hover:text-primary">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  <span dir="ltr">050 016 5914</span>
                </a>
              </li>
              <li>
                <a href="mailto:Hello@salada.sa" className="flex items-center gap-2.5 transition-colors hover:text-primary">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <span dir="ltr">Hello@salada.sa</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/966500165914"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 transition-colors hover:text-primary"
                >
                  <MessageCircle className="h-4 w-4 shrink-0 text-primary" />
                  <span>{isAr ? "واتساب" : "WhatsApp"}</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{isAr ? "الأحد – الخميس: 8:00 ص – 6:00 م" : "Sun – Thu: 8:00 AM – 6:00 PM"}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="border-t border-border">
        <div className="industrial-container py-5">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {badges.map(({ Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 border border-border bg-background/40 px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
              >
                <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="industrial-container flex flex-col gap-3 py-6">
          {/* legal links + back to top */}
          <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between rtl:md:flex-row-reverse">
            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {legalLinks.map((l) => (
                <Link key={l.href} to={l.href} className="text-xs text-muted-foreground transition-colors hover:text-primary">
                  {l.label}
                </Link>
              ))}
            </nav>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-primary"
            >
              {isAr ? "العودة للأعلى" : "Back to top"}
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* copyright + registration */}
          <div className="flex flex-col gap-1 border-t border-border pt-4 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between rtl:md:flex-row-reverse">
            <p>
              © {currentYear} {companyName}. {t("footer.rights")}
            </p>
            <p dir={isAr ? "rtl" : "ltr"}>
              {isAr ? "السجل التجاري" : "CR"}: 1010462762
              <span className="mx-2 opacity-40">|</span>
              {isAr ? "الرقم الضريبي" : "VAT"}: 311664613200003
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
