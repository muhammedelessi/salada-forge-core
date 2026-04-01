import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { usePageSEO } from "@/hooks/usePageSEO";
import { ProductCard } from "@/components/products/ProductCard";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { ChevronDown, Grid, List, SlidersHorizontal, X, Loader2, ArrowRight } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { translations } from "@/i18n/translations";
import { Link } from "react-router-dom";
import heroPort from "@/assets/hero-port.webp";

type SortOption = "featured" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

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

export default function ShopPage() {
  const seo = usePageSEO("/products");
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];
  const isAr = isRTL();

  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const activeCategory = searchParams.get("category") || "";
  const searchQuery = searchParams.get("q") || "";
  const priceRange = searchParams.get("price") || "";

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
    new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const priceRanges = [
    { id: "under-500", label: `${t.shop.under} ${formatPrice(500)}`, min: 0, max: 500 },
    { id: "500-2000", label: `${formatPrice(500)} - ${formatPrice(2000)}`, min: 500, max: 2000 },
    { id: "2000-5000", label: `${formatPrice(2000)} - ${formatPrice(5000)}`, min: 2000, max: 5000 },
    { id: "5000-10000", label: `${formatPrice(5000)} - ${formatPrice(10000)}`, min: 5000, max: 10000 },
    { id: "over-10000", label: `${t.shop.over} ${formatPrice(10000)}`, min: 10000, max: Infinity },
  ];

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (activeCategory) filtered = filtered.filter((p) => p.category === activeCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q),
      );
    }
    if (priceRange) {
      const range = priceRanges.find((r) => r.id === priceRange);
      if (range) filtered = filtered.filter((p) => p.price >= range.min && p.price < range.max);
    }
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }
    return filtered;
  }, [products, activeCategory, searchQuery, sortBy, priceRange]);

  const handleCategoryChange = (id: string) => {
    if (id) {
      searchParams.set("category", id);
    } else {
      searchParams.delete("category");
    }
    setSearchParams(searchParams);
  };

  const handlePriceRangeChange = (id: string) => {
    if (id && id !== priceRange) {
      searchParams.set("price", id);
    } else {
      searchParams.delete("price");
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => setSearchParams({});

  const isLoading = productsLoading || categoriesLoading;
  const activeCount = [activeCategory, priceRange].filter(Boolean).length;

  const pageTitle = activeCategory
    ? categoryTranslations[activeCategory] || activeCategory.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : t.shop.allProducts;

  return (
    <Layout>
      <SEOHead {...seo} />

      {/* ── HERO ───────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: "220px" }}>
        <div className="absolute inset-0">
          <img
            src={heroPort}
            alt={t.shop.catalog}
            className="w-full h-full object-cover object-center"
            style={{ filter: "grayscale(18%) brightness(0.42)" }}
          />
          <div className="absolute inset-0" style={{ background: "rgba(8,6,2,0.6)" }} />
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
          className="industrial-container relative z-10 flex flex-col justify-center py-10 md:py-12"
          dir={isAr ? "rtl" : "ltr"}
          style={{ minHeight: "220px" }}
        >
          <div className="max-w-xl">
            {/* breadcrumb */}
            <nav className="flex items-center gap-1.5 mb-4">
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
                {t.nav.shop}
              </span>
            </nav>

            <Label text={t.shop.catalog} isAr={isAr} />

            <h1
              className="font-black uppercase leading-[0.93] tracking-[-0.025em] mb-2"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.4rem)", color: "#fff" }}
            >
              {pageTitle}
            </h1>

            {/* product count */}
            <div className="flex items-center gap-3 flex-wrap">
              {isLoading ? (
                <span
                  className="inline-flex items-center gap-2 text-[0.75rem]"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {isAr ? "جاري التحميل..." : "Loading..."}
                </span>
              ) : (
                <span
                  className="font-mono text-[0.62rem] uppercase tracking-[0.15em]"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {filteredProducts.length} {t.shop.products}
                </span>
              )}
              {activeCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 font-mono text-[0.58rem] uppercase tracking-[0.15em] transition-colors hover:opacity-80"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {t.shop.clearFilters}
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN LAYOUT ────────────────── */}
      <div className="industrial-container py-8" dir={isAr ? "rtl" : "ltr"}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── SIDEBAR ── */}
          <aside className="hidden lg:block flex-shrink-0" style={{ width: "220px" }}>
            <div className="sticky top-24">
              {/* Categories */}
              <p
                className="font-mono text-[0.55rem] uppercase tracking-[0.22em] mb-3 pb-2 border-b border-border"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {t.shop.categories}
              </p>
              <ul className="space-y-0.5 mb-6">
                <li>
                  <button
                    onClick={() => handleCategoryChange("")}
                    className="w-full text-start py-2 px-3 text-[0.78rem] font-medium transition-colors duration-150"
                    style={{
                      background: !activeCategory ? "hsl(var(--primary)/0.08)" : "transparent",
                      color: !activeCategory ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                      borderInlineStart: !activeCategory ? "2px solid hsl(var(--primary))" : "2px solid transparent",
                    }}
                  >
                    {t.shop.allProducts}
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategoryChange(cat.id)}
                      className="w-full text-start py-2 px-3 text-[0.78rem] transition-colors duration-150 flex items-center justify-between"
                      style={{
                        background: activeCategory === cat.id ? "hsl(var(--primary)/0.08)" : "transparent",
                        color: activeCategory === cat.id ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                        borderInlineStart:
                          activeCategory === cat.id ? "2px solid hsl(var(--primary))" : "2px solid transparent",
                      }}
                    >
                      <span className="truncate">{categoryTranslations[cat.id] || cat.name}</span>
                      <span
                        className="font-mono text-[0.52rem] shrink-0 ms-2"
                        style={{ color: "hsl(var(--muted-foreground)/0.6)" }}
                      >
                        {cat.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Price Range */}
              <p
                className="font-mono text-[0.55rem] uppercase tracking-[0.22em] mb-3 pb-2 border-b border-border"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {t.shop.priceRange}
              </p>
              <ul className="space-y-0.5">
                {priceRanges.map((range) => (
                  <li key={range.id}>
                    <button
                      onClick={() => handlePriceRangeChange(range.id)}
                      className="w-full text-start py-2 px-3 text-[0.78rem] transition-colors duration-150"
                      style={{
                        background: priceRange === range.id ? "hsl(var(--primary)/0.08)" : "transparent",
                        color: priceRange === range.id ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                        borderInlineStart:
                          priceRange === range.id ? "2px solid hsl(var(--primary))" : "2px solid transparent",
                      }}
                    >
                      {range.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6 pb-5 border-b border-border">
              {/* mobile filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.15em] border border-border px-3 py-2 hover:border-primary transition-colors"
                style={{ color: "hsl(var(--foreground)/0.7)" }}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {t.shop.filters}
                {activeCount > 0 && (
                  <span
                    className="w-4 h-4 rounded-full text-[0.5rem] font-bold flex items-center justify-center"
                    style={{ background: "hsl(var(--primary))", color: "#fff" }}
                  >
                    {activeCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-3 ms-auto">
                {/* sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="appearance-none border border-border bg-background px-4 py-2 pe-9 font-mono text-[0.62rem] uppercase tracking-[0.12em] focus:outline-none focus:border-primary transition-colors"
                    style={{ color: "hsl(var(--foreground)/0.7)" }}
                  >
                    <option value="featured">{t.shop.featured}</option>
                    <option value="name-asc">{t.shop.nameAZ}</option>
                    <option value="name-desc">{t.shop.nameZA}</option>
                  </select>
                  <ChevronDown
                    className="absolute end-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  />
                </div>

                {/* view toggle */}
                <div className="hidden sm:flex items-center border border-border">
                  <button
                    onClick={() => setViewMode("grid")}
                    className="p-2 transition-colors"
                    style={{ background: viewMode === "grid" ? "hsl(var(--primary))" : "transparent" }}
                  >
                    <Grid
                      className="w-3.5 h-3.5"
                      style={{ color: viewMode === "grid" ? "#fff" : "hsl(var(--muted-foreground))" }}
                    />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className="p-2 transition-colors"
                    style={{ background: viewMode === "list" ? "hsl(var(--primary))" : "transparent" }}
                  >
                    <List
                      className="w-3.5 h-3.5"
                      style={{ color: viewMode === "list" ? "#fff" : "hsl(var(--muted-foreground))" }}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile filters drawer */}
            {showFilters && (
              <div
                className="lg:hidden mb-6 p-4 border border-border"
                style={{ background: "hsl(var(--secondary)/0.4)" }}
              >
                <p
                  className="font-mono text-[0.55rem] uppercase tracking-[0.22em] mb-3"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {t.shop.categories}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => {
                      handleCategoryChange("");
                      setShowFilters(false);
                    }}
                    className="px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.12em] border transition-colors"
                    style={{
                      background: !activeCategory ? "hsl(var(--primary))" : "transparent",
                      color: !activeCategory ? "#fff" : "hsl(var(--foreground)/0.7)",
                      borderColor: !activeCategory ? "hsl(var(--primary))" : "hsl(var(--border))",
                    }}
                  >
                    {isAr ? "الكل" : "All"}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        handleCategoryChange(cat.id);
                        setShowFilters(false);
                      }}
                      className="px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.12em] border transition-colors"
                      style={{
                        background: activeCategory === cat.id ? "hsl(var(--primary))" : "transparent",
                        color: activeCategory === cat.id ? "#fff" : "hsl(var(--foreground)/0.7)",
                        borderColor: activeCategory === cat.id ? "hsl(var(--primary))" : "hsl(var(--border))",
                      }}
                    >
                      {categoryTranslations[cat.id] || cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Products */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-7 h-7 animate-spin" style={{ color: "hsl(var(--primary))" }} />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" : "flex flex-col gap-4"
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant={viewMode === "list" ? "compact" : "default"}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-sm mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {t.shop.noProducts}
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] px-5 py-2.5 hover:opacity-90 transition-opacity"
                >
                  {t.shop.clearFilters}
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
