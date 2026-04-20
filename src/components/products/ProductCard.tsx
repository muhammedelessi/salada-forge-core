import { Link, useNavigate } from "react-router-dom";
import { Product } from "@/types";
import { ArrowUpRight, MessageSquare } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { useLocalizedField } from "@/hooks/useLocalizedField";
import { translations } from "@/i18n/translations";
import { cn } from "@/lib/utils";
import {
  productCardImageFrameClass,
  productCardImageImgClass,
  productThumb80CompactBoxClass,
  productThumbImgClass,
} from "@/lib/productImageFrame";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
  /** Tighter copy/padding only; image area (min-height + max-h) unchanged — for 4-column grids */
  dense?: boolean;
}

export function ProductCard({ product, variant = "default", dense = false }: ProductCardProps) {
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];
  const isAr = isRTL();
  const navigate = useNavigate();
  const { getField } = useLocalizedField();

  const localizedTitle = getField(product, "title") ?? product.title;
  const localizedDescription = getField(product, "description") ?? "";
  const tags = Array.isArray(product.tags) ? product.tags.filter((tg) => tg && tg.trim().length > 0) : [];

  /** Align category slugs with ShopPage / DB — includes singular `iso-shipping-container` for Arabic */
  const categoryTranslations: Record<string, string> = {
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

  const categoryLabel = categoryTranslations[product.category] || product.category.replace(/-/g, " ");

  const plainDescription = localizedDescription
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const contactLabel = language === "ar" ? "تواصل معنا" : "Request a Quote";
  const viewLabel = language === "ar" ? "عرض المنتج" : "View Product";

  /* ── COMPACT variant — horizontal list item ── */
  if (variant === "compact") {
    return (
      <Link
        to={`/product/${product.slug}`}
        dir={isAr ? "rtl" : "ltr"}
        className="group relative flex items-stretch overflow-hidden border border-border bg-background transition-colors duration-300 hover:border-primary hover:bg-primary/10"
      >
        {/* Fixed square image */}
        <div className={productThumb80CompactBoxClass}>
          <img
            src={product.images[0]}
            alt={localizedTitle}
            loading="lazy"
            className={cn(productThumbImgClass, "transition-transform duration-500 ease-out group-hover:scale-[1.04]")}
            style={{ filter: "grayscale(8%)" }}
          />
          {product.status === "out_of_stock" && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(8,6,2,0.55)" }}
            >
              <span className="label-text text-label-md uppercase tracking-[0.15em] text-white">
                {t.product.outOfStock}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className="flex min-w-0 flex-1 flex-col justify-center border-s border-border px-2.5 py-2 text-start"
        >
          <span
            className="mb-0.5 block text-[0.64rem] font-medium uppercase leading-tight sm:text-[0.68rem]"
            style={{ color: "hsl(var(--primary) / 0.85)", letterSpacing: "0.1em" }}
          >
            {categoryLabel}
          </span>
          <h3 className="mb-0.5 line-clamp-2 text-[0.78rem] font-bold uppercase leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary sm:text-[0.82rem]">
            {localizedTitle}
          </h3>
          {plainDescription ? (
            <p
              className="mb-0.5 line-clamp-1 text-[0.64rem] font-normal leading-snug text-muted-foreground/80 [overflow-wrap:anywhere]"
              style={{ wordBreak: "break-word" }}
            >
              {plainDescription}
            </p>
          ) : null}
          <span className="text-[0.6rem] font-medium uppercase tracking-[0.09em] text-muted-foreground/60">
            {product.sku}
          </span>
        </div>

        {/* Arrow */}
        <div className="flex shrink-0 items-center px-2">
          <ArrowUpRight
            className="h-3.5 w-3.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{ color: "hsl(var(--primary))" }}
          />
        </div>
      </Link>
    );
  }

  /* ── DEFAULT variant — dense grid: shorter image, tight copy, one-line teaser ── */
  return (
    <div
      className="group relative cursor-pointer overflow-hidden border border-border bg-background transition-colors duration-200 hover:border-primary/60 hover:bg-primary/10"
      onClick={() => navigate(`/product/${product.slug}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/product/${product.slug}`);
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={isAr ? `عرض المنتج ${localizedTitle}` : `View product ${localizedTitle}`}
    >
      {/* Image block — natural aspect ratio; contain so edges are never cropped */}
      <Link to={`/product/${product.slug}`} className="relative block overflow-hidden">
        <div className={productCardImageFrameClass}>
          <img
            src={product.images[0]}
            alt={localizedTitle}
            loading="lazy"
            className={cn(productCardImageImgClass)}
            style={{ filter: "grayscale(5%)" }}
          />
        </div>

        {/* Out of stock badge */}
        {product.status === "out_of_stock" && (
          <div
            className={cn(
              "absolute top-3 label-text text-label-md uppercase tracking-[0.2em] px-2.5 py-1 bg-destructive text-destructive-foreground",
              isAr ? "right-3" : "left-3",
            )}
          >
            {t.product.outOfStock}
          </div>
        )}

        {/* Hover overlay — two action buttons */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 flex flex-wrap items-center justify-center bg-background/88 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100",
            dense ? "gap-1.5 p-1.5 sm:gap-2" : "gap-2 p-2 sm:gap-2.5",
          )}
        >
          <Link
            to={`/inquiry/${product.slug}`}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "pointer-events-auto inline-flex items-center gap-1.5",
              dense ? "px-2 py-1.5 text-[0.58rem] tracking-[0.1em] sm:text-[0.6rem]" : "px-3 py-2 text-[0.65rem] tracking-[0.14em] sm:text-[0.68rem]",
              "bg-primary text-primary-foreground font-bold uppercase",
              "transition-opacity duration-200 hover:opacity-90",
              isAr ? "flex-row-reverse" : "",
            )}
          >
            <MessageSquare className={cn("shrink-0", dense ? "h-2.5 w-2.5" : "h-3 w-3")} />
            {contactLabel}
          </Link>
          <Link
            to={`/product/${product.slug}`}
            className={cn(
              "pointer-events-auto inline-flex items-center gap-1.5",
              dense ? "px-2 py-1.5 text-[0.56rem] tracking-[0.1em] sm:text-[0.58rem]" : "px-3 py-2 text-[0.65rem] tracking-[0.12em] sm:text-[0.68rem]",
              "border border-foreground text-foreground font-semibold uppercase",
              "transition-colors duration-200 hover:bg-foreground hover:text-background",
              isAr ? "flex-row-reverse" : "",
            )}
          >
            <ArrowUpRight className={cn("shrink-0", dense ? "h-2.5 w-2.5" : "h-3 w-3")} />
            {viewLabel}
          </Link>
        </div>
      </Link>

      {/* Card copy — logical start: RTL Arabic / LTR English (not centered) */}
      <div
        className={cn(
          "text-start",
          dense ? "px-2.5 pb-2 pt-2 sm:px-3 sm:pb-2.5 sm:pt-2.5" : "px-3 pb-3 pt-3 sm:px-4 sm:pb-3.5 sm:pt-3.5",
        )}
        dir={isAr ? "rtl" : "ltr"}
      >
        <p
          className={cn(
            "mb-1.5 w-full font-medium uppercase leading-tight",
            dense ? "text-[0.58rem] sm:text-[0.6rem]" : "text-[0.64rem] sm:text-[0.66rem]",
          )}
          style={{ color: "hsl(var(--primary) / 0.9)", letterSpacing: "0.07em" }}
        >
          {categoryLabel}
        </p>

        <Link
          to={`/product/${product.slug}`}
          className="block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1"
        >
          <h3
            className={cn(
              "w-full font-bold uppercase leading-snug tracking-tight text-foreground transition-colors duration-200 line-clamp-2 group-hover:text-primary",
              dense ? "text-[0.7rem] sm:text-[0.74rem]" : "text-[0.78rem] sm:text-[0.82rem]",
            )}
          >
            {localizedTitle}
          </h3>
        </Link>

        {tags.length > 0 ? (
          <div className={cn("flex flex-wrap gap-1", dense ? "mt-1" : "mt-1.5")}>
            {tags.slice(0, dense ? 3 : 4).map((tag) => (
              <span
                key={tag}
                className={cn(
                  "inline-flex items-center border border-border font-semibold uppercase text-muted-foreground/85",
                  dense
                    ? "px-1 py-0.5 text-[0.5rem] tracking-[0.08em]"
                    : "px-1.5 py-0.5 text-[0.55rem] tracking-[0.1em]",
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        {plainDescription ? (
          <p
            className={cn(
              "w-full font-normal leading-snug text-muted-foreground/85 line-clamp-1 [overflow-wrap:anywhere]",
              dense ? "mt-1 text-[0.6rem]" : "mt-1.5 text-[0.68rem]",
            )}
            style={{ wordBreak: "break-word" }}
          >
            {plainDescription}
          </p>
        ) : null}

        <p
          className={cn(
            "w-full font-semibold uppercase tracking-[0.09em] text-muted-foreground/65",
            dense ? "mt-1 text-[0.52rem]" : "mt-1.5 text-[0.58rem]",
          )}
          aria-label="SKU"
        >
          {product.sku}
        </p>
      </div>
    </div>
  );
}
