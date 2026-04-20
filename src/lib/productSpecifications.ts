import type { Language } from "@/i18n/translations";
import type { Product, ProductSpecification, ProductSpecificationsJson } from "@/types";

function isNonEmptyRawObject(raw: ProductSpecificationsJson | null | undefined): boolean {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return false;
  return Object.keys(raw).length > 0;
}

const STRUCTURED_GROUP_KEYS = ["external", "internal", "door", "capacity"] as const;

function isNonEmptyStringLeaf(v: unknown): boolean {
  if (v == null) return false;
  if (typeof v === "string") return v.trim() !== "";
  return true;
}

/** For each key, use Arabic leaf if non-empty string, else English (covers partial AR objects). */
function mergeLeafRecordsPreferAr(
  arLeaves: Record<string, unknown>,
  enLeaves: Record<string, unknown>,
): Record<string, unknown> {
  const keys = new Set([...Object.keys(enLeaves), ...Object.keys(arLeaves)]);
  const out: Record<string, unknown> = {};
  for (const k of keys) {
    const a = arLeaves[k];
    const e = enLeaves[k];
    out[k] = isNonEmptyStringLeaf(a) ? a : e;
  }
  return out;
}

/**
 * Merge English nested tree with Arabic: structured groups get field-wise Arabic preference;
 * other top-level keys (material, type, …) copied from Arabic when present.
 */
function mergeStructuredSpecsPreferAr(
  en: ProductSpecificationsJson | null | undefined,
  ar: ProductSpecificationsJson | null | undefined,
): ProductSpecificationsJson | null {
  if (!ar || typeof ar !== "object" || Array.isArray(ar) || Object.keys(ar).length === 0) {
    return en ?? null;
  }
  if (!en || typeof en !== "object" || Array.isArray(en)) {
    return ar;
  }

  const out: ProductSpecificationsJson = { ...en };

  for (const g of STRUCTURED_GROUP_KEYS) {
    const aG = ar[g];
    const eG = en[g];
    if (aG != null && typeof aG === "object" && !Array.isArray(aG)) {
      if (eG != null && typeof eG === "object" && !Array.isArray(eG)) {
        out[g] = mergeLeafRecordsPreferAr(aG as Record<string, unknown>, eG as Record<string, unknown>) as unknown;
      } else {
        out[g] = aG;
      }
    }
  }

  for (const k of Object.keys(ar)) {
    if ((STRUCTURED_GROUP_KEYS as readonly string[]).includes(k)) continue;
    const v = ar[k];
    if (v !== undefined && v !== null && isNonEmptyStringLeaf(v)) {
      out[k] = v;
    }
  }

  return out;
}

/**
 * Flat array from `specifications_ar` when Arabic and non-empty; otherwise `specifications` (English).
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
 * Nested JSON for grouped specs UI.
 *
 * When Arabic is selected: use `rawSpecifications_ar` if it is a non-empty object.
 * If Arabic JSON is only a **flat array** (common when `specifications` is nested in EN
 * but `specifications_ar` was saved as `[{ label, value }]`), return `null` so the
 * product page falls back to `getLocalizedProductSpecifications` (Arabic array rows)
 * instead of showing English nested values.
 */
export function getLocalizedRawSpecifications(
  product: Product,
  language: Language,
): ProductSpecificationsJson | null {
  const enRaw = product.rawSpecifications ?? null;

  if (language !== "ar") {
    return enRaw;
  }

  const arRaw = product.rawSpecificationsAr ?? null;

  if (isNonEmptyRawObject(arRaw)) {
    return mergeStructuredSpecsPreferAr(enRaw, arRaw) ?? arRaw;
  }

  const arFlat = product.specificationsAr ?? [];
  if (arFlat.length > 0) {
    return null;
  }

  return enRaw;
}
