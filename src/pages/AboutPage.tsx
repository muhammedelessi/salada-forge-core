import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { usePageSEO } from "@/hooks/usePageSEO";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { translations } from "@/i18n/translations";
import heroPort from "@/assets/hero-port.jpg";
import lashingImage from "@/assets/divisions-lashing.jpg";

/* ── Scroll reveal ── */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity .85s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .85s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function AboutPage() {
  const seo = usePageSEO("/about");
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];
  const isAr = isRTL();

  const pillars = [
    { num: "01", label: t.about.visionLabel, title: t.about.visionTitle, desc: t.about.visionDescription },
    { num: "02", label: t.about.missionLabel, title: t.about.missionTitle, desc: t.about.missionDescription },
  ];

  const factoryStats = [
    { value: "10+", label: isAr ? "سنوات تصنيع" : "Years Manufacturing" },
    { value: "200+", label: isAr ? "مشروع منجز" : "Projects Completed" },
    { value: "100%", label: isAr ? "صناعة سعودية" : "Saudi Made" },
    { value: "ISO", label: isAr ? "معتمد دولياً" : "Certified" },
  ];

  return (
    <Layout>
      <SEOHead {...seo} />

      {/* ════════════════════════════════
          HERO — fullscreen with image
      ════════════════════════════════ */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0">
          <img
            src={heroPort}
            alt="Salada manufacturing facility"
            className="w-full h-full object-cover"
            style={{ filter: "grayscale(15%) brightness(0.85)", animation: "heroZoom 16s ease-out both" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(10,8,4,0.65) 0%, rgba(10,8,4,0.5) 50%, rgba(10,8,4,0.72) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: isAr
                ? "linear-gradient(to left, rgba(10,8,4,0.65), transparent 55%)"
                : "linear-gradient(to right, rgba(10,8,4,0.65), transparent 55%)",
            }}
          />
          {/* grid lines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,.03) 0, rgba(255,255,255,.03) 1px, transparent 1px, transparent 52px), repeating-linear-gradient(90deg, rgba(255,255,255,.03) 0, rgba(255,255,255,.03) 1px, transparent 1px, transparent 52px)",
            }}
          />
          {/* scan line */}
          <div
            className="absolute inset-x-0 pointer-events-none"
            style={{
              top: "38%",
              height: "1px",
              background:
                "linear-gradient(to right, transparent, hsl(var(--primary)/0.5) 30%, hsl(var(--primary)/0.5) 70%, transparent)",
              animation: "scanPulse 8s ease-in-out infinite",
            }}
          />
          {/* corner marks */}
          <div
            className="absolute top-6 left-6 w-5 h-5"
            style={{
              borderTop: "1.5px solid hsl(var(--primary)/0.5)",
              borderLeft: "1.5px solid hsl(var(--primary)/0.5)",
            }}
          />
          <div
            className="absolute top-6 right-6 w-5 h-5"
            style={{
              borderTop: "1.5px solid hsl(var(--primary)/0.5)",
              borderRight: "1.5px solid hsl(var(--primary)/0.5)",
            }}
          />
          {/* bottom gold line */}
          <div
            className="absolute bottom-0 inset-x-0"
            style={{
              height: "1px",
              background:
                "linear-gradient(to right, transparent, hsl(var(--primary)/0.4) 30%, hsl(var(--primary)/0.4) 70%, transparent)",
            }}
          />
        </div>

        <div className="industrial-container relative z-10">
          <div className={`max-w-3xl ${isAr ? "text-right ml-auto mr-0" : ""}`}>
            {/* breadcrumb */}
            <nav
              className={`flex items-center gap-2 mb-8 animate-fade-up delay-100 ${isAr ? "flex-row-reverse justify-end" : ""}`}
            >
              <Link
                to="/"
                className="font-mono text-[0.5rem] uppercase tracking-[0.2em] transition-colors"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {isAr ? "الرئيسية" : "Home"}
              </Link>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
              <span
                className="font-mono text-[0.5rem] uppercase tracking-[0.2em]"
                style={{ color: "hsl(var(--primary))" }}
              >
                {isAr ? "من نحن" : "About"}
              </span>
            </nav>

            {/* eyebrow */}
            <div
              className={`flex items-center gap-3 mb-5 animate-fade-up delay-200 ${isAr ? "flex-row-reverse justify-end" : ""}`}
            >
              <span
                className="block flex-shrink-0"
                style={{ width: "1.5rem", height: "1.5px", background: "hsl(var(--primary)/0.7)" }}
              />
              <span
                className="font-mono text-[0.6rem] uppercase tracking-[0.3em]"
                style={{ color: "hsl(var(--primary))" }}
              >
                {t.about.label}
              </span>
            </div>

            {/* H1 */}
            <h1
              className="font-black uppercase leading-[0.92] tracking-[-0.03em] mb-2 animate-fade-up delay-300"
              style={{ fontSize: "clamp(2.25rem, 5.5vw, 4rem)", color: "#ffffff" }}
            >
              {isAr ? "عن" : "About"}
            </h1>
            <h1
              className="font-black uppercase leading-[0.92] tracking-[-0.03em] mb-3 animate-fade-up delay-400"
              style={{ fontSize: "clamp(2.25rem, 5.5vw, 4rem)", color: "hsl(var(--primary))" }}
            >
              Salada
            </h1>

            {/* divider */}
            <div
              className={`h-px mb-6 animate-fade-up delay-400 ${isAr ? "ml-auto mr-0" : ""}`}
              style={{ width: "3rem", background: "hsl(var(--primary)/0.55)" }}
            />

            {/* description */}
            <p
              className="text-sm md:text-base leading-relaxed max-w-xl mb-6 animate-fade-up delay-500"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {t.about.descP1}
            </p>

            {/* CTAs */}
            <div className={`flex flex-wrap gap-3 animate-fade-up delay-600 ${isAr ? "flex-row-reverse" : ""}`}>
              <Link
                to="/solutions"
                className={`inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] px-6 py-3 transition-all duration-300 hover:opacity-90 ${isAr ? "flex-row-reverse" : ""}`}
              >
                <span>{isAr ? "حلولنا" : "Our Solutions"}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
              </Link>
              <Link
                to="/contact"
                className={`inline-flex items-center gap-2 px-6 py-3 border font-mono text-[0.65rem] uppercase tracking-[0.18em] transition-all duration-300 ${isAr ? "flex-row-reverse" : ""}`}
                style={{ borderColor: "rgba(255,255,255,0.25)", color: "#ffffff" }}
              >
                {t.about.contactUs}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          INTRO — two column editorial
      ════════════════════════════════ */}
      <section className="bg-background border-b border-border py-12 md:py-16">
        <div className="industrial-container">
          <div className={`grid md:grid-cols-2 gap-10 md:gap-16 items-start ${isAr ? "text-right" : ""}`}>
            <Reveal>
              <span className={`flex items-center gap-3 mb-5 ${isAr ? "flex-row-reverse justify-end" : ""}`}>
                <span
                  style={{
                    width: "1.5rem",
                    height: "1.5px",
                    background: "hsl(var(--primary)/0.7)",
                    display: "block",
                    flexShrink: 0,
                  }}
                />
                <span
                  className="font-mono text-[0.6rem] uppercase tracking-[0.3em]"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {isAr ? "قصتنا" : "Our Story"}
                </span>
              </span>
              <h2
                className="font-black uppercase leading-[0.95] tracking-[-0.02em] mb-6"
                style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: "hsl(var(--foreground))" }}
              >
                {isAr ? "صانع سعودي" : "A Saudi"}{" "}
                <span style={{ color: "hsl(var(--primary))" }}>{isAr ? "معتمد" : "Manufacturer"}</span>
              </h2>
              <p
                className="text-sm md:text-base leading-relaxed mb-3"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {t.about.descP1}
              </p>
              <p className="text-sm md:text-base leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                {t.about.descP2}
              </p>
            </Reveal>

            {/* stats grid */}
            <Reveal delay={150}>
              <div className="grid grid-cols-2 gap-px" style={{ background: "hsl(var(--border))" }}>
                {factoryStats.map((s, i) => (
                  <div
                    key={i}
                    className="bg-background p-5 hover:bg-secondary/40 transition-colors duration-200"
                    style={{ background: i % 2 === 1 ? "hsl(var(--secondary)/0.3)" : "hsl(var(--background))" }}
                  >
                    <div
                      className="font-mono font-black mb-1"
                      style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", color: "hsl(var(--primary))" }}
                    >
                      {s.value}
                    </div>
                    <div
                      className="font-mono text-[0.55rem] uppercase tracking-[0.2em]"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          PILLARS — Vision, Mission, Commitment
      ════════════════════════════════ */}
      <section className="bg-secondary/30 border-b border-border py-12 md:py-16">
        <div className="industrial-container">
          <Reveal className={`mb-8 ${isAr ? "text-right" : ""}`}>
            <span className={`flex items-center gap-3 mb-5 ${isAr ? "flex-row-reverse justify-end" : ""}`}>
              <span
                style={{
                  width: "1.5rem",
                  height: "1.5px",
                  background: "hsl(var(--primary)/0.7)",
                  display: "block",
                  flexShrink: 0,
                }}
              />
              <span
                className="font-mono text-[0.6rem] uppercase tracking-[0.3em]"
                style={{ color: "hsl(var(--primary))" }}
              >
                {isAr ? "مبادئنا" : "Our Principles"}
              </span>
            </span>
            <h2
              className="font-black uppercase leading-[0.95] tracking-[-0.02em]"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: "hsl(var(--foreground))" }}
            >
              {isAr ? "رؤيتنا ورسالتنا" : "Vision, Mission"} <br />
              <span style={{ color: "hsl(var(--primary))" }}>{isAr ? "والتزامنا" : "& Commitment"}</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "hsl(var(--border))" }}>
            {pillars.map((p, i) => (
              <Reveal key={p.num} delay={i * 80}>
                <div
                  className="bg-background p-5 md:p-7 h-full group hover:bg-primary/5 transition-colors duration-300"
                  style={{ background: "hsl(var(--background))" }}
                >
                  {/* number */}
                  <div
                    className="font-mono font-black leading-none mb-2"
                    style={{ fontSize: "1.75rem", color: "hsl(var(--primary))", opacity: 0.55 }}
                  >
                    {p.num}
                  </div>

                  {/* accent bar */}
                  <div
                    className={`h-px mb-5 transition-all duration-400 group-hover:w-10 ${isAr ? "ml-auto mr-0" : ""}`}
                    style={{ width: "1.5rem", background: "hsl(var(--primary))" }}
                  />

                  {/* label */}
                  <span
                    className="font-mono text-[0.55rem] uppercase tracking-[0.25em] mb-3 block"
                    style={{ color: "hsl(var(--primary)/0.7)" }}
                  >
                    {p.label}
                  </span>

                  {/* title */}
                  <h3
                    className={`font-black uppercase leading-tight tracking-[-0.01em] mb-4 group-hover:text-primary transition-colors duration-300 ${isAr ? "text-right" : ""}`}
                    style={{ fontSize: "1rem", color: "hsl(var(--foreground))" }}
                  >
                    {p.title}
                  </h3>

                  {/* description */}
                  <p
                    className={`text-sm leading-relaxed ${isAr ? "text-right" : ""}`}
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {p.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          FACTORY — editorial image + text
      ════════════════════════════════ */}
      <section className="bg-background border-b border-border py-12 md:py-16">
        <div className="industrial-container">
          <div className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${isAr ? "text-right" : ""}`}>
            {/* Text */}
            <Reveal className={isAr ? "order-2 md:order-1" : ""}>
              <span className={`flex items-center gap-3 mb-5 ${isAr ? "flex-row-reverse justify-end" : ""}`}>
                <span
                  style={{
                    width: "1.5rem",
                    height: "1.5px",
                    background: "hsl(var(--primary)/0.7)",
                    display: "block",
                    flexShrink: 0,
                  }}
                />
                <span
                  className="font-mono text-[0.6rem] uppercase tracking-[0.3em]"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {t.about.factoryLabel}
                </span>
              </span>
              <h2
                className="font-black uppercase leading-[0.95] tracking-[-0.02em] mb-6"
                style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: "hsl(var(--foreground))" }}
              >
                {isAr ? "منشأة" : "Our"}{" "}
                <span style={{ color: "hsl(var(--primary))" }}>{isAr ? "التصنيع" : "Factory"}</span>
              </h2>
              <p
                className="text-sm md:text-base leading-relaxed mb-4"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {t.about.factoryP1}
              </p>
              <p
                className="text-sm md:text-base leading-relaxed mb-5"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {t.about.factoryP2}
              </p>

              {/* certifications row */}
              <div className={`flex flex-wrap gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
                {["ISO Certified", "DNV Approved", "Saudi Made"].map((badge) => (
                  <span
                    key={badge}
                    className="font-mono text-[0.55rem] uppercase tracking-[0.2em] px-3 py-1.5"
                    style={{
                      background: "hsl(var(--primary)/0.08)",
                      border: "1px solid hsl(var(--primary)/0.25)",
                      color: "hsl(var(--primary))",
                    }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </Reveal>

            {/* Image */}
            <Reveal delay={150} className={isAr ? "order-1 md:order-2" : ""}>
              <div className="relative aspect-[4/3] overflow-hidden border border-border">
                <img
                  src={lashingImage}
                  alt="Salada manufacturing facility"
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(10%)" }}
                />
                {/* gold overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "hsl(var(--primary)/0.06)" }}
                />

                {/* bottom label */}
                <div
                  className={`absolute bottom-0 ${isAr ? "right-0 text-right" : "left-0"} p-5`}
                  style={{ background: "linear-gradient(to top, rgba(10,8,4,0.85), transparent)" }}
                >
                  <p
                    className="font-mono text-[0.55rem] uppercase tracking-[0.2em]"
                    style={{ color: "hsl(var(--primary))" }}
                  >
                    {isAr ? "منشأة صلادة — الرياض" : "Salada Facility — Riyadh, KSA"}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          CTA — dark full bleed
      ════════════════════════════════ */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroPort}
            alt="Industrial operations"
            loading="lazy"
            className="w-full h-full object-cover"
            style={{ filter: "grayscale(30%) brightness(0.38)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(10,8,4,0.92), rgba(10,8,4,0.75))" }}
          />
        </div>

        <div className="industrial-container relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <Reveal>
              <span className="flex items-center justify-center gap-3 mb-6">
                <span
                  style={{ width: "1.5rem", height: "1.5px", background: "hsl(var(--primary)/0.7)", display: "block" }}
                />
                <span
                  className="font-mono text-[0.6rem] uppercase tracking-[0.3em]"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {isAr ? "تواصل معنا" : "Work With Us"}
                </span>
                <span
                  style={{ width: "1.5rem", height: "1.5px", background: "hsl(var(--primary)/0.7)", display: "block" }}
                />
              </span>

              <h2
                className="font-black uppercase leading-[0.92] tracking-[-0.03em] mb-5"
                style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", color: "#ffffff" }}
              >
                {t.about.partnerCTA}
              </h2>
              <p className="text-sm leading-relaxed mb-10 max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
                {t.about.partnerDesc}
              </p>

              <div className={`flex flex-wrap gap-3 justify-center ${isAr ? "flex-row-reverse" : ""}`}>
                <Link
                  to="/contact"
                  className={`inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] px-7 py-3.5 transition-all duration-300 hover:opacity-90 ${isAr ? "flex-row-reverse" : ""}`}
                >
                  <span>{t.about.contactUs}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
                </Link>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-7 py-3.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] transition-all duration-300"
                  style={{ border: "1px solid rgba(255,255,255,0.22)", color: "#ffffff" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--primary)/0.6)";
                    (e.currentTarget as HTMLElement).style.color = "hsl(var(--primary))";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.22)";
                    (e.currentTarget as HTMLElement).style.color = "#ffffff";
                  }}
                >
                  {t.about.viewProducts}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </Layout>
  );
}
