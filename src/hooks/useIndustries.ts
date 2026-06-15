import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Industry {
  id: string;
  slug: string;
  sortOrder: number;
  icon: string | null;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  explanationEn: string | null;
  explanationAr: string | null;
}

interface DbIndustry {
  id: string;
  slug: string;
  sort_order: number;
  icon: string | null;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  explanation_en: string | null;
  explanation_ar: string | null;
}

function mapIndustry(row: DbIndustry): Industry {
  return {
    id: row.id,
    slug: row.slug,
    sortOrder: row.sort_order,
    icon: row.icon,
    nameEn: row.name_en,
    nameAr: row.name_ar,
    descriptionEn: row.description_en,
    descriptionAr: row.description_ar,
    explanationEn: row.explanation_en,
    explanationAr: row.explanation_ar,
  };
}

/** All active industries, ordered for display. */
export function useIndustries() {
  return useQuery({
    queryKey: ["industries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("industries")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return (data as DbIndustry[]).map(mapIndustry);
    },
  });
}

/** A single industry by slug (for the detail page). */
export function useIndustry(slug: string) {
  return useQuery({
    queryKey: ["industry", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("industries").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      return data ? mapIndustry(data as DbIndustry) : null;
    },
    enabled: !!slug,
  });
}
