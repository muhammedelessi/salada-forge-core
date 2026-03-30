import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import heroImage from "@/assets/hero-logistics.jpg";

export default function HeroSection() {
  const { t, isRTL } = useLanguageStore();
  const isAr = isRTL();

  return (
    <section className="relative min-h-[100svh] flex items-end overflow-hidden bg-paper-0">
      {/* ── Grid overlay ── */}
      <div className="hero-grid-lines z-[2]" />

      {/* ── Corner brackets ── */}
      <div className="hero-bracket hero-bracket--tl" />
      <div className="hero-bracket hero-bracket--tr" />

      {/* ── Right image panel (desktop: 45% right, mobile: full bg) ── */}
      <div className="absolute inset-0 md:left-[55%]">
        <img
          src={heroImage}
          alt="Salada industrial operations"
          className="w-full h-full object-cover hero-img-zoom opacity-30 md:opacity-100"
        />
        {/* Fade to white on left edge (desktop only) */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(to right, hsl(var(--paper-0)) 0%, hsl(var(--paper-0)/0.92) 18%, hsl(var(--paper-0)/0.45) 55%, transparent 100%)",
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, hsl(var(--paper-0)) 0%, transparent 35%)",
          }}
        />
        {/* Scan line */}
        <div className="hero-scan-line" />
      </div>

      {/* ── Content ── */}
      <div className="container-xl relative z-10 pb-24 md:pb-32 pt-44">
        <div className={`max-w-[40rem] ${isAr ? "mr-0 ml-auto text-right" : ""}`}>
          {/* Eyebrow */}
          <div className="animate-fade-up delay-200">
            <span className={`section-label mb-8 inline-flex ${isAr ? "flex-row-reverse" : ""}`}>
              {t("hero.label")}
            </span>
          </div>

          {/* H1 — line 1 (ink) */}
          <h1 className="hero-h1 text-ink-100 mb-1 animate-fade-up delay-300">
            {t("hero.title")}
          </h1>

          {/* H1 — line 2 (gold accent) */}
          <h1 className="hero-h1 text-gold mb-10 animate-fade-up delay-400">
            {t("hero.titleHighlight")}
          </h1>

          {/* Body */}
          <p className="hero-body animate-fade-up delay-500">
            {t("hero.description")}
          </p>

          {/* Buttons */}
          <div className={`flex flex-wrap gap-3 animate-fade-up delay-600 ${isAr ? "flex-row-reverse" : ""}`}>
            <Link to="/solutions" className="btn-gold">
              <span>{t("hero.cta")}</span>
              <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
            </Link>
            <Link to="/contact" className="btn-outline">
              {t("hero.quote")}
            </Link>
          </div>

          {/* Trust badges */}
          <div className={`flex flex-wrap items-center gap-3 mt-10 animate-fade-up delay-700 ${isAr ? "flex-row-reverse" : ""}`}>
            {["ISO Certified", "DNV Approved", "Saudi Made"].map((b) => (
              <span key={b} className="hero-trust-badge">{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scroll cue ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-30">
        <span className="text-[0.5rem] font-mono uppercase tracking-[0.3em] text-ink-100">
          Scroll
        </span>
        <ChevronDown className="w-4 h-4 text-gold animate-bounce-subtle" />
      </div>

      {/* ── Bottom gold accent ── */}
      <div className="absolute bottom-0 inset-x-0 divider-gold" />
    </section>
  );
}
