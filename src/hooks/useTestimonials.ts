import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Testimonial {
  id: string;
  authorEn: string;
  authorAr: string;
  roleEn: string | null;
  roleAr: string | null;
  quoteEn: string;
  quoteAr: string;
  rating: number;
  avatarUrl: string | null;
}

interface DbTestimonial {
  id: string;
  author_en: string;
  author_ar: string;
  role_en: string | null;
  role_ar: string | null;
  quote_en: string;
  quote_ar: string;
  rating: number;
  avatar_url: string | null;
}

function mapTestimonial(row: DbTestimonial): Testimonial {
  return {
    id: row.id,
    authorEn: row.author_en,
    authorAr: row.author_ar,
    roleEn: row.role_en,
    roleAr: row.role_ar,
    quoteEn: row.quote_en,
    quoteAr: row.quote_ar,
    rating: row.rating,
    avatarUrl: row.avatar_url,
  };
}

/** Active customer testimonials, ordered for display. */
export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return (data as DbTestimonial[]).map(mapTestimonial);
    },
  });
}
