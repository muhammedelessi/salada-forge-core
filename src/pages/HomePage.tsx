import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { usePageSEO } from "@/hooks/usePageSEO";
import { useLanguageStore } from "@/store/languageStore";
import heroImage from "@/assets/hero-logistics.webp";
import seaImage from "@/assets/solutions-sea.webp";
import storageImage from "@/assets/solutions-storage.webp";
import lashingImage from "@/assets/divisions-lashing.webp";
import heroPort from "@/assets/hero-port.webp";

/* ── useInView ── */
function useInView(threshold = 0.12) {
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
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ── Scroll Reveal ── */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView();
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

/* ── Animated Counter ── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const { ref, inView } = useInView(0.5);
  useEffect(() => {
    if (!inView) return;
    const step = Math.max(1, Math.ceil(target / 72));
    let cur = 0;
    const id = setInterval(() => {
      cur = Math.min(cur + step, target);
      setN(cur);
      if (cur >= target) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [inView, target]);
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

export default function HomePage() {
  const { t, isRTL } = useLanguageStore();
  const seo = usePageSEO("/");
  const isAr = isRTL();

  const solutions = [
    {
      num: "01",
      href: "/solutions#land",
      title: t("solutions.landFreight"),
      desc: t("solutions.landFreightDesc"),
      image: lashingImage,
    },
    {
      num: "02",
      href: "/solutions#sea",
      title: t("solutions.seaFreight"),
      desc: t("solutions.seaFreightDesc"),
      image: seaImage,
    },
    {
      num: "03",
      href: "/solutions#air",
      title: t("solutions.airFreight"),
      desc: t("solutions.airFreightDesc"),
      image: heroImage,
    },
    {
      num: "04",
      href: "/solutions#storage",
      title: t("solutions.storage"),
      desc: t("solutions.storageDesc"),
      image: storageImage,
    },
  ];

  const stats = [
    { value: 10, suffix: "+", label: t("stats.yearsExperience") },
    { value: 200, suffix: "+", label: t("stats.projectsDelivered") },
    { value: 50, suffix: "+", label: t("stats.clientsServed") },
    { value: 99, suffix: ".5%", label: t("stats.onTimeDelivery") },
  ];

  const industries = [
    { name: t("industries.logistics"), desc: t("industries.logisticsDesc"), href: "/industries#logistics" },
    { name: t("industries.construction"), desc: t("industries.constructionDesc"), href: "/industries#construction" },
    { name: t("industries.government"), desc: t("industries.governmentDesc"), href: "/industries#government" },
    { name: t("industries.industrial"), desc: t("industries.industrialDesc"), href: "/industries#industrial" },
    { name: t("industries.storage"), desc: t("industries.storageDesc"), href: "/industries#storage" },
  ];

  const whyItems = [
    { num: "01", title: t("why.onePartner") },
    { num: "02", title: t("why.rapidDeployment") },
    { num: "03", title: t("why.nationalCoverage") },
    { num: "04", title: t("why.compliance") },
  ];

  return (
    <Layout>
      <SEOHead {...seo} />

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative h-[100svh] min-h-[600px] max-h-[900px] flex flex-col overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Salada industrial operations"
            width={1920}
            height={1080}
            fetchPriority="high"
            decoding="sync"
            className="w-full h-full object-cover animate-hero-zoom max-w-full"
          />
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.65)" }} />
          <div className="absolute inset-0" style={{ background: "hsl(var(--gold)/0.08)" }} />
        </div>

        {/* Scan line */}
        <div
          className="absolute inset-x-0 pointer-events-none"
          style={{
            top: "38%",
            height: "1px",
            background:
              "linear-gradient(to right, transparent, hsl(var(--gold)/0.6) 30%, hsl(var(--gold)/0.6) 70%, transparent)",
            animation: "scanPulse 7s ease-in-out infinite",
          }}
        />

        {/* Corner brackets */}
        {[
          { top: "5rem", left: "1.5rem", borderTop: true, borderLeft: true },
          { top: "5rem", right: "1.5rem", borderTop: true, borderRight: true },
          { bottom: "2.5rem", left: "1.5rem", borderBottom: true, borderLeft: true },
          { bottom: "2.5rem", right: "1.5rem", borderBottom: true, borderRight: true },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute w-5 h-5 pointer-events-none"
            style={{
              ...pos,
              borderTop: pos.borderTop ? "2px solid hsl(var(--gold)/0.55)" : undefined,
              borderBottom: pos.borderBottom ? "2px solid hsl(var(--gold)/0.55)" : undefined,
              borderLeft: pos.borderLeft ? "2px solid hsl(var(--gold)/0.55)" : undefined,
              borderRight: pos.borderRight ? "2px solid hsl(var(--gold)/0.55)" : undefined,
            }}
          />
        ))}

        {/* Main content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">
          {/* H1 white — line 1 */}
          <p
            className="animate-fade-up delay-300 max-w-2xl"
            style={{
              fontSize: "clamp(0.95rem, 2vw, 1.25rem)",
              fontWeight: 700,
              lineHeight: 1.55,
              letterSpacing: "-0.01em",
              color: "#ffffff",
              marginBottom: "0.75rem",
              textAlign: "center",
            }}
          >
            {t("hero.title")}
          </p>

          {/* Gold divider small */}
          <div
            style={{ width: "2.5rem", height: "1.5px", background: "hsl(var(--gold)/0.55)", margin: "0 auto 0.75rem" }}
          />

          {/* H1 gold — line 2 */}
          <p
            className="animate-fade-up delay-400 max-w-2xl text-primary"
            style={{
              fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)",
              fontWeight: 600,
              lineHeight: 1.65,
              letterSpacing: "-0.01em",
              marginBottom: "1.5rem",
              textAlign: "center",
              color: "rgba(255,255,255,0.72)",
            }}
          >
            {t("hero.titleHighlight")}
          </p>

          {/* ── 3 Statement lines ── */}
          <div className="animate-fade-up delay-500 w-full max-w-lg mx-auto mb-8" dir={isAr ? "rtl" : "ltr"}>
            {([t("hero.line1"), t("hero.line2"), t("hero.line3")] as string[]).map((line, i) => (
              <div
                key={i}
                className="flex items-start gap-3"
                style={{
                  padding: "0.65rem 0",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  flexDirection: isAr ? "row-reverse" : "row",
                }}
              >
                <span
                  className="font-mono font-black shrink-0 mt-0.5"
                  style={{
                    fontSize: "0.6rem",
                    color: "hsl(var(--primary))",
                    letterSpacing: "0.15em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p
                  style={{
                    fontSize: "0.8rem",
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.65)",
                    textAlign: isAr ? "right" : "left",
                  }}
                >
                  {line}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div
            className={`animate-fade-up delay-600 flex flex-wrap gap-3 justify-center ${isAr ? "flex-row-reverse" : ""}`}
          >
            <Link
              to="/solutions"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono font-bold uppercase hover:opacity-90 transition-opacity"
              style={{ fontSize: "0.6875rem", padding: "0.75rem 1.75rem", letterSpacing: "0.18em" }}
            >
              <span>{t("hero.cta")}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
            </Link>
            <Link
              to="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.75rem",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#ffffff",
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                fontWeight: 700,
                textTransform: "uppercase" as const,
                letterSpacing: "0.18em",
                transition: "all 0.3s ease",
                backdropFilter: "blur(6px)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--gold)/0.7)";
                (e.currentTarget as HTMLElement).style.color = "hsl(var(--gold))";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)";
                (e.currentTarget as HTMLElement).style.color = "#ffffff";
              }}
            >
              {t("hero.quote")}
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div
          className="relative z-10 w-full"
          style={{
            background: "rgba(0,0,0,0.55)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="industrial-container">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`py-4 sm:py-5 md:py-6 px-2 text-center cursor-default transition-colors duration-200 hover:bg-white/[0.04] ${
                    i < stats.length - 1 ? "border-b md:border-b-0 md:border-r border-white/[0.08]" : ""
                  } ${i % 2 === 0 && i < stats.length - 1 ? "border-r md:border-r border-white/[0.08]" : ""}`}
                >
                  <div
                    className="font-mono font-black text-primary leading-none mb-1"
                    style={{ fontSize: "clamp(1.25rem, 3vw, 2rem)" }}
                  >
                    <Counter target={s.value} suffix={s.suffix} />
                  </div>
                  <p
                    className="font-mono font-medium uppercase tracking-[0.18em] text-white/60"
                    style={{ fontSize: "clamp(0.5rem, 1.2vw, 0.75rem)" }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
          style={{ opacity: 0.35 }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.45rem",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color: "#fff",
            }}
          >
            Scroll
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-white animate-bounce-subtle" />
        </div>
      </section>

      {/* ════════════════════════════════════
          VISION 2030
      ════════════════════════════════════ */}
      <section
        dir={isAr ? "rtl" : "ltr"}
        style={{ background: "hsl(var(--background))", borderBottom: "1px solid hsl(var(--border))" }}
      >
        <div
          style={{
            background: "hsl(var(--primary) / 0.08)",
            borderTop: "2px solid hsl(var(--primary))",
            borderBottom: "1px solid hsl(var(--primary) / 0.2)",
          }}
          className="px-5 py-8 md:px-10 md:py-10"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              <span
                className="font-mono font-black text-primary leading-none shrink-0"
                style={{ fontSize: "clamp(2.75rem, 6vw, 3.5rem)" }}
              >
                2030
              </span>
              <div
                className="w-full h-px md:w-px md:h-[52px] shrink-0"
                style={{ background: "hsl(var(--primary) / 0.25)" }}
              />
              <div>
                <span
                  className="font-mono uppercase block text-primary mb-1.5"
                  style={{ fontSize: "0.6rem", letterSpacing: "0.28em" }}
                >
                  {t("vision.label")}
                </span>
                <h2
                  className="uppercase font-black text-foreground"
                  style={{ fontSize: "clamp(1rem, 2.2vw, 1.375rem)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
                >
                  {t("vision.title")}
                </h2>
              </div>
            </div>
            <div className="max-w-[380px]">
              <p
                className="text-muted-foreground"
                style={{ fontSize: "0.8125rem", lineHeight: 1.75, marginBottom: "14px" }}
              >
                {t("vision.description")}
              </p>
              <Link
                to="/why-salada"
                className="industrial-button inline-flex items-center gap-2"
                style={{ fontSize: "0.6rem", padding: "8px 18px" }}
              >
                <span>{t("nav.whySalada")}</span>
                <ArrowUpRight className={`w-3 h-3 ${isAr ? "rotate-180" : ""}`} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          SOLUTIONS
      ════════════════════════════════════ */}
      <section dir={isAr ? "rtl" : "ltr"} className="bg-background border-b border-border">
        <div className="industrial-container py-12 md:py-16">
          <Reveal>
            <div className="flex items-end justify-between pb-6 mb-8 md:mb-10 border-b border-border">
              <div>
                <span className="font-mono uppercase block text-primary text-base" style={{ letterSpacing: "0.28em" }}>
                  — {t("solutions.label")}
                </span>
                <h2
                  className="uppercase font-black mt-2 text-foreground"
                  style={{ fontSize: "clamp(1.6rem, 3vw, 2.5rem)", letterSpacing: "-0.025em", lineHeight: 1 }}
                >
                  {t("solutions.title")}
                </h2>
              </div>
              <Link
                to="/solutions"
                className="group hidden md:inline-flex items-center gap-2 font-mono uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
                style={{
                  fontSize: "0.6875rem",
                  letterSpacing: "0.18em",
                  paddingBottom: "4px",
                  borderBottom: "1px solid hsl(var(--border))",
                }}
              >
                <span>{isAr ? "عرض الكل" : "View All"}</span>
                <ArrowRight
                  className={`w-3 h-3 transition-transform group-hover:translate-x-1 ${isAr ? "rotate-180 group-hover:-translate-x-1" : ""}`}
                />
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center items-stretch">
            {solutions.map((sol, i) => (
              <Reveal key={sol.num} delay={i * 80}>
                <Link
                  to={sol.href}
                  className="group relative flex flex-col items-center justify-between border border-border overflow-hidden p-6 md:p-8 transition-all duration-300 hover:border-primary/40 h-full"
                  style={{ minHeight: "320px" }}
                >
                  <img
                    src={sol.image}
                    alt={sol.title}
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={375}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 max-w-full"
                  />
                  <div
                    className="absolute inset-0 transition-all duration-500"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.25) 100%)",
                    }}
                  />
                  <div
                    className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                    style={{ background: "rgba(0,0,0,0.15)" }}
                  />
                  <span
                    className="relative z-10 font-mono font-black text-white/30 group-hover:text-white/50 transition-colors duration-300 block"
                    style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1 }}
                  >
                    {sol.num}
                  </span>
                  <div className="relative z-10 mt-6">
                    <h3
                      className="uppercase font-[800] text-white group-hover:text-primary transition-colors duration-300"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {sol.title}
                    </h3>
                    <p
                      className="text-white/60 mt-2 leading-relaxed line-clamp-3 transition-all duration-500 opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-20 overflow-hidden"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {sol.desc}
                    </p>
                  </div>
                  <div className="relative z-10 flex items-center justify-center gap-1.5 mt-6 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span
                      className="font-mono uppercase tracking-widest"
                      style={{ fontSize: "0.6875rem", letterSpacing: "0.18em" }}
                    >
                      {isAr ? "اكتشف" : "Explore"}
                    </span>
                    <ArrowRight className={`w-3 h-3 ${isAr ? "rotate-180" : ""}`} />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          INDUSTRIES
      ════════════════════════════════════ */}
      <section dir={isAr ? "rtl" : "ltr"} className="bg-background border-b border-border">
        <div className="industrial-container py-12 md:py-16">
          <Reveal>
            <div className="flex items-end justify-between pb-6 mb-8 md:mb-10 border-b border-border">
              <div>
                <span className="font-mono uppercase block text-primary text-base" style={{ letterSpacing: "0.28em" }}>
                  — {t("industries.label")}
                </span>
                <h2
                  className="uppercase font-black mt-2 text-foreground"
                  style={{ fontSize: "clamp(1.6rem, 3vw, 2.5rem)", letterSpacing: "-0.025em", lineHeight: 1 }}
                >
                  {t("industries.title")}
                </h2>
              </div>
              <span
                className="font-mono uppercase text-muted-foreground"
                style={{ fontSize: "0.625rem", letterSpacing: "0.18em" }}
              >
                {String(industries.length).padStart(2, "0")} sectors
              </span>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center items-stretch">
            {industries.map((ind, i) => (
              <Reveal key={ind.href} delay={i * 80}>
                <Link
                  to={ind.href}
                  className="group relative flex flex-col items-center justify-between border border-border bg-background p-6 md:p-8 transition-all duration-300 hover:border-primary/40 hover:bg-primary/[0.04] h-full"
                >
                  <span
                    className="font-mono font-black text-primary/30 group-hover:text-primary/50 transition-colors duration-300 block"
                    style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="mt-6">
                    <h3
                      className="uppercase font-[800] text-foreground group-hover:text-primary transition-colors duration-300"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {ind.name}
                    </h3>
                    <p
                      className="text-muted-foreground mt-2 leading-relaxed line-clamp-3"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {ind.desc}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 mt-6 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span
                      className="font-mono uppercase tracking-widest"
                      style={{ fontSize: "0.6875rem", letterSpacing: "0.18em" }}
                    >
                      {t("solutions.learnMore")}
                    </span>
                    <ArrowRight className={`w-3 h-3 ${isAr ? "rotate-180" : ""}`} />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          WHY SALADA
      ════════════════════════════════════ */}
      <section className="py-12 md:py-16 border-b border-border bg-background">
        <div className="industrial-container" dir={isAr ? "rtl" : "ltr"}>
          <Reveal className="mb-8 md:mb-10">
            <span
              className={`font-mono uppercase text-primary inline-flex items-center gap-2 mb-4 ${isAr ? "flex-row-reverse" : ""} text-base`}
              style={{ letterSpacing: "0.28em" }}
            >
              <span className="w-4 h-px bg-primary" />
              {t("why.label")}
            </span>
            <h2
              className="uppercase font-black mt-2 text-foreground"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.5rem)", letterSpacing: "-0.025em", lineHeight: 1 }}
            >
              {t("why.title")}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center items-stretch">
            {whyItems.map((w, i) => (
              <Reveal key={w.title} delay={i * 80}>
                <div className="group relative flex flex-col items-center justify-between border border-border bg-background p-6 md:p-8 transition-all duration-300 hover:border-primary/40 hover:bg-primary/[0.04] h-full">
                  <span
                    className="font-mono font-black text-primary/30 group-hover:text-primary/50 transition-colors duration-300 block"
                    style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1 }}
                  >
                    {w.num}
                  </span>
                  <div className="mt-6">
                    <h3
                      className="uppercase font-[800] text-foreground group-hover:text-primary transition-colors duration-300"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {w.title}
                    </h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          CTA
      ════════════════════════════════════ */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroPort}
            alt="Industrial port"
            loading="lazy"
            decoding="async"
            width={1920}
            height={1080}
            className="w-full h-full object-cover max-w-full"
            style={{ filter: "grayscale(35%) brightness(0.38)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, hsl(var(--ink-100)/0.88), hsl(var(--ink-100)/0.72))" }}
          />
        </div>
        <div className="container-xl relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <Reveal>
              <span
                className="font-mono uppercase mb-6 inline-flex justify-center"
                style={{ fontSize: "0.625rem", letterSpacing: "0.28em", color: "hsl(var(--gold))" }}
              >
                {isAr ? "تواصل معنا" : "Get In Touch"}
              </span>
              <h2
                className="uppercase font-black mb-8"
                style={{
                  fontSize: "clamp(1.6rem, 3vw, 2.5rem)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1,
                  color: "#ffffff",
                }}
              >
                {t("cta.title")}
              </h2>
              <div className={`flex flex-wrap gap-3 justify-center ${isAr ? "flex-row-reverse" : ""}`}>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono font-bold uppercase hover:opacity-90 transition-opacity"
                  style={{ fontSize: "0.6875rem", padding: "0.75rem 1.75rem", letterSpacing: "0.18em" }}
                >
                  <span>{t("cta.getQuote")}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
                </Link>
                <Link
                  to="/solutions"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.75rem 1.75rem",
                    border: "1px solid rgba(255,255,255,0.25)",
                    color: "#ffffff",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.18em",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--gold)/0.6)";
                    (e.currentTarget as HTMLElement).style.color = "hsl(var(--gold))";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)";
                    (e.currentTarget as HTMLElement).style.color = "#ffffff";
                  }}
                >
                  {t("cta.browseCatalog")}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </Layout>
  );
}
