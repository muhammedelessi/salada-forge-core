import { Link } from "react-router-dom";
import { Product } from "@/types";
import { ArrowUpRight, MessageSquare } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { translations } from "@/i18n/translations";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
}

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];
  const isAr = isRTL();

  const categoryTranslations: Record<string, string> = {
    "shipping-containers": t.categories.shippingContainers,
    "storage-tanks": t.categories.storageTanks,
    "ibc-containers": t.categories.ibcContainers,
    "specialty-containers": t.categories.specialtyContainers,
    "drums-barrels": t.categories.drumsBarrels,
    "modular-buildings": t.categories.modularBuildings,
    "spare-parts": language === "ar" ? "قطع الغيار" : "Spare Parts",
    "lashing-equipment": language === "ar" ? "معدات الربط" : "Lashing Equipment",
    "iso-shipping-containers": language === "ar" ? "حاويات ISO" : "ISO Containers",
    "storage-containers": language === "ar" ? "حاويات التخزين" : "Storage Containers",
  };

  const categoryLabel = categoryTranslations[product.category] || product.category.replace(/-/g, " ");

  const contactLabel = language === "ar" ? "تواصل معنا" : "Request a Quote";
  const viewLabel = language === "ar" ? "عرض المنتج" : "View Product";

  /* ── COMPACT variant ── */
  if (variant === "compact") {
    return (
      <Link
        to={`/product/${product.slug}`}
        className="group block border border-border bg-background hover:border-primary transition-colors duration-300"
      >
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-secondary">
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            style={{ filter: "grayscale(8%)" }}
          />
        </div>

        {/* Content */}
        <div className={`p-4 ${isAr ? "text-right" : ""}`}>
          <span className="block font-mono text-[0.55rem] uppercase tracking-[0.22em] text-primary/60 mb-1.5">
            {categoryLabel}
          </span>
          <h3 className="text-sm font-bold uppercase tracking-tight leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-200">
            {product.title}
          </h3>
          <span
            className={`inline-flex items-center gap-1.5 mt-3 font-mono text-[0.55rem] uppercase tracking-[0.18em] text-primary/70 ${isAr ? "flex-row-reverse" : ""}`}
          >
            {contactLabel}
            <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </Link>
    );
  }

  /* ── DEFAULT variant ── */
  return (
    <div className="group border border-border bg-background transition-all duration-300 hover:border-primary">
      {/* Image block */}
      <Link to={`/product/${product.slug}`} className="block relative overflow-hidden">
        <div className="aspect-[4/3] bg-secondary overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-600 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
            style={{ filter: "grayscale(10%)", transition: "transform .6s cubic-bezier(.16,1,.3,1), filter .6s ease" }}
          />
        </div>

        {/* Gold accent bar — slides in from left on hover */}
        <div
          className="absolute bottom-0 h-px bg-primary transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
          style={{ width: "0", left: isAr ? "auto" : 0, right: isAr ? 0 : "auto" }}
          ref={(el) => {
            if (!el) return;
            const card = el.closest(".group")!;
            card.addEventListener("mouseenter", () => {
              el.style.width = "100%";
            });
            card.addEventListener("mouseleave", () => {
              el.style.width = "0";
            });
          }}
        />

        {/* Out of stock badge */}
        {product.status === "out_of_stock" && (
          <div
            className={cn(
              "absolute top-3 font-mono text-[0.55rem] uppercase tracking-[0.2em] px-2.5 py-1 bg-destructive text-destructive-foreground",
              isAr ? "right-3" : "left-3",
            )}
          >
            {t.product.outOfStock}
          </div>
        )}

        {/* Hover overlay — two action buttons */}
        <div
          className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: "hsl(var(--background)/0.82)" }}
        >
          <Link
            to={`/inquiry/${product.slug}`}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "pointer-events-auto inline-flex items-center gap-2 px-4 py-2.5",
              "bg-primary text-primary-foreground",
              "font-mono text-[0.55rem] uppercase tracking-[0.18em] font-700",
              "transition-all duration-200 hover:opacity-90",
              isAr ? "flex-row-reverse" : "",
            )}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            {contactLabel}
          </Link>
          <Link
            to={`/product/${product.slug}`}
            className={cn(
              "pointer-events-auto inline-flex items-center gap-2 px-4 py-2.5",
              "border border-foreground text-foreground",
              "font-mono text-[0.55rem] uppercase tracking-[0.18em]",
              "transition-all duration-200 hover:bg-foreground hover:text-background",
              isAr ? "flex-row-reverse" : "",
            )}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            {viewLabel}
          </Link>
        </div>
      </Link>

      {/* Card content */}
      <div className={`p-5 ${isAr ? "text-right" : ""}`}>
        {/* Category + SKU row */}
        <div className={`flex items-center justify-between mb-2 ${isAr ? "flex-row-reverse" : ""}`}>
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.22em] text-primary/60">{categoryLabel}</span>
          <span className="font-mono text-[0.5rem] uppercase tracking-[0.15em] text-muted-foreground/50">
            {product.sku}
          </span>
        </div>

        {/* Title */}
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-sm font-black uppercase tracking-tight leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-200 mb-4">
            {product.title}
          </h3>
        </Link>

        {/* Divider */}
        <div className="h-px bg-border mb-4" />

        {/* CTA row */}
        <div className={`flex items-center justify-between ${isAr ? "flex-row-reverse" : ""}`}>
          <Link
            to={`/inquiry/${product.slug}`}
            className={cn(
              "inline-flex items-center gap-1.5",
              "font-mono text-[0.6rem] uppercase tracking-[0.18em] font-700",
              "text-primary hover:text-foreground transition-colors duration-200",
              isAr ? "flex-row-reverse" : "",
            )}
          >
            <MessageSquare className="w-3 h-3" />
            {contactLabel}
          </Link>

          <Link
            to={`/product/${product.slug}`}
            className={cn(
              "inline-flex items-center gap-1",
              "font-mono text-[0.55rem] uppercase tracking-[0.15em]",
              "text-muted-foreground hover:text-primary transition-colors duration-200",
              isAr ? "flex-row-reverse" : "",
            )}
          >
            {viewLabel}
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
