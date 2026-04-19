import { useLanguageStore } from "@/store/languageStore";
import { Product } from "@/types";

/**
 * Returns the Arabic version of a product field when the active language is `ar`
 * AND the Arabic value exists. Otherwise falls back to the base (English) field.
 *
 * Returns `null` if neither side has a usable value — callers should conditionally
 * render based on this so empty containers are never produced.
 *
 * Field name should be the camelCase Product key (e.g. "title", "description").
 * The hook will look for the corresponding `${field}Ar` key for Arabic.
 */
export function useLocalizedField() {
  const { language } = useLanguageStore();
  const isAr = language === "ar";

  function getField(product: Product | null | undefined, fieldName: keyof Product): string | null {
    if (!product) return null;
    if (isAr) {
      const arKey = `${String(fieldName)}Ar` as keyof Product;
      const arValue = product[arKey];
      if (typeof arValue === "string" && arValue.trim().length > 0) return arValue;
    }
    const enValue = product[fieldName];
    if (typeof enValue === "string" && enValue.trim().length > 0) return enValue;
    return null;
  }

  function getJsonField<T = unknown>(
    product: Product | null | undefined,
    fieldName: keyof Product,
  ): T[] {
    if (!product) return [];
    if (isAr) {
      const arKey = `${String(fieldName)}Ar` as keyof Product;
      const arValue = product[arKey];
      if (Array.isArray(arValue) && arValue.length > 0) return arValue as T[];
    }
    const enValue = product[fieldName];
    if (Array.isArray(enValue) && enValue.length > 0) return enValue as T[];
    return [];
  }

  return { getField, getJsonField, isAr };
}
