import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
  specifications: any;
  variants: any;
  stock: number;
  status: string;
  bulk_pricing: any;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  tags: string[] | null;
  ideal_for: any;
  key_features: any;
  customization_options: any;
}

function parseSpecifications(specs: any): ProductSpecification[] {
  if (!specs) return [];
  if (Array.isArray(specs)) {
    return specs.map((s: any) => ({
      label: s.label || "",
      value: s.value || "",
    }));
  }
  return [];
}

function mapDbProductToProduct(dbProduct: DbProduct): Product {
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
    variants: Array.isArray(dbProduct.variants) ? dbProduct.variants : [],
    stock: dbProduct.stock,
    status: (dbProduct.status as "active" | "draft" | "out_of_stock") || "active",
    bulkPricing: Array.isArray(dbProduct.bulk_pricing) ? dbProduct.bulk_pricing : undefined,
    seoTitle: dbProduct.seo_title || undefined,
    seoDescription: dbProduct.seo_description || undefined,
    idealFor: Array.isArray(dbProduct.ideal_for) ? dbProduct.ideal_for : [],
    keyFeatures: Array.isArray(dbProduct.key_features) ? dbProduct.key_features : [],
    customizationOptions: Array.isArray(dbProduct.customization_options) ? dbProduct.customization_options : [],
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
