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
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background split: text side clean, image side visual */}
        <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-5">
          {/* Left/text background */}
          <div className="hidden lg:block lg:col-span-3 bg-background" />
          {/* Right/image background */}
          <div className="col-span-1 lg:col-span-2 relative">
            <img
              src={heroImage}
              alt="Salada Metal Industries — industrial shipping port"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-foreground/40" />
          </div>
        </div>

        {/* Mobile full overlay */}
        <div className="absolute inset-0 lg:hidden">
          <img src={heroImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/70" />
        </div>

        {/* Subtle geometric accent */}
        <div className="absolute top-0 ltr:right-0 rtl:left-0 w-1/2 h-full hidden lg:block pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l rtl:bg-gradient-to-r from-transparent via-background/60 to-background z-10" />
        </div>

        <div className="industrial-container relative z-20 py-20 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-5 items-center gap-12 lg:gap-0 min-h-[80vh]">
            {/* Text content — 3/5 */}
            <div className="lg:col-span-3 ltr:lg:pr-20 rtl:lg:pl-20 rtl:text-right">
              {/* Label */}
              <span className="inline-block text-xs uppercase tracking-[0.3em] font-mono text-primary mb-6 animate-industrial-fade lg:text-foreground/60 lg:text-primary">
                {t("hero.label")}
              </span>

              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-tighter leading-[1.1] text-background lg:text-foreground animate-industrial-fade">
                {t("hero.title")}
                <span className="block text-primary mt-2">{t("hero.titleHighlight")}</span>
              </h1>

              <p className="mt-6 text-sm md:text-base leading-relaxed text-background/70 lg:text-muted-foreground max-w-xl animate-industrial-fade delay-100">
                {t("hero.description")}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-10 animate-industrial-fade delay-200 rtl:sm:flex-row-reverse">
                <Link
                  to="/solutions"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold uppercase tracking-[0.15em] text-sm rounded-lg transition-all duration-300 hover:shadow-[0_8px_30px_-4px_hsl(var(--primary)/0.4)] hover:-translate-y-0.5 rtl:flex-row-reverse"
                >
                  {t("hero.cta")}
                  <ArrowIcon />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-background lg:border-foreground/20 text-background lg:text-foreground font-semibold uppercase tracking-[0.15em] text-sm rounded-lg transition-all duration-300 hover:border-primary hover:text-primary"
                >
                  {t("hero.quote")}
                </Link>
              </div>

              {/* Trust signals */}
              <div className="flex items-center gap-6 mt-10 animate-industrial-fade delay-300 rtl:flex-row-reverse flex-wrap">
                {[
                  { icon: "🚛", labelEn: "Land Freight", labelAr: "شحن بري" },
                  { icon: "🚢", labelEn: "Sea Freight", labelAr: "شحن بحري" },
                  { icon: "✈️", labelEn: "Air Freight", labelAr: "شحن جوي" },
                ].map((badge) => (
                  <div key={badge.labelEn} className="flex items-center gap-2 rtl:flex-row-reverse">
                    <span className="text-base">{badge.icon}</span>
                    <span className="text-xs uppercase tracking-wider text-background/60 lg:text-muted-foreground font-medium">
                      {isRTL() ? badge.labelAr : badge.labelEn}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual element — 2/5 (desktop only, image already visible behind) */}
            <div className="hidden lg:flex lg:col-span-2 items-center justify-center relative">
              <div className="relative w-full aspect-[3/4] max-w-md rounded-lg overflow-hidden shadow-[0_20px_60px_-10px_hsl(var(--foreground)/0.3)] border border-border/30">
                <img
                  src={heroPort}
                  alt="Industrial container port operations"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-2xl font-bold text-primary font-mono">10+</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-background/80 mt-1">
                    {isRTL() ? "سنوات من الخبرة" : "Years of Experience"}
                  </div>
                </div>
              </div>
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
