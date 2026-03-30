import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { usePageSEO } from "@/hooks/usePageSEO";
import { useLanguageStore } from "@/store/languageStore";
import heroImage from "@/assets/hero-logistics.jpg";
import seaImage from "@/assets/solutions-sea.jpg";
import storageImage from "@/assets/solutions-storage.jpg";
import lashingImage from "@/assets/divisions-lashing.jpg";
import heroPort from "@/assets/hero-port.jpg";

export default function HomePage() {
  const { t, isRTL } = useLanguageStore();

  const ArrowIcon = () => <ArrowRight className="w-5 h-5 ltr:ml-3 rtl:mr-3 rtl:rotate-180" />;

  const solutions = [
    { title: t("solutions.landFreight"), image: lashingImage, href: "/solutions#land" },
    { title: t("solutions.seaFreight"), image: seaImage, href: "/solutions#sea" },
    { title: t("solutions.airFreight"), image: heroImage, href: "/solutions#air" },
    { title: t("solutions.storage"), image: storageImage, href: "/solutions#storage" },
  ];

  const stats = [
    { value: "10+", label: t("stats.yearsExperience") },
    { value: "200+", label: t("stats.projectsDelivered") },
    { value: "50+", label: t("stats.clientsServed") },
    { value: "99.5%", label: t("stats.onTimeDelivery") },
  ];

  const seo = usePageSEO("/");

  return (
    <Layout>
      <SEOHead {...seo} />
      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] bg-background container-pattern">
        <div className="industrial-container relative z-10 h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[90vh]">
            {/* Text Side */}
            <div className="flex flex-col justify-center py-20 md:py-32 order-2 md:order-1 rtl:md:order-2 rtl:text-right">
              <h1 className="industrial-heading animate-industrial-slide">
                {t("hero.title")}{" "}
                <span className="text-primary">{t("hero.titleHighlight")}</span>
              </h1>
              <p className="industrial-subheading mt-6 max-w-lg animate-industrial-fade delay-200">
                {t("hero.description") !== "hero.description"
                  ? t("hero.description")
                  : "Delivering end-to-end logistics, storage, and metal fabrication services across the Kingdom with precision and reliability."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-10 animate-fade-in delay-400 rtl:sm:flex-row-reverse">
                <Link to="/solutions" className="industrial-button rtl:flex-row-reverse">
                  {t("hero.cta")}
                  <ArrowIcon />
                </Link>
                <Link to="/about" className="industrial-button-outline rtl:flex-row-reverse">
                  {t("hero.quote")}
                  <ArrowIcon />
                </Link>
              </div>
            </div>

            {/* Image Side */}
            <div className="relative order-1 md:order-2 rtl:md:order-1 min-h-[300px] md:min-h-0">
              <img
                src={heroImage}
                alt="Salada Metal Industries — industrial shipping port"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-foreground/40" />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-b border-border">
        <div className="industrial-container">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`py-14 md:py-20 text-center ${
                  index < stats.length - 1 ? "ltr:border-r rtl:border-l border-border" : ""
                }`}
              >
                <div className="text-2xl md:text-4xl font-bold text-primary mb-3 font-mono">{stat.value}</div>
                <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VISION 2030 ── */}
      <section className="industrial-section border-b border-border">
        <div className="industrial-container">
          <div className="max-w-5xl rtl:text-right">
            <span className="industrial-label mb-8 block">{t("vision.label")}</span>
            <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tighter leading-tight">
              {t("vision.title")}
            </h2>
          </div>
        </div>
      </section>

      {/* ── SOLUTIONS ── */}
      <section className="border-b border-border">
        <div className="industrial-container py-24 md:py-32">
          <div className="mb-20 rtl:text-right">
            <span className="industrial-label mb-6 block">{t("solutions.label")}</span>
            <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tighter">{t("solutions.title")}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {solutions.map((solution) => (
            <Link
              key={solution.title}
              to={solution.href}
              className="group relative aspect-[16/10] overflow-hidden border-b ltr:border-r rtl:border-l border-border"
            >
              <img
                src={solution.image}
                alt={solution.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 rtl:text-right">
                <h3 className="text-xl md:text-2xl font-bold text-background uppercase tracking-tight group-hover:text-primary transition-colors duration-300">
                  {solution.title}
                </h3>
                <span className="inline-flex items-center text-xs uppercase tracking-[0.25em] text-primary font-mono mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rtl:flex-row-reverse">
                  {t("solutions.learnMore")}
                  <ArrowIcon />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── INDUSTRIES ── */}
      <section className="industrial-section border-b border-border">
        <div className="industrial-container">
          <div className="mb-20 rtl:text-right">
            <span className="industrial-label mb-6 block">{t("industries.label")}</span>
            <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tighter">{t("industries.title")}</h2>
          </div>

          <div className="border-t border-border">
            {[
              t("industries.logistics"),
              t("industries.construction"),
              t("industries.government"),
              t("industries.industrial"),
              t("industries.storage"),
            ].map((name) => (
              <Link
                key={name}
                to="/industries"
                dir={isRTL() ? "rtl" : "ltr"}
                className="group flex items-center justify-between py-6 md:py-8 border-b border-border ltr:hover:pl-4 rtl:hover:pr-4 transition-all duration-300"
              >
                <span className="text-lg md:text-xl font-bold uppercase tracking-tight group-hover:text-primary transition-colors">
                  {name}
                </span>
                <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY SALADA ── */}
      <section className="industrial-section border-b border-border">
        <div className="industrial-container">
          <div className="mb-20 text-center">
            <span className="industrial-label mb-6 block">{t("why.label")}</span>
            <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tighter">{t("why.title")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t ltr:border-l rtl:border-r border-border">
            {[
              { title: t("why.onePartner") },
              { title: t("why.rapidDeployment") },
              { title: t("why.nationalCoverage") },
              { title: t("why.compliance") },
            ].map((item) => (
              <div
                key={item.title}
                className="border-b ltr:border-r rtl:border-l border-border p-10 md:p-12 hover:bg-secondary/50 transition-colors duration-300 rtl:text-right"
              >
                <h3 className="text-base md:text-xl font-bold uppercase tracking-tight">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroPort} alt="Industrial port operations" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-foreground/70" />
        </div>

        <div className="industrial-container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-background mb-10 uppercase tracking-tighter leading-tight">
              {t("cta.title")}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center rtl:sm:flex-row-reverse">
              <Link to="/contact" className="industrial-button rtl:flex-row-reverse">
                {t("cta.getQuote")}
                <ArrowIcon />
              </Link>
              <Link
                to="/solutions"
                className="inline-flex items-center justify-center px-10 py-5 border-2 border-background text-background font-semibold uppercase tracking-[0.2em] text-sm transition-all duration-300 hover:bg-background hover:text-foreground"
              >
                {t("cta.browseCatalog")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
