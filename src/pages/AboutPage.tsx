import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Breadcrumb } from "@/components/Breadcrumb";
import { usePageSEO } from "@/hooks/usePageSEO";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Award, Users, Globe, Zap } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { translations } from "@/i18n/translations";
import { cn } from "@/lib/utils";

export default function AboutPage() {
  const seo = usePageSEO("/about");
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];

  const ArrowIcon = isRTL() ? ArrowLeft : ArrowRight;

  const timeline = [
    { year: "1998", title: t.about.timeline.founded, description: t.about.timeline.foundedDesc },
    { year: "2005", title: t.about.timeline.globalExpansion, description: t.about.timeline.globalExpansionDesc },
    { year: "2012", title: t.about.timeline.innovationHub, description: t.about.timeline.innovationHubDesc },
    {
      year: "2020",
      title: t.about.timeline.digitalTransformation,
      description: t.about.timeline.digitalTransformationDesc,
    },
    { year: "2024", title: t.about.timeline.industryLeader, description: t.about.timeline.industryLeaderDesc },
  ];

  const values = [
    { icon: Award, title: t.about.qualityFirst, description: t.about.qualityFirstDesc },
    { icon: Users, title: t.about.customerFocus, description: t.about.customerFocusDesc },
    { icon: Globe, title: t.about.globalReach, description: t.about.globalReachDesc },
    { icon: Zap, title: t.about.innovation, description: t.about.innovationDesc },
  ];

  const stats = [
    { value: "25+", label: t.about.yearsExperience },
    { value: "50K+", label: t.about.unitsDelivered },
    { value: "120+", label: t.about.countriesServed },
    { value: "500+", label: t.about.enterpriseClients },
  ];

  return (
    <Layout>
      <SEOHead {...seo} />
      <Breadcrumb items={[{ label: isRTL() ? "من نحن" : "About" }]} />
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-20" />
        <div className="industrial-container relative z-10 rtl:text-right">
          <span className="industrial-label mb-6 block">{t.about.label}</span>
          <h1 className="industrial-heading max-w-4xl mb-8">
            {t.about.title}
            <span className="block text-gradient">{t.about.titleHighlight}</span>
          </h1>
          <p className="industrial-subheading max-w-2xl">{t.about.description}</p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-secondary">
        <div className="industrial-container">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  "py-12 text-center",
                  index < 3 && "ltr:md:border-r rtl:md:border-l border-border",
                  index === 1 && "ltr:border-r rtl:border-l border-border",
                )}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2 font-mono">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="industrial-section">
        <div className="industrial-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="rtl:text-right lg:order-1 rtl:lg:order-2">
              <span className="industrial-label mb-4 block">{t.about.storyLabel}</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.about.storyTitle}</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{t.about.storyP1}</p>
                <p>{t.about.storyP2}</p>
                <p>{t.about.storyP3}</p>
              </div>
            </div>
            <div className="relative lg:order-2 rtl:lg:order-1">
              <div className="aspect-square bg-card border border-border p-8">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center">
                  <span className="text-6xl font-bold text-primary/30">SALADA</span>
                </div>
              </div>
              <div className="absolute -bottom-4 ltr:-right-4 rtl:-left-4 bg-primary text-primary-foreground p-6">
                <p className="text-2xl font-bold font-mono">25+</p>
                <p className="text-sm">{t.about.yearsStrong}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="industrial-section bg-secondary border-y border-border">
        <div className="industrial-container">
          <div className="text-center mb-12">
            <span className="industrial-label mb-4 block">{t.about.journeyLabel}</span>
            <h2 className="text-3xl md:text-4xl font-bold">{t.about.milestones}</h2>
          </div>

          <div className="relative">
            <div className="absolute top-0 bottom-0 w-px bg-border ltr:left-8 rtl:right-8 ltr:md:left-1/2 rtl:md:right-1/2" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={cn(
                    "relative flex items-start gap-8 rtl:flex-row-reverse",
                    index % 2 === 0
                      ? "ltr:md:flex-row rtl:md:flex-row-reverse"
                      : "ltr:md:flex-row-reverse rtl:md:flex-row",
                  )}
                >
                  <div
                    className={cn("flex-1 hidden md:block", index % 2 === 0 ? "ltr:text-right rtl:text-left" : "")}
                  />
                  <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary text-primary-foreground flex items-center justify-center font-bold font-mono z-10">
                      {item.year}
                    </div>
                  </div>
                  <div className="flex-1 rtl:text-right">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="industrial-section">
        <div className="industrial-container">
          <div className="text-center mb-12">
            <span className="industrial-label mb-4 block">{t.about.valuesLabel}</span>
            <h2 className="text-3xl md:text-4xl font-bold">{t.about.ourValues}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-1">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-card border border-border p-8 hover:border-primary transition-colors rtl:text-right"
              >
                <value.icon className="w-10 h-10 text-primary mb-6" />
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 bg-primary overflow-hidden">
        <div className="absolute inset-0 container-pattern opacity-20" />
        <div className="industrial-container relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">{t.about.partnerCTA}</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">{t.about.partnerDesc}</p>
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
