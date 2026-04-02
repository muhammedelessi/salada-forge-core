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

// ─── Shared micro-components ──────────────────────────────────────

function GoldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span
        className="block shrink-0"
        style={{
          width: "1.2rem",
          height: "1.5px",
          background: "hsl(var(--primary)/0.6)",
        }}
      />
      <span className="font-mono text-[0.56rem] uppercase tracking-[0.28em]" style={{ color: "hsl(var(--primary))" }}>
        {children}
      </span>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex font-mono text-[0.52rem] uppercase tracking-[0.18em] px-2.5 py-1 border border-border"
      style={{ color: "hsl(var(--muted-foreground))" }}
    >
      {children}
    </span>
  );
}

function SpecCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border p-4 hover:border-primary transition-colors duration-200 bg-background group">
      <p
        className="font-mono text-[0.5rem] uppercase tracking-[0.2em] mb-2 group-hover:opacity-100"
        style={{ color: "hsl(var(--primary))", opacity: 0.65 }}
      >
        {label}
      </p>
      <p className="font-mono text-sm font-bold leading-snug" style={{ color: "hsl(var(--foreground))" }}>
        {value}
      </p>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
      <span
        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: "hsl(var(--primary)/0.1)" }}
      >
        <Check className="w-2.5 h-2.5" style={{ color: "hsl(var(--primary))" }} />
      </span>
      {text}
    </li>
  );
}

function QuantityStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="inline-flex items-center border border-border">
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

// ─── Main page ────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || "");
  const { data: allProducts = [] } = useProducts();
  const { language } = useLanguageStore();
  const t = translations[language];
  const isAr = language === "ar";

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
    new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
    }).format(n);

  // ── Guards ──────────────────────────────────────────────────────
  if (isLoading)
    return (
      <Layout>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );

  if (!product)
    return (
      <Layout>
        <div className="industrial-container py-24 text-center" dir={isAr ? "rtl" : "ltr"}>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] mb-4 text-muted-foreground">404</p>
          <h1 className="font-black uppercase text-2xl mb-6">{t.product.notFound}</h1>
          <Link
            to="/shop"
            className="industrial-button w-full sm:w-auto"
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

  // ── NOTE: All RTL is handled via dir="rtl" on wrappers.
  //    Flexbox, text-align, borders all flip automatically.
  //    We NEVER use inline flexDirection or manual rtl: classes for layout.

  return (
    <Layout>
      {/* ╔══════════════════════════════════════╗
          ║  BREADCRUMB                          ║
          ╚══════════════════════════════════════╝ */}
      <nav className="border-b border-border bg-background" dir={isAr ? "rtl" : "ltr"}>
        <div className="industrial-container py-3">
          <ol className="flex items-center gap-1 flex-wrap">
            {[
              { label: isAr ? "الرئيسية" : "Home", href: "/" },
              { label: t.nav.shop, href: "/shop" },
              { label: getCat(product.category), href: `/shop?category=${product.category}` },
              { label: product.title },
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="w-3 h-3 shrink-0 text-border rtl:rotate-180" />}
                {item.href ? (
                  <Link
                    to={item.href}
                    className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="font-mono text-[0.5rem] uppercase tracking-[0.14em] line-clamp-1 max-w-[180px]"
                    style={{ color: "hsl(var(--primary))" }}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>

      {/* ╔══════════════════════════════════════╗
          ║  PRODUCT MAIN                        ║
          ╚══════════════════════════════════════╝ */}
      <section className="bg-background border-b border-border py-8 md:py-12">
        <div className="industrial-container">
          {/* Grid: on mobile stacked, on desktop side-by-side */}
          {/* RTL: CSS grid + dir handles column order automatically */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14" dir={isAr ? "rtl" : "ltr"}>
            {/* ── Gallery ─────────────────────── */}
            <div className="space-y-3">
              {/* Main image */}
              <div
                className="relative overflow-hidden border border-border bg-secondary"
                style={{ aspectRatio: "4/3" }}
              >
                <img
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                  style={{ filter: "grayscale(8%)" }}
                />
                {product.status === "out_of_stock" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white border border-white/30 px-4 py-2">
                      {t.product.outOfStock}
                    </span>
                  </div>
                )}
                {/* Decorative gold bottom line */}
                <div
                  className="absolute bottom-0 inset-x-0 h-px"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, hsl(var(--primary)/0.45) 30%, hsl(var(--primary)/0.45) 70%, transparent)",
                  }}
                />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`overflow-hidden border-2 transition-all duration-200 bg-secondary ${
                        selectedImage === i ? "border-primary" : "border-border hover:border-primary/50"
                      }`}
                      style={{ aspectRatio: "1/1" }}
                    >
                      <img src={img} alt={`view-${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Product info ─────────────────── */}
            <div className="rtl:text-right">
              {/* SKU + Category pills */}
              <div className="flex items-center gap-2 flex-wrap mb-3 rtl:justify-end">
                <Pill>{product.sku}</Pill>
                <Pill>{getCat(product.category)}</Pill>
              </div>

              {/* Title */}
              <h1
                className="font-black uppercase leading-tight tracking-[-0.025em] mb-4 text-foreground"
                style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.6rem)" }}
              >
                {product.title}
              </h1>

              {/* Pricing callout */}
              <div
                className="flex items-center gap-3 mb-5 px-4 py-3 border"
                style={{ background: "hsl(var(--primary)/0.07)", borderColor: "hsl(var(--primary)/0.2)" }}
              >
                <span
                  className="block w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: "hsl(var(--primary))" }}
                />
                <p className="text-sm text-muted-foreground">
                  {isAr ? "للحصول على السعر، تواصل معنا" : "Contact us for pricing"}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed text-muted-foreground mb-6">{product.description}</p>

              {/* Variants */}
              {product.variants && product.variants.length > 1 && (
                <div className="mb-5">
                  <p className="font-mono text-[0.54rem] uppercase tracking-[0.2em] mb-2.5 text-muted-foreground">
                    {t.productDetail.variant}
                  </p>
                  <div className="flex flex-wrap gap-2 rtl:justify-end">
                    {product.variants.map((v) => {
                      const active = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`px-4 py-2 border font-mono text-[0.6rem] uppercase tracking-[0.15em] transition-all duration-200 ${
                            active
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-border text-foreground hover:border-primary"
                          }`}
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
                <p className="font-mono text-[0.54rem] uppercase tracking-[0.2em] mb-2.5 text-muted-foreground">
                  {t.productDetail.quantity}
                </p>
                <div className="flex items-center gap-4 rtl:flex-row-reverse rtl:justify-end">
                  <QuantityStepper value={quantity} onChange={setQuantity} />
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-muted-foreground">
                    {product.stock} {t.productDetail.inStock}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <Link
                to={`/inquiry/${product.slug}?quantity=${quantity}`}
                className="flex items-center justify-center gap-2.5 w-full bg-primary text-primary-foreground font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] py-4 mb-6 hover:opacity-90 transition-opacity rtl:flex-row-reverse"
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                {isAr ? "تواصل معنا للحصول على عرض سعر" : "Contact Us for a Quote"}
              </Link>

              {/* Trust badges — flex + dir handles RTL order & text alignment */}
              <div
                className="flex border-t border-b border-border"
                dir={isAr ? "rtl" : "ltr"}
                style={{ gap: "1px", background: "hsl(var(--border))" }}
              >
                {trustBadges.map(({ Icon, title, sub }, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center text-center gap-1.5 px-3 py-4 bg-background"
                  >
                    <Icon className="w-5 h-5 text-primary shrink-0" />
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.08em] leading-snug text-foreground font-semibold w-full">
                      {title}
                    </span>
                    <span className="font-mono text-[0.52rem] uppercase tracking-[0.06em] text-muted-foreground w-full">
                      {sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════╗
          ║  TABS                                ║
          ╚══════════════════════════════════════╝ */}
      <section className="bg-background border-b border-border">
        <div className="industrial-container">
          {/* Tab nav — dir handles RTL tab order automatically */}
          <div
            className="flex overflow-x-auto border-b border-border"
            dir={isAr ? "rtl" : "ltr"}
            style={{ scrollbarWidth: "none" }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative shrink-0 px-5 py-4 font-mono text-[0.6rem] uppercase tracking-[0.18em] whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-primary" />}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="py-8" dir={isAr ? "rtl" : "ltr"}>
            {/* SPECS — cards grid */}
            {activeTab === "specs" &&
              (product.specifications?.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {product.specifications.map((s, i) => (
                    <SpecCard key={i} label={s.label} value={s.value} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-2 rtl:text-right">
                  {isAr ? "لا توجد مواصفات متاحة" : "No specifications available"}
                </p>
              ))}

            {/* SHIPPING — cards */}
            {activeTab === "shipping" && (
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { title: t.productDetail.freeShippingOver, desc: t.productDetail.freeShippingDesc },
                  { title: t.productDetail.worldwideDelivery, desc: t.productDetail.worldwideDeliveryDesc },
                  { title: t.productDetail.estimatedDelivery, desc: t.productDetail.estimatedDeliveryDesc },
                ].map((item, i) => (
                  <div key={i} className="border border-border p-4 bg-background rtl:text-right">
                    <div className="flex items-center gap-2 mb-2 rtl:flex-row-reverse">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "hsl(var(--primary)/0.1)" }}
                      >
                        <Check className="w-3 h-3 text-primary" />
                      </span>
                      <p className="text-sm font-bold uppercase tracking-tight">{item.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* BULK PRICING */}
            {activeTab === "bulk" &&
              (product.bulkPricing?.length ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-4 rtl:text-right">{t.productDetail.saveMore}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-border min-w-[300px]" dir="ltr">
                      <thead className="bg-secondary/40">
                        <tr>
                          {[t.productDetail.quantityLabel, t.productDetail.unitPrice, t.productDetail.savings].map(
                            (h, i) => (
                              <th
                                key={i}
                                className="py-3 px-4 font-mono text-[0.52rem] uppercase tracking-[0.16em] text-start text-muted-foreground border-b border-border"
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
                          <td className="py-3 px-4 font-mono text-sm text-muted-foreground">—</td>
                        </tr>
                        {product.bulkPricing.map((tier, i) => (
                          <tr
                            key={i}
                            className={`border-b border-border ${i % 2 === 1 ? "bg-secondary/30" : "bg-background"}`}
                          >
                            <td className="py-3 px-4 font-mono text-sm">
                              {tier.minQuantity}
                              {tier.maxQuantity ? ` – ${tier.maxQuantity}` : "+"}
                            </td>
                            <td className="py-3 px-4 font-mono text-sm text-primary">{fmt(tier.price)}</td>
                            <td className="py-3 px-4 font-mono text-sm font-bold text-primary">
                              {Math.round(((product.price - tier.price) / product.price) * 100)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground rtl:text-right">{t.productDetail.contactBulk}</p>
              ))}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════╗
          ║  INFO BLOCKS                         ║
          ╚══════════════════════════════════════╝ */}
      <section className="border-b border-border py-10 md:py-14 bg-secondary/20">
        <div className="industrial-container" dir={isAr ? "rtl" : "ltr"}>
          <div
            className="grid grid-cols-1 md:grid-cols-3 mb-8"
            style={{ gap: "1px", background: "hsl(var(--border))" }}
          >
            {infoBlocks.map((block, i) => (
              <div key={i} className="p-6 md:p-7 bg-background rtl:text-right">
                <GoldLabel>{block.title}</GoldLabel>
                <ul className="space-y-2.5 mt-1">
                  {(block.items as string[]).map((item, j) => (
                    <FeatureItem key={j} text={item} />
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row gap-3 rtl:sm:flex-row-reverse">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] px-7 py-3.5 hover:opacity-90 transition-opacity rtl:flex-row-reverse"
            >
              <span>{t.productDetail.requestPricing}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-7 py-3.5 border border-border font-mono text-[0.65rem] uppercase tracking-[0.18em] hover:border-primary transition-colors text-foreground/65"
            >
              {t.productDetail.contactEngineer}
            </Link>
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════╗
          ║  RELATED PRODUCTS                    ║
          ╚══════════════════════════════════════╝ */}
      {related.length > 0 && (
        <section className="bg-background border-b border-border py-10 md:py-14">
          <div className="industrial-container" dir={isAr ? "rtl" : "ltr"}>
            <div className="flex items-end justify-between mb-7">
              <div className="rtl:text-right">
                <GoldLabel>{t.productDetail.relatedProducts}</GoldLabel>
                <h2
                  className="font-black uppercase leading-tight tracking-[-0.02em] text-foreground"
                  style={{ fontSize: "clamp(1rem, 2vw, 1.4rem)" }}
                >
                  {isAr ? "منتجات مشابهة" : "You Might Also Like"}
                </h2>
              </div>
              <Link
                to={`/shop?category=${product.category}`}
                className="inline-flex items-center gap-1.5 font-mono text-[0.56rem] uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors shrink-0 rtl:flex-row-reverse"
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
