import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { usePageSEO } from "@/hooks/usePageSEO";
import { useLanguageStore } from "@/store/languageStore";
import heroImage from "@/assets/hero-logistics.jpg";
import seaImage from "@/assets/solutions-sea.jpg";
import storageImage from "@/assets/solutions-storage.jpg";
import lashingImage from "@/assets/divisions-lashing.jpg";
import heroPort from "@/assets/hero-port.jpg";

/* ══ Intersection observer hook ══ */
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

/* ══ Scroll-reveal wrapper ══ */
function Reveal({
  children,
  delay = 0,
  className = "",
  from = "bottom",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  from?: "bottom" | "left" | "right";
}) {
  const { ref, inView } = useInView();
  const translate = from === "left" ? "translateX(-32px)" : from === "right" ? "translateX(32px)" : "translateY(32px)";
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translate(0)" : translate,
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ══ Animated number counter ══ */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, inView } = useInView(0.5);
  useEffect(() => {
    if (!inView) return;
    const step = Math.max(1, Math.ceil(target / 80));
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      setVal(cur);
      if (cur >= target) clearInterval(t);
    }, 18);
    return () => clearInterval(t);
  }, [inView, target]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
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
      num: "01",
    },
    {
      title: t("solutions.seaFreight"),
      desc: t("solutions.seaFreightDesc"),
      image: seaImage,
      href: "/solutions#sea",
      num: "02",
    },
    {
      title: t("solutions.airFreight"),
      desc: t("solutions.airFreightDesc"),
      image: heroImage,
      href: "/solutions#air",
      num: "03",
    },
    {
      title: t("solutions.storage"),
      desc: t("solutions.storageDesc"),
      image: storageImage,
      href: "/solutions#storage",
      num: "04",
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

      {/* ════════════════════════════════════
          HERO — full-screen cinematic dark
      ════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-end bg-s0 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={heroImage}
            alt="Salada industrial operations"
            className="w-full h-full object-cover animate-hero-zoom"
          />
          {/* layered overlays using CSS tokens */}
          <div className="absolute inset-0 hero-vignette" />
          <div className="absolute inset-0 hero-vignette-side" />
        </div>

        {/* animated gold scan line */}
        <div className="scan-line" style={{ top: "32%" }} />

        {/* corner accent decorations */}
        <div className="corner-accent tl" style={{ top: "7.5rem", left: "1.5rem" }} />
        <div className="corner-accent tr" style={{ top: "7.5rem", right: "1.5rem" }} />

        {/* certified badge — top center */}
        <div className="absolute top-32 inset-x-0 flex justify-center z-10 animate-fade-down delay-200">
          <span className="label-lined label-lined-both text-primary/70">
            {isAr ? "صانع سعودي معتمد" : "Saudi Certified Manufacturer"}
          </span>
        </div>

        {/* ── Main hero content ── */}
        <div className="industrial-container relative z-10 pb-24 md:pb-32">
          <div className={`max-w-5xl ${isAr ? "text-right ml-auto" : ""}`}>
            {/* eyebrow label */}
            <div className="animate-fade-up delay-300">
              <span className={`label-lined mb-6 block ${isAr ? "flex-row-reverse justify-end" : ""}`}>
                {t("hero.label")}
              </span>
            </div>

            {/* H1 — white line */}
            <h1
              className="
              text-[clamp(2.4rem,6vw,5rem)]
              font-black uppercase leading-[1] tracking-[-0.025em]
              text-white mb-2
              animate-fade-up delay-400
            "
            >
              {t("hero.title")}
            </h1>

            {/* H1 — primary gradient line */}
            <h1
              className="
              text-[clamp(2.4rem,6vw,5rem)]
              font-black uppercase leading-[1] tracking-[-0.025em]
              text-primary-gradient mb-10
              animate-fade-up delay-500
            "
            >
              {t("hero.titleHighlight")}
            </h1>

            {/* sub description */}
            <p
              className="
              text-white/45 text-sm md:text-base leading-relaxed
              max-w-xl mb-10
              animate-fade-up delay-600
            "
            >
              {t("hero.description")}
            </p>

            {/* CTA row */}
            <div
              className={`
              flex flex-col sm:flex-row gap-3
              animate-fade-up delay-700
              ${isAr ? "sm:flex-row-reverse" : ""}
            `}
            >
              <Link to="/solutions" className="btn-primary">
                <span>{t("hero.cta")}</span>
                <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
              </Link>
              <Link to="/contact" className="btn-ghost">
                {t("hero.quote")}
              </Link>
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 opacity-35">
          <ChevronDown className="w-5 h-5 text-primary animate-bounce-subtle" />
        </div>

        {/* bottom gold divider */}
        <div className="absolute bottom-0 inset-x-0 divider-gold" />
      </section>

      {/* ════════════════════════════════════
          STATS BAR
      ════════════════════════════════════ */}
      <section className="bg-s1 border-b border-subtle">
        <div className="industrial-container">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal
                key={s.label}
                delay={i * 70}
                className={`
                  py-12 md:py-16 text-center
                  ${i < stats.length - 1 ? (isAr ? "border-l border-subtle" : "border-r border-subtle") : ""}
                `}
              >
                <div className="text-[clamp(2rem,4vw,3rem)] font-black font-mono text-primary-gradient mb-2 leading-none">
                  <Counter target={s.value} suffix={s.suffix} />
                </div>
                <p className="industrial-label opacity-55">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          VISION 2030
      ════════════════════════════════════ */}
      <section className="bg-s0 py-28 md:py-40 border-b border-subtle">
        <div className="industrial-container">
          <div className="grid md:grid-cols-2 gap-16 md:gap-28 items-center">
            <Reveal from={isAr ? "right" : "left"} className={isAr ? "text-right order-2 md:order-1" : ""}>
              <span className={`label-lined mb-7 block ${isAr ? "flex-row-reverse justify-end" : ""}`}>
                {t("vision.label")}
              </span>
              <h2 className="text-[clamp(1.8rem,4vw,3.5rem)] font-black uppercase leading-[1] tracking-tight text-white mb-7">
                {t("vision.title")}
              </h2>
              <p className="text-white/45 text-sm md:text-base leading-relaxed max-w-lg mb-10">
                {t("vision.description")}
              </p>
              <Link to="/why-salada" className="btn-primary inline-flex">
                <span>{isAr ? "تعرف علينا" : "Learn More"}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </Reveal>

            {/* Vision badge box */}
            <Reveal delay={180} className={isAr ? "order-1 md:order-2" : ""}>
              <div className="relative max-w-sm mx-auto">
                {/* outer glow */}
                <div className="absolute inset-0 glow-primary-lg rounded-none pointer-events-none" />
                <div className="glass-card relative p-14 flex flex-col items-center justify-center aspect-square">
                  <div className="corner-accent tl" />
                  <div className="corner-accent tr" />
                  <div className="corner-accent bl" />
                  <div className="corner-accent br" />

                  {/* number */}
                  <span className="text-[clamp(4rem,12vw,7rem)] font-black font-mono leading-none text-primary-gradient block">
                    2030
                  </span>
                  <div className="divider-gold w-16 my-5" />
                  <span className="industrial-label opacity-50 text-center">
                    {isAr ? "رؤية المملكة العربية السعودية" : "Saudi Vision"}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          SOLUTIONS GRID
      ════════════════════════════════════ */}
      <section className="bg-s0 border-b border-subtle">
        {/* section header */}
        <div className="industrial-container pt-24 md:pt-32 pb-14">
          <Reveal className={`flex items-end ${isAr ? "flex-row-reverse text-right" : "justify-between"}`}>
            <div>
              <span className={`label-lined mb-5 block ${isAr ? "flex-row-reverse justify-end" : ""}`}>
                {t("solutions.label")}
              </span>
              <h2 className="text-[clamp(1.8rem,4vw,3.2rem)] font-black uppercase leading-[1] tracking-tight text-white">
                {t("solutions.title")}
              </h2>
            </div>
            <Link
              to="/solutions"
              className="hidden md:inline-flex items-center gap-2 industrial-label text-white/40 hover:text-primary transition-colors"
            >
              {isAr ? "كل الحلول" : "All Solutions"}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>

        {/* 2×2 image grid */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {solutions.map((sol, i) => (
            <Reveal key={sol.title} delay={i * 55}>
              <Link
                to={sol.href}
                className={`
                  group relative flex overflow-hidden
                  aspect-[4/3] md:aspect-[16/11]
                  border-b border-subtle
                  ${i % 2 === 0 ? (isAr ? "md:border-l" : "md:border-r") : ""}
                  border-subtle
                `}
              >
                {/* image */}
                <img
                  src={sol.image}
                  alt={sol.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover img-industrial transition-transform duration-700 group-hover:scale-[1.04]"
                />

                {/* overlay */}
                <div className="absolute inset-0 sol-overlay" />

                {/* primary color flash on hover */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/6 transition-colors duration-500" />

                {/* number tag */}
                <span className="absolute top-5 left-6 industrial-label opacity-45">{sol.num}</span>

                {/* content */}
                <div className={`absolute bottom-0 w-full p-7 md:p-9 ${isAr ? "text-right" : ""}`}>
                  {/* primary accent bar */}
                  <div
                    className={`
                    h-px bg-primary mb-4
                    w-0 group-hover:w-10
                    transition-all duration-500
                    ${isAr ? "ml-auto" : ""}
                  `}
                  />

                  <h3
                    className="
                    text-lg md:text-xl font-black uppercase tracking-tight
                    text-white group-hover:text-primary
                    transition-colors duration-300 mb-2 leading-snug
                  "
                  >
                    {sol.title}
                  </h3>

                  <p
                    className="
                    text-white/40 text-sm leading-relaxed
                    max-w-xs opacity-0 group-hover:opacity-100
                    translate-y-2 group-hover:translate-y-0
                    transition-all duration-400 mb-4
                  "
                  >
                    {sol.desc}
                  </p>

                  <span
                    className={`
                    label-lined text-primary opacity-0 group-hover:opacity-100
                    transition-opacity duration-300
                    ${isAr ? "flex-row-reverse justify-end" : ""}
                  `}
                  >
                    {t("solutions.learnMore")}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════
          INDUSTRIES LIST
      ════════════════════════════════════ */}
      <section className="bg-s1 py-24 md:py-40 border-b border-subtle">
        <div className="industrial-container">
          <Reveal className={`mb-14 ${isAr ? "text-right" : ""}`}>
            <span className={`label-lined mb-5 block ${isAr ? "flex-row-reverse justify-end" : ""}`}>
              {t("industries.label")}
            </span>
            <h2 className="text-[clamp(1.8rem,4vw,3.2rem)] font-black uppercase leading-[1] tracking-tight text-white">
              {t("industries.title")}
            </h2>
          </Reveal>

          <div className="border-t border-subtle">
            {industries.map((ind, i) => (
              <Reveal key={ind.name} delay={i * 50}>
                <Link
                  to={ind.href}
                  dir={isAr ? "rtl" : "ltr"}
                  className={`
                    group industry-row
                    ${isAr ? "flex-row-reverse" : ""}
                  `}
                >
                  <div className={`flex items-center gap-5 ${isAr ? "flex-row-reverse" : ""}`}>
                    <span className="industrial-label w-7 opacity-35 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span
                      className="
                      text-lg md:text-2xl font-black uppercase tracking-tight
                      text-white/75 group-hover:text-primary
                      transition-colors duration-300
                    "
                    >
                      {ind.name}
                    </span>
                  </div>
                  <ArrowRight
                    className={`
                    w-5 h-5 shrink-0 text-primary/25
                    group-hover:text-primary
                    transition-all duration-300
                    ${isAr ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}
                  `}
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          WHY SALADA
      ════════════════════════════════════ */}
      <section className="bg-s0 py-24 md:py-40 border-b border-subtle">
        <div className="industrial-container">
          <Reveal className={`mb-16 ${isAr ? "text-right" : "text-center"}`}>
            <span
              className={`label-lined label-lined-both mb-5 ${isAr ? "flex-row-reverse justify-end" : "justify-center"} flex`}
            >
              {t("why.label")}
            </span>
            <h2 className="text-[clamp(1.8rem,4vw,3.2rem)] font-black uppercase leading-[1] tracking-tight text-white">
              {t("why.title")}
            </h2>
          </Reveal>

          <div className="why-grid">
            {whyItems.map((w, i) => (
              <Reveal key={w.title} delay={i * 70}>
                <div className={`why-cell group ${isAr ? "text-right" : ""}`}>
                  <span className="text-[2.8rem] font-black font-mono leading-none text-primary-gradient block mb-5">
                    {w.num}
                  </span>
                  <div
                    className={`
                    h-px bg-primary/30 mb-6 w-8
                    group-hover:w-14 group-hover:bg-primary
                    transition-all duration-400
                    ${isAr ? "mr-0 ml-auto" : ""}
                  `}
                  />
                  <h3
                    className="
                    text-base md:text-lg font-black uppercase tracking-tight leading-snug
                    text-white/70 group-hover:text-primary
                    transition-colors duration-300
                  "
                  >
                    {w.title}
                  </h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          CTA — full bleed dark port
      ════════════════════════════════════ */}
      <section className="relative py-36 md:py-56 overflow-hidden bg-s0">
        {/* background */}
        <div className="absolute inset-0">
          <img
            src={heroPort}
            alt="Industrial port"
            className="w-full h-full object-cover img-industrial"
            loading="lazy"
          />
          <div className="absolute inset-0 hero-vignette" />
          <div className="absolute inset-0 hero-vignette-side" style={{ opacity: 0.7 }} />
        </div>

        {/* horizontal gold accent */}
        <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 divider-gold opacity-25 pointer-events-none" />

        <div className="industrial-container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <span className="label-lined label-lined-both mb-7 flex justify-center">
                {isAr ? "تواصل معنا" : "Get In Touch"}
              </span>

              <h2
                className="
                text-[clamp(2rem,5vw,4rem)]
                font-black uppercase text-white
                leading-[1] tracking-tight mb-10
              "
              >
                {t("cta.title")}
              </h2>

              <div
                className={`
                flex flex-col sm:flex-row gap-4 justify-center
                ${isAr ? "sm:flex-row-reverse" : ""}
              `}
              >
                <Link to="/contact" className="btn-primary">
                  <span>{t("cta.getQuote")}</span>
                  <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
                </Link>
                <Link to="/solutions" className="btn-ghost">
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
