import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { useTestimonials, type Testimonial } from "@/hooks/useTestimonials";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

/** Fallback content so the section renders before the DB migration is applied. */
const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "m1",
    authorEn: "Khalid Al-Otaibi",
    authorAr: "خالد العتيبي",
    roleEn: "Operations Manager — Gulf Logistics Group",
    roleAr: "مدير العمليات — مجموعة الخليج اللوجستية",
    quoteEn: "Salada containers withstand tough daily operations, and delivery arrived right on schedule. A reliable partner for our logistics.",
    quoteAr: "حاويات صلادة تتحمّل التشغيل اليومي القاسي، والتسليم كان دقيقاً في موعده. شريك موثوق لعملياتنا اللوجستية.",
    rating: 5,
    avatarUrl: null,
  },
  {
    id: "m2",
    authorEn: "Saad Al-Qahtani",
    authorAr: "سعد القحطاني",
    roleEn: "Projects Manager — Al-Bunyan Contracting",
    roleAr: "مدير مشاريع — البنيان للمقاولات",
    quoteEn: "The on-site storage units helped us organize project sites and speed up readiness. Excellent build quality.",
    quoteAr: "وحدات التخزين الميدانية ساعدتنا على تنظيم مواقع المشاريع وتسريع الجاهزية. جودة تصنيع ممتازة.",
    rating: 5,
    avatarUrl: null,
  },
  {
    id: "m3",
    authorEn: "Eng. Noura Al-Subaie",
    authorAr: "م. نورة السبيعي",
    roleEn: "Procurement Director — Government Entity",
    roleAr: "مديرة التوريد — جهة حكومية",
    quoteEn: "Strong commitment to specifications, quality, and fast supply — with the added value of local manufacturing and national content.",
    quoteAr: "التزام قوي بالمواصفات والجودة وسرعة التوريد، مع ميزة التصنيع المحلي ودعم المحتوى الوطني.",
    rating: 5,
    avatarUrl: null,
  },
  {
    id: "m4",
    authorEn: "Fahad Al-Malki",
    authorAr: "فهد المالكي",
    roleEn: "Plant Manager — Advanced Metal Industries",
    roleAr: "مدير المصنع — صناعات المعادن المتقدمة",
    quoteEn: "Heavy-duty steel solutions well suited to our industrial environment, backed by responsive after-sales service.",
    quoteAr: "حلول معدنية شديدة التحمّل تناسب بيئتنا الصناعية، مع خدمة ما بعد البيع متجاوبة.",
    rating: 5,
    avatarUrl: null,
  },
  {
    id: "m5",
    authorEn: "Reem Al-Dosari",
    authorAr: "ريم الدوسري",
    roleEn: "Warehouse Manager — National Distribution Centers",
    roleAr: "مديرة المستودعات — مراكز التوزيع الوطنية",
    quoteEn: "Flexible container solutions improved our space utilization and inventory protection. Professional from start to finish.",
    quoteAr: "حلول حاويات مرنة حسّنت استغلال المساحات وحماية المخزون. تعامل احترافي من البداية إلى النهاية.",
    rating: 5,
    avatarUrl: null,
  },
];

const AUTOPLAY_MS = 4500;

export function Testimonials() {
  const { isRTL } = useLanguageStore();
  const isAr = isRTL();
  const { data } = useTestimonials();
  const items = data && data.length > 0 ? data : MOCK_TESTIMONIALS;

  const [api, setApi] = useState<CarouselApi>();
  const paused = useRef(false);

  // Auto-advance the slider; loop is enabled so it wraps continuously.
  useEffect(() => {
    if (!api) return;
    const id = setInterval(() => {
      if (!paused.current) api.scrollNext();
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [api]);

  return (
    <section
      className="section-pad border-b border-border"
      dir={isAr ? "rtl" : "ltr"}
      style={{ background: "hsl(var(--secondary)/0.3)" }}
    >
      <div className="industrial-container">
        {/* Heading + square slider controls */}
        <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
          <div className="min-w-0">
            <span
              className="mb-3 inline-flex items-center gap-2 uppercase text-primary"
              style={{ fontSize: "0.75rem", letterSpacing: "0.2em" }}
            >
              <span className="h-px w-4 bg-primary" />
              {isAr ? "آراء عملائنا" : "Customer Feedback"}
            </span>
            <h2
              className="font-black uppercase text-foreground"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.5rem)", letterSpacing: "-0.025em", lineHeight: 1 }}
            >
              {isAr ? "ماذا يقول عملاؤنا" : "Feedback From Our Customers"}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              aria-label={isAr ? "السابق" : "Previous"}
              onClick={() => api?.scrollPrev()}
              className="flex h-10 w-10 items-center justify-center border border-border bg-background text-foreground transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              {isAr ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
            <button
              type="button"
              aria-label={isAr ? "التالي" : "Next"}
              onClick={() => api?.scrollNext()}
              className="flex h-10 w-10 items-center justify-center border border-border bg-background text-foreground transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              {isAr ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Auto-advancing slider (pauses on hover) */}
        <Carousel
          setApi={setApi}
          opts={{ loop: true, align: "start", direction: isAr ? "rtl" : "ltr" }}
          className="relative px-1"
          onMouseEnter={() => (paused.current = true)}
          onMouseLeave={() => (paused.current = false)}
        >
          <CarouselContent className="-ml-5">
            {items.map((tItem) => {
              const author = isAr ? tItem.authorAr : tItem.authorEn;
              const role = isAr ? tItem.roleAr : tItem.roleEn;
              const initials = author
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((w) => w.charAt(0))
                .join("");
              return (
                <CarouselItem key={tItem.id} className="pl-5 sm:basis-1/2 lg:basis-1/3">
                  <div
                    className="group relative flex h-full w-full flex-col overflow-hidden border border-border bg-background p-7 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_14px_34px_-16px_rgba(0,0,0,0.18)]"
                  >
                {/* gold top accent on hover */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[2px] origin-center scale-x-0 bg-primary/70 transition-transform duration-300 group-hover:scale-x-100"
                />
                {/* large decorative quote glyph */}
                <Quote
                  aria-hidden
                  className="pointer-events-none absolute -top-1 h-16 w-16 text-primary/[0.07] ltr:right-5 rtl:left-5 rtl:-scale-x-100"
                />

                {/* stars */}
                <div className="relative mb-5 flex items-center gap-1" aria-label={`${tItem.rating} / 5`}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className="h-4 w-4 shrink-0"
                      style={{
                        color: "hsl(var(--primary))",
                        fill: s < tItem.rating ? "hsl(var(--primary))" : "transparent",
                      }}
                      aria-hidden
                    />
                  ))}
                </div>

                {/* Quote — smaller, bold, slightly muted (span escapes the global paragraph weight rules) */}
                <span
                  className="relative mb-6 block text-foreground line-clamp-4"
                  style={{ fontWeight: 400, fontSize: "1rem", lineHeight: 1.7 }}
                >
                  {isAr ? tItem.quoteAr : tItem.quoteEn}
                </span>

                {/* Author row — pinned to the card bottom (cards in a row stretch to equal height) */}
                <div className="mt-auto flex items-center gap-3 border-t border-border pt-5">
                  <div
                    aria-hidden
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm"
                    style={{ background: "hsl(var(--primary)/0.12)", color: "hsl(var(--primary))", fontWeight: 700 }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0 text-start">
                    {/* Author — Bold (span escapes the global heading/paragraph weight rules) */}
                    <span className="block truncate text-foreground" style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                      {author}
                    </span>
                    {/* Role — small, muted (caption) */}
                    {role ? (
                      <span
                        className="mt-0.5 block text-muted-foreground line-clamp-2"
                        style={{ fontWeight: 400, fontSize: "0.78rem", lineHeight: 1.5 }}
                      >
                        {role}
                      </span>
                      ) : null}
                    </div>
                  </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
