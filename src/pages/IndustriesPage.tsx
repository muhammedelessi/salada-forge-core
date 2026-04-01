import { Link } from "react-router-dom";
import { ArrowRight, Ship, HardHat, Landmark, Factory, Warehouse } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { usePageSEO } from "@/hooks/usePageSEO";
import { useLanguageStore } from "@/store/languageStore";
import heroPort from "@/assets/hero-port.jpg";
import seaImage from "@/assets/solutions-sea.jpg";
import storageImage from "@/assets/solutions-storage.jpg";

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

/* ── Shared eyebrow label ── */
function Label({ text }: { text: string; isAr?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <span
        style={{
          width: "1.25rem",
          height: "1.5px",
          background: "hsl(var(--primary)/0.65)",
          display: "block",
          flexShrink: 0,
        }}
      />
      <span className="font-mono text-[0.57rem] uppercase tracking-[0.28em]" style={{ color: "hsl(var(--primary))" }}>
        {text}
      </span>
    </div>
  );
}

export default function IndustriesPage() {
  const seo = usePageSEO("/industries");
  const { t, isRTL } = useLanguageStore();
  const isAr = isRTL();

  const industries = [
    {
      id: "logistics",
      num: "01",
      name: t("industries.logistics"),
      desc: t("industries.logisticsDesc"),
      image: seaImage,
    },
    {
      id: "construction",
      num: "02",
      name: t("industries.construction"),
      desc: t("industries.constructionDesc"),
      image: lashingImage,
    },
    {
      id: "government",
      num: "03",
      name: t("industries.government"),
      desc: t("industries.governmentDesc"),
      image: heroPort,
    },
    {
      id: "industrial",
      num: "04",
      name: t("industries.industrial"),
      desc: t("industries.industrialDesc"),
      image: storageImage,
    },
    {
      id: "storage",
      num: "05",
      name: t("industries.storage"),
      desc: t("industries.storageDesc"),
      image: seaImage,
    },
  ];

  return (
    <Layout>
      <SEOHead {...seo} />

      {/* ════════════════════════════════
          HERO — compact
      ════════════════════════════════ */}
      <section className="relative overflow-hidden" dir={isAr ? "rtl" : "ltr"} style={{ minHeight: "260px" }}>
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
          <div className="max-w-xl">
            {/* breadcrumb */}
            <nav className="flex items-center gap-1.5 mb-4">
              <Link
                to="/"
                className="font-mono text-[0.48rem] uppercase tracking-[0.18em]"
                style={{ color: "rgba(255,255,255,0.32)" }}
              >
                {isAr ? "الرئيسية" : "Home"}
              </Link>
              <span style={{ color: "rgba(255,255,255,0.18)" }}>/</span>
              <span
                className="font-mono text-[0.48rem] uppercase tracking-[0.18em]"
                style={{ color: "hsl(var(--primary))" }}
              >
                {isAr ? "القطاعات" : "Industries"}
              </span>
            </nav>

            <Label text={t("industries.label")} isAr={isAr} />

            <h1
              className="font-black uppercase leading-[0.93] tracking-[-0.025em] mb-3"
              style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)", color: "#fff" }}
            >
              {isAr ? "القطاعات " : "Industries "}
              <span style={{ color: "hsl(var(--primary))" }}>{isAr ? "التي نخدمها" : "We Serve"}</span>
            </h1>

            <p className="text-[0.8rem] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", maxWidth: "36rem" }}>
              {t("industries.pageDesc")}
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          INTRO STRIP
      ════════════════════════════════ */}
      <section className="border-b border-border py-8 md:py-10" dir={isAr ? "rtl" : "ltr"} style={{ background: "hsl(var(--secondary)/0.3)" }}>
        <div className="industrial-container">
          <Reveal>
            <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
              <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "hsl(var(--muted-foreground))" }}>
                {t("industries.introDesc")}
              </p>
              <span
                className="font-mono font-black shrink-0"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  color: "hsl(var(--primary)/0.12)",
                  letterSpacing: "-0.04em",
                }}
              >
                05
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          INDUSTRIES — number ticker list
      ════════════════════════════════ */}
      <section className="bg-background border-b border-border" dir={isAr ? "rtl" : "ltr"}>
        <div className="industrial-container">
          {industries.map((ind, i) => (
            <Reveal key={ind.id} delay={i * 60}>
              <div
                id={ind.id}
                className="group border-b border-border last:border-b-0 transition-all duration-300 hover:bg-primary/5"
              >
                <div className="flex items-stretch gap-0">
                  {/* Number */}
                  <div
                    className="flex items-center px-5 py-6 shrink-0 border-border ltr:border-r rtl:border-l"
                    style={{ width: "72px" }}
                  >
                    <span
                      className="font-mono font-black leading-none transition-all duration-300 group-hover:opacity-100"
                      style={{
                        fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                        color: "hsl(var(--primary))",
                        opacity: 0.18,
                      }}
                      ref={(el) => {
                        if (!el) return;
                        const row = el.closest(".group")!;
                        row.addEventListener("mouseenter", () => {
                          el.style.opacity = "1";
                        });
                        row.addEventListener("mouseleave", () => {
                          el.style.opacity = "0.18";
                        });
                      }}
                    >
                      {ind.num}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 items-center gap-5 py-6 px-6 md:px-8">
                    {/* Image — small square */}
                    <div
                      className="relative overflow-hidden shrink-0 hidden sm:block"
                      style={{ width: "64px", height: "64px" }}
                    >
                      <img
                        src={ind.image}
                        alt={ind.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                        style={{ filter: "grayscale(15%)" }}
                      />
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: "hsl(var(--primary)/0.12)" }}
                      />
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                      <h2
                        className="font-black uppercase tracking-tight leading-tight mb-1 group-hover:text-primary transition-colors duration-300"
                        style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.2rem)", color: "hsl(var(--foreground))" }}
                      >
                        {ind.name}
                      </h2>
                      <p className="text-[0.78rem] leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                        {ind.desc}
                      </p>
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
      <section className="relative py-14 md:py-20 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
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
                  className="font-mono text-[0.57rem] uppercase tracking-[0.28em]"
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

              <h2
                className="font-black uppercase leading-[0.92] tracking-[-0.025em] mb-4"
                style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", color: "#fff" }}
              >
                {t("industries.ctaTitle")}
              </h2>
              <p
                className="text-[0.8rem] leading-relaxed mb-7 max-w-md mx-auto"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {t("industries.ctaDesc")}
              </p>

              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] px-6 py-3 hover:opacity-90 transition-opacity"
                >
                  <span>{t("cta.getQuote")}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </Link>
                <Link
                  to="/solutions"
                  className="inline-flex items-center px-6 py-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] transition-all duration-200"
                  style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--primary)/0.55)";
                    (e.currentTarget as HTMLElement).style.color = "hsl(var(--primary))";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                    (e.currentTarget as HTMLElement).style.color = "#fff";
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
