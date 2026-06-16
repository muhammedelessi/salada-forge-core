import { useParams, Link } from "react-router-dom";
import {
  ArrowRight,
  Loader2,
  Ruler,
  ShieldCheck,
  Truck,
  Wrench,
  Ship,
  HardHat,
  Landmark,
  Factory,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { PageHero } from "@/components/PageHero";
import { useLanguageStore } from "@/store/languageStore";
import { useIndustry } from "@/hooks/useIndustries";
import heroPort from "@/assets/hero-port.webp";

/* ── Scroll reveal (shared pattern with Why Salada / Industries) ── */
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
        style={{ width: "1.25rem", height: "1.5px", background: "hsl(var(--primary)/0.65)", display: "block", flexShrink: 0 }}
      />
      <span
        className={`label-text text-label-md uppercase tracking-[0.25em]${spanClassName ? ` ${spanClassName}` : ""}`}
        style={{ color: "hsl(var(--primary))" }}
      >
        {text}
      </span>
      {center && (
        <span
          style={{ width: "1.25rem", height: "1.5px", background: "hsl(var(--primary)/0.65)", display: "block", flexShrink: 0 }}
        />
      )}
    </div>
  );
}

const INDUSTRY_ICONS: Record<string, LucideIcon> = { Ship, HardHat, Landmark, Factory, Warehouse };

export default function IndustryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, isRTL } = useLanguageStore();
  const isAr = isRTL();
  const { data: industry, isLoading } = useIndustry(id || "");

  if (isLoading) {
    return (
      <Layout>
        <div className="industrial-container flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!industry) {
    return (
      <Layout>
        <div className="industrial-container py-24 text-center">
          <h1 className="mb-4 text-2xl font-bold">{isAr ? "القطاع غير موجود" : "Industry not found"}</h1>
          <Link to="/industries" className="btn-primary">
            {isAr ? "عرض القطاعات" : "View Industries"}
          </Link>
        </div>
      </Layout>
    );
  }

  const name = isAr ? industry.nameAr : industry.nameEn;
  const description = isAr ? industry.descriptionAr : industry.descriptionEn;
  const explanation = isAr ? industry.explanationAr : industry.explanationEn;
  const Icon = (industry.icon && INDUSTRY_ICONS[industry.icon]) || Factory;

  // Generic capabilities Salada brings to every sector (bilingual).
  const capabilities = [
    {
      Icon: Ruler,
      title: isAr ? "تصنيع حسب المواصفات" : "Built to Specification",
      desc: isAr
        ? "مصمّمة حسب أبعادك ومتطلبات التحميل بدقة."
        : "Engineered to your exact dimensions and load requirements.",
    },
    {
      Icon: ShieldCheck,
      title: isAr ? "فولاذ شديد التحمّل" : "Heavy-Duty Steel",
      desc: isAr
        ? "هياكل مقاومة للتآكل تتحمّل أصعب بيئات التشغيل."
        : "Corrosion-resistant builds that endure the toughest environments.",
    },
    {
      Icon: Truck,
      title: isAr ? "تسليم في الموعد" : "On-Time Delivery",
      desc: isAr
        ? "توريد موثوق على مستوى المملكة يبقي عملياتك مستمرة."
        : "Reliable nationwide supply that keeps your operations moving.",
    },
    {
      Icon: Wrench,
      title: isAr ? "دعم ما بعد البيع" : "After-Sales Support",
      desc: isAr
        ? "خدمة وصيانة متجاوبة تدعم كل وحدة نسلّمها."
        : "Responsive service and maintenance backing every unit.",
    },
  ];

  return (
    <Layout>
      <SEOHead title={`${name} | Salada`} description={description} path={`/industries/${id}`} />

      {/* HERO — shared component (Home / Industries / name) */}
      <PageHero
        breadcrumbLabel={name}
        parentLabel={isAr ? "القطاعات" : "Industries"}
        parentHref="/industries"
        title={name}
        description={description}
      />

      {/* ════════════════════════════════
          OVERVIEW — explanation + capabilities (RTL-aware, logical alignment)
      ════════════════════════════════ */}
      <section className="bg-background border-b border-border section-pad" dir={isAr ? "rtl" : "ltr"}>
        <div className="industrial-container">
          <div className="grid items-start gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
            {/* Lead + explanation */}
            <Reveal className="min-w-0">
              <div className="text-start">
                <div className="mb-5 flex items-center gap-4">
                  <span
                    aria-hidden
                    className="flex h-14 w-14 shrink-0 items-center justify-center bg-primary/10 text-primary"
                  >
                    <Icon className="h-7 w-7" />
                  </span>
                  <Label text={isAr ? "كيف نخدم هذا القطاع" : "How We Serve This Industry"} isAr={isAr} />
                </div>

                <p
                  className="mb-5 leading-snug text-foreground"
                  style={{ fontSize: "clamp(1.15rem, 2vw, 1.5rem)", fontWeight: 700, maxWidth: "40rem" }}
                >
                  {description}
                </p>

                {explanation ? (
                  <p
                    className="leading-relaxed text-muted-foreground"
                    style={{ fontSize: "clamp(0.92rem, 1.4vw, 1.05rem)", lineHeight: 1.85, maxWidth: "42rem" }}
                  >
                    {explanation}
                  </p>
                ) : null}

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link to="/contact?type=quote" className="btn-primary w-full sm:w-auto">
                    <span>{t("cta.getQuote")}</span>
                    <ArrowRight className={`h-3.5 w-3.5 ${isAr ? "rotate-180" : ""}`} />
                  </Link>
                  <Link
                    to="/industries"
                    className="hero-inline-cta inline-flex items-center gap-2 label-text text-label-md uppercase tracking-[0.18em] transition-colors duration-200 hover:opacity-75"
                    style={{ color: "hsl(var(--primary))" }}
                  >
                    {isAr ? "كل القطاعات" : "All Industries"}
                    <ArrowRight className={`h-3.5 w-3.5 ${isAr ? "rotate-180" : ""}`} />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Capabilities card */}
            <Reveal delay={120} className="min-w-0">
              <div className="border border-border bg-secondary/30 p-6 md:p-7">
                <span
                  className="mb-5 block label-text text-label-md uppercase tracking-[0.22em] text-start"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {isAr ? "ما الذي نقدّمه" : "What We Provide"}
                </span>
                <ul className="flex flex-col gap-5">
                  {capabilities.map((cap) => (
                    <li key={cap.title} className="flex items-start gap-3.5 text-start">
                      <span
                        aria-hidden
                        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-primary/30 bg-primary/10 text-primary"
                      >
                        <cap.Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <span className="block text-foreground" style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                          {cap.title}
                        </span>
                        <span
                          className="mt-0.5 block text-muted-foreground"
                          style={{ fontWeight: 400, fontSize: "0.82rem", lineHeight: 1.6 }}
                        >
                          {cap.desc}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          CTA — dark (shared)
      ════════════════════════════════ */}
      <section className="relative py-14 md:py-20 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
        <div className="absolute inset-0">
          <img
            src={heroPort}
            alt="Industrial operations"
            loading="lazy"
            decoding="async"
            width={1920}
            height={1080}
            className="w-full h-full object-cover max-w-full"
            style={{ filter: "grayscale(25%) brightness(0.35)" }}
          />
          <div className="absolute inset-0" style={{ background: "rgba(8,6,2,0.82)" }} />
        </div>

        <div className="industrial-container relative z-10">
          <div className="max-w-xl mx-auto text-center">
            <Reveal>
              <Label text={isAr ? "تواصل معنا" : "Get Started"} isAr={isAr} center spanClassName="hero-eyebrow-primary" />
              <h2
                className="font-black uppercase leading-[0.92] tracking-[-0.025em] mb-4"
                style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", color: "#fff" }}
              >
                {t("cta.title")}
              </h2>
              <p className="text-[0.8rem] leading-relaxed mb-7 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.4)" }}>
                {t("cta.description")}
              </p>
              <div className={`flex flex-wrap gap-3 justify-center ${isAr ? "flex-row-reverse" : ""}`}>
                <Link to="/contact?type=quote" className="btn-primary w-full sm:w-auto">
                  <span>{t("cta.getQuote")}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link to="/solutions" className="btn-ghost-dark w-full sm:w-auto">
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
