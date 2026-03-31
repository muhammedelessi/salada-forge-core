import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { usePageSEO } from "@/hooks/usePageSEO";
import { useLanguageStore } from "@/store/languageStore";
import heroImage from "@/assets/hero-logistics.jpg";
import seaImage from "@/assets/solutions-sea.jpg";
import storageImage from "@/assets/solutions-storage.jpg";
import lashingImage from "@/assets/divisions-lashing.jpg";
import heroPort from "@/assets/hero-port.jpg";

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
          HERO — Centered, full viewport, bg image
          كل العناصر تظهر في شاشة واحدة بدون scroll
      ════════════════════════════════════════ */}
      <section className="relative h-[100svh] min-h-[600px] max-h-[900px] flex flex-col overflow-hidden">
        {/* ── Background image ── */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Salada industrial operations"
            className="w-full h-full object-cover animate-hero-zoom"
          />
          {/* Multi-layer overlay: warm dark tint + vignette */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0, 0, 0, 0.65)" }}
          />
          {/* warm gold tint layer */}
          <div className="absolute inset-0" style={{ background: "hsl(var(--gold)/0.08)" }} />
        </div>




        {/* ── Animated gold scan line ── */}
        <div
          className="absolute inset-x-0 pointer-events-none"
          style={{
            top: "38%",
            height: "1px",
            background: `linear-gradient(to right, transparent, hsl(var(--gold)/0.6) 30%, hsl(var(--gold)/0.6) 70%, transparent)`,
            animation: "scanPulse 7s ease-in-out infinite",
          }}
        />

        {/* ── Corner bracket marks ── */}
        <div
          className="absolute top-20 left-6 md:left-10 w-5 h-5 pointer-events-none"
          style={{ borderTop: "2px solid hsl(var(--gold)/0.55)", borderLeft: "2px solid hsl(var(--gold)/0.55)" }}
        />
        <div
          className="absolute top-20 right-6 md:right-10 w-5 h-5 pointer-events-none"
          style={{ borderTop: "2px solid hsl(var(--gold)/0.55)", borderRight: "2px solid hsl(var(--gold)/0.55)" }}
        />
        <div
          className="absolute bottom-10 left-6 md:left-10 w-5 h-5 pointer-events-none"
          style={{ borderBottom: "2px solid hsl(var(--gold)/0.55)", borderLeft: "2px solid hsl(var(--gold)/0.55)" }}
        />
        <div
          className="absolute bottom-10 right-6 md:right-10 w-5 h-5 pointer-events-none"
          style={{ borderBottom: "2px solid hsl(var(--gold)/0.55)", borderRight: "2px solid hsl(var(--gold)/0.55)" }}
        />

        {/* ── Main centered content ── */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">

          {/* H1 — white */}
          <h1
            className="animate-fade-up delay-300"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              fontWeight: 900,
              textTransform: "uppercase",
              lineHeight: 0.93,
              letterSpacing: "-0.03em",
              color: "#ffffff",
              marginBottom: "0.25rem",
            }}
          >
            {t("hero.title")}
          </h1>

          {/* H1 — gold accent */}
          <h1
            className="animate-fade-up delay-400"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              fontWeight: 900,
              textTransform: "uppercase",
              lineHeight: 0.93,
              letterSpacing: "-0.03em",
              color: "hsl(var(--gold))",
              marginBottom: "1.25rem",
            }}
          >
            {t("hero.titleHighlight")}
          </h1>

          {/* Gold divider */}
          <div
            className="animate-fade-up delay-450"
            style={{
              width: "3rem",
              height: "1.5px",
              background: "hsl(var(--gold)/0.6)",
              margin: "0 auto 1.25rem",
            }}
          />

          {/* CTA Buttons */}
          <div
            className={`animate-fade-up delay-600 flex flex-wrap gap-3 justify-center ${isAr ? "flex-row-reverse" : ""}`}
            style={{ marginBottom: "1.5rem" }}
          >
            <Link to="/solutions" className="btn-gold" style={{ fontSize: "0.6rem", padding: "0.75rem 1.75rem" }}>
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
                fontSize: "0.6rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
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

        {/* ── Stats bar — pinned to bottom ── */}
        <div
          className="relative z-10 w-full"
          style={{
            background: "rgba(0, 0, 0, 0.55)",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div className="container-xl">
            <div className="grid grid-cols-4">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className="py-3 md:py-5 text-center cursor-default"
                  style={{
                    borderRight: i < stats.length - 1 ? "1px solid rgba(255, 255, 255, 0.08)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255, 255, 255, 0.04)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                      fontWeight: 900,
                      color: "#c49614",
                      lineHeight: 1,
                      marginBottom: "4px",
                    }}
                  >
                    <Counter target={s.value} suffix={s.suffix} />
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.5rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.22em",
                      color: "rgba(255, 255, 255, 0.4)",
                    }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Scroll cue ── */}
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
      <section className="bg-paper-1 py-12 md:py-16 border-b border-warm">
        <div className="container-xl">
          <div className="grid md:grid-cols-2 gap-14 md:gap-24 items-center">
            <Reveal className={isAr ? "text-right order-2 md:order-1" : ""}>
              <span
                className={`font-mono uppercase block text-primary mb-5 ${isAr ? "flex-row-reverse" : ""}`}
                style={{ fontSize: "0.625rem", letterSpacing: "0.28em" }}
              >
                {t("vision.label")}
              </span>
              <h2
                className="uppercase font-black text-foreground mb-5"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.5rem)", letterSpacing: "-0.025em", lineHeight: 1 }}
              >
                {t("vision.title")}
              </h2>
              <p className="max-w-md mb-7 text-muted-foreground" style={{ fontSize: "0.8125rem", lineHeight: 1.7 }}>{t("vision.description")}</p>
              <Link
                to="/why-salada"
                className="btn-gold inline-flex"
                style={{ fontSize: "0.6875rem", padding: "0.75rem 1.75rem", letterSpacing: "0.18em" }}
              >
                <span>{isAr ? "تعرف على صلادة" : "About Salada"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          SOLUTIONS
      ════════════════════════════════════ */}
      <section
        dir={isAr ? "rtl" : "ltr"}
        className="bg-background border-b border-border"
      >
        <div className="industrial-container py-12 md:py-16">
          {/* HEADER */}
          <Reveal>
            <div className="flex items-end justify-between pb-6 mb-8 md:mb-10 border-b border-border">
              <div>
                <span
                  className="font-mono uppercase block text-primary"
                  style={{ fontSize: "0.625rem", letterSpacing: "0.28em" }}
                >
                  — {t("solutions.label")}
                </span>
                <h2
                  className="uppercase font-black mt-2 text-foreground"
                  style={{
                    fontSize: "clamp(1.6rem, 3vw, 2.5rem)",
                    letterSpacing: "-0.025em",
                    lineHeight: 1,
                  }}
                >
                  {t("solutions.title")}
                </h2>
              </div>
              <Link
                to="/solutions"
                className="group hidden md:inline-flex items-center gap-2 font-mono uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
                style={{ fontSize: "0.6875rem", letterSpacing: "0.18em", paddingBottom: "4px", borderBottom: "1px solid hsl(var(--border))" }}
              >
                <span>{isAr ? "عرض الكل" : "View All"}</span>
                <ArrowRight className={`w-3 h-3 transition-transform group-hover:translate-x-1 ${isAr ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
              </Link>
            </div>
          </Reveal>

          {/* CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center items-stretch">
            {solutions.map((sol, i) => (
              <Reveal key={sol.num} delay={i * 80}>
                <Link
                  to={sol.href}
                  className="group relative flex flex-col items-center justify-between border border-border overflow-hidden p-6 md:p-8 transition-all duration-300 hover:border-primary/40 h-full"
                  style={{ minHeight: "320px" }}
                >
                  {/* Background image */}
                  <img
                    src={sol.image}
                    alt={sol.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Dark overlay */}
                  <div
                    className="absolute inset-0 transition-all duration-500"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.25) 100%)" }}
                  />
                  <div className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100" style={{ background: "rgba(0,0,0,0.15)" }} />

                  {/* Number */}
                  <span
                    className="relative z-10 font-mono font-black text-white/30 group-hover:text-white/50 transition-colors duration-300 block"
                    style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1 }}
                  >
                    {sol.num}
                  </span>

                  {/* Text */}
                  <div className="relative z-10 mt-6">
                    <h3 className="uppercase font-[800] text-white group-hover:text-primary transition-colors duration-300" style={{ fontSize: "0.875rem" }}>
                      {sol.title}
                    </h3>
                    <p className="text-white/60 mt-2 leading-relaxed line-clamp-3 transition-all duration-500 opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-20 overflow-hidden" style={{ fontSize: "0.75rem" }}>
                      {sol.desc}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="relative z-10 flex items-center justify-center gap-1.5 mt-6 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <span className="font-mono uppercase tracking-widest" style={{ fontSize: "0.6875rem", letterSpacing: "0.18em" }}>
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
      <section
        dir={isAr ? "rtl" : "ltr"}
        className="bg-background border-b border-border"
      >
        <div className="industrial-container py-12 md:py-16">
          {/* HEADER */}
          <Reveal>
            <div className="flex items-end justify-between pb-6 mb-8 md:mb-10 border-b border-border">
              <div>
                <span
                  className="font-mono uppercase block text-primary"
                  style={{ fontSize: "0.625rem", letterSpacing: "0.28em" }}
                >
                  — {t("industries.label")}
                </span>
                <h2
                  className="uppercase font-black mt-2 text-foreground"
                  style={{
                    fontSize: "clamp(1.6rem, 3vw, 2.5rem)",
                    letterSpacing: "-0.025em",
                    lineHeight: 1,
                  }}
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

          {/* CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center items-stretch">
            {industries.map((ind, i) => (
              <Reveal key={ind.href} delay={i * 80}>
                <Link
                  to={ind.href}
                  className="group relative flex flex-col items-center justify-between border border-border bg-background p-6 md:p-8 transition-all duration-300 hover:border-primary/40 hover:bg-primary/[0.04] h-full"
                >
                  {/* Number */}
                  <span
                    className="font-mono font-black text-primary/30 group-hover:text-primary/50 transition-colors duration-300 block"
                    style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Text */}
                  <div className="mt-6">
                    <h3 className="uppercase font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 text-lg">
                      {ind.name}
                    </h3>
                    <p className="text-muted-foreground mt-2 leading-relaxed line-clamp-3 text-sm">
                      {ind.desc}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center gap-1.5 mt-6 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-mono uppercase text-[9px] tracking-widest">
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
      <section className="py-20 md:py-32 border-b border-border bg-background">
        <div className="industrial-container" dir={isAr ? "rtl" : "ltr"}>
          <Reveal className="mb-12 text-center">
            <span
              className={`font-mono uppercase text-primary inline-flex items-center gap-2 mb-4 ${isAr ? "flex-row-reverse" : ""}`}
              style={{ fontSize: "8px", letterSpacing: "0.28em" }}
            >
              <span className="w-4 h-px bg-primary" />
              {t("why.label")}
            </span>
            <h2
              className="section-heading font-black uppercase mt-2 text-foreground"
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              {t("why.title")}
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center items-stretch">
            {whyItems.map((w, i) => (
              <Reveal key={w.title} delay={i * 80}>
                <div className="group relative flex flex-col items-center justify-between border border-border bg-background p-6 md:p-8 transition-all duration-300 hover:border-primary/40 hover:bg-primary/[0.04] h-full">
                  {/* Number */}
                  <span
                    className="font-mono font-black text-primary/30 group-hover:text-primary/50 transition-colors duration-300 block"
                    style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1 }}
                  >
                    {w.num}
                  </span>

                  {/* Title */}
                  <div className="mt-6">
                    <h3 className="uppercase font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 text-lg">
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
      <section className="relative py-28 md:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroPort}
            alt="Industrial port"
            loading="lazy"
            className="w-full h-full object-cover"
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
                className="section-label section-label-center mb-6 inline-flex justify-center"
                style={{ color: "hsl(var(--gold))" }}
              >
                {isAr ? "تواصل معنا" : "Get In Touch"}
              </span>
              <h2 className="section-heading mb-8" style={{ color: "#ffffff" }}>
                {t("cta.title")}
              </h2>
              <div className={`flex flex-wrap gap-3 justify-center ${isAr ? "flex-row-reverse" : ""}`}>
                <Link to="/contact" className="btn-gold" style={{ fontSize: "0.6rem", padding: "0.75rem 1.75rem" }}>
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
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
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
