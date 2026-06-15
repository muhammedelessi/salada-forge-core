import { Link } from "react-router-dom";
import { ArrowRight, Ship, HardHat, Landmark, Factory, Warehouse } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { usePageSEO } from "@/hooks/usePageSEO";
import { useLanguageStore } from "@/store/languageStore";
import { useIndustries } from "@/hooks/useIndustries";
import { PartnerCTA } from "@/components/PartnerCTA";
import { PageHero } from "@/components/PageHero";

/** Icon name (stored in DB) → Lucide component. */
const INDUSTRY_ICONS: Record<string, LucideIcon> = {
  Ship,
  HardHat,
  Landmark,
  Factory,
  Warehouse,
};

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

  const { data: industries = [] } = useIndustries();

  return (
    <Layout>
      <SEOHead {...seo} />

      {/* ════════════════════════════════
          HERO — compact
      ════════════════════════════════ */}
      <PageHero
        breadcrumbLabel={isAr ? "القطاعات" : "Industries"}
        title={isAr ? "القطاعات التي نخدمها" : "Industries We Serve"}
        description={t("industries.pageDesc")}
      />

      {/* ════════════════════════════════
          INTRO STRIP
      ════════════════════════════════ */}
     

      {/* ════════════════════════════════
          INDUSTRIES — number ticker list
      ════════════════════════════════ */}
      <section className="bg-background border-b border-border" dir={isAr ? "rtl" : "ltr"}>
        <div className="industrial-container">
          {industries.map((ind, i) => {
            const Icon = (ind.icon && INDUSTRY_ICONS[ind.icon]) || Ship;
            const name = isAr ? ind.nameAr : ind.nameEn;
            const desc = isAr ? ind.descriptionAr : ind.descriptionEn;
            return (
              <Reveal key={ind.id} delay={i * 60}>
                <Link
                  to={`/industries/${ind.slug}`}
                  id={ind.slug}
                  className="group block border-b border-border last:border-b-0 subtle-card-hover hover:bg-primary/5"
                >
                  <div className="flex items-stretch gap-0">
                    {/* Content */}
                    <div className="flex flex-1 items-center gap-5 py-6 px-6 md:px-8">
                      {/* Icon */}
                      <div
                        className="relative shrink-0 flex items-center justify-center bg-primary rounded-md transition-transform duration-300 group-hover:scale-105"
                        style={{ width: "52px", height: "52px" }}
                      >
                        <Icon className="w-5 h-5 text-primary-foreground" />
                      </div>

                      {/* Text */}
                      <div className="min-w-0 flex-1">
                        <div
                          className="mb-2 shrink-0"
                          style={{ width: "1.5rem", height: "2px", background: "hsl(var(--primary))" }}
                          aria-hidden
                        />
                        <h2 className="industry-card-title mb-1 uppercase leading-tight tracking-tight transition-colors duration-300 group-hover:text-primary">
                          {name}
                        </h2>
                        <p className="industry-card-desc">{desc}</p>
                      </div>

                      {/* Arrow */}
                      <ArrowRight
                        className="w-4 h-4 shrink-0 opacity-25 group-hover:opacity-100 transition-all duration-300 ltr:group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                        style={{ color: "hsl(var(--primary))" }}
                      />
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════
          CTA — dark
      ════════════════════════════════ */}
      <PartnerCTA title={t("industries.ctaTitle")} description={t("industries.ctaDesc")} />
    </Layout>
  );
}
