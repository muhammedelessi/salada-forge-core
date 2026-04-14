import { Link } from "react-router-dom";
import { ArrowRight, Ship, HardHat, Landmark, Factory, Warehouse } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { usePageSEO } from "@/hooks/usePageSEO";
import { useLanguageStore } from "@/store/languageStore";
import heroPort from "@/assets/hero-port.webp";
import seaImage from "@/assets/solutions-sea.webp";
import storageImage from "@/assets/solutions-storage.webp";

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
      { threshold: 0.08 },
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
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: `opacity .8s cubic-bezier(.16,1,.3,1) ${delay}ms,
                   transform .8s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function IndustriesPage() {
  const seo = usePageSEO("/industries");
  const { t, isRTL } = useLanguageStore();
  const isAr = isRTL();
  const introDesc = t("industries.introDesc").trim();

  const industries = [
    {
      id: "logistics",
      num: "01",
      name: t("industries.logistics"),
      desc: t("industries.logisticsDesc"),
      icon: Ship,
    },
    {
      id: "construction",
      num: "02",
      name: t("industries.construction"),
      desc: t("industries.constructionDesc"),
      icon: HardHat,
    },
    {
      id: "government",
      num: "03",
      name: t("industries.government"),
      desc: t("industries.governmentDesc"),
      icon: Landmark,
    },
    {
      id: "industrial",
      num: "04",
      name: t("industries.industrial"),
      desc: t("industries.industrialDesc"),
      icon: Factory,
    },
    {
      id: "storage",
      num: "05",
      name: t("industries.storage"),
      desc: t("industries.storageDesc"),
      icon: Warehouse,
    },
  ];

  return (
    <Layout>
      <SEOHead {...seo} />

      {/* ════════════════════════════════
          HERO — compact
      ════════════════════════════════ */}
      <section
        className="industries-page-hero relative overflow-hidden"
        dir={isAr ? "rtl" : "ltr"}
        style={{ minHeight: "260px" }}
      >
        <div className="absolute inset-0">
          <img
            src={heroPort}
            alt="Industries served by Salada"
            className="w-full h-full object-cover object-center"
            style={{ filter: "grayscale(18%) brightness(0.45)" }}
          />
          <div className="absolute inset-0" style={{ background: "rgba(8,6,2,0.58)" }} />
          <div
            className="absolute bottom-0 inset-x-0"
            style={{
              height: "1.5px",
              background:
                "linear-gradient(to right, transparent, hsl(var(--primary)/0.45) 25%, hsl(var(--primary)/0.45) 75%, transparent)",
            }}
          />
        </div>

        <div
          className="industrial-container relative z-10 flex flex-col justify-center py-10 md:py-14"
          style={{ minHeight: "260px" }}
        >
          <div className={`max-w-xl ${isAr ? "mr-0 ml-auto text-right" : ""}`}>
            {/* breadcrumb — match About page scale & RTL */}
            <nav
              className={`page-hero-breadcrumb mb-4 flex items-center gap-1.5 ${isAr ? "flex-row-reverse justify-end" : ""}`}
            >
              <Link
                to="/"
                className="hero-crumb label-text text-label-md uppercase tracking-[0.15em]"
                style={{ color: "rgba(255,255,255,0.32)" }}
              >
                {isAr ? "الرئيسية" : "Home"}
              </Link>
              <span style={{ color: "rgba(255,255,255,0.18)" }}>/</span>
              <span
                className="hero-crumb label-text text-label-md uppercase tracking-[0.15em]"
                style={{ color: "hsl(var(--primary))" }}
              >
                {isAr ? "القطاعات" : "Industries"}
              </span>
            </nav>

            <h1 className="hero-title-primary industries-hero-h1 font-black uppercase leading-[0.93] tracking-[-0.025em] mb-3">
              {isAr ? "القطاعات التي نخدمها" : "Industries We Serve"}
            </h1>

            <p className="hero-subtitle industries-hero-lead leading-relaxed" style={{ maxWidth: "36rem" }}>
              {t("industries.pageDesc")}
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          INTRO STRIP
      ════════════════════════════════ */}
     

      {/* ════════════════════════════════
          INDUSTRIES — number ticker list
      ════════════════════════════════ */}
      <section className="bg-background border-b border-border" dir={isAr ? "rtl" : "ltr"}>
        <div className="industrial-container">
          {industries.map((ind, i) => (
            <Reveal key={ind.id} delay={i * 60}>
              <div
                id={ind.id}
                className="group border-b border-border last:border-b-0 subtle-card-hover hover:bg-primary/5"
              >
                <div className="flex items-stretch gap-0">
                  {/* Number */}

                  {/* Content */}
                  <div className="flex flex-1 items-center gap-5 py-6 px-6 md:px-8">
                    {/* Icon */}
                    <div
                      className="relative shrink-0 flex items-center justify-center bg-primary rounded-md transition-transform duration-300 group-hover:scale-105"
                      style={{ width: "52px", height: "52px" }}
                    >
                      <ind.icon className="w-5 h-5 text-primary-foreground" />
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <div
                        className="mb-2 shrink-0"
                        style={{
                          width: "1.5rem",
                          height: "2px",
                          background: "hsl(var(--primary))",
                        }}
                        aria-hidden
                      />
                      <h2 className="industry-card-title mb-1 uppercase leading-tight tracking-tight transition-colors duration-300 group-hover:text-primary">
                        {ind.name}
                      </h2>
                      <p className="industry-card-desc">{ind.desc}</p>
                    </div>

                    {/* Arrow */}
                    <ArrowRight
                      className="w-4 h-4 shrink-0 opacity-25 group-hover:opacity-100 transition-all duration-300 ltr:group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                      style={{ color: "hsl(var(--primary))" }}
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════
          CTA — dark
      ════════════════════════════════ */}
      <section className="industries-cta relative py-14 md:py-20 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
        <div className="absolute inset-0">
          <img
            src={heroPort}
            alt="Industrial operations"
            loading="lazy"
            className="w-full h-full object-cover"
            style={{ filter: "grayscale(25%) brightness(0.35)" }}
          />
          <div className="absolute inset-0" style={{ background: "rgba(8,6,2,0.82)" }} />
        </div>

        <div className="industrial-container relative z-10">
          <div className="max-w-xl mx-auto text-center">
            <Reveal>
              <div className="flex items-center justify-center gap-3 mb-3">
                <span
                  style={{
                    width: "1.25rem",
                    height: "1.5px",
                    background: "hsl(var(--primary)/0.65)",
                    display: "block",
                  }}
                />
                <span
                  className="label-text text-label-md hero-eyebrow-primary uppercase tracking-[0.25em]"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {isAr ? "تواصل معنا" : "Get Started"}
                </span>
                <span
                  style={{
                    width: "1.25rem",
                    height: "1.5px",
                    background: "hsl(var(--primary)/0.65)",
                    display: "block",
                  }}
                />
              </div>

              <h2 className="industries-cta-title font-black uppercase leading-[0.92] tracking-[-0.025em] mb-4">
                {t("industries.ctaTitle")}
              </h2>
              <p className="industries-cta-desc mb-7 max-w-md mx-auto leading-relaxed">
                {t("industries.ctaDesc")}
              </p>

              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  to="/contact"
                  className="btn-primary w-full sm:w-auto"
                >
                  <span>{t("cta.getQuote")}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </Link>
                <Link
                  to="/solutions"
                  className="btn-ghost-dark w-full sm:w-auto"
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
