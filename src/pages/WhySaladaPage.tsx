import { Link } from "react-router-dom";
import { Quote } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { usePageSEO } from "@/hooks/usePageSEO";
import { useLanguageStore } from "@/store/languageStore";
import { PartnerCTA } from "@/components/PartnerCTA";
import { PageHero } from "@/components/PageHero";
import heroPort from "@/assets/hero-port.webp";
import lashingImage from "@/assets/divisions-lashing.webp";
import logisticsImage from "@/assets/hero-logistics.webp";
import storageImage from "@/assets/solutions-storage.webp";
import landFreightImage from "@/assets/solutions-land-freight.jpg";

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
      className={`group relative overflow-hidden border border-border bg-background transition-all duration-300 h-full hover:border-primary/50 hover:shadow-[0_14px_34px_-16px_rgba(0,0,0,0.18)] ${isAr ? "text-right" : "text-left"}`}
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* gold top accent — wipes in on hover */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 z-10 h-[2px] origin-center scale-x-0 bg-primary/70 transition-transform duration-300 group-hover:scale-x-100"
      />
      {/*
        Mobile  → row: [square image] [text]
        Desktop → col: [full-width image] [text below]
      */}
      <div className="flex h-full flex-row sm:flex-col">
        {/* ── Image ── */}
        <div className="relative shrink-0 overflow-hidden aspect-square w-[92px] sm:aspect-[16/10] sm:w-full">
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            decoding="async"
            width={400}
            height={400}
            className="absolute inset-0 h-full w-full max-w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            style={{ filter: "grayscale(14%) brightness(0.85)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(8,6,2,0.42), transparent 62%)" }}
          />
        </div>

        {/* ── Text ── */}
        <div className="relative flex flex-1 flex-col justify-center border-s border-s-border p-3.5 sm:border-s-0 sm:border-t sm:border-t-border sm:p-5">
          {/* faded number watermark */}
          <span
            aria-hidden
            className="pointer-events-none absolute top-1.5 select-none font-black leading-none text-primary/[0.08] ltr:right-3 rtl:left-3"
            style={{ fontSize: "2.6rem" }}
          >
            {item.num}
          </span>

          <div className="relative mb-2 h-[2px] w-7" style={{ background: "hsl(var(--primary)/0.7)" }} />
          <h3
            className="relative mb-1.5 font-black uppercase leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary"
            style={{ fontSize: "0.98rem" }}
          >
            {item.title}
          </h3>
          <p
            className="relative leading-relaxed text-muted-foreground line-clamp-2 sm:line-clamp-3"
            style={{ fontSize: "0.84rem", lineHeight: 1.7 }}
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
    // 01 Saudi Manufacturing Advantage — local supply / inventory readiness
    { num: "01", title: t("why.onePartner"), desc: t("why.onePartnerDesc"), image: storageImage },
    // 02 Faster Delivery — road transport
    { num: "02", title: t("why.rapidDeployment"), desc: t("why.rapidDeploymentDesc"), image: landFreightImage },
    // 03 Quality Control Process — container handling / inspection
    { num: "03", title: t("why.nationalCoverage"), desc: t("why.nationalCoverageDesc"), image: logisticsImage },
    // 04 Custom Engineering Capability — large-scale container operations
    { num: "04", title: t("why.compliance"), desc: t("why.complianceDesc"), image: heroPort },
    // 05 Industrial Reliability — heavy-duty steel / rugged
    { num: "05", title: t("why.localSupply"), desc: t("why.localSupplyDesc"), image: lashingImage },
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
            <div
              className={`relative max-w-3xl border-primary/55 ps-5 sm:ps-7 ${isAr ? "border-e-2 text-right" : "border-s-2"}`}
              dir={isAr ? "rtl" : "ltr"}
            >
              {/* decorative quote glyph */}
              <Quote
                aria-hidden
                className="pointer-events-none absolute -top-2 h-12 w-12 text-primary/[0.1] ltr:right-0 rtl:left-0 rtl:-scale-x-100"
              />
              <Label text={isAr ? "باختصار" : "In Short"} isAr={isAr} />
              <p
                className="relative leading-relaxed"
                style={{
                  fontSize: "clamp(1rem, 1.7vw, 1.2rem)",
                  color: "hsl(var(--foreground))",
                  fontWeight: 500,
                  lineHeight: 1.85,
                }}
              >
                {t("why.supportingText")}
              </p>
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
