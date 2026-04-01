import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { usePageSEO } from "@/hooks/usePageSEO";
import { useLanguageStore } from "@/store/languageStore";
import heroPort from "@/assets/hero-port.jpg";
import lashingImage from "@/assets/divisions-lashing.jpg";
import seaImage from "@/assets/solutions-sea.jpg";

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
function Label({ text, isAr, center = false }: { text: string; isAr: boolean; center?: boolean }) {
  return (
    <div
      className={`flex items-center gap-2.5 mb-3 ${center ? "justify-center" : isAr ? "flex-row-reverse justify-end" : ""}`}
    >
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
      {center && (
        <span
          style={{
            width: "1.25rem",
            height: "1.5px",
            background: "hsl(var(--primary)/0.65)",
            display: "block",
            flexShrink: 0,
          }}
        />
      )}
    </div>
  );
}

export default function WhySaladaPage() {
  const seo = usePageSEO("/why-salada");
  const { t, isRTL } = useLanguageStore();
  const isAr = isRTL();

  const strengths = [
    { num: "01", title: t("why.onePartner"), desc: t("why.onePartnerDesc"), image: lashingImage },
    { num: "02", title: t("why.rapidDeployment"), desc: t("why.rapidDeploymentDesc"), image: seaImage },
    { num: "03", title: t("why.nationalCoverage"), desc: t("why.nationalCoverageDesc"), image: heroPort },
    { num: "04", title: t("why.compliance"), desc: t("why.complianceDesc"), image: lashingImage },
    { num: "05", title: t("why.localSupply"), desc: t("why.localSupplyDesc"), image: seaImage },
  ];

  return (
    <Layout>
      <SEOHead {...seo} />

      {/* ════════════════════════════════
          HERO — compact with image
      ════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: "260px" }}>
        <div className="absolute inset-0">
          <img
            src={heroPort}
            alt="Why choose Salada"
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
          <div className={`max-w-xl ${isAr ? "text-right ml-auto mr-0" : ""}`}>
            {/* breadcrumb */}
            <nav className={`flex items-center gap-1.5 mb-4 ${isAr ? "flex-row-reverse justify-end" : ""}`}>
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
                {isAr ? "لماذا صلادة" : "Why Salada"}
              </span>
            </nav>

            <Label text={t("why.label")} isAr={isAr} />

            <h1
              className="font-black uppercase leading-[0.93] tracking-[-0.025em] mb-3 animate-fade-up delay-200"
              style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)", color: "#fff" }}
            >
              {isAr ? "لماذا " : "Why "}
              <span style={{ color: "hsl(var(--primary))" }}>Salada?</span>
            </h1>

            <p
              className="text-[0.8rem] leading-relaxed animate-fade-up delay-300"
              style={{ color: "rgba(255,255,255,0.45)", maxWidth: "36rem" }}
            >
              {t("why.pageDesc")}
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          STRENGTHS — 3 top + 2 centered below
      ════════════════════════════════ */}
      <section className="bg-background border-b border-border py-10 md:py-14">
        <div className="industrial-container">
          <Reveal className={`mb-10 ${isAr ? "text-right" : "text-center"}`}>
            <Label text={t("why.label")} isAr={isAr} center={!isAr} />
            <h2
              className="font-black uppercase leading-[0.95] tracking-[-0.02em]"
              style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)", color: "hsl(var(--foreground))" }}
            >
              {isAr ? "مميزات " : "The Salada "}
              <span style={{ color: "hsl(var(--primary))" }}>{isAr ? "صلادة" : "Advantage"}</span>
            </h2>
          </Reveal>

          {/* Row 1 — 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {strengths.slice(0, 3).map((item, i) => (
              <Reveal key={item.num} delay={i * 70}>
                <div
                  className={`group border border-border hover:border-primary bg-background transition-all duration-300 h-full ${isAr ? "text-right" : ""}`}
                >
                  {/* Square image */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      style={{ filter: "grayscale(12%) brightness(0.9)" }}
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: "hsl(var(--primary)/0.08)" }}
                    />
                    {/* number badge */}
                    <span
                      className="absolute top-3 font-mono text-[0.55rem] uppercase tracking-[0.22em]"
                      style={{
                        color: "hsl(var(--primary))",
                        left: isAr ? "auto" : "0.875rem",
                        right: isAr ? "0.875rem" : "auto",
                      }}
                    >
                      {item.num}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 border-t border-border">
                    <div
                      className={`h-px mb-3 transition-all duration-400 ${isAr ? "ml-auto mr-0" : ""}`}
                      style={{ width: "1.5rem", background: "hsl(var(--primary)/0.6)" }}
                    />
                    <h3
                      className="font-black uppercase tracking-tight leading-snug mb-2 group-hover:text-primary transition-colors duration-300"
                      style={{ fontSize: "0.9rem", color: "hsl(var(--foreground))" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="leading-relaxed"
                      style={{ fontSize: "0.78rem", color: "hsl(var(--muted-foreground))" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Row 2 — 2 cards centered */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {strengths.slice(3).map((item, i) => (
              <Reveal key={item.num} delay={i * 70 + 210}>
                <div
                  className={`group border border-border hover:border-primary bg-background transition-all duration-300 h-full ${isAr ? "text-right" : ""}`}
                >
                  {/* Square image */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      style={{ filter: "grayscale(12%) brightness(0.9)" }}
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: "hsl(var(--primary)/0.08)" }}
                    />
                    <span
                      className="absolute top-3 font-mono text-[0.55rem] uppercase tracking-[0.22em]"
                      style={{
                        color: "hsl(var(--primary))",
                        left: isAr ? "auto" : "0.875rem",
                        right: isAr ? "0.875rem" : "auto",
                      }}
                    >
                      {item.num}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 border-t border-border">
                    <div
                      className={`h-px mb-3 transition-all duration-400 ${isAr ? "ml-auto mr-0" : ""}`}
                      style={{ width: "1.5rem", background: "hsl(var(--primary)/0.6)" }}
                    />
                    <h3
                      className="font-black uppercase tracking-tight leading-snug mb-2 group-hover:text-primary transition-colors duration-300"
                      style={{ fontSize: "0.9rem", color: "hsl(var(--foreground))" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="leading-relaxed"
                      style={{ fontSize: "0.78rem", color: "hsl(var(--muted-foreground))" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          SUPPORTING TEXT — editorial strip
      ════════════════════════════════ */}
      <section className="border-b border-border py-10 md:py-14" style={{ background: "hsl(var(--secondary)/0.25)" }}>
        <div className="industrial-container">
          <Reveal>
            <div className={`max-w-2xl ${isAr ? "text-right mr-auto ml-0" : "mx-auto text-center"}`}>
              <Label text={isAr ? "بكلمة واحدة" : "In Short"} isAr={isAr} center={!isAr} />
              <p className="text-sm md:text-base leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                {t("why.supportingText")}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          CTA — dark
      ════════════════════════════════ */}
      <section className="relative py-14 md:py-20 overflow-hidden">
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
              <Label text={isAr ? "تواصل معنا" : "Get Started"} isAr={isAr} center />
              <h2
                className="font-black uppercase leading-[0.92] tracking-[-0.025em] mb-4"
                style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", color: "#fff" }}
              >
                {t("cta.title")}
              </h2>
              <p
                className="text-[0.8rem] leading-relaxed mb-7 max-w-md mx-auto"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {t("cta.description")}
              </p>
              <div className={`flex flex-wrap gap-3 justify-center ${isAr ? "flex-row-reverse" : ""}`}>
                <Link
                  to="/contact"
                  className={`inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] px-6 py-3 hover:opacity-90 transition-opacity ${isAr ? "flex-row-reverse" : ""}`}
                >
                  <span>{t("cta.getQuote")}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
                </Link>
                <Link
                  to="/solutions"
                  className="inline-flex items-center gap-2 px-6 py-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] transition-all duration-200"
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
