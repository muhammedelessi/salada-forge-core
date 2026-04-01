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

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || "");
  const { data: allProducts = [] } = useProducts();
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];
  const isAr = isRTL();

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

  const categoryTranslations: Record<string, string> = {
    "shipping-containers": t.categories.shippingContainers,
    "storage-tanks": t.categories.storageTanks,
    "ibc-containers": t.categories.ibcContainers,
    "specialty-containers": t.categories.specialtyContainers,
    "drums-barrels": t.categories.drumsBarrels,
    "modular-buildings": t.categories.modularBuildings,
    "spare-parts": language === "ar" ? "قطع الغيار" : "Spare Parts",
    "lashing-equipment": language === "ar" ? "معدات الربط" : "Lashing Equipment",
    "iso-shipping-containers": language === "ar" ? "حاويات شحن ISO" : "ISO Shipping Containers",
    "storage-containers": language === "ar" ? "حاويات التخزين" : "Storage Containers",
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR", minimumFractionDigits: 0 }).format(price);

  /* ── Loading ── */
  if (isLoading) {
    return (
      <Layout>
        <div className="industrial-container py-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "hsl(var(--primary))" }} />
        </div>
      </Layout>
    );
  }

  /* ── Not found ── */
  if (!product) {
    return (
      <Layout>
        <div className="industrial-container py-24 text-center">
          <p
            className="font-mono text-[0.6rem] uppercase tracking-[0.2em] mb-4"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            404
          </p>
          <h1 className="font-black uppercase text-2xl mb-6">{t.product.notFound}</h1>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] px-6 py-3"
          >
            {isAr ? "العودة للمتجر" : "Back to Shop"}
            <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
          </Link>
        </div>
      </Layout>
    );
  }

  const relatedProducts = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const tabs = [
    { id: "specs" as const, label: t.productDetail.specifications },
    { id: "shipping" as const, label: t.productDetail.shipping },
    { id: "bulk" as const, label: t.productDetail.bulkPricing },
  ];

  const badges = [
    { icon: Truck, title: t.productDetail.freeShipping, sub: t.productDetail.ordersOver },
    { icon: Shield, title: t.productDetail.warranty, sub: t.productDetail.yearStandard },
    { icon: RotateCcw, title: t.productDetail.returnsTitle, sub: t.productDetail.dayPolicy },
  ];

  return (
    <Layout>
      {/* ── BREADCRUMB ─────────────────── */}
      <nav className="border-b border-border" dir={isAr ? "rtl" : "ltr"}>
        <div className="industrial-container py-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { label: isAr ? "الرئيسية" : "Home", href: "/" },
              { label: t.nav.shop, href: "/shop" },
              {
                label:
                  categoryTranslations[product.category] ||
                  product.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
                href: `/shop?category=${product.category}`,
              },
              { label: product.title },
            ].map((item, i, arr) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                  <ChevronRight
                    className={`w-3 h-3 shrink-0 ${isAr ? "rotate-180" : ""}`}
                    style={{ color: "hsl(var(--border))" }}
                  />
                )}
                {item.href ? (
                  <Link
                    to={item.href}
                    className="font-mono text-[0.5rem] uppercase tracking-[0.15em] hover:text-primary transition-colors"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="font-mono text-[0.5rem] uppercase tracking-[0.15em] line-clamp-1 max-w-[160px]"
                    style={{ color: "hsl(var(--primary))" }}
                  >
                    {item.label}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </nav>

      {/* ── PRODUCT MAIN ───────────────── */}
      <section className="bg-background border-b border-border py-8 md:py-12">
        <div className="industrial-container">
          <div
            className={`grid lg:grid-cols-2 gap-8 md:gap-14 ${isAr ? "lg:flex lg:flex-row-reverse" : ""}`}
            dir={isAr ? "rtl" : "ltr"}
          >
            {/* ── GALLERY ── */}
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
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "rgba(8,6,2,0.5)" }}
                  >
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white px-4 py-2 border border-white/30">
                      {t.product.outOfStock}
                    </span>
                  </div>
                )}
                {/* gold bottom line */}
                <div
                  className="absolute bottom-0 inset-x-0"
                  style={{
                    height: "1.5px",
                    background:
                      "linear-gradient(to right, transparent, hsl(var(--primary)/0.4) 30%, hsl(var(--primary)/0.4) 70%, transparent)",
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
                      className="relative overflow-hidden border-2 transition-all duration-200"
                      style={{
                        aspectRatio: "1/1",
                        borderColor: selectedImage === i ? "hsl(var(--primary))" : "hsl(var(--border))",
                        background: "hsl(var(--secondary))",
                      }}
                    >
                      <img
                        src={img}
                        alt={`${product.title} ${i + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── PRODUCT INFO ── */}
            <div className={isAr ? "text-right" : ""}>
              {/* SKU + Category */}
              <div className={`flex items-center gap-3 mb-3 flex-wrap ${isAr ? "flex-row-reverse justify-end" : ""}`}>
                <span
                  className="font-mono text-[0.55rem] uppercase tracking-[0.2em] px-2 py-1 border border-border"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {product.sku}
                </span>
                <span
                  className="font-mono text-[0.55rem] uppercase tracking-[0.2em]"
                  style={{ color: "hsl(var(--primary)/0.7)" }}
                >
                  {categoryTranslations[product.category] || product.category}
                </span>
              </div>

              {/* Title */}
              <h1
                className="font-black uppercase leading-tight tracking-[-0.02em] mb-4"
                style={{ fontSize: "clamp(1.4rem, 3.5vw, 2.5rem)", color: "hsl(var(--foreground))" }}
              >
                {product.title}
              </h1>

              {/* Pricing note */}
              <div className="mb-4 py-3 px-4 border border-border" style={{ background: "hsl(var(--primary)/0.05)" }}>
                <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {language === "ar" ? "للحصول على السعر، تواصل معنا" : "Contact us for pricing"}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
                {product.description}
              </p>

              {/* Variants */}
              {product.variants && product.variants.length > 1 && (
                <div className="mb-5">
                  <p
                    className="font-mono text-[0.55rem] uppercase tracking-[0.2em] mb-2.5"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {t.productDetail.variant}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className="px-4 py-2 border font-mono text-[0.6rem] uppercase tracking-[0.15em] transition-all duration-200"
                        style={{
                          borderColor: selectedVariant?.id === v.id ? "hsl(var(--primary))" : "hsl(var(--border))",
                          background: selectedVariant?.id === v.id ? "hsl(var(--primary))" : "transparent",
                          color:
                            selectedVariant?.id === v.id ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
                        }}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <p
                  className="font-mono text-[0.55rem] uppercase tracking-[0.2em] mb-2.5"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {t.productDetail.quantity}
                </p>
                <div className={`flex items-center gap-4 ${isAr ? "flex-row-reverse" : ""}`}>
                  <div className="flex items-center border border-border">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-11 h-11 flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-14 h-11 text-center bg-transparent border-x border-border font-mono text-sm focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-11 h-11 flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span
                    className="font-mono text-[0.58rem] uppercase tracking-[0.15em]"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {product.stock} {t.productDetail.inStock}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <Link
                to={`/inquiry/${product.slug}?quantity=${quantity}`}
                className={`w-full inline-flex items-center justify-center gap-2.5 bg-primary text-primary-foreground font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] py-4 mb-6 hover:opacity-90 transition-opacity ${isAr ? "flex-row-reverse" : ""}`}
              >
                <MessageSquare className="w-4 h-4" />
                {language === "ar" ? "تواصل معنا للحصول على عرض سعر" : "Contact Us for a Quote"}
              </Link>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-1 border-t border-b border-border py-5">
                {badges.map(({ icon: Icon, title, sub }, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-1.5 px-2">
                    <Icon className="w-5 h-5 shrink-0" style={{ color: "hsl(var(--primary))" }} />
                    <span
                      className="font-mono text-[0.52rem] uppercase tracking-[0.15em] leading-snug"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      {title}
                    </span>
                    <span
                      className="font-mono text-[0.48rem] uppercase tracking-[0.12em]"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TABS ───────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="industrial-container" dir={isAr ? "rtl" : "ltr"}>
          {/* Tab nav */}
          <div className="flex border-b border-border overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative px-5 py-4 font-mono text-[0.6rem] uppercase tracking-[0.18em] whitespace-nowrap transition-colors duration-200"
                style={{ color: activeTab === tab.id ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span
                    className="absolute bottom-0 inset-x-0"
                    style={{ height: "2px", background: "hsl(var(--primary))" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="py-8">
            {/* SPECS */}
            {activeTab === "specs" && (
              <div className="grid md:grid-cols-2 gap-px" style={{ background: "hsl(var(--border))" }}>
                {product.specifications && product.specifications.length > 0 ? (
                  product.specifications.map((spec, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between py-3 px-4 ${isAr ? "flex-row-reverse" : ""}`}
                      style={{ background: i % 2 === 0 ? "hsl(var(--background))" : "hsl(var(--secondary)/0.4)" }}
                    >
                      <span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                        {spec.label}
                      </span>
                      <span className="font-mono text-sm font-bold" style={{ color: "hsl(var(--foreground))" }}>
                        {spec.value}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="col-span-2 text-sm py-4" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {language === "ar" ? "لا توجد مواصفات متاحة" : "No specifications available"}
                  </p>
                )}
              </div>
            )}

            {/* SHIPPING */}
            {activeTab === "shipping" && (
              <div className="max-w-xl space-y-4">
                {[
                  { title: t.productDetail.freeShippingOver, desc: t.productDetail.freeShippingDesc },
                  { title: t.productDetail.worldwideDelivery, desc: t.productDetail.worldwideDeliveryDesc },
                  { title: t.productDetail.estimatedDelivery, desc: t.productDetail.estimatedDeliveryDesc },
                ].map((item, i) => (
                  <div key={i} className={`flex items-start gap-3 ${isAr ? "flex-row-reverse text-right" : ""}`}>
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "hsl(var(--primary)/0.12)" }}
                    >
                      <Check className="w-3 h-3" style={{ color: "hsl(var(--primary))" }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-tight">{item.title}</p>
                      <p className="text-sm mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* BULK */}
            {activeTab === "bulk" &&
              (product.bulkPricing && product.bulkPricing.length > 0 ? (
                <div className="max-w-md">
                  <p className="text-sm mb-5" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {t.productDetail.saveMore}
                  </p>
                  <table className="w-full border border-border" dir={isAr ? "rtl" : "ltr"}>
                    <thead style={{ background: "hsl(var(--secondary))" }}>
                      <tr>
                        {[t.productDetail.quantityLabel, t.productDetail.unitPrice, t.productDetail.savings].map(
                          (h, i) => (
                            <th
                              key={i}
                              className="py-3 px-4 font-mono text-[0.55rem] uppercase tracking-[0.18em] text-start border-b border-border"
                              style={{ color: "hsl(var(--muted-foreground))" }}
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
                        <td className="py-3 px-4 font-mono text-sm">{formatPrice(product.price)}</td>
                        <td className="py-3 px-4 font-mono text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                          —
                        </td>
                      </tr>
                      {product.bulkPricing.map((tier, i) => (
                        <tr key={i} className="border-b border-border hover:bg-secondary/40 transition-colors">
                          <td className="py-3 px-4 font-mono text-sm">
                            {tier.minQuantity}
                            {tier.maxQuantity ? ` – ${tier.maxQuantity}` : "+"}
                          </td>
                          <td className="py-3 px-4 font-mono text-sm" style={{ color: "hsl(var(--primary))" }}>
                            {formatPrice(tier.price)}
                          </td>
                          <td
                            className="py-3 px-4 font-mono text-sm font-bold"
                            style={{ color: "hsl(var(--primary))" }}
                          >
                            {Math.round(((product.price - tier.price) / product.price) * 100)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {t.productDetail.contactBulk}
                </p>
              ))}
          </div>
        </div>
      </section>

      {/* ── IDEAL FOR / KEY FEATURES / CUSTOMIZATION ── */}
      <section className="border-b border-border py-10 md:py-14" style={{ background: "hsl(var(--secondary)/0.25)" }}>
        <div className="industrial-container" dir={isAr ? "rtl" : "ltr"}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "hsl(var(--border))" }}>
            {[
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
                items: product.customizationOptions?.length
                  ? product.customizationOptions
                  : t.productDetail.defaultCustomization,
              },
            ].map((block, i) => (
              <div
                key={i}
                className={`p-6 md:p-8 ${isAr ? "text-right" : ""}`}
                style={{ background: "hsl(var(--background))" }}
              >
                <Label text={block.title} isAr={isAr} />
                <ul className="space-y-2.5 mt-1">
                  {(block.items as string[]).map((item, j) => (
                    <li
                      key={j}
                      className={`flex items-start gap-2.5 text-sm ${isAr ? "flex-row-reverse" : ""}`}
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "hsl(var(--primary))" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div className={`flex flex-col sm:flex-row gap-3 mt-8 ${isAr ? "sm:flex-row-reverse" : ""}`}>
            <Link
              to="/contact"
              className={`inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] px-7 py-3.5 hover:opacity-90 transition-opacity ${isAr ? "flex-row-reverse" : ""}`}
            >
              <span>{t.productDetail.requestPricing}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-7 py-3.5 border border-border font-mono text-[0.65rem] uppercase tracking-[0.18em] hover:border-primary transition-colors duration-200"
              style={{ color: "hsl(var(--foreground)/0.7)" }}
            >
              {t.productDetail.contactEngineer}
            </Link>
          </div>
        </div>
      </section>

      {/* ── RELATED PRODUCTS ───────────── */}
      {relatedProducts.length > 0 && (
        <section className="bg-background border-b border-border py-10 md:py-14">
          <div className="industrial-container" dir={isAr ? "rtl" : "ltr"}>
            <div className={`flex items-center justify-between mb-8 ${isAr ? "flex-row-reverse" : ""}`}>
              <div className={isAr ? "text-right" : ""}>
                <Label text={t.productDetail.relatedProducts} isAr={isAr} />
                <h2
                  className="font-black uppercase leading-tight tracking-[-0.02em]"
                  style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", color: "hsl(var(--foreground))" }}
                >
                  {isAr ? "منتجات مشابهة" : "You Might Also Like"}
                </h2>
              </div>
              <Link
                to={`/shop?category=${product.category}`}
                className={`inline-flex items-center gap-1.5 font-mono text-[0.58rem] uppercase tracking-[0.15em] hover:text-primary transition-colors shrink-0 ${isAr ? "flex-row-reverse" : ""}`}
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {isAr ? "عرض الكل" : "View All"}
                <ArrowRight className={`w-3 h-3 ${isAr ? "rotate-180" : ""}`} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── STICKY BAR ─────────────────── */}
      <StickyAddToCart product={product} selectedVariant={selectedVariant} quantity={quantity} />
    </Layout>
  );
}
