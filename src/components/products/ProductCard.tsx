import { Link, useNavigate } from "react-router-dom";
import { Product } from "@/types";
import { ArrowUpRight, Check } from "lucide-react";
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
  /** Selection mode — clicking the card toggles selection instead of navigating. */
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: (product: Product) => void;
}

export function ProductCard({
  product,
  variant = "default",
  dense = false,
  selectable = false,
  selected = false,
  onToggleSelect,
}: ProductCardProps) {
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];
  const isAr = isRTL();
  const navigate = useNavigate();
  const { getField } = useLocalizedField();

  const localizedTitle = getField(product, "title") ?? product.title;
  const localizedDescription = getField(product, "description") ?? "";

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

  /* ── COMPACT variant — horizontal list item (also used as small selectable row) ── */
  if (variant === "compact") {
    const compactClass = cn(
      "group relative flex items-stretch overflow-hidden border bg-background transition-colors duration-300",
      selectable && selected
        ? "border-primary ring-2 ring-primary/60 bg-primary/10"
        : "border-border hover:border-primary hover:bg-primary/10",
      selectable && "cursor-pointer",
    );

    // Selectable rows (used in the quote drawer) get a larger product image.
    const compactImageBoxClass = selectable
      ? "relative flex h-28 w-28 shrink-0 items-center justify-center self-center overflow-hidden bg-transparent p-1.5"
      : productThumb80CompactBoxClass;

    const compactInner = (
      <>
        {/* Fixed square image */}
        <div className={compactImageBoxClass}>
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
        <div className="flex min-w-0 flex-1 flex-col justify-center border-s border-border px-2.5 py-2 text-start">
          <span
            className="mb-0.5 block text-[0.64rem] font-medium uppercase leading-tight sm:text-[0.68rem]"
            style={{ color: "hsl(var(--primary) / 0.85)", letterSpacing: "0.1em" }}
          >
            {categoryLabel}
          </span>
          {selectable ? (
            /* span (not h3) so global heading !important sizes don't apply — large, prominent title */
            <span className="mb-0.5 line-clamp-1 block text-base font-bold uppercase leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
              {localizedTitle}
            </span>
          ) : (
            <h3 className="mb-0.5 line-clamp-2 text-[0.78rem] font-bold uppercase leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary sm:text-[0.82rem]">
              {localizedTitle}
            </h3>
          )}
          {/* Description hidden on selectable (drawer) cards */}
          {plainDescription && !selectable ? (
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
          {selectable && (
            <Link
              to={`/product/${product.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="mt-1.5 inline-flex w-fit items-center gap-1 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-primary hover:underline"
            >
              {isAr ? "عرض تفاصيل المنتج" : "View product details"}
              <ArrowUpRight className="h-3 w-3 shrink-0" />
            </Link>
          )}
        </div>

        {/* Trailing icon — selection check (selectable) or navigation arrow */}
        <div className="flex shrink-0 items-center px-2">
          {selectable ? (
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
                selected ? "border-primary bg-primary text-primary-foreground" : "border-foreground/30 bg-background",
              )}
            >
              {selected && <Check className="h-3 w-3" />}
            </span>
          ) : (
            <ArrowUpRight
              className="h-3.5 w-3.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{ color: "hsl(var(--primary))" }}
            />
          )}
        </div>
      </>
    );

    if (selectable) {
      return (
        <div
          dir={isAr ? "rtl" : "ltr"}
          role="button"
          aria-pressed={selected}
          tabIndex={0}
          onClick={() => onToggleSelect?.(product)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggleSelect?.(product);
            }
          }}
          aria-label={isAr ? `تحديد المنتج ${localizedTitle}` : `Select product ${localizedTitle}`}
          className={compactClass}
        >
          {compactInner}
        </div>
      );
    }

    return (
      <Link to={`/product/${product.slug}`} dir={isAr ? "rtl" : "ltr"} className={compactClass}>
        {compactInner}
      </Link>
    );
  }

  /* ── DEFAULT variant — dense grid: shorter image, tight copy, one-line teaser ── */
  const handleActivate = () => {
    if (selectable) onToggleSelect?.(product);
    else navigate(`/product/${product.slug}`);
  };

  return (
    <div
      className={cn(
        "group relative flex h-full cursor-pointer flex-col overflow-hidden border bg-background transition-colors duration-200",
        selectable && selected
          ? "border-primary ring-2 ring-primary/70 bg-primary/10"
          : "border-border hover:border-primary/60 hover:bg-primary/10",
      )}
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleActivate();
        }
      }}
      role={selectable ? "button" : "link"}
      aria-pressed={selectable ? selected : undefined}
      tabIndex={0}
      aria-label={
        selectable
          ? isAr
            ? `تحديد المنتج ${localizedTitle}`
            : `Select product ${localizedTitle}`
          : isAr
            ? `عرض المنتج ${localizedTitle}`
            : `View product ${localizedTitle}`
      }
    >
      {/* Selection indicator */}
      {selectable && (
        <div
          className={cn(
            "pointer-events-none absolute top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors",
            isAr ? "left-2" : "right-2",
            selected ? "border-primary bg-primary text-primary-foreground" : "border-foreground/30 bg-background/80",
          )}
        >
          {selected && <Check className="h-3.5 w-3.5" />}
        </div>
      )}

      {/* Image block — natural aspect ratio; contain so edges are never cropped */}
      <Link
        to={`/product/${product.slug}`}
        className="relative block overflow-hidden"
        onClick={(e) => {
          if (selectable) {
            e.preventDefault();
            onToggleSelect?.(product);
          }
        }}
        tabIndex={selectable ? -1 : undefined}
      >
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

      </Link>

      {/* Card copy — logical start: RTL Arabic / LTR English (not centered) */}
      <div
        className={cn(
          "flex flex-1 flex-col text-start",
          dense ? "px-2.5 pb-2 pt-2 sm:px-3 sm:pb-2.5 sm:pt-2.5" : "px-3 pb-3 pt-3 sm:px-4 sm:pb-3.5 sm:pt-3.5",
        )}
        dir={isAr ? "rtl" : "ltr"}
      >
        <span
          className={cn(
            "block w-full uppercase leading-tight",
            dense ? "text-[0.92rem] sm:text-[0.98rem]" : "text-[1rem] sm:text-[1.06rem]",
          )}
          style={{ color: "hsl(var(--primary) / 0.9)", letterSpacing: "0.08em", fontWeight: 700 }}
        >
          {categoryLabel}
        </span>

        <Link
          to={`/product/${product.slug}`}
          className="mt-2 block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1"
          onClick={(e) => {
            if (selectable) {
              e.preventDefault();
              onToggleSelect?.(product);
            }
          }}
          tabIndex={selectable ? -1 : undefined}
        >
          {/* span (not h3) so the global heading !important sizes don't enlarge it */}
          <span
            className={cn(
              "block w-full font-bold uppercase tracking-[0.01em] text-foreground transition-colors duration-200 line-clamp-2 group-hover:text-primary",
              dense ? "text-[0.92rem] sm:text-[0.98rem]" : "text-[1rem] sm:text-[1.06rem]",
            )}
            style={{ lineHeight: 1.4, fontWeight: 700 }}
          >
            {localizedTitle}
          </span>
        </Link>

        {/* Bottom row — SKU + Get Quote, pinned to the card bottom */}
        <div className={cn("mt-auto flex items-center justify-between gap-2", dense ? "pt-3" : "pt-3.5")}>
          <span
            className={cn(
              "min-w-0 truncate uppercase tracking-[0.09em] text-muted-foreground/80",
              dense ? "text-[0.62rem]" : "text-[0.68rem]",
            )}
            style={{ fontWeight: 700 }}
            aria-label="SKU"
          >
            {product.sku}
          </span>
          <Link
            to={`/contact?type=quote&product=${product.id}`}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "shrink-0 inline-flex items-center gap-1.5 bg-primary font-bold uppercase tracking-[0.08em] text-primary-foreground transition-opacity duration-200 hover:opacity-90",
              dense ? "px-3 py-1.5 text-[0.62rem]" : "px-3.5 py-2 text-[0.66rem]",
              isAr ? "flex-row-reverse" : "",
            )}
          >
            {isAr ? "اطلب عرض سعر" : "Get Quote"}
            <ArrowUpRight className="h-3 w-3 shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}
