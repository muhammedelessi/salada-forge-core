import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { usePageSEO } from "@/hooks/usePageSEO";
import { useLanguageStore } from "@/store/languageStore";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/products/ProductCard";
import heroPort from "@/assets/hero-port.webp";
import seaImage from "@/assets/solutions-sea.webp";
import lashingImage from "@/assets/divisions-lashing.webp";
import storageImage from "@/assets/solutions-storage.webp";

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

/* ── Shared eyebrow label ── */
function Label({ text, isAr }: { text: string; isAr: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 mb-3 ${isAr ? "flex-row-reverse justify-end" : ""}`}>
      <span
        style={{
          width: "1.25rem",
          height: "1.5px",
          background: "hsl(var(--primary)/0.65)",
          display: "block",
          flexShrink: 0,
        }}
      />
      <span className="font-mono text-[0.57rem] uppercase tracking-[0.28em]" style={{ color: "hsl(var(--primary))" }}>
        {text}
      </span>
    </div>
  );
}

export default function SolutionsPage() {
  const seo = usePageSEO("/solutions");
  const { t, isRTL } = useLanguageStore();
  const { data: products = [] } = useProducts();
  const isAr = isRTL();

  const solutions = [
    {
      id: "land",
      num: "01",
      title: t("solutions.landFreight"),
      desc: t("solutions.landFreightDesc"),
      challenge: t("solutions.landChallenge"),
      solution: t("solutions.landSolution"),
      impact: t("solutions.landImpact"),
      image: lashingImage,
      shopLink: "/shop?category=land-shipping-container",
    },
    {
      id: "sea",
      num: "02",
      title: t("solutions.seaFreight"),
      desc: t("solutions.seaFreightDesc"),
      challenge: t("solutions.seaChallenge"),
      solution: t("solutions.seaSolution"),
      impact: t("solutions.seaImpact"),
      image: seaImage,
      shopLink: "/shop?category=iso-shipping-container",
    },
    {
      id: "air",
      num: "03",
      title: t("solutions.airFreight"),
      desc: t("solutions.airFreightDesc"),
      challenge: t("solutions.airChallenge"),
      solution: t("solutions.airSolution"),
      impact: t("solutions.airImpact"),
      image: heroPort,
      shopLink: "/shop",
    },
    {
      id: "storage",
      num: "04",
      title: t("solutions.storage"),
      desc: t("solutions.storageDesc"),
      challenge: t("solutions.storageChallenge"),
      solution: t("solutions.storageSolution"),
      impact: t("solutions.storageImpact"),
      image: storageImage,
      shopLink: "/shop?category=storage-containers",
    },
  ];

  const featuredProducts = products.filter((p) => p.status === "active").slice(0, 4);

  return (
    <Layout>
      <SEOHead {...seo} />

      {/* ════════════════════════════════
          HERO — compact
      ════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: "260px" }}>
        <div className="absolute inset-0">
          <img
            src={heroPort}
            alt="Salada industrial solutions"
            className="w-full h-full object-cover object-center"
            style={{ filter: "grayscale(18%) brightness(0.45)" }}
          />
          <div className="absolute inset-0" style={{ background: "rgba(8,6,2,0.58)" }} />
          <div
            className="absolute bottom-0 inset-x-0"
            style={{
              height: "1.5px",
              background:
                "linear-gradient(to right, transparent, hsl(var(--primary)/0.45) 25%, hsl(var(--primary)/0.45) 75%, transparent)",
            }}
          />
        </div>

        <div
          className="industrial-container relative z-10 flex flex-col justify-center py-10 md:py-14"
          style={{ minHeight: "260px" }}
        >
          <div className={`max-w-xl ${isAr ? "text-right ml-auto mr-0" : ""}`}>
            <nav className={`flex items-center gap-1.5 mb-4 ${isAr ? "flex-row-reverse justify-end" : ""}`}>
              <Link
                to="/"
                className="font-mono text-[0.48rem] uppercase tracking-[0.18em]"
                style={{ color: "rgba(255,255,255,0.32)" }}
              >
                {isAr ? "الرئيسية" : "Home"}
              </Link>
              <span style={{ color: "rgba(255,255,255,0.18)" }}>/</span>
              <span
                className="font-mono text-[0.48rem] uppercase tracking-[0.18em]"
                style={{ color: "hsl(var(--primary))" }}
              >
                {isAr ? "الحلول" : "Solutions"}
              </span>
            </nav>

            <Label text={t("solutions.label")} isAr={isAr} />

            <h1
              className="font-black uppercase leading-[0.93] tracking-[-0.025em] mb-3"
              style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)", color: "#fff" }}
            >
              {isAr ? "حلول " : "Our "}
              <span style={{ color: "hsl(var(--primary))" }}>{isAr ? "متكاملة" : "Solutions"}</span>
            </h1>

            <p className="text-[0.8rem] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", maxWidth: "36rem" }}>
              {t("solutions.pageDesc")}
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          SOLUTIONS — detailed sections
      ════════════════════════════════ */}
      {solutions.map((sol, i) => {
        const isEven = i % 2 === 0;
        const imgStart = isAr ? !isEven : isEven;
        return (
          <section key={sol.id} id={sol.id} className="border-b border-border">
            {/* ── Main row: image + content ── */}
            <div className={`grid md:grid-cols-2 ${isAr ? "" : ""}`}>
              {/* Image */}
              <div
                className={`relative overflow-hidden ${imgStart ? "order-1" : "order-1 md:order-2"}`}
                style={{ minHeight: "280px" }}
              >
                <img
                  src={sol.image}
                  alt={sol.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                  style={{ filter: "grayscale(12%) brightness(0.88)" }}
                />
                <div className="absolute inset-0" style={{ background: "rgba(8,6,2,0.35)" }} />
                {/* watermark number */}
                <div
                  className="absolute font-mono font-black leading-none pointer-events-none select-none"
                  style={{
                    fontSize: "clamp(5rem, 14vw, 10rem)",
                    color: "rgba(255,255,255,0.04)",
                    bottom: "-0.1em",
                    right: isAr ? "auto" : "0.1em",
                    left: isAr ? "0.1em" : "auto",
                  }}
                >
                  {sol.num}
                </div>
                {/* num badge */}
                <span
                  className="absolute top-4 font-mono text-[0.55rem] uppercase tracking-[0.22em]"
                  style={{
                    color: "hsl(var(--primary))",
                    left: isAr ? "auto" : "1.25rem",
                    right: isAr ? "1.25rem" : "auto",
                  }}
                >
                  {sol.num}
                </span>
              </div>

              {/* Content */}
              <Reveal
                className={`flex flex-col justify-center p-8 md:p-10 ${imgStart ? "order-2" : "order-2 md:order-1"} ${isAr ? "text-right" : ""}`}
                style={
                  { background: isEven ? "hsl(var(--background))" : "hsl(var(--secondary)/0.3)" } as React.CSSProperties
                }
                delay={80}
              >
                <Label text={sol.title} isAr={isAr} />
                <h2
                  className="font-black uppercase leading-tight tracking-[-0.02em] mb-4"
                  style={{ fontSize: "clamp(1.2rem, 2.2vw, 1.75rem)", color: "hsl(var(--foreground))" }}
                >
                  {isAr ? "حل " : "The "}
                  <span style={{ color: "hsl(var(--primary))" }}>{isAr ? sol.title : sol.title}</span>
                </h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {sol.desc}
                </p>
                <div className={`flex flex-wrap gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
                  <Link
                    to={sol.shopLink}
                    className={`inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] px-5 py-2.5 hover:opacity-90 transition-opacity ${isAr ? "flex-row-reverse" : ""}`}
                  >
                    <span>{isAr ? "عرض المنتجات" : "View Products"}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center px-5 py-2.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] border border-border hover:border-primary transition-colors duration-200"
                    style={{ color: "hsl(var(--foreground)/0.7)" }}
                  >
                    {t("solutions.inquire")}
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* ── Challenge / Solution / Impact ── */}
            <Reveal>
              <div
                className={`grid grid-cols-1 md:grid-cols-3 border-t border-border`}
                style={{ background: "hsl(var(--secondary)/0.15)" }}
              >
                {[
                  { label: t("solutions.challengeLabel"), text: sol.challenge },
                  { label: t("solutions.solutionLabel"), text: sol.solution },
                  { label: t("solutions.impactLabel"), text: sol.impact },
                ].map((item, j) => (
                  <div
                    key={j}
                    className={`py-6 px-7 ${j < 2 ? (isAr ? "border-l border-border" : "border-r border-border") : ""} ${isAr ? "text-right" : ""}`}
                  >
                    <span
                      className="font-mono text-[0.55rem] uppercase tracking-[0.22em] mb-2 block"
                      style={{ color: "hsl(var(--primary))" }}
                    >
                      {item.label}
                    </span>
                    <p className="text-[0.78rem] leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </section>
        );
      })}

      {/* ════════════════════════════════
          FEATURED PRODUCTS
      ════════════════════════════════ */}
      {featuredProducts.length > 0 && (
        <section className="bg-background border-b border-border py-10 md:py-14">
          <div className="industrial-container">
            <Reveal className={`mb-8 flex items-end justify-between ${isAr ? "flex-row-reverse" : ""}`}>
              <div className={isAr ? "text-right" : ""}>
                <Label text={isAr ? "منتجاتنا" : "Featured Products"} isAr={isAr} />
                <h2
                  className="font-black uppercase leading-tight tracking-[-0.02em]"
                  style={{ fontSize: "clamp(1.2rem, 2.2vw, 1.7rem)", color: "hsl(var(--foreground))" }}
                >
                  {isAr ? "منتجات " : "Our "}
                  <span style={{ color: "hsl(var(--primary))" }}>{isAr ? "مختارة" : "Catalog"}</span>
                </h2>
              </div>
              <Link
                to="/shop"
                className={`inline-flex items-center gap-1.5 font-mono text-[0.58rem] uppercase tracking-[0.18em] hover:text-primary transition-colors shrink-0 ${isAr ? "flex-row-reverse" : ""}`}
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {isAr ? "كل المنتجات" : "View All"}
                <ArrowRight className={`w-3 h-3 ${isAr ? "rotate-180" : ""}`} />
              </Link>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product, i) => (
                <Reveal key={product.id} delay={i * 60}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════
          CTA — dark
      ════════════════════════════════ */}
      <section className="relative py-14 md:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroPort}
            alt="Industrial operations"
            loading="lazy"
            className="w-full h-full object-cover"
            style={{ filter: "grayscale(25%) brightness(0.35)" }}
          />
          <div className="absolute inset-0" style={{ background: "rgba(8,6,2,0.82)" }} />
        </div>

        <div className="industrial-container relative z-10">
          <div className="max-w-xl mx-auto text-center">
            <Reveal>
              <div className="flex items-center justify-center gap-3 mb-3">
                <span
                  style={{
                    width: "1.25rem",
                    height: "1.5px",
                    background: "hsl(var(--primary)/0.65)",
                    display: "block",
                  }}
                />
                <span
                  className="font-mono text-[0.57rem] uppercase tracking-[0.28em]"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {isAr ? "تواصل معنا" : "Get Started"}
                </span>
                <span
                  style={{
                    width: "1.25rem",
                    height: "1.5px",
                    background: "hsl(var(--primary)/0.65)",
                    display: "block",
                  }}
                />
              </div>
              <h2
                className="font-black uppercase leading-[0.92] tracking-[-0.025em] mb-4"
                style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", color: "#fff" }}
              >
                {t("cta.title")}
              </h2>
              <p
                className="text-[0.8rem] leading-relaxed mb-7 max-w-md mx-auto"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {t("cta.description")}
              </p>
              <div className={`flex flex-wrap gap-3 justify-center ${isAr ? "flex-row-reverse" : ""}`}>
                <Link
                  to="/contact"
                  className={`inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] px-6 py-3 hover:opacity-90 transition-opacity ${isAr ? "flex-row-reverse" : ""}`}
                >
                  <span>{t("cta.getQuote")}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
                </Link>
                <Link
                  to="/shop"
                  className="inline-flex items-center px-6 py-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] transition-all duration-200"
                  style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--primary)/0.55)";
                    (e.currentTarget as HTMLElement).style.color = "hsl(var(--primary))";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }}
                >
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
