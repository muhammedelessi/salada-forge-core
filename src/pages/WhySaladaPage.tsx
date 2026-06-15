import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { usePageSEO } from "@/hooks/usePageSEO";
import { useLanguageStore } from "@/store/languageStore";
import { PartnerCTA } from "@/components/PartnerCTA";
import { PageHero } from "@/components/PageHero";
import heroPort from "@/assets/hero-port.webp";
import lashingImage from "@/assets/divisions-lashing.webp";
import seaImage from "@/assets/solutions-sea.webp";

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
function Label({
  text,
  isAr,
  center = false,
  spanClassName = "",
}: {
  text: string;
  isAr: boolean;
  center?: boolean;
  spanClassName?: string;
}) {
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
      <span
        className={`label-text text-label-md uppercase tracking-[0.25em]${spanClassName ? ` ${spanClassName}` : ""}`}
        style={{ color: "hsl(var(--primary))" }}
      >
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

/* ── Shared card component ── */
function StrengthCard({
  item,
  isAr,
}: {
  item: { num: string; title: string; desc: string; image: string };
  isAr: boolean;
}) {
  return (
    <div
      className={`group relative border border-border subtle-card-hover hover:border-primary/50 bg-background transition-all duration-300 h-full shadow-[0_1px_0_hsl(var(--border))] hover:shadow-[0_10px_24px_rgba(0,0,0,0.1)] ${isAr ? "text-right" : "text-left"}`}
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="absolute top-0 inset-x-0 h-[2px] bg-primary/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {/*
        Mobile  → row: [square 100px image] [text]
        Desktop → col: [full-width image]   [text below]
      */}
      <div className="flex flex-row sm:flex-col h-full">
        {/* ── Image ── */}
        <div className="relative overflow-hidden shrink-0 w-[84px] sm:w-full aspect-square sm:aspect-[16/9]">
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            decoding="async"
            width={400}
            height={400}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04] max-w-full"
            style={{ filter: "grayscale(12%) brightness(0.9)" }}
          />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "hsl(var(--primary)/0.08)" }}
          />
          <span
            className="absolute top-2 start-2 sm:top-3 sm:start-3 label-text text-[0.75rem] uppercase tracking-[0.14em]"
            style={{ color: "hsl(var(--primary))" }}
          >
            {item.num}
          </span>
        </div>

        {/* ── Text ── */}
        <div
          className="
          p-3 sm:p-4
          flex flex-col justify-center flex-1
          border-s border-s-border sm:border-s-0
          sm:border-t sm:border-t-border
        "
        >
          <div className="h-px mb-1.5" style={{ width: "1rem", background: "hsl(var(--primary)/0.6)" }} />
          <h3
            className="font-black uppercase tracking-tight leading-snug mb-1 group-hover:text-primary transition-colors duration-300"
            style={{ fontSize: "0.85rem", color: "hsl(var(--foreground))" }}
          >
            {item.title}
          </h3>
          <p
            className="leading-relaxed hidden sm:block line-clamp-3"
            style={{ fontSize: "0.78rem", color: "hsl(var(--muted-foreground))" }}
          >
            {item.desc}
          </p>
          {/* on mobile show shorter desc */}
          <p
            className="leading-relaxed sm:hidden line-clamp-2"
            style={{ fontSize: "0.74rem", color: "hsl(var(--muted-foreground))" }}
          >
            {item.desc}
          </p>
        </div>
      </div>
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
      <PageHero
        breadcrumbLabel={isAr ? "لماذا صلادة" : "Why Salada"}
        title={isAr ? "لماذا صلادة؟" : "Why Salada?"}
        description={t("why.pageDesc")}
      />

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
              {isAr ? "مميزات صلادة" : "The Salada Advantage"}
            </h2>
          </Reveal>

          {/* Row 1 — 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mb-4 md:mb-5">
            {strengths.slice(0, 3).map((item, i) => (
              <Reveal key={item.num} delay={i * 70}>
                <StrengthCard item={item} isAr={isAr} />
              </Reveal>
            ))}
          </div>

          {/* Row 2 — 2 cards centered, same width as row 1 cards */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-5">
            {strengths.slice(3).map((item, i) => (
              <Reveal key={item.num} delay={i * 70 + 210} className="w-full sm:w-[calc(33.333%-11px)]">
                <StrengthCard item={item} isAr={isAr} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          IN SHORT — premium editorial strip
      ════════════════════════════════ */}
      <section className="border-b border-border py-10 md:py-14 bg-background">
        <div className="industrial-container">
          <Reveal>
            <div className={isAr ? "text-right" : ""}>
              <Label text={isAr ? "باختصار" : "In Short"} isAr={isAr} />
              <p
                className="leading-relaxed"
                style={{
                  fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
                  color: "hsl(var(--foreground))",
                  fontWeight: 500,
                  maxWidth: "42rem",
                }}
              >
                {t("why.supportingText")}
              </p>
              <Link
                to="/contact"
                className={`hero-inline-cta inline-flex items-center gap-2 mt-5 label-text text-label-md uppercase tracking-[0.18em] transition-colors duration-200 hover:opacity-75 ${isAr ? "flex-row-reverse" : ""}`}
                style={{ color: "hsl(var(--primary))" }}
              >
                {isAr ? "تواصل معنا" : "Get In Touch"}
                <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          CTA — dark
      ════════════════════════════════ */}
      <PartnerCTA />
    </Layout>
  );
}
