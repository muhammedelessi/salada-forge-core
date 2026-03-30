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
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
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

/* ─── Section Reveal ─── */
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
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
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

      {/* ══════════════════════════════════════
          HERO — Full bleed, cinematic dark
      ══════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Salada industrial port"
            className="w-full h-full object-cover scale-105"
            style={{ animation: "heroZoom 12s ease-out forwards" }}
          />
          {/* Dark vignette layers */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0804] via-[#0a0804]/60 to-[#0a0804]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0804]/70 via-transparent to-transparent" />
          {/* Gold scan line */}
          <div
            className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent"
            style={{ top: "30%", animation: "scanLine 6s ease-in-out infinite" }}
          />
        </div>

        {/* Corner marks — industrial feel */}
        <div className="absolute top-32 left-6 md:left-12 w-8 h-8 border-t-2 border-l-2 border-yellow-500/50" />
        <div className="absolute top-32 right-6 md:right-12 w-8 h-8 border-t-2 border-r-2 border-yellow-500/50" />

        {/* Label top */}
        <div className="absolute top-36 left-1/2 -translate-x-1/2 z-10" style={{ animation: "fadeDown 1s 0.3s both" }}>
          <span className="text-[10px] uppercase tracking-[0.4em] text-yellow-500/70 font-mono">
            {isAr ? "صانع سعودي معتمد" : "Saudi Certified Manufacturer"}
          </span>
        </div>

        {/* Main content */}
        <div className="industrial-container relative z-10 pb-28 md:pb-36">
          <div className={`max-w-5xl ${isAr ? "text-right mr-0 ml-auto" : ""}`}>
            {/* Hero label */}
            <div style={{ animation: "fadeUp 0.9s 0.4s both" }}>
              <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-yellow-400/80 font-mono mb-8">
                <span className="w-8 h-px bg-yellow-500/60" />
                {t("hero.label")}
              </span>
            </div>

            {/* Heading */}
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.92] tracking-[-0.02em] text-white mb-4"
              style={{ animation: "fadeUp 0.9s 0.6s both" }}
            >
              {t("hero.title")}
            </h1>
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.92] tracking-[-0.02em] mb-12"
              style={{
                animation: "fadeUp 0.9s 0.8s both",
                background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #d97706 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("hero.titleHighlight")}
            </h1>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 ${isAr ? "sm:flex-row-reverse" : ""}`}
              style={{ animation: "fadeUp 0.9s 1s both" }}
            >
              <Link
                to="/solutions"
                className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-yellow-500 text-[#0a0804] font-black uppercase tracking-[0.2em] text-sm overflow-hidden transition-all duration-300 hover:bg-yellow-400"
              >
                <span className="relative z-10">{t("hero.cta")}</span>
                <ArrowRight
                  className={`w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1 ${isAr ? "rotate-180" : ""}`}
                />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 border border-white/30 text-white font-semibold uppercase tracking-[0.2em] text-sm transition-all duration-300 hover:border-yellow-500 hover:text-yellow-400 backdrop-blur-sm"
              >
                {t("hero.quote")}
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-50">
          <ChevronDown className="w-4 h-4 text-yellow-500 animate-bounce" />
        </div>

        {/* Bottom gold border */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />
      </section>

      {/* ══════════════════════════════════════
          STATS — Dark slab with gold numbers
      ══════════════════════════════════════ */}
      <section className="bg-[#0d0b07] border-b border-yellow-900/30">
        <div className="industrial-container">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, i) => (
              <Reveal
                key={stat.label}
                delay={i * 80}
                className={`py-14 md:py-20 text-center ${i < stats.length - 1 ? (isAr ? "border-l border-yellow-900/30" : "border-r border-yellow-900/30") : ""}`}
              >
                <div
                  className="text-3xl md:text-5xl font-black font-mono mb-3"
                  style={{
                    background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-yellow-900/80 font-mono">{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          VISION 2030 — Heavy editorial block
      ══════════════════════════════════════ */}
      <section className="bg-[#0d0b07] py-28 md:py-40 border-b border-yellow-900/20">
        <div className="industrial-container">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            <Reveal className={isAr ? "text-right order-2 md:order-1" : ""}>
              <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-yellow-500/70 font-mono mb-8">
                <span className="w-8 h-px bg-yellow-500/50" />
                {t("vision.label")}
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase leading-[0.95] tracking-tight text-white mb-8">
                {t("vision.title")}
              </h2>
              <p className="text-white/50 leading-relaxed text-sm md:text-base max-w-lg">{t("vision.description")}</p>
            </Reveal>

            {/* Vision 2030 badge block */}
            <Reveal delay={200} className={isAr ? "order-1 md:order-2" : ""}>
              <div className="relative">
                <div
                  className="aspect-square max-w-xs mx-auto flex flex-col items-center justify-center border border-yellow-500/20 p-12"
                  style={{ background: "linear-gradient(135deg, #1a1508 0%, #0d0b07 100%)" }}
                >
                  {/* Corner marks */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-yellow-500/60" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-yellow-500/60" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-yellow-500/60" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-yellow-500/60" />

                  <div
                    className="text-6xl md:text-8xl font-black font-mono leading-none"
                    style={{
                      background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 60%, #92400e 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    2030
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.4em] text-yellow-500/50 font-mono mt-4 text-center">
                    {isAr ? "رؤية المملكة" : "Saudi Vision"}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SOLUTIONS — Full-bleed image grid
      ══════════════════════════════════════ */}
      <section className="bg-[#080603] border-b border-yellow-900/20">
        <div className="industrial-container py-24 md:py-32">
          <Reveal className={isAr ? "text-right" : ""}>
            <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-yellow-500/70 font-mono mb-6">
              <span className="w-8 h-px bg-yellow-500/50" />
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
                className="group relative aspect-[4/3] flex overflow-hidden border-b border-yellow-900/20"
                style={{ borderRight: i % 2 === 0 ? "1px solid rgba(120,80,0,0.2)" : undefined }}
              >
                <img
                  src={sol.image}
                  alt={sol.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[30%] group-hover:grayscale-0"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0804]/95 via-[#0a0804]/40 to-transparent transition-all duration-500" />
                <div className="absolute inset-0 bg-yellow-500/0 group-hover:bg-yellow-500/5 transition-all duration-500" />

                {/* Tag number */}
                <span className="absolute top-6 left-6 text-[10px] font-mono tracking-[0.3em] text-yellow-500/60">
                  {sol.tag}
                </span>

                {/* Content */}
                <div className={`absolute bottom-0 ${isAr ? "right-0 text-right" : "left-0"} p-8 md:p-10 w-full`}>
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight leading-tight mb-3 group-hover:text-yellow-400 transition-colors duration-300">
                    {sol.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-400 mb-4">
                    {sol.desc}
                  </p>
                  <span
                    className={`inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-yellow-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-400 ${isAr ? "flex-row-reverse" : ""}`}
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

      {/* ══════════════════════════════════════
          INDUSTRIES — Stacked list rows
      ══════════════════════════════════════ */}
      <section className="bg-[#0d0b07] py-28 md:py-40 border-b border-yellow-900/20">
        <div className="industrial-container">
          <Reveal className={`mb-16 ${isAr ? "text-right" : ""}`}>
            <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-yellow-500/70 font-mono mb-6">
              <span className="w-8 h-px bg-yellow-500/50" />
              {t("industries.label")}
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase leading-[0.95] tracking-tight text-white">
              {t("industries.title")}
            </h2>
          </Reveal>

          <div className="border-t border-yellow-900/30 mt-2">
            {industries.map((name, i) => (
              <Reveal key={name} delay={i * 60}>
                <Link
                  to="/industries"
                  className={`group flex items-center justify-between py-6 md:py-8 border-b border-yellow-900/20 transition-all duration-300 ${isAr ? "flex-row-reverse text-right hover:pr-4" : "hover:pl-4"}`}
                >
                  <div className={`flex items-center gap-6 ${isAr ? "flex-row-reverse" : ""}`}>
                    <span className="text-[10px] font-mono text-yellow-500/40 w-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lg md:text-2xl font-black uppercase tracking-tight text-white/80 group-hover:text-yellow-400 transition-colors duration-300">
                      {name}
                    </span>
                  </div>
                  <ArrowRight
                    className={`w-5 h-5 text-yellow-500/30 group-hover:text-yellow-400 transition-all duration-300 group-hover:translate-x-1 ${isAr ? "rotate-180 group-hover:-translate-x-1" : ""}`}
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY SALADA — Heavy grid cards
      ══════════════════════════════════════ */}
      <section className="bg-[#080603] py-28 md:py-40 border-b border-yellow-900/20">
        <div className="industrial-container">
          <Reveal className={`mb-20 ${isAr ? "text-right" : "text-center"}`}>
            <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-yellow-500/70 font-mono mb-6 justify-center">
              <span className="w-8 h-px bg-yellow-500/50" />
              {t("why.label")}
              <span className="w-8 h-px bg-yellow-500/50" />
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase leading-[0.95] tracking-tight text-white">
              {t("why.title")}
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-yellow-900/20">
            {whyItems.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div
                  className={`bg-[#080603] p-10 md:p-12 group hover:bg-[#130f05] transition-colors duration-300 h-full ${isAr ? "text-right" : ""}`}
                >
                  <div
                    className="text-4xl font-black font-mono mb-6 leading-none"
                    style={{
                      background: "linear-gradient(135deg, #f59e0b, #92400e)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {item.num}
                  </div>
                  <div className="w-8 h-px bg-yellow-500/30 mb-6 group-hover:w-12 transition-all duration-300" />
                  <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-white/80 group-hover:text-yellow-400 transition-colors duration-300 leading-tight">
                    {item.title}
                  </h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA — Full bleed dark port image
      ══════════════════════════════════════ */}
      <section className="relative py-36 md:py-56 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroPort}
            alt="Industrial port"
            className="w-full h-full object-cover grayscale-[20%]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[#0a0804]/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0804]/90 via-[#0a0804]/60 to-[#0a0804]/90" />
          {/* Gold accent lines */}
          <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />
        </div>

        <div className="industrial-container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-yellow-500/70 font-mono mb-8 justify-center">
                <span className="w-8 h-px bg-yellow-500/50" />
                {isAr ? "تواصل معنا" : "Get In Touch"}
                <span className="w-8 h-px bg-yellow-500/50" />
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase leading-[0.95] tracking-tight mb-12">
                {t("cta.title")}
              </h2>

              <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isAr ? "sm:flex-row-reverse" : ""}`}>
                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-center gap-3 px-12 py-5 bg-yellow-500 text-[#0a0804] font-black uppercase tracking-[0.2em] text-sm transition-all duration-300 hover:bg-yellow-400"
                >
                  {t("cta.getQuote")}
                  <ArrowRight
                    className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 ${isAr ? "rotate-180" : ""}`}
                  />
                </Link>
                <Link
                  to="/solutions"
                  className="inline-flex items-center justify-center gap-3 px-12 py-5 border border-white/20 text-white font-semibold uppercase tracking-[0.2em] text-sm transition-all duration-300 hover:border-yellow-500/60 hover:text-yellow-400 backdrop-blur-sm"
                >
                  {t("cta.browseCatalog")}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Keyframe styles ── */}
      <style>{`
        @keyframes heroZoom {
          from { transform: scale(1.05); }
          to   { transform: scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translate(-50%, -10px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes scanLine {
          0%, 100% { opacity: 0; transform: scaleX(0.3); }
          50%       { opacity: 1; transform: scaleX(1); }
        }
      `}</style>
    </Layout>
  );
}
