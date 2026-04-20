import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { Product, ProductSpecification } from "@/types";

interface DbProduct {
  id: string;
  title: string;
  sku: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category: string;
  subcategory: string | null;
  images: string[] | null;
  specifications: Json | null;
  /** Present when the column exists in Supabase. */
  specifications_ar?: Json | null;
  variants: Json | null;
  stock: number;
  status: string;
  bulk_pricing: Json | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  tags: string[] | null;
  ideal_for: Json | null;
  key_features: Json | null;
  customization_options: Json | null;
  customization_options_ar?: Json | null;
  title_ar: string | null;
  description_ar: string | null;
  seo_title_ar: string | null;
  seo_description_ar: string | null;
  ideal_for_ar: Json | null;
  key_features_ar: Json | null;
  material: string | null;
  weight: number | null;
}

function isSpecRecord(x: unknown): x is { label?: unknown; value?: unknown } {
  return typeof x === "object" && x !== null;
}

function parseSpecifications(specs: Json | null): ProductSpecification[] {
  if (!specs || !Array.isArray(specs)) return [];
  return specs.map((item) => {
    if (!isSpecRecord(item)) return { label: "", value: "" };
    return {
      label: typeof item.label === "string" ? item.label : "",
      value: typeof item.value === "string" ? item.value : "",
    };
  });
}

/** When `specifications` / `specifications_ar` is a nested object (not an array). */
function parseRawSpecifications(specs: Json | null): Record<string, unknown> | null {
  if (!specs || typeof specs !== "object" || Array.isArray(specs)) return null;
  return specs as Record<string, unknown>;
}

function mapDbProductToProduct(dbProduct: DbProduct): Product {
  const specsAr = dbProduct.specifications_ar ?? null;
  return {
    id: dbProduct.id,
    title: dbProduct.title,
    sku: dbProduct.sku,
    slug: dbProduct.slug,
    description: dbProduct.description || "",
    price: Number(dbProduct.price),
    compareAtPrice: dbProduct.compare_at_price ? Number(dbProduct.compare_at_price) : undefined,
    category: dbProduct.category,
    subcategory: dbProduct.subcategory || undefined,
    images: dbProduct.images || ["/placeholder.svg"],
    specifications: parseSpecifications(dbProduct.specifications),
    rawSpecifications: parseRawSpecifications(dbProduct.specifications),
    specificationsAr: parseSpecifications(specsAr),
    rawSpecificationsAr: parseRawSpecifications(specsAr),
    variants: (Array.isArray(dbProduct.variants) ? dbProduct.variants : []) as unknown as Product["variants"],
    stock: dbProduct.stock,
    status: (dbProduct.status as "active" | "draft" | "out_of_stock") || "active",
    bulkPricing: (Array.isArray(dbProduct.bulk_pricing) ? dbProduct.bulk_pricing : undefined) as unknown as Product["bulkPricing"],
    seoTitle: dbProduct.seo_title || undefined,
    seoDescription: dbProduct.seo_description || undefined,
    idealFor: (Array.isArray(dbProduct.ideal_for) ? dbProduct.ideal_for : []) as string[],
    keyFeatures: (Array.isArray(dbProduct.key_features) ? dbProduct.key_features : []) as string[],
    customizationOptions: (Array.isArray(dbProduct.customization_options) ? dbProduct.customization_options : []) as string[],
    titleAr: dbProduct.title_ar || undefined,
    descriptionAr: dbProduct.description_ar || undefined,
    seoTitleAr: dbProduct.seo_title_ar || undefined,
    seoDescriptionAr: dbProduct.seo_description_ar || undefined,
    idealForAr: (Array.isArray(dbProduct.ideal_for_ar) ? (dbProduct.ideal_for_ar as string[]) : undefined),
    keyFeaturesAr: (Array.isArray(dbProduct.key_features_ar) ? (dbProduct.key_features_ar as string[]) : undefined),
    tags: Array.isArray(dbProduct.tags) ? dbProduct.tags : undefined,
    material: dbProduct.material || undefined,
    weight: dbProduct.weight != null ? Number(dbProduct.weight) : undefined,
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at,
  };
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      return (data as DbProduct[]).map(mapDbProductToProduct);
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();

      if (error) {
        console.error("Error fetching product:", error);
        throw error;
      }

      if (!data) return null;

      return mapDbProductToProduct(data as DbProduct);
    },
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("category").eq("status", "active");

      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }

      // Count products per category
      const categoryCounts: Record<string, number> = {};
      data?.forEach((p) => {
        const cat = p.category;
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });

      // Defined sort order
      const categoryOrder = [
        "storage-containers",
        "land-shipping-container",
        "iso-shipping-container",
        "lashing-equipment",
        "spare-parts",
      ];

      // Convert to array and sort by defined order
      const allCategories = Object.entries(categoryCounts).map(([id, count]) => ({
        id,
        name: id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        count,
      }));

      // Sort: known categories first (in order), then any others alphabetically
      return allCategories.sort((a, b) => {
        const aIdx = categoryOrder.indexOf(a.id);
        const bIdx = categoryOrder.indexOf(b.id);
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
        if (aIdx !== -1) return -1;
        if (bIdx !== -1) return 1;
        return a.name.localeCompare(b.name);
      });
    },
  });
}
