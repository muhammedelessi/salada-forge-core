import type { Language } from "@/i18n/translations";
import type { Product, ProductSpecification } from "@/types";

function isNonEmptyRawObject(raw: Record<string, unknown> | null | undefined): boolean {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return false;
  return Object.keys(raw).length > 0;
}

/**
 * Returns Arabic specs when `language === "ar"` and `specificationsAr` is non-empty;
 * otherwise English `specifications`.
 */
export function getLocalizedProductSpecifications(
  product: Product,
  language: Language,
): ProductSpecification[] {
  const en = product.specifications;
  const ar = product.specificationsAr ?? [];
  if (language === "ar" && ar.length > 0) return ar;
  return en;
}

/**
 * Nested specs object from `specifications_ar` when Arabic and non-empty;
 * otherwise English `rawSpecifications`.
 */
export function getLocalizedRawSpecifications(
  product: Product,
  language: Language,
): Record<string, unknown> | null {
  if (language === "ar" && isNonEmptyRawObject(product.rawSpecificationsAr ?? null)) {
    return product.rawSpecificationsAr ?? null;
  }
  return product.rawSpecifications ?? null;
}
