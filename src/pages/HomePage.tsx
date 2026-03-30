import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { usePageSEO } from "@/hooks/usePageSEO";
import { useLanguageStore } from "@/store/languageStore";
import HeroSection from "@/components/home/HeroSection";
import seaImage from "@/assets/solutions-sea.jpg";
import storageImage from "@/assets/solutions-storage.jpg";
import lashingImage from "@/assets/divisions-lashing.jpg";
import heroImage from "@/assets/hero-logistics.jpg";
import heroPort from "@/assets/hero-port.jpg";

/* ══ useInView — triggers once when element enters viewport ══ */
function useInView(threshold = 0.12) {
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
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ══ Reveal — smooth scroll-triggered fade+slide ══ */
function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}) {
  const { ref, inView } = useInView();
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity .9s cubic-bezier(.16,1,.3,1) ${delay}ms,
                     transform .9s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}

/* ══ Counter — counts up when in view ══ */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const { ref, inView } = useInView(0.5);
  useEffect(() => {
    if (!inView) return;
    const step = Math.max(1, Math.ceil(target / 72));
    let cur = 0;
    const id = setInterval(() => {
      cur = Math.min(cur + step, target);
      setN(cur);
      if (cur >= target) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [inView, target]);
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

/* ══ HomePage ══ */
export default function HomePage() {
  const { t, isRTL } = useLanguageStore();
  const seo = usePageSEO("/");
  const isAr = isRTL();

  const solutions = [
    {
      num: "01",
      href: "/solutions#land",
      title: t("solutions.landFreight"),
      desc: t("solutions.landFreightDesc"),
      image: lashingImage,
    },
    {
      num: "02",
      href: "/solutions#sea",
      title: t("solutions.seaFreight"),
      desc: t("solutions.seaFreightDesc"),
      image: seaImage,
    },
    {
      num: "03",
      href: "/solutions#air",
      title: t("solutions.airFreight"),
      desc: t("solutions.airFreightDesc"),
      image: heroImage,
    },
    {
      num: "04",
      href: "/solutions#storage",
      title: t("solutions.storage"),
      desc: t("solutions.storageDesc"),
      image: storageImage,
    },
  ];

  const stats = [
    { value: 10, suffix: "+", label: t("stats.yearsExperience") },
    { value: 200, suffix: "+", label: t("stats.projectsDelivered") },
    { value: 50, suffix: "+", label: t("stats.clientsServed") },
    { value: 99, suffix: ".5%", label: t("stats.onTimeDelivery") },
  ];

  const industries = [
    { name: t("industries.logistics"), href: "/industries#logistics" },
    { name: t("industries.construction"), href: "/industries#construction" },
    { name: t("industries.government"), href: "/industries#government" },
    { name: t("industries.industrial"), href: "/industries#industrial" },
    { name: t("industries.storage"), href: "/industries#storage" },
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

      <HeroSection />

      {/* ════════════════════════════════
          STATS BAR
      ════════════════════════════════ */}
      <section className="bg-paper-0 border-b border-warm">
        <div className="container-xl">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal
                key={s.label}
                delay={i * 60}
                className={`stat-cell ${i === stats.length - 1 ? "!border-r-0" : ""}`}
              >
                <div className="stat-value">
                  <Counter target={s.value} suffix={s.suffix} />
                </div>
                <p className="stat-label">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          VISION 2030
      ════════════════════════════════ */}
      <section className="bg-paper-1 py-24 md:py-36 border-b border-warm">
        <div className="container-xl">
          <div className={`grid md:grid-cols-2 gap-16 md:gap-24 items-center`}>
            {/* Text */}
            <Reveal className={`order-2 md:order-1 ${isAr ? "text-right" : ""}`}>
              <span className={`section-label mb-6 inline-flex ${isAr ? "flex-row-reverse" : ""}`}>
                {t("vision.label")}
              </span>
              <h2 className="section-heading text-ink-100 mb-6">{t("vision.title")}</h2>
              <p className="text-sm md:text-base text-ink-40 leading-relaxed max-w-md mb-8">
                {t("vision.description")}
              </p>
              <Link to="/why-salada" className="btn-gold inline-flex">
                <span>{isAr ? "تعرف على سلادة" : "About Salada"}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </Reveal>

            {/* Badge */}
            <Reveal delay={150} className="order-1 md:order-2">
              <div className="vision-badge glow-gold">
                <span className="vision-year">2030</span>
                <div className="divider-gold w-16 my-4" />
                <p className="vision-sub">{isAr ? "رؤية المملكة العربية السعودية" : "Saudi Vision"}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          SOLUTIONS
      ════════════════════════════════ */}
      <section className="bg-paper-0 border-b border-warm">
        {/* Header */}
        <div className="container-xl pt-24 md:pt-32 pb-12">
          <Reveal>
            <div
              className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 ${isAr ? "md:flex-row-reverse text-right" : ""}`}
            >
              <div>
                <span className={`section-label mb-5 inline-flex ${isAr ? "flex-row-reverse" : ""}`}>
                  {t("solutions.label")}
                </span>
                <h2 className="section-heading text-ink-100">{t("solutions.title")}</h2>
              </div>
              <Link
                to="/solutions"
                className={`inline-flex items-center gap-2 text-[0.6rem] font-mono uppercase tracking-[0.2em] text-ink-40 hover:text-gold transition-colors duration-300 ${isAr ? "flex-row-reverse" : ""}`}
              >
                {isAr ? "جميع الحلول" : "View all solutions"}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* 2×2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-warm">
          {solutions.map((sol, i) => (
            <Reveal key={sol.num} delay={i * 50}>
              <Link to={sol.href} className="block sol-card h-full">
                {/* Image */}
                <div className="sol-card-img-wrap">
                  <img src={sol.image} alt={sol.title} loading="lazy" className="sol-card-img" />
                </div>
                {/* Content */}
                <div className="sol-card-inner">
                  <p className="sol-card-num">{sol.num}</p>
                  <div className="sol-card-bar" />
                  <h3 className="sol-card-title">{sol.title}</h3>
                  <p className="sol-card-desc">{sol.desc}</p>
                  <span className={`sol-card-arrow ${isAr ? "flex-row-reverse" : ""}`}>
                    {t("solutions.learnMore")}
                    <ArrowRight className={`w-3 h-3 ${isAr ? "rotate-180" : ""}`} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════
          INDUSTRIES
      ════════════════════════════════ */}
      <section className="bg-paper-1 py-24 md:py-36 border-b border-warm">
        <div className="container-xl">
          <Reveal className={`mb-14 ${isAr ? "text-right" : ""}`}>
            <span className={`section-label mb-5 inline-flex ${isAr ? "flex-row-reverse" : ""}`}>
              {t("industries.label")}
            </span>
            <h2 className="section-heading text-ink-100">{t("industries.title")}</h2>
          </Reveal>

          <div className="border-t border-warm">
            {industries.map((ind, i) => (
              <Reveal key={ind.name} delay={i * 45}>
                <Link to={ind.href} dir={isAr ? "rtl" : "ltr"} className="industry-row">
                  <div className={`flex items-center gap-5 ${isAr ? "flex-row-reverse" : ""}`}>
                    <span className="industry-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="industry-name">{ind.name}</span>
                  </div>
                  <ArrowRight className={`industry-arrow w-5 h-5 ${isAr ? "rotate-180" : ""}`} />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          WHY SALADA
      ════════════════════════════════ */}
      <section className="bg-paper-0 py-24 md:py-36 border-b border-warm">
        <div className="container-xl">
          <Reveal className={`mb-14 ${isAr ? "text-right" : "text-center"}`}>
            <span className={`section-label section-label-center mb-5 inline-flex ${isAr ? "flex-row-reverse" : ""}`}>
              {t("why.label")}
            </span>
            <h2 className="section-heading text-ink-100">{t("why.title")}</h2>
          </Reveal>

          <div className="why-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {whyItems.map((w, i) => (
              <Reveal key={w.title} delay={i * 60}>
                <div className={`why-cell ${isAr ? "text-right" : ""}`}>
                  <p className="why-num">{w.num}</p>
                  <div className={`why-bar ${isAr ? "mr-0 ml-auto" : ""}`} />
                  <h3 className="why-title">{w.title}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          CTA — editorial dark strip
      ════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Background image with warm overlay */}
        <div className="absolute inset-0">
          <img
            src={heroPort}
            alt="Industrial port operations"
            loading="lazy"
            className="w-full h-full object-cover"
            style={{ filter: "grayscale(40%) brightness(0.4)" }}
          />
          {/* warm tint overlay using gold token */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, hsl(var(--ink-100)/0.92) 0%, hsl(var(--ink-100)/0.75) 100%)",
            }}
          />
        </div>

        <div className="container-xl relative z-10 py-32 md:py-48">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <span
                className="section-label section-label-center mb-7 inline-flex"
                style={{ color: "hsl(var(--gold))" }}
              >
                {isAr ? "تواصل معنا" : "Get In Touch"}
              </span>

              <h2 className="section-heading mb-10" style={{ color: "#ffffff" }}>
                {t("cta.title")}
              </h2>

              <div className={`flex flex-wrap gap-4 justify-center ${isAr ? "flex-row-reverse" : ""}`}>
                <Link to="/contact" className="btn-gold">
                  <span>{t("cta.getQuote")}</span>
                  <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
                </Link>
                {/* outline button on dark bg */}
                <Link
                  to="/solutions"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5
                             border border-white/30 text-white
                             font-mono text-[0.6875rem] font-700 uppercase tracking-[0.2em]
                             transition-all duration-300
                             hover:border-[hsl(var(--gold))] hover:text-[hsl(var(--gold))]"
                  style={{ fontSize: "0.6875rem", letterSpacing: "0.2em" }}
                >
                  {t("cta.browseCatalog")}
                </Link>
              </div>

              {/* newsletter mini */}
              <div className="mt-16 pt-10 border-t border-white/10">
                <p
                  className="text-xs uppercase tracking-[0.25em] font-mono mb-5"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {isAr ? "ابقَ على اطلاع" : "Stay Updated"}
                </p>
                <div className={`flex max-w-md mx-auto ${isAr ? "flex-row-reverse" : ""}`}>
                  <input
                    type="email"
                    placeholder={isAr ? "البريد الإلكتروني" : "your@email.com"}
                    dir={isAr ? "rtl" : "ltr"}
                    className="newsletter-input"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      borderColor: "rgba(255,255,255,0.15)",
                      color: "#fff",
                    }}
                  />
                  <button className="btn-gold shrink-0" style={{ height: "3rem", paddingInline: "1.5rem" }}>
                    {isAr ? "اشتراك" : "Subscribe"}
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </Layout>
  );
}
