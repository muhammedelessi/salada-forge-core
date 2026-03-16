import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Breadcrumb } from "@/components/Breadcrumb";
import { usePageSEO } from "@/hooks/usePageSEO";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Factory, Eye, Target, Handshake } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { translations } from "@/i18n/translations";
import { cn } from "@/lib/utils";

export default function AboutPage() {
  const seo = usePageSEO("/about");
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];

  const ArrowIcon = isRTL() ? ArrowLeft : ArrowRight;

  return (
    <Layout>
      <SEOHead {...seo} />
      <Breadcrumb items={[{ label: isRTL() ? "من نحن" : "About" }]} />

      {/* Section 1 — About Salada */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-20" />
        <div className="industrial-container relative z-10 rtl:text-right">
          <span className="industrial-label mb-6 block">{t.about.label}</span>
          <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter leading-tight max-w-4xl mb-8">{t.about.title}</h1>
          <div className="max-w-2xl space-y-4">
            <p className="text-base text-muted-foreground">{t.about.descP1}</p>
            <p className="text-base text-muted-foreground">{t.about.descP2}</p>
          </div>
        </div>
      </section>

      {/* Section 2 — Our Vision */}
      <section className="border-y border-border bg-secondary">
        <div className="industrial-container py-16 md:py-24">
          <div className="grid lg:grid-cols-[auto_1fr] gap-8 items-center rtl:text-right">
            <Eye className="w-12 h-12 text-primary shrink-0" />
            <div>
              <span className="industrial-label mb-4 block">{t.about.visionLabel}</span>
              <h2 className="text-2xl md:text-4xl font-bold mb-4">{t.about.visionTitle}</h2>
              <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
                {t.about.visionDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Our Mission */}
      <section className="industrial-section">
        <div className="industrial-container">
          <div className="grid lg:grid-cols-[auto_1fr] gap-8 items-center rtl:text-right">
            <Target className="w-12 h-12 text-primary shrink-0" />
            <div>
              <span className="industrial-label mb-4 block">{t.about.missionLabel}</span>
              <h2 className="text-2xl md:text-4xl font-bold mb-4">{t.about.missionTitle}</h2>
              <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
                {t.about.missionDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 — Our Commitment */}
      <section className="border-y border-border bg-secondary">
        <div className="industrial-container py-16 md:py-24">
          <div className="grid lg:grid-cols-[auto_1fr] gap-8 items-center rtl:text-right">
            <Handshake className="w-12 h-12 text-primary shrink-0" />
            <div>
              <span className="industrial-label mb-4 block">{t.about.commitmentLabel}</span>
              <h2 className="text-2xl md:text-4xl font-bold mb-4">{t.about.commitmentTitle}</h2>
              <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
                {t.about.commitmentDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 — Our Manufacturing Facility */}
      <section className="industrial-section">
        <div className="industrial-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="rtl:text-right lg:order-1 rtl:lg:order-2">
              <span className="industrial-label mb-4 block">{t.about.factoryLabel}</span>
              <h2 className="text-2xl md:text-4xl font-bold mb-6">{t.about.factoryTitle}</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                <p>{t.about.factoryP1}</p>
                <p>{t.about.factoryP2}</p>
              </div>
            </div>
            <div className="relative lg:order-2 rtl:lg:order-1">
              <div className="aspect-square bg-card border border-border p-8">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center">
                  <Factory className="w-24 h-24 text-primary/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 bg-primary overflow-hidden">
        <div className="absolute inset-0 container-pattern opacity-20" />
        <div className="industrial-container relative z-10 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-6">{t.about.partnerCTA}</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto text-base">{t.about.partnerDesc}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center rtl:sm:flex-row-reverse">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-background text-foreground font-semibold uppercase tracking-wider text-sm rtl:flex-row-reverse"
            >
              {t.about.contactUs}
              <ArrowIcon className="w-4 h-4 ltr:ml-2 rtl:mr-2" />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-foreground text-primary-foreground font-semibold uppercase tracking-wider text-sm hover:bg-primary-foreground hover:text-primary transition-colors"
            >
              {t.about.viewProducts}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
