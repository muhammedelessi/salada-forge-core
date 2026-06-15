import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import heroPort from "@/assets/hero-port.webp";

interface PartnerCTAProps {
  /** All optional — defaults to the shared `cta.*` copy. */
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
}

/**
 * Shared dark "Ready to partner" call-to-action section used across the
 * main marketing pages. Defaults to the canonical `cta.*` copy; pass props
 * to override per page.
 */
export function PartnerCTA({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryTo = "/contact",
  secondaryLabel,
  secondaryTo = "/solutions",
}: PartnerCTAProps = {}) {
  const { t, isRTL } = useLanguageStore();
  const isAr = isRTL();

  return (
    <section className="relative overflow-hidden py-14 md:py-20" dir={isAr ? "rtl" : "ltr"}>
      <div className="absolute inset-0">
        <img
          src={heroPort}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          width={1920}
          height={1080}
          className="h-full w-full max-w-full object-cover"
          style={{ filter: "grayscale(25%) brightness(0.35)" }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(8,6,2,0.82)" }} />
      </div>

      <div className="industrial-container relative z-10">
        <div className="mx-auto max-w-xl text-center">
          {/* eyebrow */}
          <div className={`mb-3 flex items-center justify-center gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
            <span style={{ width: "1.25rem", height: "1.5px", background: "hsl(var(--primary)/0.65)", display: "block" }} />
            <span className="label-text text-label-md uppercase tracking-[0.25em]" style={{ color: "hsl(var(--primary))" }}>
              {eyebrow ?? (isAr ? "تواصل معنا" : "Get Started")}
            </span>
            <span style={{ width: "1.25rem", height: "1.5px", background: "hsl(var(--primary)/0.65)", display: "block" }} />
          </div>

          <h2
            className="mb-4 font-black uppercase leading-[0.92] tracking-[-0.025em]"
            style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", color: "#fff" }}
          >
            {title ?? t("cta.title")}
          </h2>

          <p className="mx-auto mb-7 max-w-md leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            {description ?? t("cta.description")}
          </p>

          <div className={`flex flex-wrap justify-center gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
            <Link to={primaryTo} className="btn-primary w-full sm:w-auto">
              <span>{primaryLabel ?? t("cta.getQuote")}</span>
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </Link>
            <Link to={secondaryTo} className="btn-ghost-dark w-full sm:w-auto">
              {secondaryLabel ?? t("cta.browseCatalog")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
