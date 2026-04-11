import { useState, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { usePageSEO } from "@/hooks/usePageSEO";
import { ProductCard } from "@/components/products/ProductCard";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { ChevronDown, Grid, List, X, Loader2, Search, SlidersHorizontal } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { translations } from "@/i18n/translations";
import { Link } from "react-router-dom";
import heroPort from "@/assets/hero-port.webp";

type SortOption = "featured" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

export default function ShopPage() {
  const seo = usePageSEO("/products");
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) return "list";
    return "grid";
  });
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];
  const isAr = isRTL();

  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const activeCategory = searchParams.get("category") || "";
  const searchQuery    = searchParams.get("q") || "";
  const priceRange     = searchParams.get("price") || "";

  const categoryTranslations: Record<string, string> = {
    "shipping-containers":     t.categories.shippingContainers,
    "storage-tanks":           t.categories.storageTanks,
    "ibc-containers":          t.categories.ibcContainers,
    "specialty-containers":    t.categories.specialtyContainers,
    "drums-barrels":           t.categories.drumsBarrels,
    "modular-buildings":       t.categories.modularBuildings,
    "spare-parts":             t.categories.spareParts        || (isAr ? "قطع الغيار"         : "Spare Parts"),
    "lashing-equipment":       t.categories.lashingEquipment  || (isAr ? "معدات الربط"        : "Lashing Equipment"),
    "iso-shipping-container":  t.categories.isoShipping       || (isAr ? "حاويات شحن ISO"     : "ISO Shipping Container"),
    "iso-shipping-containers": t.categories.isoShipping       || (isAr ? "حاويات شحن ISO"     : "ISO Shipping Containers"),
    "land-shipping-container":  t.categories.landShipping      || (isAr ? "حاويات الشحن البري" : "Land Shipping Container"),
    "land-shipping-containers": t.categories.landShipping       || (isAr ? "حاويات الشحن البري" : "Land Shipping Containers"),
    "storage-containers":      t.categories.storageContainers || (isAr ? "حاويات التخزين"     : "Storage Containers"),
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat(isAr ? "ar-SA" : "en-US", {
      style: "currency", currency: "SAR",
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(price);

  const priceRanges = [
    { id: "under-500",   label: `${t.shop.under} ${formatPrice(500)}`,               min: 0,     max: 500      },
    { id: "500-2000",    label: `${formatPrice(500)} - ${formatPrice(2000)}`,         min: 500,   max: 2000     },
    { id: "2000-5000",   label: `${formatPrice(2000)} - ${formatPrice(5000)}`,        min: 2000,  max: 5000     },
    { id: "5000-10000",  label: `${formatPrice(5000)} - ${formatPrice(10000)}`,       min: 5000,  max: 10000    },
    { id: "over-10000",  label: `${t.shop.over} ${formatPrice(10000)}`,               min: 10000, max: Infinity },
  ];

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (activeCategory) filtered = filtered.filter((p) => p.category === activeCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
      );
    }
    if (priceRange) {
      const range = priceRanges.find((r) => r.id === priceRange);
      if (range) filtered = filtered.filter((p) => p.price >= range.min && p.price < range.max);
    }
    switch (sortBy) {
      case "price-asc":  filtered.sort((a, b) => a.price - b.price); break;
      case "price-desc": filtered.sort((a, b) => b.price - a.price); break;
      case "name-asc":   filtered.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "name-desc":  filtered.sort((a, b) => b.title.localeCompare(a.title)); break;
    }
    return filtered;
  }, [products, activeCategory, searchQuery, sortBy, priceRange]);

  const handleCategoryChange = (id: string) => {
    if (id) searchParams.set("category", id);
    else searchParams.delete("category");
    setSearchParams(searchParams);
    // Scroll to first product (below sticky header + filter bar)
    setTimeout(() => {
      if (productsRef.current) {
        const top = productsRef.current.getBoundingClientRect().top + window.scrollY - 180;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }
    }, 50);
  };

  const handlePriceRangeChange = (id: string) => {
    if (id && id !== priceRange) searchParams.set("price", id);
    else searchParams.delete("price");
    setSearchParams(searchParams);
    setShowPriceFilter(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) searchParams.set("q", searchInput.trim());
    else searchParams.delete("q");
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearchParams({});
  };

  const isLoading  = productsLoading || categoriesLoading;
  const activeCount = [activeCategory, priceRange, searchQuery].filter(Boolean).length;

  const pageTitle = activeCategory
    ? categoryTranslations[activeCategory] || activeCategory.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : t.shop.allProducts;

  const activePriceLabel = priceRanges.find((r) => r.id === priceRange)?.label;

  return (
    <Layout>
      <SEOHead {...seo} />

      {/* ── HERO — same typography shell as About / Why Salada ── */}
      <section className="relative overflow-hidden" style={{ minHeight: "260px" }}>
        <div className="absolute inset-0">
          <img
            src={heroPort}
            alt={t.shop.catalog}
            width={1920}
            height={1080}
            className="w-full h-full object-cover object-center max-w-full"
            style={{ filter: "grayscale(18%) brightness(0.48)" }}
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

        <div className="industrial-container relative z-10 flex flex-col justify-center py-10 md:py-14" style={{ minHeight: "260px" }}>
          <div className={`max-w-xl ${isAr ? "text-right ml-auto mr-0" : ""}`}>
            <nav className={`page-hero-breadcrumb flex items-center gap-1.5 mb-4 ${isAr ? "flex-row-reverse justify-end" : ""}`}>
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
                {t.nav.shop}
              </span>
            </nav>

            <h1 className="hero-title-primary font-black uppercase leading-[0.93] tracking-[-0.025em] mb-3 animate-fade-up delay-200">
              {pageTitle}
            </h1>

            <p
              className="hero-subtitle leading-relaxed animate-fade-up delay-300 mb-0"
              style={{ color: "rgba(255,255,255,0.45)", maxWidth: "36rem" }}
            >
              {t.shop.introP1}
            </p>

            <div
              className={`mt-3 flex flex-wrap items-center gap-3 leading-[1.65] text-base font-normal animate-fade-up delay-300 ${
                isAr ? "justify-end" : ""
              }`}
              style={{ color: "rgba(255,255,255,0.45)", maxWidth: "36rem" }}
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin" />
                  {isAr ? "جاري التحميل..." : "Loading..."}
                </span>
              ) : (
                <span>
                  {filteredProducts.length} {t.shop.products}
                </span>
              )}
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 uppercase tracking-[0.12em] underline-offset-2 hover:underline"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {t.shop.clearFilters}
                  <X className="w-3 h-3 shrink-0" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          STICKY FILTER BAR — categories + price + search
          ════════════════════════════════════════ */}
      <div className="sticky z-30 border-b border-border shadow-sm"
        style={{ top: "64px", background: "hsl(var(--background))" }}>

        {/* ROW 1 — Search + Price + Sort + View — all same height */}
        <div className="industrial-container py-2.5 border-b border-border" dir={isAr ? "rtl" : "ltr"}>
          <div className="flex items-center gap-2">

            {/* Search */}
            <form onSubmit={handleSearch} className="relative flex-1 max-w-xs">
              <input type="text" value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={isAr ? "ابحث عن منتج..." : "Search products..."}
                className="w-full border border-border bg-background px-3 py-2 pe-9 focus:outline-none focus:border-primary transition-colors"
                style={{ color: "hsl(var(--foreground))", fontSize: "0.95rem", height: "40px" }} />
              <button type="submit" className="absolute end-2.5 top-1/2 -translate-y-1/2">
                <Search className="w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
              </button>
            </form>

            {/* Price filter dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPriceFilter(!showPriceFilter)}
                className="inline-flex items-center gap-1.5 border border-border px-3 transition-colors hover:border-primary"
                style={{
                  color: priceRange ? "hsl(var(--primary))" : "hsl(var(--foreground)/0.7)",
                  borderColor: priceRange ? "hsl(var(--primary))" : undefined,
                  background: priceRange ? "hsl(var(--primary)/0.06)" : "transparent",
                  fontSize: "0.95rem",
                  height: "40px",
                  minWidth: "9.5rem",
                }}>
                <SlidersHorizontal className="w-4 h-4 shrink-0" />
                <span className="truncate">
                  {activePriceLabel || (isAr ? "نطاق السعر" : "Price Range")}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ms-auto ${showPriceFilter ? "rotate-180" : ""}`} />
              </button>

              {showPriceFilter && (
                <div className="absolute top-full mt-1 border border-border shadow-lg z-50 min-w-[210px]"
                  style={{ background: "hsl(var(--background))", insetInlineStart: 0 }}>
                  {priceRanges.map((range) => (
                    <button key={range.id} onClick={() => handlePriceRangeChange(range.id)}
                      className="w-full px-4 py-2.5 text-start transition-colors hover:bg-primary/5"
                      style={{
                        color: priceRange === range.id ? "hsl(var(--primary))" : "hsl(var(--foreground)/0.8)",
                        background: priceRange === range.id ? "hsl(var(--primary)/0.08)" : "transparent",
                        fontWeight: priceRange === range.id ? 600 : 400,
                        fontSize: "0.95rem",
                      }}>
                      {range.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none border border-border bg-background px-3 pe-8 focus:outline-none focus:border-primary transition-colors"
                style={{
                  color: "hsl(var(--foreground)/0.7)",
                  fontSize: "0.95rem",
                  height: "40px",
                  minWidth: "8rem",
                }}>
                <option value="featured">{t.shop.featured}</option>
                <option value="name-asc">{t.shop.nameAZ}</option>
                <option value="name-desc">{t.shop.nameZA}</option>
              </select>
              <ChevronDown className="absolute end-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                style={{ color: "hsl(var(--muted-foreground))" }} />
            </div>

            {/* Clear filters */}
            {activeCount > 0 && (
              <button onClick={clearFilters}
                className="inline-flex items-center gap-1.5 border border-border px-3 transition-colors hover:border-primary"
                style={{ color: "hsl(var(--primary))", fontSize: "0.95rem", height: "40px" }}>
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">{t.shop.clearFilters}</span>
              </button>
            )}

            {/* View toggle */}
            <div className="ms-auto flex items-center border border-border shrink-0" style={{ height: "40px" }}>
              <button onClick={() => setViewMode("grid")} className="px-2.5 h-full transition-colors"
                style={{ background: viewMode === "grid" ? "hsl(var(--primary))" : "transparent" }}>
                <Grid className="w-4 h-4"
                  style={{ color: viewMode === "grid" ? "#fff" : "hsl(var(--muted-foreground))" }} />
              </button>
              <button onClick={() => setViewMode("list")} className="px-2.5 h-full transition-colors"
                style={{ background: viewMode === "list" ? "hsl(var(--primary))" : "transparent" }}>
                <List className="w-4 h-4"
                  style={{ color: viewMode === "list" ? "#fff" : "hsl(var(--muted-foreground))" }} />
              </button>
            </div>
          </div>
        </div>

        {/* ROW 2 — Category tabs (horizontal scroll) */}
        <div className="overflow-x-auto scrollbar-none" dir={isAr ? "rtl" : "ltr"}>
          <div className="industrial-container">
            <div className="flex items-stretch gap-0 min-w-max">

              {/* All */}
              <button onClick={() => handleCategoryChange("")}
                className="px-4 py-3 font-medium whitespace-nowrap border-b-2 transition-colors duration-150 shrink-0"
                style={{
                  fontSize: "0.95rem",
                  borderColor: !activeCategory ? "hsl(var(--primary))" : "transparent",
                  color: !activeCategory ? "hsl(var(--primary))" : "hsl(var(--foreground)/0.65)",
                }}>
                {t.shop.allProducts}
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  type="button"
                  className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 font-medium transition-colors duration-150"
                  style={{
                    fontSize: "0.95rem",
                    borderColor: activeCategory === cat.id ? "hsl(var(--primary))" : "transparent",
                    color: activeCategory === cat.id ? "hsl(var(--primary))" : "hsl(var(--foreground)/0.65)",
                  }}
                >
                  <span className="min-w-0" dir="auto">
                    {categoryTranslations[cat.id] || cat.name}
                  </span>
                  <span
                    className="inline-flex shrink-0 select-none tabular-nums rounded px-1.5 py-0.5 text-[0.75rem] leading-none [unicode-bidi:isolate]"
                    dir="ltr"
                    style={{
                      color: "hsl(var(--muted-foreground)/0.75)",
                      background: "hsl(var(--muted) / 0.35)",
                    }}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── PRODUCTS GRID ── */}
      <div ref={productsRef} className="industrial-container py-6 md:py-8" dir={isAr ? "rtl" : "ltr"}>

        {/* Count */}
        <div className="flex items-center mb-5">
          <span style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.95rem" }}>
            {filteredProducts.length} {t.shop.products}
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin" style={{ color: "hsl(var(--primary))" }} />
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            {/* Desktop */}
            <div className="hidden lg:block">
              <div className={viewMode === "grid" ? "grid grid-cols-2 xl:grid-cols-3 gap-4" : "flex flex-col gap-3"}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product}
                    variant={viewMode === "list" ? "compact" : "default"} />
                ))}
              </div>
            </div>
            {/* Mobile */}
            <div className="flex flex-col gap-3 lg:hidden">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} variant="compact" />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>
              {t.shop.noProducts}
            </p>
            <button onClick={clearFilters} className="btn-primary">
              {t.shop.clearFilters}
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}