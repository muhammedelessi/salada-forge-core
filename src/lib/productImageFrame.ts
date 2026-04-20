/**
 * Unified product image frames: fixed outer size/ratio + object-contain so pixels are not cropped.
 * Tailwind classes are spelled in full so JIT picks them up from this file.
 */

/** Default ProductCard — same width and height ratio for every card */
export const productCardImageFrameClass =
  "relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-transparent p-1.5 sm:p-2";

export const productCardImageImgClass =
  "h-full w-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]";

/** 80×80px thumb — cart, checkout, orders, drawer */
export const productThumb80BoxClass =
  "relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden bg-muted";

/** 80×80px on ProductCard compact — transparent well */
export const productThumb80CompactBoxClass =
  "relative flex h-20 w-20 shrink-0 items-center justify-center self-center overflow-hidden bg-transparent p-1";

export const productThumbImgClass = "max-h-full max-w-full object-contain object-center";
