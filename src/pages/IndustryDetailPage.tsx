import { useParams, Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
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

  return (
    <Layout>
      <SEOHead title={`${name} | Salada`} description={description} path={`/industries/${id}`} />

      {/* ════════════════════════════════
          HERO — compact with image (matches Why Salada / Industries)
      ════════════════════════════════ */}
      <section className="relative overflow-hidden" dir={isAr ? "rtl" : "ltr"} style={{ minHeight: "260px" }}>
        <div className="absolute inset-0">
          <img
            src={heroPort}
            alt={name}
            width={1920}
            height={1080}
            className="w-full h-full object-cover object-center max-w-full"
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
            <nav className="page-hero-breadcrumb flex items-center gap-1.5 mb-4">
              <Link
                to="/"
                className="hero-crumb label-text text-label-md uppercase tracking-[0.15em]"
                style={{ color: "rgba(255,255,255,0.32)" }}
              >
                {isAr ? "الرئيسية" : "Home"}
              </Link>
              <span style={{ color: "rgba(255,255,255,0.18)" }}>/</span>
              <Link
                to="/industries"
                className="hero-crumb label-text text-label-md uppercase tracking-[0.15em]"
                style={{ color: "rgba(255,255,255,0.32)" }}
              >
                {isAr ? "القطاعات" : "Industries"}
              </Link>
              <span style={{ color: "rgba(255,255,255,0.18)" }}>/</span>
              <span
                className="hero-crumb label-text text-label-md uppercase tracking-[0.15em]"
                style={{ color: "hsl(var(--primary))" }}
              >
                {name}
              </span>
            </nav>

            <h1 className="hero-title-primary font-black uppercase leading-[0.93] tracking-[-0.025em] mb-3 animate-fade-up delay-200">
              {name}
            </h1>

            <p
              className="hero-subtitle leading-relaxed animate-fade-up delay-300"
              style={{ color: "rgba(255,255,255,0.45)", maxWidth: "36rem" }}
            >
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          HOW WE SERVE — detailed explanation
      ════════════════════════════════ */}
      {explanation ? (
        <section className="bg-background border-b border-border py-10 md:py-14" dir={isAr ? "rtl" : "ltr"}>
          <div className="industrial-container">
            <Reveal>
              <div className={isAr ? "text-right" : ""}>
                <Label text={isAr ? "كيف نخدم هذا القطاع" : "How We Serve This Industry"} isAr={isAr} />
                <p
                  className="leading-relaxed"
                  style={{
                    fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
                    color: "hsl(var(--foreground))",
                    fontWeight: 500,
                    maxWidth: "42rem",
                  }}
                >
                  {explanation}
                </p>
                <Link
                  to="/industries"
                  className={`hero-inline-cta inline-flex items-center gap-2 mt-5 label-text text-label-md uppercase tracking-[0.18em] transition-colors duration-200 hover:opacity-75 ${isAr ? "flex-row-reverse" : ""}`}
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {isAr ? "كل القطاعات" : "All Industries"}
                  <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

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
