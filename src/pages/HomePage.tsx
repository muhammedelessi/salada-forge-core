import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { usePageSEO } from "@/hooks/usePageSEO";
import { useLanguageStore } from "@/store/languageStore";
import heroImage from "@/assets/hero-logistics.jpg";
import seaImage from "@/assets/solutions-sea.jpg";
import storageImage from "@/assets/solutions-storage.jpg";
import lashingImage from "@/assets/divisions-lashing.jpg";
import heroPort from "@/assets/hero-port.jpg";

/* ─── Intersection Observer Hook ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─── Animated Counter ─── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / (1800 / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ─── Scroll Reveal ─── */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(36px)",
        transition: `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms,
                   transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const { t, isRTL } = useLanguageStore();
  const seo = usePageSEO("/");
  const isAr = isRTL();

  const solutions = [
    {
      title: t("solutions.landFreight"),
      desc: t("solutions.landFreightDesc"),
      image: lashingImage,
      href: "/solutions#land",
      tag: "01",
    },
    {
      title: t("solutions.seaFreight"),
      desc: t("solutions.seaFreightDesc"),
      image: seaImage,
      href: "/solutions#sea",
      tag: "02",
    },
    {
      title: t("solutions.airFreight"),
      desc: t("solutions.airFreightDesc"),
      image: heroImage,
      href: "/solutions#air",
      tag: "03",
    },
    {
      title: t("solutions.storage"),
      desc: t("solutions.storageDesc"),
      image: storageImage,
      href: "/solutions#storage",
      tag: "04",
    },
  ];

  const stats = [
    { value: 10, suffix: "+", label: t("stats.yearsExperience") },
    { value: 200, suffix: "+", label: t("stats.projectsDelivered") },
    { value: 50, suffix: "+", label: t("stats.clientsServed") },
    { value: 99, suffix: ".5%", label: t("stats.onTimeDelivery") },
  ];

  const industries = [
    t("industries.logistics"),
    t("industries.construction"),
    t("industries.government"),
    t("industries.industrial"),
    t("industries.storage"),
  ];

  const whyItems = [
    { num: "01", title: t("why.onePartner") },
    { num: "02", title: t("why.rapidDeployment") },
    { num: "03", title: t("why.nationalCoverage") },
    { num: "04", title: t("why.compliance") },
  ];

  return (
    <Layout>
      <SEOHead {...seo} />

      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-surface-base">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Salada industrial port" className="w-full h-full object-cover animate-hero-zoom" />
          <div className="absolute inset-0 hero-overlay" />
          <div className="absolute inset-0 hero-overlay-side" />
        </div>

        <div className="scan-line" style={{ top: "28%" }} />
        <div className="corner-mark corner-mark-tl" style={{ top: "8rem", left: "1.5rem" }} />
        <div className="corner-mark corner-mark-tr" style={{ top: "8rem", right: "1.5rem" }} />

        <div className="absolute top-36 left-1/2 -translate-x-1/2 z-10 animate-fade-down delay-300">
          <span className="industrial-label opacity-70">
            {isAr ? "صانع سعودي معتمد" : "Saudi Certified Manufacturer"}
          </span>
        </div>

        <div className="industrial-container relative z-10 pb-28 md:pb-36">
          <div className={`max-w-5xl ${isAr ? "text-right mr-0 ml-auto" : ""}`}>
            <div className="animate-fade-up delay-400">
              <span className={`industrial-label-line mb-8 block ${isAr ? "flex-row-reverse justify-end" : ""}`}>
                {t("hero.label")}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.92] tracking-[-0.02em] text-white mb-3 animate-fade-up delay-500">
              {t("hero.title")}
            </h1>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.92] tracking-[-0.02em] mb-12 text-gold-gradient animate-fade-up delay-600">
              {t("hero.titleHighlight")}
            </h1>

            <div
              className={`flex flex-col sm:flex-row gap-4 animate-fade-up delay-800 ${isAr ? "sm:flex-row-reverse" : ""}`}
            >
              <Link to="/solutions" className={`industrial-button ${isAr ? "flex-row-reverse" : ""}`}>
                {t("hero.cta")}
                <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
              </Link>
              <Link to="/contact" className={`industrial-button-outline ${isAr ? "flex-row-reverse" : ""}`}>
                {t("hero.quote")}
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 opacity-40">
          <ChevronDown className="w-4 h-4 text-primary animate-bounce-subtle" />
        </div>
        <div className="absolute bottom-0 inset-x-0 gold-divider" />
      </section>

      {/* ══ STATS ══ */}
      <section className="bg-surface-raised border-b border-gold">
        <div className="industrial-container">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, i) => (
              <Reveal
                key={stat.label}
                delay={i * 80}
                className={`py-14 md:py-20 text-center ${i < stats.length - 1 ? (isAr ? "border-l border-gold" : "border-r border-gold") : ""}`}
              >
                <div className="text-3xl md:text-5xl font-black font-mono mb-3 text-stat-gold">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="industrial-label opacity-60">{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ VISION 2030 ══ */}
      <section className="bg-surface-base py-28 md:py-40 border-b border-gold">
        <div className="industrial-container">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            <Reveal className={isAr ? "text-right order-2 md:order-1" : ""}>
              <span className={`industrial-label-line mb-8 block ${isAr ? "flex-row-reverse justify-end" : ""}`}>
                {t("vision.label")}
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase leading-[0.95] tracking-tight text-white mb-8">
                {t("vision.title")}
              </h2>
              <p className="text-white/50 leading-relaxed text-sm md:text-base max-w-lg">{t("vision.description")}</p>
            </Reveal>

            <Reveal delay={200} className={isAr ? "order-1 md:order-2" : ""}>
              <div className="vision-badge relative aspect-square max-w-xs mx-auto flex flex-col items-center justify-center p-12">
                <div className="corner-mark corner-mark-tl" />
                <div className="corner-mark corner-mark-tr" />
                <div className="corner-mark corner-mark-bl" />
                <div className="corner-mark corner-mark-br" />
                <div className="text-6xl md:text-8xl font-black font-mono leading-none text-gold-gradient">2030</div>
                <div className="industrial-label mt-4 text-center opacity-50">
                  {isAr ? "رؤية المملكة" : "Saudi Vision"}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ SOLUTIONS ══ */}
      <section className="bg-surface-base border-b border-gold">
        <div className="industrial-container py-24 md:py-32">
          <Reveal className={isAr ? "text-right" : ""}>
            <span className={`industrial-label-line mb-6 block ${isAr ? "flex-row-reverse justify-end" : ""}`}>
              {t("solutions.label")}
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase leading-[0.95] tracking-tight text-white">
              {t("solutions.title")}
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {solutions.map((sol, i) => (
            <Reveal key={sol.title} delay={i * 60}>
              <Link
                to={sol.href}
                className={`group relative aspect-[4/3] flex overflow-hidden border-b border-gold ${
                  i % 2 === 0 ? (isAr ? "border-l border-gold" : "border-r border-gold") : ""
                }`}
              >
                <img
                  src={sol.image}
                  alt={sol.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover img-industrial transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 solution-overlay" />
                <span className="absolute top-6 left-6 industrial-label opacity-50">{sol.tag}</span>
                <div className={`absolute bottom-0 ${isAr ? "right-0 text-right" : "left-0"} p-8 md:p-10 w-full`}>
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight leading-tight mb-3 group-hover:text-primary transition-colors duration-300">
                    {sol.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-4">
                    {sol.desc}
                  </p>
                  <span
                    className={`industrial-label opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}
                  >
                    {t("solutions.learnMore")}
                    <ArrowRight className={`w-3 h-3 ${isAr ? "rotate-180" : ""}`} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ INDUSTRIES ══ */}
      <section className="bg-surface-raised py-28 md:py-40 border-b border-gold">
        <div className="industrial-container">
          <Reveal className={`mb-16 ${isAr ? "text-right" : ""}`}>
            <span className={`industrial-label-line mb-6 block ${isAr ? "flex-row-reverse justify-end" : ""}`}>
              {t("industries.label")}
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase leading-[0.95] tracking-tight text-white">
              {t("industries.title")}
            </h2>
          </Reveal>

          <div className="border-t border-gold mt-2">
            {industries.map((name, i) => (
              <Reveal key={name} delay={i * 60}>
                <Link
                  to="/industries"
                  dir={isAr ? "rtl" : "ltr"}
                  className={`group flex items-center justify-between py-6 md:py-8 border-b border-gold transition-all duration-300 ${isAr ? "hover:pr-4" : "hover:pl-4"}`}
                >
                  <div className={`flex items-center gap-6 ${isAr ? "flex-row-reverse" : ""}`}>
                    <span className="industrial-label w-6 opacity-40">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-lg md:text-2xl font-black uppercase tracking-tight text-white/80 group-hover:text-primary transition-colors duration-300">
                      {name}
                    </span>
                  </div>
                  <ArrowRight
                    className={`w-5 h-5 text-primary/30 group-hover:text-primary transition-all duration-300 ${isAr ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY SALADA ══ */}
      <section className="bg-surface-base py-28 md:py-40 border-b border-gold">
        <div className="industrial-container">
          <Reveal className={`mb-20 ${isAr ? "text-right" : "text-center"}`}>
            <span
              className={`industrial-label-line industrial-label-line-both mb-6 flex ${isAr ? "flex-row-reverse justify-end" : "justify-center"}`}
            >
              {t("why.label")}
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase leading-[0.95] tracking-tight text-white">
              {t("why.title")}
            </h2>
          </Reveal>

          <div className="why-grid">
            {whyItems.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className={`why-grid-item group ${isAr ? "text-right" : ""}`}>
                  <div className="text-4xl font-black font-mono mb-6 leading-none text-stat-gold">{item.num}</div>
                  <div
                    className={`w-8 h-px bg-primary/30 mb-6 group-hover:w-12 transition-all duration-300 ${isAr ? "mr-0 ml-auto" : ""}`}
                  />
                  <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-white/75 group-hover:text-primary transition-colors duration-300 leading-tight">
                    {item.title}
                  </h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="relative py-36 md:py-56 overflow-hidden bg-surface-base">
        <div className="absolute inset-0">
          <img
            src={heroPort}
            alt="Industrial port"
            className="w-full h-full object-cover img-industrial"
            loading="lazy"
          />
          <div className="absolute inset-0 hero-overlay" />
          <div className="absolute inset-0 hero-overlay-side" style={{ opacity: 0.6 }} />
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 gold-divider opacity-30" />

        <div className="industrial-container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <span className="industrial-label-line industrial-label-line-both mb-8 flex justify-center">
                {isAr ? "تواصل معنا" : "Get In Touch"}
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase leading-[0.95] tracking-tight mb-12">
                {t("cta.title")}
              </h2>
              <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isAr ? "sm:flex-row-reverse" : ""}`}>
                <Link to="/contact" className={`industrial-button ${isAr ? "flex-row-reverse" : ""}`}>
                  {t("cta.getQuote")}
                  <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
                </Link>
                <Link to="/solutions" className={`industrial-button-outline ${isAr ? "flex-row-reverse" : ""}`}>
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
