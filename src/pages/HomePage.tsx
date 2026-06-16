import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ChevronDown, Ship, HardHat, Landmark, Factory, Warehouse, Check, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { usePageSEO } from "@/hooks/usePageSEO";
import { useLanguageStore } from "@/store/languageStore";
import { useIndustries } from "@/hooks/useIndustries";
import { PartnerCTA } from "@/components/PartnerCTA";
import { Testimonials } from "@/components/home/Testimonials";
import heroImage from "@/assets/hero-logistics.webp";
import seaImage from "@/assets/solutions-sea.webp";
import storageImage from "@/assets/solutions-storage.webp";
import lashingImage from "@/assets/divisions-lashing.webp";
import vision2030 from "@/assets/vision-2030.svg";

/** Industry icon name (from DB) → Lucide component. */
const INDUSTRY_ICONS: Record<string, LucideIcon> = { Ship, HardHat, Landmark, Factory, Warehouse };

/* ── useInView ── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ── Scroll Reveal ── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(24px)",
      transition: `opacity .85s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .85s cubic-bezier(.16,1,.3,1) ${delay}ms`,
    }}>
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
  return <span ref={ref} style={{ fontSize: "inherit", fontWeight: "inherit", lineHeight: "inherit", color: "inherit" }}>{n}{suffix}</span>;
}

export default function HomePage() {
  const { t, isRTL } = useLanguageStore();
  const seo = usePageSEO("/");
  const isAr = isRTL();

  const solutions = [
    { num: "01", href: "/solutions#land",    title: t("solutions.landFreight"), desc: t("solutions.landFreightDesc"), image: lashingImage },
    { num: "02", href: "/solutions#sea",     title: t("solutions.seaFreight"),  desc: t("solutions.seaFreightDesc"), image: seaImage     },
    { num: "03", href: "/solutions#air",     title: t("solutions.airFreight"),  desc: t("solutions.airFreightDesc"), image: heroImage    },
    { num: "04", href: "/solutions#storage", title: t("solutions.storage"),     desc: t("solutions.storageDesc"),    image: storageImage },
  ];

  const stats = [
    { value: 10,  suffix: "+",   label: t("stats.yearsExperience")   },
    { value: 50,  suffix: "+",   label: t("stats.clientsServed")     },
    { value: 99,  suffix: ".5%", label: t("stats.onTimeDelivery")    },
  ];

  const { data: industriesData = [] } = useIndustries();
  const industries = industriesData.map((ind) => ({
    name: isAr ? ind.nameAr : ind.nameEn,
    desc: isAr ? ind.descriptionAr : ind.descriptionEn,
    href: `/industries/${ind.slug}`,
    Icon: (ind.icon && INDUSTRY_ICONS[ind.icon]) || Ship,
  }));

  const whyItems = [
    { num: "01", title: t("why.onePartner")       },
    { num: "02", title: t("why.rapidDeployment")  },
    { num: "03", title: t("why.nationalCoverage") },
    { num: "04", title: t("why.compliance")       },
  ];

  return (
    <Layout>
      <SEOHead {...seo} />

      {/* ════════ HERO ════════ */}
      <section className="relative h-[100svh] min-h-[600px] max-h-[900px] flex flex-col overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Salada industrial operations"
            width={1920} height={1080} fetchPriority="high" decoding="sync"
            className="w-full h-full object-cover animate-hero-zoom max-w-full" />
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.68)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.62) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "hsl(var(--gold)/0.08)" }} />
        </div>

        <div className="absolute inset-x-0 pointer-events-none" style={{
          top: "38%", height: "1px",
          background: "linear-gradient(to right, transparent, hsl(var(--gold)/0.6) 30%, hsl(var(--gold)/0.6) 70%, transparent)",
          animation: "scanPulse 7s ease-in-out infinite",
        }} />

        {[
          { top: "5rem",    left:  "1.5rem", borderTop: true,    borderLeft:  true  },
          { top: "5rem",    right: "1.5rem", borderTop: true,    borderRight: true  },
          { bottom:"2.5rem",left:  "1.5rem", borderBottom: true, borderLeft:  true  },
          { bottom:"2.5rem",right: "1.5rem", borderBottom: true, borderRight: true  },
        ].map((pos, i) => (
          <div key={i} className="absolute w-5 h-5 pointer-events-none" style={{
            ...pos,
            borderTop:    pos.borderTop    ? "2px solid hsl(var(--gold)/0.55)" : undefined,
            borderBottom: pos.borderBottom ? "2px solid hsl(var(--gold)/0.55)" : undefined,
            borderLeft:   pos.borderLeft   ? "2px solid hsl(var(--gold)/0.55)" : undefined,
            borderRight:  pos.borderRight  ? "2px solid hsl(var(--gold)/0.55)" : undefined,
          }} />
        ))}

        {/* Main content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">
          <div
            className="animate-fade-up delay-200 w-full max-w-4xl mx-auto px-5 py-6 md:px-8 md:py-8"
            style={{
              background: "linear-gradient(180deg, rgba(0,0,0,0.26), rgba(0,0,0,0.14))",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(4px)",
            }}
          >
          <p
            className="home-hero-primary animate-fade-up delay-300 max-w-2xl mx-auto"
            style={{ marginBottom: "1rem", textAlign: "center", maxWidth: "700px" }}
          >
            {t("hero.title")}
          </p>

          <div style={{ width:"3rem", height:"2px", background:"hsl(var(--gold)/0.55)", margin:"1rem auto", boxShadow: "0 0 14px hsl(var(--gold)/0.45)" }} />

          <p
            className="home-hero-secondary animate-fade-up delay-400 max-w-2xl mx-auto"
            style={{ marginBottom: "2rem", textAlign: "center", maxWidth: "700px" }}
          >
            {t("hero.titleHighlight")}
          </p>

          {/* Advantage check points (moved from the Salada Advantage section) */}
          <div className="animate-fade-up delay-500 mb-7 flex flex-wrap justify-center gap-x-5 gap-y-2">
            {whyItems.map((w) => (
              <span
                key={w.title}
                className="inline-flex items-center gap-1.5 text-sm"
                style={{ color: "rgba(255,255,255,0.82)" }}
              >
                <Check className="h-4 w-4 shrink-0" style={{ color: "hsl(var(--gold))" }} aria-hidden />
                {w.title}
              </span>
            ))}
          </div>

          <div className={`animate-fade-up delay-600 flex flex-wrap gap-3 justify-center items-center ${isAr ? "flex-row-reverse" : ""}`}>
            <Link to="/solutions" className="btn-primary shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
              <span>{t("hero.cta")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/contact?type=quote" className="btn-ghost-dark shadow-[0_8px_22px_rgba(0,0,0,0.28)]">
              {t("hero.quote")}
            </Link>
          </div>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="relative z-10 w-full" style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.48) 100%)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(3px)",
        }}>
          <div className="industrial-container py-1">
            <div className="grid grid-cols-2 md:grid-cols-3">
              {stats.map((s, i) => {
                const isOrphan = i === stats.length - 1 && stats.length % 2 === 1;
                return (
                <div key={s.label}
                  className={`group relative py-6 px-3 text-center cursor-default transition-all duration-300 hover:bg-white/[0.05] ${
                    isOrphan ? "col-span-2 md:col-span-1" : ""
                  } ${
                    i < stats.length - 1 ? "border-b md:border-b-0 md:border-r border-white/[0.08]" : ""
                  } ${i % 2 === 0 && i < stats.length - 1 ? "border-r md:border-r border-white/[0.08]" : ""}`}
                >
                  <div style={{
                    fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                    fontWeight: isAr ? 900 : 700,
                    lineHeight: 1,
                    color: "hsl(var(--primary))",
                    textShadow: "0 0 22px hsl(var(--primary) / 0.2)",
                  }}>
                    <Counter target={s.value} suffix={s.suffix} />
                  </div>
                  <p style={{
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.7)",
                    letterSpacing: "0.08em",
                    marginTop: "0.5rem",
                    transition: "color 200ms ease",
                  }}>
                    {s.label}
                  </p>
                  <div
                    className="absolute left-1/2 -translate-x-1/2 bottom-3 h-[2px] w-0 bg-primary/60 transition-all duration-300 group-hover:w-10"
                  />
                </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1" style={{ opacity: 0.35 }}>
          <span style={{ fontSize:"0.45rem", textTransform:"uppercase", letterSpacing:"0.3em", color:"#fff" }}>Scroll</span>
          <ChevronDown className="w-3.5 h-3.5 text-white animate-bounce-subtle" />
        </div>
      </section>

      {/* ════════ VISION 2030 ════════ */}
      <section dir={isAr ? "rtl" : "ltr"} className="relative w-full overflow-hidden border-y-2 border-primary bg-background">
        {/* Vision 2030 emblem (replaces the old big "2030" watermark; swap this file for the official logo if desired) */}
        <img
          src={vision2030}
          alt={t("vision.label")}
          aria-hidden
          className="pointer-events-none absolute top-1/2 hidden -translate-y-1/2 select-none opacity-90 lg:block ltr:right-6 xl:ltr:right-16 rtl:left-6 xl:rtl:left-16"
          style={{ width: "clamp(15rem, 22vw, 22rem)", height: "auto" }}
        />
        {/* subtle emblem on small screens */}
        <img
          src={vision2030}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -bottom-8 select-none opacity-[0.12] lg:hidden ltr:right-0 rtl:left-0"
          style={{ width: "min(60vw, 18rem)", height: "auto" }}
        />

        <div
          className="industrial-container relative z-10 py-12 md:py-16"
          style={{ background: "linear-gradient(90deg, hsl(var(--primary)/0.06), transparent 70%)" }}
        >
          <div className="max-w-2xl">
            {/* eyebrow badge */}
            <span className="mb-4 inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-3 py-1.5 text-primary">
              <Target className="h-4 w-4 shrink-0" aria-hidden />
              <span className="home-vision-eyebrow uppercase tracking-widest" style={{ fontSize: "0.72rem" }}>
                {t("vision.label")}
              </span>
            </span>

            <h2
              className="home-vision-title uppercase text-foreground"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", lineHeight: 1.15 }}
            >
              {t("vision.title")}
            </h2>

            <p className="home-vision-desc mt-4 max-w-xl" style={{ fontSize: "0.92rem", lineHeight: 1.85, color: "hsl(var(--muted-foreground))" }}>
              {t("vision.description")}
            </p>

            {/* alignment check points */}
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {(isAr
                ? ["محتوى محلي", "تصنيع سعودي 100%", "نمو القطاع الصناعي"]
                : ["Local Content", "100% Saudi Manufacturing", "Industrial Growth"]
              ).map((p) => (
                <span key={p} className="inline-flex items-center gap-1.5 text-sm text-foreground/80">
                  <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {p}
                </span>
              ))}
            </div>

            <Link to="/why-salada" className="btn-primary mt-7 w-full justify-center sm:w-auto">
              <span>{t("nav.whySalada")}</span>
              <ArrowUpRight className="h-3 w-3 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════ SOLUTIONS ════════ */}
      <section dir={isAr ? "rtl" : "ltr"} className="bg-background border-b border-border">
        <div className="industrial-container section-pad">
          <Reveal>
            <div className="flex items-end justify-between pb-6 mb-8 md:mb-10 border-b border-border">
              <div>
                <span className="uppercase block text-primary" style={{ fontSize:"0.75rem", letterSpacing:"0.2em", marginBottom:"0.5rem" }}>
                  — {t("solutions.label")}
                </span>
                <h2 className="uppercase font-black mt-2 text-foreground"
                  style={{ fontSize:"clamp(1.6rem, 3vw, 2.5rem)", letterSpacing:"-0.025em", lineHeight:1 }}>
                  {t("solutions.title")}
                </h2>
              </div>
              <Link to="/solutions" className="group hidden md:inline-flex items-center gap-2 uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
                style={{ fontSize:"0.6875rem", letterSpacing:"0.18em", paddingBottom:"4px", borderBottom:"1px solid hsl(var(--border))" }}>
                <span>{isAr ? "عرض الكل" : "View All"}</span>
                <ArrowRight className={`w-3 h-3 transition-transform group-hover:translate-x-1 ${isAr ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {solutions.map((sol, i) => (
              <Reveal key={sol.num} delay={i * 80} className="h-full min-h-0">
                <Link
                  to={sol.href}
                  className="home-solution-card group relative flex h-full min-h-[260px] w-full flex-col overflow-hidden border border-transparent transition-all duration-300 ease hover:border-primary/50 md:min-h-[280px] lg:min-h-[380px]"
                >
                  <img
                    src={sol.image}
                    alt={sol.title}
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={375}
                    className="absolute inset-0 h-full w-full max-w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 z-[1]"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.15) 100%)",
                    }}
                  />
                  <span
                    className="home-solution-card-num pointer-events-none absolute start-4 top-4 z-[2] select-none"
                    aria-hidden
                  >
                    {sol.num}
                  </span>
                  <div className="relative z-[2] mt-auto flex w-full flex-col items-stretch p-6 text-start">
                    <div
                      className="mb-3 shrink-0"
                      style={{
                        width: "2rem",
                        height: "2px",
                        background: "hsl(var(--primary) / 0.7)",
                      }}
                      aria-hidden
                    />
                    <h3 className="home-solution-card-title">{sol.title}</h3>
                    <p className="home-solution-card-desc">{sol.desc}</p>
                    <span className="home-solution-card-explore inline-flex items-center gap-1.5">
                      {isAr ? "اكتشف" : "Explore"}
                      <ArrowRight className={`h-3 w-3 shrink-0 ${isAr ? "rotate-180" : ""}`} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ INDUSTRIES ════════ */}
      <section dir={isAr ? "rtl" : "ltr"} className="bg-background border-b border-border">
        <div className="industrial-container section-pad">
          <Reveal>
            <div className="flex items-end justify-between pb-6 mb-8 md:mb-10 border-b border-border">
              <div>
                <span className="uppercase block text-primary" style={{ fontSize:"0.75rem", letterSpacing:"0.2em", marginBottom:"0.5rem" }}>
                  — {t("industries.label")}
                </span>
                <h2 className="uppercase font-black mt-2 text-foreground"
                  style={{ fontSize:"clamp(1.6rem, 3vw, 2.5rem)", letterSpacing:"-0.025em", lineHeight:1 }}>
                  {t("industries.title")}
                </h2>
              </div>
              <span className="uppercase text-muted-foreground" style={{ fontSize:"0.625rem", letterSpacing:"0.18em" }}>
                {String(industries.length).padStart(2, "0")} sectors
              </span>
            </div>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-5">
            {industries.map((ind, i) => (
              <Reveal key={ind.href} delay={i * 80} className="w-full sm:w-[calc(50%_-_0.625rem)] lg:w-[calc((100%_-_2.5rem)/3)]">
                <Link to={ind.href}
                  className="group relative flex h-full flex-col overflow-hidden border border-border bg-background p-6 md:p-7 text-start transition-all duration-300 hover:border-primary/50 hover:shadow-[0_14px_34px_-16px_rgba(0,0,0,0.18)]">
                  {/* gold top accent on hover */}
                  <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] origin-center scale-x-0 bg-primary/70 transition-transform duration-300 group-hover:scale-x-100" />
                  {/* number watermark */}
                  <span aria-hidden className="pointer-events-none absolute top-3 font-black text-primary/[0.07] ltr:right-4 rtl:left-4"
                    style={{ fontSize:"3rem", lineHeight:1 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {/* icon */}
                  <div className="mb-5 flex h-12 w-12 shrink-0 items-center justify-center bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <ind.Icon className="h-6 w-6" />
                  </div>
                  <h3 className="uppercase font-[900] text-foreground group-hover:text-primary transition-colors duration-300"
                    style={{ fontSize:"1rem" }}>
                    {ind.name}
                  </h3>
                  {/* description — same style as the Customer Feedback comment text */}
                  <span className="mt-2 block text-foreground line-clamp-3" style={{ fontWeight: 400, fontSize: "1rem", lineHeight: 1.7 }}>
                    {ind.desc}
                  </span>
                  <div className="mt-auto flex items-center gap-1.5 pt-5 text-primary" style={{ fontSize:"0.72rem", letterSpacing:"0.15em" }}>
                    <span className="uppercase">{t("solutions.learnMore")}</span>
                    <ArrowRight className={`w-3 h-3 transition-transform duration-300 ${isAr ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ TESTIMONIALS ════════ */}
      <Testimonials />

      {/* ════════ CTA ════════ */}
      <PartnerCTA />
    </Layout>
  );
}