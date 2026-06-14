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
        "group relative cursor-pointer overflow-hidden border bg-background transition-colors duration-200",
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
          onClick={(e) => {
            if (selectable) {
              e.preventDefault();
              onToggleSelect?.(product);
            }
          }}
          tabIndex={selectable ? -1 : undefined}
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
