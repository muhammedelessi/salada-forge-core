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
    { name: t("industries.logistics"), href: "/industries#logistics" },
    { name: t("industries.construction"), href: "/industries#construction" },
    { name: t("industries.government"), href: "/industries#government" },
    { name: t("industries.industrial"), href: "/industries#industrial" },
    { name: t("industries.storage"), href: "/industries#storage" },
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
            style={{
              background: `
                linear-gradient(
                  to bottom,
                  hsl(var(--ink-100)/0.55) 0%,
                  hsl(var(--ink-100)/0.40) 40%,
                  hsl(var(--ink-100)/0.65) 100%
                )
              `,
            }}
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
          {/* Eyebrow label */}
          <div className="animate-fade-up delay-200 mb-5">
            <span
              className="inline-flex items-center gap-3"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.32em",
                color: "hsl(var(--gold))",
              }}
            >
              <span style={{ width: "1.5rem", height: "1px", background: "hsl(var(--gold)/0.7)", display: "block" }} />
              {t("hero.label")}
              <span style={{ width: "1.5rem", height: "1px", background: "hsl(var(--gold)/0.7)", display: "block" }} />
            </span>
          </div>

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
              fontSize: "clamp(2rem, 5vw, 3.75rem)",
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

          {/* Description */}
          <p
            className="animate-fade-up delay-500"
            style={{
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.7,
              maxWidth: "32rem",
              marginBottom: "1.75rem",
            }}
          >
            {t("hero.description")}
          </p>

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

          {/* Trust badges */}
          <div className="animate-fade-up delay-700 flex flex-wrap gap-2 justify-center">
            {["ISO Certified", "DNV Approved", "Saudi Made"].map((b) => (
              <span
                key={b}
                style={{
                  padding: "3px 10px",
                  background: "hsl(var(--gold)/0.15)",
                  border: "1px solid hsl(var(--gold)/0.3)",
                  color: "hsl(var(--gold))",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.55rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  fontWeight: 600,
                  backdropFilter: "blur(4px)",
                }}
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* ── Stats bar — pinned to bottom ── */}
        <div
          className="relative z-10 w-full"
          style={{
            background: "rgba(10, 8, 4, 0.65)",
            backdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="container-xl">
            <div className="grid grid-cols-4">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className="py-3 md:py-5 text-center cursor-default transition-colors duration-[250ms]"
                  style={{
                    borderRight: i < stats.length - 1 ? "1px solid rgba(255, 255, 255, 0.08)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(196, 150, 20, 0.07)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "clamp(1.2rem, 3vw, 2.2rem)",
                      fontWeight: 700,
                      color: "hsl(var(--gold))",
                      lineHeight: 1,
                      marginBottom: "4px",
                      textShadow: "0 0 20px rgba(196, 150, 20, 0.35)",
                    }}
                  >
                    <Counter target={s.value} suffix={s.suffix} />
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "clamp(0.45rem, 1vw, 0.5rem)",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "clamp(0.15em, 0.5vw, 0.22em)",
                      color: "rgba(255, 255, 255, 0.45)",
                      lineHeight: 1.4,
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
      <section className="bg-paper-1 py-20 md:py-32 border-b border-warm">
        <div className="container-xl">
          <div className="grid md:grid-cols-2 gap-14 md:gap-24 items-center">
            <Reveal className={isAr ? "text-right order-2 md:order-1" : ""}>
              <span className={`section-label mb-5 inline-flex ${isAr ? "flex-row-reverse" : ""}`}>
                {t("vision.label")}
              </span>
              <h2 className="section-heading text-ink-100 mb-5">{t("vision.title")}</h2>
              <p className="text-sm text-ink-40 leading-relaxed max-w-md mb-7">{t("vision.description")}</p>
              <Link
                to="/why-salada"
                className="btn-gold inline-flex"
                style={{ fontSize: "0.6rem", padding: "0.75rem 1.75rem" }}
              >
                <span>{isAr ? "تعرف على سلادة" : "About Salada"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </Reveal>

            <Reveal delay={150}>
              <div className="vision-badge glow-gold max-w-xs mx-auto">
                <span className="vision-year">2030</span>
                <div className="divider-gold w-12 my-3" />
                <p className="vision-sub">{isAr ? "رؤية المملكة العربية السعودية" : "Saudi Vision"}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          SOLUTIONS
      ════════════════════════════════════ */}
      <section className="bg-paper-0 border-b border-warm">
        <div className="container-xl pt-20 md:pt-28 pb-10">
          <Reveal>
            <div
              className={`flex flex-col md:flex-row md:items-end md:justify-between gap-4 ${isAr ? "md:flex-row-reverse text-right" : ""}`}
            >
              <div>
                <span className={`section-label mb-4 inline-flex ${isAr ? "flex-row-reverse" : ""}`}>
                  {t("solutions.label")}
                </span>
                <h2 className="section-heading text-ink-100">{t("solutions.title")}</h2>
              </div>
              <Link
                to="/solutions"
                className={`inline-flex items-center gap-2 text-ink-40 hover:text-gold transition-colors duration-200 ${isAr ? "flex-row-reverse" : ""}`}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                }}
              >
                {isAr ? "جميع الحلول" : "View all"}
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-warm">
          {solutions.map((sol, i) => (
            <Reveal key={sol.num} delay={i * 50}>
              <Link to={sol.href} className="block sol-card h-full">
                <div className="sol-card-img-wrap">
                  <img src={sol.image} alt={sol.title} loading="lazy" className="sol-card-img" />
                </div>
                <div className="sol-card-inner">
                  <p className="sol-card-num">{sol.num}</p>
                  <div className="sol-card-bar" />
                  <h3 className="sol-card-title">{sol.title}</h3>
                  <p className="sol-card-desc">{sol.desc}</p>
                  <span className={`sol-card-arrow ${isAr ? "flex-row-reverse" : ""}`}>
                    {t("solutions.learnMore")}
                    <ArrowRight className={`w-3 h-3 ${isAr ? "rotate-180" : ""}`} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════
          INDUSTRIES
      ════════════════════════════════════ */}
      <section className="bg-paper-1 py-20 md:py-32 border-b border-warm">
        <div className="container-xl">
          <Reveal className={`mb-12 ${isAr ? "text-right" : ""}`}>
            <span className={`section-label mb-4 inline-flex ${isAr ? "flex-row-reverse" : ""}`}>
              {t("industries.label")}
            </span>
            <h2 className="section-heading text-ink-100">{t("industries.title")}</h2>
          </Reveal>
          <div className="border-t border-warm">
            {industries.map((ind, i) => (
              <Reveal key={ind.name} delay={i * 45}>
                <Link to={ind.href} dir={isAr ? "rtl" : "ltr"} className="industry-row">
                  <div className={`flex items-center gap-5 ${isAr ? "flex-row-reverse" : ""}`}>
                    <span className="industry-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="industry-name">{ind.name}</span>
                  </div>
                  <ArrowRight className={`industry-arrow w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          WHY SALADA
      ════════════════════════════════════ */}
      <section className="bg-paper-0 py-20 md:py-32 border-b border-warm">
        <div className="container-xl">
          <Reveal className={`mb-12 ${isAr ? "text-right" : "text-center"}`}>
            <span
              className={`section-label section-label-center mb-4 inline-flex ${isAr ? "flex-row-reverse justify-end" : ""}`}
            >
              {t("why.label")}
            </span>
            <h2 className="section-heading text-ink-100">{t("why.title")}</h2>
          </Reveal>
          <div className="why-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {whyItems.map((w, i) => (
              <Reveal key={w.title} delay={i * 60}>
                <div className={`why-cell ${isAr ? "text-right" : ""}`}>
                  <p className="why-num">{w.num}</p>
                  <div className={`why-bar ${isAr ? "mr-0 ml-auto" : ""}`} />
                  <h3 className="why-title">{w.title}</h3>
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
