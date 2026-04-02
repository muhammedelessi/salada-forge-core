import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import heroImage from "@/assets/hero-logistics.webp";

export default function HeroSection() {
  const { t, isRTL } = useLanguageStore();
  const isAr = isRTL();

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
      {/* ── Background image ── */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Salada industrial operations"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="sync"
          className="w-full h-full object-cover scale-105 max-w-full"
        />
      </div>

      {/* ── Dark overlay ── */}
      <div className="absolute inset-0 bg-black/65 z-[1]" />

      {/* ── Bottom gradient fade ── */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
        }}
      />

      {/* ── Content ── */}
      <div
        className={`relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-12 pb-28 sm:pb-32 md:pb-36 pt-32 sm:pt-40 ${
          isAr ? "text-right" : "text-left"
        }`}
      >
        <div className={`max-w-2xl ${isAr ? "mr-0 ml-auto" : ""}`}>
          {/* Eyebrow */}
          <span
            className={`inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-primary mb-5 sm:mb-6 animate-industrial-fade ${
              isAr ? "flex-row-reverse" : ""
            }`}
          >
            {t("hero.label")}
          </span>

          {/* H1 — main */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter leading-[1.05] text-white mb-1 animate-industrial-fade delay-100"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}
          >
            {t("hero.title")}
          </h1>

          {/* H1 — gold accent */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter leading-[1.05] text-primary mb-6 sm:mb-8 md:mb-10 animate-industrial-fade delay-200"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.4)" }}
          >
            {t("hero.titleHighlight")}
          </h1>

          {/* Body */}
          <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-lg mb-8 sm:mb-10 animate-industrial-fade delay-300">
            {t("hero.description")}
          </p>

          {/* Buttons */}
          <div
            className={`flex flex-col sm:flex-row flex-wrap gap-3 animate-industrial-fade delay-400 ${
              isAr ? "sm:flex-row-reverse" : ""
            }`}
          >
            <Link
              to="/solutions"
              className="industrial-button w-full sm:w-auto"
            >
              <span>{t("hero.cta")}</span>
              <ArrowRight
                className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`}
              />
            </Link>
            <Link
              to="/contact"
              className="industrial-button-outline w-full sm:w-auto"
              style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}
            >
              {t("hero.quote")}
            </Link>
          </div>

          {/* Trust badges */}
          <div
            className={`flex flex-wrap items-center gap-2 sm:gap-3 mt-8 sm:mt-10 animate-industrial-fade delay-500 ${
              isAr ? "flex-row-reverse" : ""
            }`}
          >
            {["ISO Certified", "DNV Approved", "Saudi Made"].map((b) => (
              <span
                key={b}
                className="px-3 py-1.5 text-[0.65rem] sm:text-xs font-mono uppercase tracking-wider text-white/60 border border-white/15 bg-white/5"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scroll cue ── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-40">
        <span className="text-[0.65rem] font-mono uppercase tracking-[0.3em] text-white/60">
          Scroll
        </span>
        <ChevronDown className="w-4 h-4 text-primary animate-bounce" />
      </div>

      {/* ── Bottom gold accent line ── */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-primary z-10" />
    </section>
  );
}
