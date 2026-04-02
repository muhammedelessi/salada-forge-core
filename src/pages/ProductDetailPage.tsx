import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/products/ProductCard";
import { StickyAddToCart } from "@/components/products/StickyAddToCart";
import {
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Check,
  MessageSquare,
  Loader2,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { ProductVariant } from "@/types";
import { useLanguageStore } from "@/store/languageStore";
import { translations } from "@/i18n/translations";

// ─── Design tokens (avoid repeating hsl strings) ──────────────────
const C = {
  gold: "hsl(var(--primary))",
  goldFaint: "hsl(var(--primary)/0.08)",
  goldLine: "hsl(var(--primary)/0.55)",
  muted: "hsl(var(--muted-foreground))",
  fg: "hsl(var(--foreground))",
  bg: "hsl(var(--background))",
  sec: "hsl(var(--secondary)/0.4)",
  border: "hsl(var(--border))",
} as const;

// ─── Primitives ───────────────────────────────────────────────────

/** Small gold eyebrow with dash */
function EyebrowLabel({ text, isAr }: { text: string; isAr: boolean }) {
  return (
    <div className="flex items-center gap-2 mb-3" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
      <span style={{ width: "1.2rem", height: "1.5px", background: C.goldLine, flexShrink: 0, display: "block" }} />
      <span className="font-mono text-[0.56rem] uppercase tracking-[0.28em]" style={{ color: C.gold }}>
        {text}
      </span>
    </div>
  );
}

/** Mono pill badge */
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-mono text-[0.52rem] uppercase tracking-[0.18em] px-2 py-1 border"
      style={{ color: C.muted, borderColor: C.border }}
    >
      {children}
    </span>
  );
}

/** Spec card — used in the Specifications tab */
function SpecCard({ label, value, isAr }: { label: string; value: string; isAr: boolean }) {
  return (
    <div
      className="border border-border p-4 hover:border-primary transition-colors duration-200"
      style={{ background: C.bg }}
    >
      <p className="font-mono text-[0.5rem] uppercase tracking-[0.2em] mb-1.5" style={{ color: C.gold, opacity: 0.7 }}>
        {label}
      </p>
      <p
        className="font-mono text-sm font-bold leading-snug"
        style={{ color: C.fg, textAlign: isAr ? "right" : "left" }}
      >
        {value}
      </p>
    </div>
  );
}

/** Feature list item with gold bullet */
function FeatureItem({ text, isAr }: { text: string; isAr: boolean }) {
  return (
    <li
      className="flex items-start gap-2.5 text-sm"
      style={{ color: C.muted, flexDirection: isAr ? "row-reverse" : "row" }}
    >
      <span
        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: C.goldFaint }}
      >
        <Check className="w-2.5 h-2.5" style={{ color: C.gold }} />
      </span>
      <span style={{ textAlign: isAr ? "right" : "left" }}>{text}</span>
    </li>
  );
}

/** Tab navigation bar */
function TabBar({
  tabs,
  active,
  onChange,
  isAr,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  isAr: boolean;
}) {
  return (
    <div
      className="flex overflow-x-auto border-b border-border"
      style={{ scrollbarWidth: "none", flexDirection: isAr ? "row-reverse" : "row" }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="relative shrink-0 px-5 py-4 font-mono text-[0.6rem] uppercase tracking-[0.18em] whitespace-nowrap transition-colors duration-200"
          style={{ color: active === tab.id ? C.gold : C.muted }}
        >
          {tab.label}
          {active === tab.id && (
            <span className="absolute bottom-0 inset-x-0" style={{ height: "2px", background: C.gold }} />
          )}
        </button>
      ))}
    </div>
  );
}

/** Quantity stepper */
function QuantityStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center border border-border" style={{ width: "fit-content" }}>
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        className="w-11 h-11 flex items-center justify-center hover:bg-secondary transition-colors"
        aria-label="decrease"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <input
        type="number"
        value={value}
        dir="ltr"
        onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))}
        className="w-12 h-11 text-center bg-transparent border-x border-border font-mono text-sm focus:outline-none"
      />
      <button
        onClick={() => onChange(value + 1)}
        className="w-11 h-11 flex items-center justify-center hover:bg-secondary transition-colors"
        aria-label="increase"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════
export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || "");
  const { data: allProducts = [] } = useProducts();
  const { language } = useLanguageStore();
  const t = translations[language];
  const isAr = language === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"specs" | "shipping" | "bulk">("specs");

  useEffect(() => {
    if (product?.variants?.length) setSelectedVariant(product.variants[0]);
  }, [product]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImage(0);
  }, [slug]);

  const catLabel: Record<string, string> = {
    "shipping-containers": t.categories.shippingContainers,
    "storage-tanks": t.categories.storageTanks,
    "ibc-containers": t.categories.ibcContainers,
    "specialty-containers": t.categories.specialtyContainers,
    "drums-barrels": t.categories.drumsBarrels,
    "modular-buildings": t.categories.modularBuildings,
    "spare-parts": isAr ? "قطع الغيار" : "Spare Parts",
    "lashing-equipment": isAr ? "معدات الربط" : "Lashing Equipment",
    "iso-shipping-containers": isAr ? "حاويات شحن ISO" : "ISO Shipping Containers",
    "storage-containers": isAr ? "حاويات التخزين" : "Storage Containers",
  };
  const getCat = (id: string) => catLabel[id] || id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const fmt = (n: number) =>
    new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR", minimumFractionDigits: 0 }).format(n);

  // ── Guards ──
  if (isLoading)
    return (
      <Layout>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.gold }} />
        </div>
      </Layout>
    );

  if (!product)
    return (
      <Layout>
        <div className="industrial-container py-24 text-center">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] mb-4" style={{ color: C.muted }}>
            404
          </p>
          <h1 className="font-black uppercase text-2xl mb-6" style={{ color: C.fg }}>
            {t.product.notFound}
          </h1>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] px-6 py-3"
          >
            {isAr ? "العودة للمتجر" : "Back to Shop"}
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        </div>
      </Layout>
    );

  const related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const tabs = [
    { id: "specs" as const, label: t.productDetail.specifications },
    { id: "shipping" as const, label: t.productDetail.shipping },
    { id: "bulk" as const, label: t.productDetail.bulkPricing },
  ];

  const trustBadges = [
    { Icon: Truck, title: t.productDetail.freeShipping, sub: t.productDetail.ordersOver },
    { Icon: Shield, title: t.productDetail.warranty, sub: t.productDetail.yearStandard },
    { Icon: RotateCcw, title: t.productDetail.returnsTitle, sub: t.productDetail.dayPolicy },
  ];

  const infoBlocks = [
    {
      title: t.productDetail.idealFor,
      items: product.idealFor?.length ? product.idealFor : t.productDetail.defaultIdealFor,
    },
    {
      title: t.productDetail.keyFeatures,
      items: product.keyFeatures?.length ? product.keyFeatures : t.productDetail.defaultKeyFeatures,
    },
    {
      title: t.productDetail.customization,
      items: product.customizationOptions?.length ? product.customizationOptions : t.productDetail.defaultCustomization,
    },
  ];

  return (
    <Layout>
      {/* ── BREADCRUMB ── */}
      <nav className="border-b border-border" dir={dir}>
        <div className="industrial-container py-3">
          <ol className="flex items-center gap-1 flex-wrap" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
            {[
              { label: isAr ? "الرئيسية" : "Home", href: "/" },
              { label: t.nav.shop, href: "/shop" },
              { label: getCat(product.category), href: `/shop?category=${product.category}` },
              { label: product.title },
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-1" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
                {i > 0 && <ChevronRight className="w-3 h-3 shrink-0 rtl:rotate-180" style={{ color: C.border }} />}
                {item.href ? (
                  <Link
                    to={item.href}
                    className="font-mono text-[0.5rem] uppercase tracking-[0.14em] hover:text-primary transition-colors"
                    style={{ color: C.muted }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="font-mono text-[0.5rem] uppercase tracking-[0.14em] line-clamp-1"
                    style={{ color: C.gold, maxWidth: "180px" }}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>

      {/* ── PRODUCT MAIN ── */}
      <section className="border-b border-border py-8 md:py-12" style={{ background: C.bg }}>
        <div className="industrial-container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14" dir={dir}>
            {/* Gallery */}
            <div className="space-y-3">
              <div
                className="relative overflow-hidden border border-border"
                style={{ aspectRatio: "4/3", background: C.sec }}
              >
                <img
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                  style={{ filter: "grayscale(8%)" }}
                />
                {product.status === "out_of_stock" && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "rgba(8,6,2,0.52)" }}
                  >
                    <span
                      className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white px-4 py-2 border"
                      style={{ borderColor: "rgba(255,255,255,0.3)" }}
                    >
                      {t.product.outOfStock}
                    </span>
                  </div>
                )}
                <div
                  className="absolute bottom-0 inset-x-0"
                  style={{
                    height: "1.5px",
                    background:
                      "linear-gradient(to right, transparent, hsl(var(--primary)/0.45) 30%, hsl(var(--primary)/0.45) 70%, transparent)",
                  }}
                />
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className="overflow-hidden border-2 transition-all duration-200"
                      style={{
                        aspectRatio: "1/1",
                        borderColor: selectedImage === i ? C.gold : C.border,
                        background: C.sec,
                      }}
                    >
                      <img src={img} alt={`view-${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div style={{ textAlign: isAr ? "right" : "left" }}>
              {/* Pills */}
              <div
                className="flex items-center gap-2 mb-3 flex-wrap"
                style={{ flexDirection: isAr ? "row-reverse" : "row" }}
              >
                <Pill>{product.sku}</Pill>
                <Pill>{getCat(product.category)}</Pill>
              </div>

              {/* Title */}
              <h1
                className="font-black uppercase leading-tight tracking-[-0.025em] mb-4"
                style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.6rem)", color: C.fg }}
              >
                {product.title}
              </h1>

              {/* Pricing callout */}
              <div
                className="flex items-center gap-3 mb-5 px-4 py-3 border"
                style={{
                  background: C.goldFaint,
                  borderColor: "hsl(var(--primary)/0.2)",
                  flexDirection: isAr ? "row-reverse" : "row",
                }}
              >
                <span className="block w-1.5 h-1.5 rounded-full shrink-0" style={{ background: C.gold }} />
                <p className="text-sm" style={{ color: C.muted }}>
                  {isAr ? "للحصول على السعر، تواصل معنا" : "Contact us for pricing"}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed mb-6" style={{ color: C.muted }}>
                {product.description}
              </p>

              {/* Variants */}
              {product.variants && product.variants.length > 1 && (
                <div className="mb-5">
                  <p className="font-mono text-[0.54rem] uppercase tracking-[0.2em] mb-2" style={{ color: C.muted }}>
                    {t.productDetail.variant}
                  </p>
                  <div className="flex flex-wrap gap-2" style={{ justifyContent: isAr ? "flex-end" : "flex-start" }}>
                    {product.variants.map((v) => {
                      const active = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className="px-4 py-2 border font-mono text-[0.6rem] uppercase tracking-[0.15em] transition-all duration-200"
                          style={{
                            borderColor: active ? C.gold : C.border,
                            background: active ? C.gold : "transparent",
                            color: active ? "hsl(var(--primary-foreground))" : C.fg,
                          }}
                        >
                          {v.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <p className="font-mono text-[0.54rem] uppercase tracking-[0.2em] mb-2" style={{ color: C.muted }}>
                  {t.productDetail.quantity}
                </p>
                <div className="flex items-center gap-4" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
                  <QuantityStepper value={quantity} onChange={setQuantity} />
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.15em]" style={{ color: C.muted }}>
                    {product.stock} {t.productDetail.inStock}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <Link
                to={`/inquiry/${product.slug}?quantity=${quantity}`}
                className="flex items-center justify-center gap-2.5 w-full bg-primary text-primary-foreground font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] py-4 mb-6 hover:opacity-90 transition-opacity"
                style={{ flexDirection: isAr ? "row-reverse" : "row" }}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                {isAr ? "تواصل معنا للحصول على عرض سعر" : "Contact Us for a Quote"}
              </Link>

              {/* Trust badges */}
              <div
                className="grid grid-cols-3 border-t border-b border-border py-4"
                style={{ gap: "1px", background: C.border }}
              >
                {trustBadges.map(({ Icon, title, sub }, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center gap-1 px-2 py-1"
                    style={{ background: C.bg }}
                  >
                    <Icon className="w-4 h-4 mb-0.5" style={{ color: C.gold }} />
                    <span
                      className="font-mono text-[0.5rem] uppercase tracking-[0.12em] leading-tight"
                      style={{ color: C.fg }}
                    >
                      {title}
                    </span>
                    <span className="font-mono text-[0.44rem] uppercase tracking-[0.1em]" style={{ color: C.muted }}>
                      {sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TABS ── */}
      <section className="border-b border-border" style={{ background: C.bg }}>
        <div className="industrial-container">
          <TabBar tabs={tabs} active={activeTab} onChange={(id) => setActiveTab(id as typeof activeTab)} isAr={isAr} />

          <div className="py-8" dir={dir}>
            {/* Specs as cards */}
            {activeTab === "specs" &&
              (product.specifications?.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {product.specifications.map((s, i) => (
                    <SpecCard key={i} label={s.label} value={s.value} isAr={isAr} />
                  ))}
                </div>
              ) : (
                <p className="text-sm py-2" style={{ color: C.muted, textAlign: isAr ? "right" : "left" }}>
                  {isAr ? "لا توجد مواصفات متاحة" : "No specifications available"}
                </p>
              ))}

            {/* Shipping */}
            {activeTab === "shipping" && (
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { title: t.productDetail.freeShippingOver, desc: t.productDetail.freeShippingDesc },
                  { title: t.productDetail.worldwideDelivery, desc: t.productDetail.worldwideDeliveryDesc },
                  { title: t.productDetail.estimatedDelivery, desc: t.productDetail.estimatedDeliveryDesc },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="border border-border p-4"
                    style={{ background: C.bg, textAlign: isAr ? "right" : "left" }}
                  >
                    <div
                      className="flex items-center gap-2 mb-2"
                      style={{ flexDirection: isAr ? "row-reverse" : "row" }}
                    >
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: C.goldFaint }}
                      >
                        <Check className="w-3 h-3" style={{ color: C.gold }} />
                      </span>
                      <p className="text-sm font-bold uppercase tracking-tight" style={{ color: C.fg }}>
                        {item.title}
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Bulk */}
            {activeTab === "bulk" &&
              (product.bulkPricing?.length ? (
                <div>
                  <p className="text-sm mb-4" style={{ color: C.muted, textAlign: isAr ? "right" : "left" }}>
                    {t.productDetail.saveMore}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-border min-w-[300px]" dir="ltr">
                      <thead style={{ background: C.sec }}>
                        <tr>
                          {[t.productDetail.quantityLabel, t.productDetail.unitPrice, t.productDetail.savings].map(
                            (h, i) => (
                              <th
                                key={i}
                                className="py-3 px-4 font-mono text-[0.52rem] uppercase tracking-[0.16em] text-start border-b border-border"
                                style={{ color: C.muted }}
                              >
                                {h}
                              </th>
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 font-mono text-sm">1 – 4</td>
                          <td className="py-3 px-4 font-mono text-sm">{fmt(product.price)}</td>
                          <td className="py-3 px-4 font-mono text-sm" style={{ color: C.muted }}>
                            —
                          </td>
                        </tr>
                        {product.bulkPricing.map((tier, i) => (
                          <tr
                            key={i}
                            className="border-b border-border"
                            style={{ background: i % 2 === 1 ? C.sec : C.bg }}
                          >
                            <td className="py-3 px-4 font-mono text-sm">
                              {tier.minQuantity}
                              {tier.maxQuantity ? ` – ${tier.maxQuantity}` : "+"}
                            </td>
                            <td className="py-3 px-4 font-mono text-sm" style={{ color: C.gold }}>
                              {fmt(tier.price)}
                            </td>
                            <td className="py-3 px-4 font-mono text-sm font-bold" style={{ color: C.gold }}>
                              {Math.round(((product.price - tier.price) / product.price) * 100)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-sm" style={{ color: C.muted, textAlign: isAr ? "right" : "left" }}>
                  {t.productDetail.contactBulk}
                </p>
              ))}
          </div>
        </div>
      </section>

      {/* ── INFO BLOCKS ── */}
      <section className="border-b border-border py-10 md:py-14" style={{ background: "hsl(var(--secondary)/0.2)" }}>
        <div className="industrial-container" dir={dir}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px mb-8" style={{ background: C.border }}>
            {infoBlocks.map((block, i) => (
              <div key={i} className="p-6 md:p-7" style={{ background: C.bg }}>
                <EyebrowLabel text={block.title} isAr={isAr} />
                <ul className="space-y-2.5 mt-2">
                  {(block.items as string[]).map((item, j) => (
                    <FeatureItem key={j} text={item} isAr={isAr} />
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="flex flex-col sm:flex-row gap-3"
            style={{ flexDirection: isAr ? "row-reverse" : undefined } as React.CSSProperties}
          >
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] px-7 py-3.5 hover:opacity-90 transition-opacity"
              style={{ flexDirection: isAr ? "row-reverse" : "row" }}
            >
              <span>{t.productDetail.requestPricing}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-7 py-3.5 border border-border font-mono text-[0.65rem] uppercase tracking-[0.18em] hover:border-primary transition-colors duration-200"
              style={{ color: "hsl(var(--foreground)/0.65)" }}
            >
              {t.productDetail.contactEngineer}
            </Link>
          </div>
        </div>
      </section>

      {/* ── RELATED ── */}
      {related.length > 0 && (
        <section className="border-b border-border py-10 md:py-14" style={{ background: C.bg }}>
          <div className="industrial-container" dir={dir}>
            <div
              className="flex items-end justify-between mb-7"
              style={{ flexDirection: isAr ? "row-reverse" : "row" }}
            >
              <div style={{ textAlign: isAr ? "right" : "left" }}>
                <EyebrowLabel text={t.productDetail.relatedProducts} isAr={isAr} />
                <h2
                  className="font-black uppercase leading-tight tracking-[-0.02em]"
                  style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", color: C.fg }}
                >
                  {isAr ? "منتجات مشابهة" : "You Might Also Like"}
                </h2>
              </div>
              <Link
                to={`/shop?category=${product.category}`}
                className="inline-flex items-center gap-1.5 font-mono text-[0.56rem] uppercase tracking-[0.15em] hover:text-primary transition-colors shrink-0"
                style={{ color: C.muted, flexDirection: isAr ? "row-reverse" : "row" }}
              >
                {isAr ? "عرض الكل" : "View All"}
                <ArrowRight className="w-3 h-3 rtl:rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <StickyAddToCart product={product} selectedVariant={selectedVariant} quantity={quantity} />
    </Layout>
  );
}
