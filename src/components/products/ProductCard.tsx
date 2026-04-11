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

  const plainDescription = (product.description ?? "")
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
        className="group flex items-stretch border border-border bg-background hover:border-primary transition-colors duration-300"
      >
        {/* Fixed square image */}
        <div
          className="relative shrink-0 overflow-hidden bg-secondary"
          style={{ width: "80px", minWidth: "80px", height: "80px" }}
        >
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            className="h-full w-full !object-cover object-center transition-transform duration-500 group-hover:scale-[1.05]"
            style={{ objectFit: "cover", objectPosition: "center", filter: "grayscale(8%)" }}
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
            {product.title}
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
    <div className="group border border-border bg-background transition-colors duration-200 hover:border-primary/50">
      {/* Image block — aspect 5:3; image always fills frame (cover, not contain) */}
      <Link to={`/product/${product.slug}`} className="relative block overflow-hidden">
        <div className="overflow-hidden bg-secondary dark:bg-secondary/80" style={{ aspectRatio: "5 / 3" }}>
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            className="h-full w-full min-h-0 !object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.02]"
            style={{ objectFit: "cover", objectPosition: "center", filter: "grayscale(5%)" }}
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
        <div className="pointer-events-none absolute inset-0 flex flex-wrap items-center justify-center gap-2 bg-background/88 p-2 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100 sm:gap-2.5">
          <Link
            to={`/inquiry/${product.slug}`}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "pointer-events-auto inline-flex items-center gap-1.5 px-3 py-2",
              "bg-primary text-primary-foreground",
              "text-[0.65rem] font-bold uppercase tracking-[0.14em] sm:text-[0.68rem]",
              "transition-opacity duration-200 hover:opacity-90",
              isAr ? "flex-row-reverse" : "",
            )}
          >
            <MessageSquare className="h-3 w-3 shrink-0" />
            {contactLabel}
          </Link>
          <Link
            to={`/product/${product.slug}`}
            className={cn(
              "pointer-events-auto inline-flex items-center gap-1.5 px-3 py-2",
              "border border-foreground text-foreground",
              "text-[0.65rem] font-semibold uppercase tracking-[0.12em] sm:text-[0.68rem]",
              "transition-colors duration-200 hover:bg-foreground hover:text-background",
              isAr ? "flex-row-reverse" : "",
            )}
          >
            <ArrowUpRight className="h-3 w-3 shrink-0" />
            {viewLabel}
          </Link>
        </div>
      </Link>

      {/* Card copy — logical start: RTL Arabic / LTR English (not centered) */}
      <div className="px-3 pb-3 pt-3 text-start sm:px-4 sm:pb-3.5 sm:pt-3.5" dir={isAr ? "rtl" : "ltr"}>
        <p
          className="mb-1.5 w-full text-[0.64rem] font-medium uppercase leading-tight sm:text-[0.66rem]"
          style={{ color: "hsl(var(--primary) / 0.9)", letterSpacing: "0.07em" }}
        >
          {categoryLabel}
        </p>

        <Link
          to={`/product/${product.slug}`}
          className="block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1"
        >
          <h3 className="w-full text-[0.78rem] font-bold uppercase leading-snug tracking-tight text-foreground transition-colors duration-200 line-clamp-2 group-hover:text-primary sm:text-[0.82rem]">
            {product.title}
          </h3>
        </Link>

        {plainDescription ? (
          <p
            className="mt-1.5 w-full text-[0.68rem] font-normal leading-snug text-muted-foreground/85 line-clamp-1 [overflow-wrap:anywhere]"
            style={{ wordBreak: "break-word" }}
          >
            {plainDescription}
          </p>
        ) : null}

        <p
          className="mt-1.5 w-full text-[0.58rem] font-semibold uppercase tracking-[0.09em] text-muted-foreground/65"
          aria-label="SKU"
        >
          {product.sku}
        </p>
      </div>
    </div>
  );
}
