import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { usePageSEO } from "@/hooks/usePageSEO";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { translations } from "@/i18n/translations";
import heroPort from "@/assets/hero-port.webp";
import lashingImage from "@/assets/divisions-lashing.webp";

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(20px)",
      transition: `opacity .8s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .8s cubic-bezier(.16,1,.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

function Label({ text, isAr, center }: { text: string; isAr: boolean; center?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 mb-3 ${center ? "justify-center" : ""} ${isAr && !center ? "flex-row-reverse justify-end" : isAr ? "flex-row-reverse" : ""}`}>
      <span style={{ width: "1.25rem", height: "1.5px", background: "hsl(var(--primary)/0.65)", display: "block", flexShrink: 0 }} />
      <span className="label-text text-[0.65rem] uppercase tracking-[0.25em]" style={{ color: "hsl(var(--primary))" }}>
        {text}
      </span>
    </div>
  );
}

export default function AboutPage() {
  const seo = usePageSEO("/about");
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];
  const isAr = isRTL();

  const pillars = [
    { num: "01", label: t.about.visionLabel,     desc: t.about.visionDescription     },
    { num: "02", label: t.about.missionLabel,    desc: t.about.missionDescription    },
    { num: "03", label: t.about.commitmentLabel, desc: t.about.commitmentDescription },
  ];

  const factoryStats = [
    { value: "10+",  label: isAr ? "سنوات خبرة تصنيعية" : "Years of Manufacturing" },
    { value: "200+", label: isAr ? "مشروع منجز"          : "Projects Delivered"     },
    { value: "100%", label: isAr ? "صناعة سعودية"        : "Saudi Manufactured"     },
    { value: "ISO",  label: isAr ? "اعتماد دولي"         : "Internationally Certified" },
  ];

  return (
    <Layout>
      <SEOHead {...seo} />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ minHeight: "260px" }}>
        <div className="absolute inset-0">
          <img src={heroPort} alt="Salada operations" width={1920} height={1080}
            fetchPriority="high" decoding="sync"
            className="w-full h-full object-cover object-center max-w-full"
            style={{ filter: "grayscale(18%) brightness(0.48)" }} />
          <div className="absolute inset-0" style={{ background: "rgba(8,6,2,0.58)" }} />
          <div className="absolute bottom-0 inset-x-0" style={{
            height: "1.5px",
            background: "linear-gradient(to right, transparent, hsl(var(--primary)/0.45) 25%, hsl(var(--primary)/0.45) 75%, transparent)",
          }} />
        </div>

        <div className="industrial-container relative z-10 flex flex-col justify-center py-10 md:py-14" style={{ minHeight: "260px" }}>
          <div className={`max-w-xl ${isAr ? "text-right ml-auto mr-0" : ""}`}>
            <nav className={`flex items-center gap-1.5 mb-4 ${isAr ? "flex-row-reverse justify-end" : ""}`}>
              <Link to="/" className="label-text text-[0.6rem] uppercase tracking-[0.15em]"
                style={{ color: "rgba(255,255,255,0.32)" }}>
                {isAr ? "الرئيسية" : "Home"}
              </Link>
              <span style={{ color: "rgba(255,255,255,0.18)" }}>/</span>
              <span className="label-text text-[0.6rem] uppercase tracking-[0.15em]"
                style={{ color: "hsl(var(--primary))" }}>
                {isAr ? "من نحن" : "About"}
              </span>
            </nav>

            <Label text={t.about.label} isAr={isAr} />

            {/* FIX: unified heading — no split span */}
            <h1 className="font-black uppercase leading-[0.93] tracking-[-0.025em] mb-3 animate-fade-up delay-200"
              style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)", color: "#fff" }}>
              {isAr ? "عن صلادة" : "About SALADA"}
            </h1>

            <p className="text-[0.8rem] leading-relaxed animate-fade-up delay-300"
              style={{ color: "rgba(255,255,255,0.45)", maxWidth: "36rem" }}>
              {t.about.descP1}
            </p>
          </div>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="bg-background border-b border-border py-10 md:py-14">
        <div className="industrial-container">
          <div className={`grid md:grid-cols-2 gap-8 md:gap-14 items-start ${isAr ? "text-right" : ""}`}>
            <Reveal>
              <Label text={isAr ? "قصتنا" : "Our Story"} isAr={isAr} />
              {/* FIX: unified heading */}
              <h2 className="font-black uppercase leading-[0.95] tracking-[-0.02em] mb-4"
                style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)", color: "hsl(var(--foreground))" }}>
                {isAr ? "صانع سعودي معتمد" : "A Saudi Manufacturer"}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                {t.about.descP2}
              </p>
            </Reveal>

            <Reveal delay={120}>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {factoryStats.map((s, i) => (
                  <div key={i} className="p-5 md:p-6 border border-border bg-background transition-all duration-300 hover:border-primary/40 hover:bg-primary/[0.04] shadow-[0_1px_0_hsl(var(--border))] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]">
                    <div className="font-black mb-1 leading-none"
                      style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", color: "hsl(var(--primary))" }}>
                      {s.value}
                    </div>
                    <div className="text-[0.78rem] font-semibold"
                      style={{ color: "hsl(var(--muted-foreground))", lineHeight: 1.6 }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── PILLARS ── */}
      <section className="border-b border-border py-10 md:py-14" style={{ background: "hsl(var(--secondary)/0.25)" }}>
        <div className="industrial-container">
          <Reveal className={`mb-8 ${isAr ? "text-right" : ""}`}>
            <Label text={isAr ? "مبادئنا" : "Our Principles"} isAr={isAr} />
            {/* FIX: unified heading */}
            <h2 className="font-black uppercase leading-[0.95] tracking-[-0.02em]"
              style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)", color: "hsl(var(--foreground))" }}>
              {isAr ? "رؤية · رسالة · التزام" : "Vision · Mission · Commitment"}
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {pillars.map((p, i) => (
              <Reveal key={p.num} delay={i * 70}>
                <div className={`bg-background border border-border p-5 md:p-6 h-full group hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 shadow-[0_1px_0_hsl(var(--border))] hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)] ${isAr ? "text-right" : ""}`}>
                  <div className="h-[2px] w-0 group-hover:w-10 transition-all duration-300 mb-3" style={{ background: "hsl(var(--primary)/0.65)" }} />
                  <div className="label-text font-black mb-2 leading-none"
                    style={{ fontSize: "1.5rem", color: "hsl(var(--primary))" }}>
                    {p.num}
                  </div>
                  <div className={`h-px mb-3 transition-all duration-400 group-hover:w-8 ${isAr ? "ml-auto mr-0" : ""}`}
                    style={{ width: "1.25rem", background: "hsl(var(--primary))" }} />
                  <p className="text-[0.82rem] mb-2 font-semibold"
                    style={{ color: "hsl(var(--primary))", letterSpacing: "0.12em" }}>
                    {p.label}
                  </p>
                  <p className="text-[0.9rem] leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {p.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FACTORY ── */}
      <section className="bg-background border-b border-border py-10 md:py-14">
        <div className="industrial-container">
          <div className={`grid md:grid-cols-2 gap-8 md:gap-14 items-center ${isAr ? "text-right" : ""}`}>
            <Reveal className={isAr ? "order-2 md:order-1" : ""}>
              <Label text={t.about.factoryLabel} isAr={isAr} />
              {/* FIX: unified heading */}
              <h2 className="font-black uppercase leading-[0.95] tracking-[-0.02em] mb-4"
                style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)", color: "hsl(var(--foreground))" }}>
                {isAr ? "منشأة التصنيع" : "Our Factory"}
              </h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>
                {t.about.factoryP1}
              </p>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "hsl(var(--muted-foreground))" }}>
                {t.about.factoryP2}
              </p>
              <div className={`flex flex-wrap gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
                {(isAr
                  ? ["معتمد ISO", "معتمد DNV", "صناعة سعودية"]
                  : ["ISO Certified", "DNV Approved", "Saudi Made"]
                ).map((b) => (
                  <span key={b} className="text-[0.78rem] font-semibold px-2.5 py-1.5"
                    style={{ background: "hsl(var(--primary)/0.07)", border: "1px solid hsl(var(--primary)/0.22)", color: "hsl(var(--primary))", letterSpacing: "0.08em" }}>
                    {b}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120} className={isAr ? "order-1 md:order-2" : ""}>
              <div className="relative aspect-[4/3] overflow-hidden border border-border shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                <img src={lashingImage} alt="Salada factory" loading="lazy" decoding="async" width={800} height={600}
                  className="w-full h-full object-cover max-w-full" style={{ filter: "grayscale(10%)" }} />
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "hsl(var(--primary)/0.05)" }} />
                <div className={`absolute bottom-0 ${isAr ? "right-0" : "left-0"} p-4`}
                  style={{ background: "linear-gradient(to top, rgba(8,6,2,0.82), transparent)" }}>
                  <p className="label-text text-[0.75rem] uppercase tracking-[0.14em]"
                    style={{ color: "hsl(var(--primary))" }}>
                    {isAr ? "منشأة صلادة — الرياض" : "Salada Facility — Riyadh, KSA"}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-14 md:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroPort} alt="Industrial operations" loading="lazy" decoding="async" width={1920} height={1080}
            className="w-full h-full object-cover max-w-full"
            style={{ filter: "grayscale(25%) brightness(0.35)" }} />
          <div className="absolute inset-0" style={{ background: "rgba(8,6,2,0.82)" }} />
        </div>
        <div className="industrial-container relative z-10">
          <div className="max-w-xl mx-auto text-center">
            <Reveal>
              <Label text={isAr ? "تواصل معنا" : "Work With Us"} isAr={isAr} center />
              <h2 className="font-black uppercase leading-[0.92] tracking-[-0.025em] mb-4"
                style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", color: "#fff" }}>
                {t.about.partnerCTA}
              </h2>
              <p className="text-[0.8rem] leading-relaxed mb-7 max-w-md mx-auto"
                style={{ color: "rgba(255,255,255,0.42)" }}>
                {t.about.partnerDesc}
              </p>
              <div className={`flex flex-wrap gap-3 justify-center ${isAr ? "flex-row-reverse" : ""}`}>
                <Link to="/contact" className="btn-primary w-full sm:w-auto">
                  <span>{t.about.contactUs}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link to="/shop" className="btn-ghost-dark w-full sm:w-auto">
                  {t.about.viewProducts}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </Layout>
  );
}