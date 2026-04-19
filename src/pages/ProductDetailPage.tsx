import { useState, useEffect, useMemo } from "react";
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
import { useLocalizedField } from "@/hooks/useLocalizedField";
import { getLocalizedProductSpecifications, getLocalizedRawSpecifications } from "@/lib/productSpecifications";

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
      <span className="label-text text-label-md uppercase tracking-[0.28em]" style={{ color: "hsl(var(--primary))" }}>
        {children}
      </span>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex min-w-0 max-w-full flex-wrap items-center justify-center gap-x-1 border border-border px-2.5 py-1.5 text-center text-[0.62rem] font-semibold uppercase leading-snug tracking-[0.12em] text-muted-foreground [overflow-wrap:anywhere] sm:text-[0.68rem] sm:tracking-[0.14em]"
      style={{ wordBreak: "break-word" }}
    >
      {children}
    </span>
  );
}

function SpecCard({ label, value }: { label: string; value: string }) {
  // Split values like "2.44M | 8 FEET" into segments for visually balanced display
  const segments = String(value)
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="relative border border-border bg-background group transition-all duration-300 hover:border-primary hover:shadow-[0_8px_24px_-12px_hsl(var(--primary)/0.35)] overflow-hidden">
      {/* Gold corner accent — top start (RTL-aware via logical inset) */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 start-0 h-[2px] w-6 bg-primary opacity-70 transition-all duration-300 group-hover:w-12 group-hover:opacity-100"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 start-0 w-[2px] h-6 bg-primary opacity-70 transition-all duration-300 group-hover:h-12 group-hover:opacity-100"
      />

      <div className="p-4 sm:p-5">
        {/* Label */}
        <p
          className="label-text text-[0.55rem] sm:text-[0.6rem] uppercase tracking-[0.22em] mb-2.5 font-semibold transition-colors duration-300"
          style={{ color: "hsl(var(--primary) / 0.85)" }}
        >
          {label}
        </p>

        {/* Value(s) — split on "|" for metric/imperial pairing */}
        {segments.length > 1 ? (
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1" dir="ltr">
            <span className="label-text text-base sm:text-[1.05rem] font-bold leading-none tracking-tight text-foreground">
              {segments[0]}
            </span>
            <span aria-hidden className="inline-block w-px h-3.5 bg-primary/50" />
            <span className="label-text text-[0.72rem] sm:text-xs font-semibold leading-none tracking-[0.06em] text-muted-foreground/85">
              {segments.slice(1).join(" | ")}
            </span>
          </div>
        ) : (
          <p
            className="label-text text-base sm:text-[1.05rem] font-bold leading-tight tracking-tight text-foreground"
            dir="ltr"
          >
            {value}
          </p>
        )}
      </div>
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
        className="w-12 h-11 text-center bg-transparent border-x border-border label-text text-sm focus:outline-none"
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
  const { getField, getJsonField } = useLocalizedField();
  const hideShipping = ["land-shipping-container", "storage-containers", "iso-shipping-container"].includes(
    product?.category || "",
  );
  const warrantyTitle = hideShipping ? (isAr ? "الضمان" : "WARRANTY") : t.productDetail.warranty;
  const warrantySubText = hideShipping ? (isAr ? "ضمان 10 سنوات" : "10 Years Warranty") : t.productDetail.yearStandard;

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

  // ── SEO: set <title> + meta description from localized fields ──
  useEffect(() => {
    if (!product) return;
    const seoTitleAr = product.seoTitleAr?.trim();
    const seoTitleEn = product.seoTitle?.trim();
    const titleAr = product.titleAr?.trim();
    const titleEn = product.title?.trim();
    const seoDescAr = product.seoDescriptionAr?.trim();
    const seoDescEn = product.seoDescription?.trim();
    const descAr = product.descriptionAr?.trim();
    const descEn = product.description?.trim();

    const finalTitle =
      (isAr ? seoTitleAr || titleAr : seoTitleEn || titleEn) ||
      seoTitleEn ||
      titleEn ||
      "Salada";
    const finalDesc = (isAr ? seoDescAr || descAr : seoDescEn || descEn) || seoDescEn || descEn || "";

    document.title = finalTitle;
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    if (finalDesc) meta.content = finalDesc.slice(0, 160);
  }, [product, isAr]);

  const displaySpecifications = useMemo(() => {
    if (!product) return [];
    return getLocalizedProductSpecifications(product, language);
  }, [product, language]);

  const catLabel: Record<string, string> = {
    "shipping-containers": t.categories.shippingContainers,
    "storage-tanks": t.categories.storageTanks,
    "ibc-containers": t.categories.ibcContainers,
    "specialty-containers": t.categories.specialtyContainers,
    "drums-barrels": t.categories.drumsBarrels,
    "modular-buildings": t.categories.modularBuildings,
    "spare-parts": t.categories.spareParts,
    "lashing-equipment": t.categories.lashingEquipment,
    "iso-shipping-container": t.categories.isoShipping,
    "iso-shipping-containers": t.categories.isoShipping,
    "land-shipping-container": t.categories.landShipping,
    "land-shipping-containers": t.categories.landShipping,
    "storage-containers": t.categories.storageContainers,
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
          <p className="label-text text-[0.6rem] uppercase tracking-[0.2em] mb-4 text-muted-foreground">404</p>
          <h1 className="font-black uppercase text-2xl mb-6">{t.product.notFound}</h1>
          <Link
            to="/shop"
            className="btn-primary"
          >
            {isAr ? "العودة للمتجر" : "Back to Shop"}
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        </div>
      </Layout>
    );

  const related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  // ── Localized fields (fallback to base/English when Arabic empty) ──
  const localizedTitle = getField(product, "title") ?? product.title;
  const localizedDescription = getField(product, "description") ?? "";
  const localizedSeoTitle = getField(product, "seoTitle");
  const localizedSeoDescription = getField(product, "seoDescription");
  const localizedKeyFeatures = getJsonField<string>(product, "keyFeatures");
  const localizedIdealFor = getJsonField<string>(product, "idealFor");

  const tabs = [
    { id: "specs" as const, label: t.productDetail.specifications },
    { id: "shipping" as const, label: t.productDetail.shipping },
    { id: "bulk" as const, label: t.productDetail.bulkPricing },
  ];

  const trustBadges = [
    ...(!hideShipping ? [{ Icon: Truck, title: t.productDetail.freeShipping, sub: t.productDetail.ordersOver }] : []),
    { Icon: Shield, title: warrantyTitle, sub: warrantySubText },
    { Icon: RotateCcw, title: t.productDetail.returnsTitle, sub: t.productDetail.dayPolicy },
  ];

  const infoBlocks = [
    {
      title: t.productDetail.idealFor,
      items: localizedIdealFor.length ? localizedIdealFor : t.productDetail.defaultIdealFor,
    },
    {
      title: t.productDetail.keyFeatures,
      items: localizedKeyFeatures.length ? localizedKeyFeatures : t.productDetail.defaultKeyFeatures,
    },
    {
      title: t.productDetail.customization,
      items: product.customizationOptions?.length ? product.customizationOptions : t.productDetail.defaultCustomization,
    },
  ];

  // ── Nested specs detection (supports both shapes) ──
  // New shape: raw object with { external, internal, door, capacity, ... } — localized via specifications_ar
  // Existing shape: flat [{ label, value }] via displaySpecifications
  const nestedSpecs: Record<string, unknown> | null = getLocalizedRawSpecifications(product, language);

  const dimGroups: { key: "external" | "internal" | "door"; labelKey: keyof (typeof t)["products"] }[] = [
    { key: "external", labelKey: "external_dimensions" },
    { key: "internal", labelKey: "internal_dimensions" },
    { key: "door", labelKey: "door_sizes" },
  ];
  const dimSubLabels: Record<string, keyof (typeof t)["products"]> = {
    length: "length",
    width: "width",
    height: "height",
  };
  const capacitySubLabels: Record<string, keyof (typeof t)["products"]> = {
    cubic_volume: "cubic_volume",
    empty_weight: "empty_weight",
    load_capacity: "load_capacity",
    total_weight: "total_weight",
  };

  const renderNestedDim = (groupKey: "external" | "internal" | "door"): React.ReactNode => {
    const group = nestedSpecs?.[groupKey];
    if (!group || typeof group !== "object") return null;
    const entries = Object.entries(group).filter(
      ([, v]) => v !== null && v !== undefined && String(v).toString().trim() !== "",
    );
    if (entries.length === 0) return null;
    return entries.map(([k, v]) => {
      const labelKey = dimSubLabels[k];
      const label = labelKey ? t.products[labelKey] : k.replace(/_/g, " ");
      return <SpecCard key={`${groupKey}-${k}`} label={label} value={String(v)} />;
    });
  };

  const renderCapacity = (): React.ReactNode => {
    const cap = nestedSpecs?.capacity;
    if (!cap || typeof cap !== "object") return null;
    const entries = Object.entries(cap).filter(
      ([, v]) => v !== null && v !== undefined && String(v).toString().trim() !== "",
    );
    if (entries.length === 0) return null;
    return entries.map(([k, v]) => {
      const labelKey = capacitySubLabels[k];
      const label = labelKey ? t.products[labelKey] : k.replace(/_/g, " ");
      return <SpecCard key={`cap-${k}`} label={label} value={String(v)} />;
    });
  };

  const hasNestedSpecsContent =
    !!nestedSpecs &&
    (dimGroups.some((g) => {
      const grp = nestedSpecs[g.key];
      return grp && typeof grp === "object" && Object.values(grp).some((v) => v != null && String(v).trim() !== "");
    }) ||
      (nestedSpecs.capacity &&
        typeof nestedSpecs.capacity === "object" &&
        Object.values(nestedSpecs.capacity).some((v) => v != null && String(v).trim() !== "")));


  // ── NOTE: All RTL is handled via dir="rtl" on wrappers.
  //    Flexbox, text-align, borders all flip automatically.
  //    We NEVER use inline flexDirection or manual rtl: classes for layout.

  return (
    <Layout>
      {/* ╔══════════════════════════════════════╗
          ║  BREADCRUMB                          ║
          ╚══════════════════════════════════════╝ */}
      <nav className="page-hero-breadcrumb border-b border-border bg-background" dir={isAr ? "rtl" : "ltr"}>
        <div className="industrial-container py-3">
          <ol className="flex items-center gap-1 flex-wrap">
            {[
              { label: isAr ? "الرئيسية" : "Home", href: "/" },
              { label: t.nav.shop, href: "/shop" },
              { label: getCat(product.category), href: `/shop?category=${product.category}` },
              { label: localizedTitle },
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="w-3 h-3 shrink-0 text-border rtl:rotate-180" />}
                {item.href ? (
                  <Link
                    to={item.href}
                    className="hero-crumb label-text text-label-md uppercase tracking-[0.14em] text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="hero-crumb label-text text-label-md uppercase tracking-[0.14em] line-clamp-1 max-w-[180px]"
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
                  alt={localizedTitle}
                  className="h-full w-full min-h-0 !object-cover object-center transition-transform duration-400 ease-out hover:scale-[1.02]"
                  style={{ objectFit: "cover", objectPosition: "center", filter: "grayscale(8%)", cursor: "zoom-in" }}
                  title={isAr ? "تكبير الصورة" : "Zoom image"}
                />
                {product.status === "out_of_stock" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
                    <span className="label-text text-[0.6rem] uppercase tracking-[0.2em] text-white border border-white/30 px-4 py-2">
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
                      <img
                        src={img}
                        alt={`${localizedTitle} - ${i + 1}`}
                        loading="lazy"
                        className="h-full w-full min-h-0 !object-cover object-center"
                        style={{ objectFit: "cover", objectPosition: "center" }}
                      />
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
                {localizedTitle}
              </h1>

              {/* Tags — only render if present */}
              {Array.isArray(product.tags) && product.tags.filter((tg) => tg && tg.trim()).length > 0 && (
                <div className="mb-4 flex flex-wrap gap-1.5 rtl:justify-end">
                  {product.tags
                    .filter((tg) => tg && tg.trim())
                    .map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center border border-border px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              )}

              {/* Material badge — only if material is set */}
              {product.material && product.material.trim() ? (
                <div className="mb-4 flex flex-wrap gap-1.5 rtl:justify-end">
                  <span
                    className="inline-flex items-center border px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em]"
                    style={{
                      borderColor: "hsl(var(--primary)/0.3)",
                      background: "hsl(var(--primary)/0.06)",
                      color: "hsl(var(--primary))",
                    }}
                  >
                    {t.products.material}: {product.material}
                  </span>
                </div>
              ) : null}

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

              {/* Description — only render if present */}
              {localizedDescription ? (
                <p className="text-sm leading-relaxed text-muted-foreground mb-6">{localizedDescription}</p>
              ) : null}

              {/* Variants */}
              {product.variants && product.variants.length > 1 && (
                <div className="mb-5">
                  <p className="label-text text-[0.54rem] uppercase tracking-[0.2em] mb-2.5 text-muted-foreground">
                    {t.productDetail.variant}
                  </p>
                  <div className="flex flex-wrap gap-2 rtl:justify-end">
                    {product.variants.map((v) => {
                      const active = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`px-4 py-2 border label-text text-[0.6rem] uppercase tracking-[0.15em] transition-all duration-200 ${
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
                <p className="label-text text-[0.54rem] uppercase tracking-[0.2em] mb-2.5 text-muted-foreground">
                  {t.productDetail.quantity}
                </p>
                <div className="flex items-center gap-4 rtl:flex-row-reverse rtl:justify-end">
                  <QuantityStepper value={quantity} onChange={setQuantity} />
                  <span className="label-text text-[0.56rem] uppercase tracking-[0.15em] text-muted-foreground">
                    {product.stock} {t.productDetail.inStock}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <Link
                to={`/inquiry/${product.slug}?quantity=${quantity}`}
                className="btn-primary w-full mb-6 rtl:flex-row-reverse"
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
                    <span className="label-text text-[0.6rem] uppercase tracking-[0.08em] leading-snug text-foreground font-semibold w-full">
                      {title}
                    </span>
                    <span className="label-text text-[0.52rem] uppercase tracking-[0.06em] text-muted-foreground w-full">
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
                className={`relative shrink-0 px-5 py-4 label-text text-[0.6rem] uppercase tracking-[0.18em] whitespace-nowrap transition-colors duration-200 ${
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
            {/* SPECS — nested {external,internal,door,capacity} OR localized flat [{label,value}] */}
            {activeTab === "specs" && (
              <>
                {hasNestedSpecsContent ? (
                  <div className="space-y-7">
                    {/* Section heading */}
                    <h2 className="label-text text-[0.6rem] uppercase tracking-[0.2em] text-primary">
                      {t.products.technical_specifications}
                    </h2>

                    {/* Dimension groups */}
                    {dimGroups.map((g) => {
                      const cards = renderNestedDim(g.key);
                      if (!cards || (Array.isArray(cards) && cards.length === 0)) return null;
                      return (
                        <div key={g.key}>
                          <p className="label-text text-[0.58rem] uppercase tracking-[0.18em] mb-2.5 text-muted-foreground">
                            {t.products[g.labelKey]}
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">{cards}</div>
                        </div>
                      );
                    })}

                    {/* Capacity */}
                    {(() => {
                      const cards = renderCapacity();
                      if (!cards || (Array.isArray(cards) && cards.length === 0)) return null;
                      return (
                        <div>
                          <p className="label-text text-[0.58rem] uppercase tracking-[0.18em] mb-2.5 text-muted-foreground">
                            {t.products.capacity}
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">{cards}</div>
                        </div>
                      );
                    })()}

                    {/* Weight + Material — only if data exists */}
                    {(product.weight || product.material) && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {product.weight ? (
                          <SpecCard label={t.products.weight} value={`${product.weight} kg`} />
                        ) : null}
                        {product.material ? (
                          <SpecCard label={t.products.material} value={product.material} />
                        ) : null}
                      </div>
                    )}
                  </div>
                ) : displaySpecifications.length ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {displaySpecifications.map((s, i) => (
                      <SpecCard key={i} label={s.label} value={s.value} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-2 rtl:text-right">
                    {isAr ? "لا توجد مواصفات متاحة" : "No specifications available"}
                  </p>
                )}
              </>
            )}

            {/* SHIPPING — cards */}
            {activeTab === "shipping" && (
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  ...(!hideShipping
                    ? [{ title: t.productDetail.freeShippingOver, desc: t.productDetail.freeShippingDesc }]
                    : []),
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
                                className="py-3 px-4 label-text text-[0.52rem] uppercase tracking-[0.16em] text-start text-muted-foreground border-b border-border"
                              >
                                {h}
                              </th>
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 label-text text-sm">1 – 4</td>
                          <td className="py-3 px-4 label-text text-sm">{fmt(product.price)}</td>
                          <td className="py-3 px-4 label-text text-sm text-muted-foreground">—</td>
                        </tr>
                        {product.bulkPricing.map((tier, i) => (
                          <tr
                            key={i}
                            className={`border-b border-border ${i % 2 === 1 ? "bg-secondary/30" : "bg-background"}`}
                          >
                            <td className="py-3 px-4 label-text text-sm">
                              {tier.minQuantity}
                              {tier.maxQuantity ? ` – ${tier.maxQuantity}` : "+"}
                            </td>
                            <td className="py-3 px-4 label-text text-sm text-primary">{fmt(tier.price)}</td>
                            <td className="py-3 px-4 label-text text-sm font-bold text-primary">
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
              className="btn-primary rtl:flex-row-reverse"
            >
              <span>{t.productDetail.requestPricing}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </Link>
            <Link
              to="/contact"
              className="btn-secondary text-foreground/65"
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
                className="inline-flex items-center gap-1.5 label-text text-[0.56rem] uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors shrink-0 rtl:flex-row-reverse"
              >
                {isAr ? "عرض الكل" : "View All"}
                <ArrowRight className="w-3 h-3 rtl:rotate-180" />
              </Link>
            </div>

            {/* Mobile: linear list — Desktop: grid */}
            <div className="flex flex-col gap-3 lg:hidden">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} variant="compact" />
              ))}
            </div>
            <div className="hidden lg:grid lg:grid-cols-4 gap-4">
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
