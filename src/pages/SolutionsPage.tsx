import { Link } from "react-router-dom";
import { ArrowRight, Container, Warehouse, Truck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { usePageSEO } from "@/hooks/usePageSEO";
import { useLanguageStore } from "@/store/languageStore";
import heroPort from "@/assets/hero-port.webp";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/products/ProductCard";
import { useLocalizedField } from "@/hooks/useLocalizedField";

/* ── Scroll reveal ── */
function Reveal({
  children,
  delay = 0,
  className = "",
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
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
        ...style,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: `opacity .8s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .8s cubic-bezier(.16,1,.3,1) ${delay}ms`,
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
      <span className="label-text text-label-md uppercase tracking-[0.25em]" style={{ color: "hsl(var(--primary))" }}>
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
  const { getField } = useLocalizedField();

  const shippingContainers = products.filter((p) => p.category === "iso-shipping-container" && p.status === "active");
  const storageContainers = products.filter((p) => p.category === "storage-containers" && p.status === "active");
  const landContainers = products.filter((p) => p.category === "land-shipping-container" && p.status === "active");

  const mainSolutions = [
    {
      id: "shipping-containers",
      num: "01",
      icon: Container,
      title: isAr ? "حاويات الشحن" : "Shipping Containers",
      subtitle: isAr ? "حاويات شحن ISO معتمدة" : "ISO Certified Shipping Containers",
      description: isAr
        ? "حاويات شحن ISO معتمدة بأحجام متعددة — 10 أقدام، 20 قدمًا، 40 قدمًا — بارتفاعات قياسية وعالية. مثالية للشحن البري والبحري والتخزين الصناعي."
        : "ISO-certified shipping containers in multiple sizes — 10ft, 20ft, 40ft — in standard and high-cube configurations. Ideal for land freight, sea freight, and industrial storage.",
      products: shippingContainers,
      shopLink: "/shop?category=iso-shipping-container",
    },
    {
      id: "storage-containers",
      num: "02",
      icon: Warehouse,
      title: isAr ? "حاويات التخزين" : "Storage Containers",
      subtitle: isAr ? "وحدات تخزين متينة وجاهزة للنشر" : "Durable, Deployment-Ready Storage Units",
      description: isAr
        ? "وحدات تخزين متينة بأحجام 5 أقدام إلى 20 قدمًا، مصممة لمواقع البناء والمنشآت الصناعية والمراكز اللوجستية. جاهزة للنشر السريع في أي بيئة."
        : "Heavy-duty storage units from 5ft to 20ft, engineered for construction sites, industrial facilities, and logistics hubs. Ready for rapid deployment in any environment.",
      products: storageContainers,
      shopLink: "/shop?category=storage-containers",
    },
    {
      id: "land-shipping-containers",
      num: "03",
      icon: Truck,
      title: isAr ? "حاويات الشحن البري" : "Land Shipping Containers",
      subtitle: isAr
        ? "حاويات مصممة للنقل البري والشحن عبر الطرق"
        : "Containers Engineered for Road Freight & Land Transport",
      description: isAr
        ? "حاويات متينة مصممة خصيصًا للنقل البري والشحن عبر الطرق، مناسبة لنقل البضائع الثقيلة والمعدات الصناعية عبر الشبكات البرية بأمان وكفاءة."
        : "Heavy-duty containers purpose-built for road freight and overland transport. Engineered to safely and efficiently move heavy cargo and industrial equipment across land-based logistics networks.",
      products: landContainers,
      shopLink: "/shop?category=land-shipping-container",
    },
  ];

  return (
    <Layout>
      <SEOHead {...seo} />

      {/* ── HERO ───────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: "260px" }}>
        <div className="absolute inset-0">
          <img
            src={heroPort}
            alt="Industrial port solutions"
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
          dir={isAr ? "rtl" : "ltr"}
          style={{ minHeight: "260px" }}
        >
          <div className="max-w-xl">
            <nav className="page-hero-breadcrumb flex items-center gap-1.5 mb-4">
              <Link
                to="/"
                className="hero-crumb label-text text-label-md uppercase tracking-[0.15em]"
                style={{ color: "rgba(255,255,255,0.32)" }}
              >
                {isAr ? "الرئيسية" : "Home"}
              </Link>
              <span style={{ color: "rgba(255,255,255,0.18)" }}>/</span>
              <span
                className="hero-crumb label-text text-label-md uppercase tracking-[0.15em]"
                style={{ color: "hsl(var(--primary))" }}
              >
                {t("nav.solutions")}
              </span>
            </nav>

            <h1 className="hero-title-primary font-black uppercase leading-[0.93] tracking-[-0.025em] mb-3">
              {t("solutions.pageTitle")}
            </h1>

            <p className="hero-subtitle leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", maxWidth: "36rem" }}>
              {t("solutions.pageDesc")}
            </p>
          </div>
        </div>
      </section>

      {/* ── MAIN SOLUTIONS ─────────────── */}
      {mainSolutions.map((solution, index) => {
        const isEven = index % 2 === 0;
        const imgOrder = isAr ? (isEven ? "order-1 md:order-2" : "order-1") : isEven ? "order-1" : "order-1 md:order-2";
        const txtOrder = isAr ? (isEven ? "order-2 md:order-1" : "order-2") : isEven ? "order-2" : "order-2 md:order-1";

        return (
          <section key={solution.id} id={solution.id} className="border-b border-border" dir={isAr ? "rtl" : "ltr"}>
            {/* Image + Content */}
            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className={`relative overflow-hidden ${imgOrder}`} style={{ minHeight: "320px" }}>
                {solution.products[0]?.images?.[0] ? (
                  <img
                    src={solution.products[0].images[0]}
                    alt={getField(solution.products[0], "title") ?? solution.products[0].title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "hsl(var(--secondary))" }}
                  >
                    <solution.icon className="w-16 h-16" style={{ color: "hsl(var(--primary)/0.3)" }} />
                  </div>
                )}
                
                {/* watermark */}
                <div
                  className="absolute label-text leading-none pointer-events-none select-none"
                  style={{
                    fontSize: "clamp(5rem, 14vw, 10rem)",
                    color: "rgba(255,255,255,0.04)",
                    bottom: "-0.1em",
                    insetInlineEnd: "0.1em",
                  }}
                >
                  {solution.num}
                </div>
                {/* num badge */}
                <span
                  className="absolute top-4 label-text text-[0.65rem] uppercase tracking-[0.15em]"
                  style={{ color: "hsl(var(--primary))", insetInlineStart: "1.25rem" }}
                >
                  {solution.num}
                </span>
              </div>

              {/* Content */}
              <Reveal
                className={`flex flex-col justify-center p-8 md:p-10 ${txtOrder}`}
                style={
                  { background: isEven ? "hsl(var(--background))" : "hsl(var(--secondary)/0.3)" } as React.CSSProperties
                }
                delay={80}
              >
                {/* icon + label row */}
                <div className="flex items-center gap-3 mb-1">
                  <solution.icon className="w-5 h-5 shrink-0" style={{ color: "hsl(var(--primary))" }} />
                  <Label text={solution.title} isAr={isAr} />
                </div>

                <h2
                  className="font-black uppercase leading-tight tracking-[-0.02em] mb-2"
                  style={{ fontSize: "clamp(1.2rem, 2.2vw, 1.75rem)", color: "hsl(var(--foreground))" }}
                >
                  {solution.subtitle}
                </h2>

                <p className="text-sm leading-relaxed mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {solution.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to={solution.shopLink}
                    className="btn-primary w-full sm:w-auto"
                  >
                    <span>{t("solutions.viewSpecifications")}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </Link>
                  <Link
                    to="/contact"
                    className="btn-secondary w-full sm:w-auto"
                  >
                    {t("solutions.inquire")}
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Available Products */}
            {solution.products.length > 0 && (
              <Reveal>
                <div
                  className="border-t border-border py-8 px-6 md:px-10"
                  style={{ background: "hsl(var(--secondary)/0.2)" }}
                >
                  <p
                    className="label-text text-[0.65rem] uppercase tracking-[0.15em] mb-5"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {t("solutions.availableProducts")}
                    <span className="ms-2" style={{ color: "hsl(var(--primary))" }}>
                      ({solution.products.length})
                    </span>
                  </p>
                  {/* Same cards as Shop: default grid on lg, compact list on small screens */}
                  <div className="hidden lg:block">
                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                      {solution.products.map((product) => (
                        <ProductCard key={`${solution.id}-${product.id}`} product={product} variant="default" />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 lg:hidden">
                    {solution.products.map((product) => (
                      <ProductCard key={`${solution.id}-${product.id}`} product={product} variant="compact" />
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </section>
        );
      })}

      {/* ── CTA ────────────────────────── */}
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
          <div className="max-w-xl mx-auto text-center" dir={isAr ? "rtl" : "ltr"}>
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
                  className="label-text text-[0.65rem] uppercase tracking-[0.25em]"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {t("solutions.label")}
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
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  to="/contact"
                  className="btn-primary w-full sm:w-auto"
                >
                  <span>{t("cta.getQuote")}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </Link>
                <Link
                  to="/shop"
                  className="btn-ghost-dark w-full sm:w-auto"
                >
                  {t("solutions.browseShopCatalog")}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </Layout>
  );
}
