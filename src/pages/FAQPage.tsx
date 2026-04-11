import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { usePageSEO } from "@/hooks/usePageSEO";
import { SEOHead } from "@/components/SEOHead";
import { ChevronDown, Search, ArrowRight, X } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { translations } from "@/i18n/translations";
import heroPort from "@/assets/hero-port.webp";

export default function FAQPage() {
  const seo = usePageSEO("/faq");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { language } = useLanguageStore();
  const t = translations[language];
  const isAr = language === "ar";

  // ── FAQ data ──────────────────────────────────────────────────────
  const faqsEn = [
    {
      category: "Orders & Shipping",
      items: [
        {
          q: "What are your shipping options?",
          a: "We offer multiple shipping options including ground freight, rail transport, and ocean freight for international orders. Free shipping is available for orders over 37,500 SAR within Saudi Arabia. Delivery times vary based on location and product availability.",
        },
        {
          q: "How long does delivery take?",
          a: "Standard delivery within Saudi Arabia typically takes 3–7 business days. International orders may take 2–6 weeks depending on destination and shipping method. Expedited shipping is available for urgent orders at additional cost.",
        },
        {
          q: "Do you ship internationally?",
          a: "Yes, we ship to over 120 countries worldwide. International shipping rates are calculated at checkout based on destination, weight, and dimensions. We handle all customs documentation for hassle-free delivery.",
        },
        {
          q: "Can I track my order?",
          a: "Once your order ships, you'll receive a tracking number via email. You can also track your order through our website or by contacting our customer service team.",
        },
      ],
    },
    {
      category: "Products & Quality",
      items: [
        {
          q: "Are your containers certified?",
          a: "Yes, all our containers meet international standards. Our shipping containers are ISO certified, offshore containers are DNV 2.7-1 certified, and all products comply with relevant industry regulations. Certification documents are provided with each purchase.",
        },
        {
          q: "What materials are your containers made from?",
          a: "Our shipping containers are primarily made from Corten steel, known for its exceptional weathering properties. Storage tanks use 304 or 316 stainless steel. IBC containers feature HDPE inner bottles with steel cage frames.",
        },
        {
          q: "Do you offer customization?",
          a: "Yes, we offer extensive customization options including custom paint colors, modifications for doors/windows, insulation, electrical wiring, HVAC systems, and more. Contact our sales team to discuss your specific requirements.",
        },
        {
          q: "What warranty do you offer?",
          a: "We provide a 2-year standard warranty covering manufacturing defects. Extended warranty options are available. Warranty terms vary by product type — please refer to product specifications or contact us for details.",
        },
      ],
    },
    {
      category: "Pricing & Payments",
      items: [
        {
          q: "Do you offer bulk discounts?",
          a: "Yes, we offer tiered bulk pricing on most products. Discounts start at quantities of 5+ units with increasing savings for larger orders. Volume pricing is displayed on product pages where applicable.",
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards (Visa, MasterCard, mada), bank wire transfers, and company purchase orders for approved accounts. Payment terms of Net 30 are available for qualifying business customers.",
        },
        {
          q: "Can I get a custom quote?",
          a: "For large orders, custom configurations, or special requirements, contact our sales team for a personalized quote. We typically respond within 24 business hours.",
        },
      ],
    },
    {
      category: "Returns & Support",
      items: [
        {
          q: "What is your return policy?",
          a: "We offer a 30-day return policy for unused products in original condition. Custom or modified containers are non-returnable. Return shipping costs are the responsibility of the customer unless the return is due to our error.",
        },
        {
          q: "How do I report a problem with my order?",
          a: "Contact our customer service team immediately at Hello@salada.sa or call 050 016 5914. Please have your order number ready and provide photos of any damage or issues. We aim to resolve all concerns within 48 hours.",
        },
        {
          q: "Do you offer technical support?",
          a: "Yes, our technical team is available to assist with installation, maintenance, and operational questions. We provide documentation with all products and offer on-site support for complex installations at additional cost.",
        },
      ],
    },
  ];

  const faqsAr = [
    {
      category: "الطلبات والشحن",
      items: [
        {
          q: "ما هي خيارات الشحن المتاحة لديكم؟",
          a: "نوفر خيارات شحن متعددة تشمل الشحن البري والنقل بالسكك الحديدية والشحن البحري للطلبات الدولية. الشحن مجاني للطلبات التي تتجاوز 37,500 ريال سعودي داخل المملكة العربية السعودية.",
        },
        {
          q: "كم تستغرق مدة التوصيل؟",
          a: "التوصيل القياسي داخل المملكة يستغرق عادة من 3 إلى 7 أيام عمل. الطلبات الدولية قد تستغرق من 2 إلى 6 أسابيع حسب الوجهة وطريقة الشحن.",
        },
        {
          q: "هل تشحنون دولياً؟",
          a: "نعم، نشحن إلى أكثر من 120 دولة حول العالم. يتم احتساب أسعار الشحن الدولي عند إتمام الطلب بناءً على الوجهة والوزن والأبعاد.",
        },
        {
          q: "هل يمكنني تتبع طلبي؟",
          a: "بمجرد شحن طلبك ستتلقى رقم التتبع عبر البريد الإلكتروني. يمكنك أيضاً تتبع طلبك من خلال موقعنا أو بالتواصل مع فريق خدمة العملاء.",
        },
      ],
    },
    {
      category: "المنتجات والجودة",
      items: [
        {
          q: "هل حاوياتكم معتمدة؟",
          a: "نعم، جميع حاوياتنا تستوفي المعايير الدولية. حاويات الشحن حاصلة على شهادة ISO، وحاويات العمليات البحرية حاصلة على شهادة DNV 2.7-1.",
        },
        {
          q: "ما هي المواد المصنوعة منها حاوياتكم؟",
          a: "حاويات الشحن مصنوعة من فولاذ كورتن. خزانات التخزين تستخدم الفولاذ المقاوم للصدأ 304 أو 316. حاويات IBC تتميز بزجاجات داخلية من HDPE مع هياكل أقفاص فولاذية.",
        },
        {
          q: "هل تقدمون خيارات التخصيص؟",
          a: "نعم، نقدم خيارات تخصيص واسعة تشمل ألوان الطلاء المخصصة وتعديلات الأبواب والنوافذ والعزل الحراري والتمديدات الكهربائية وأنظمة التكييف والمزيد.",
        },
        {
          q: "ما هو الضمان الذي تقدمونه؟",
          a: "نقدم ضماناً قياسياً لمدة سنتين يغطي عيوب التصنيع. تتوفر خيارات الضمان الممتد. تختلف شروط الضمان حسب نوع المنتج.",
        },
      ],
    },
    {
      category: "الأسعار والدفع",
      items: [
        {
          q: "هل تقدمون خصومات على الكميات؟",
          a: "نعم، نقدم أسعاراً متدرجة للكميات الكبيرة على معظم المنتجات. تبدأ الخصومات من كميات 5+ وحدات مع توفير متزايد للطلبات الأكبر.",
        },
        {
          q: "ما هي طرق الدفع المقبولة؟",
          a: "نقبل جميع بطاقات الائتمان الرئيسية (فيزا، ماستركارد، مدى)، والتحويلات البنكية، وأوامر الشراء للشركات للحسابات المعتمدة.",
        },
        {
          q: "هل يمكنني الحصول على عرض سعر مخصص؟",
          a: "بالتأكيد! للطلبات الكبيرة أو التكوينات المخصصة، تواصل مع فريق المبيعات للحصول على عرض سعر مخصص. نستجيب عادة خلال 24 ساعة عمل.",
        },
      ],
    },
    {
      category: "الإرجاع والدعم",
      items: [
        {
          q: "ما هي سياسة الإرجاع لديكم؟",
          a: "نقدم سياسة إرجاع لمدة 30 يوماً للمنتجات غير المستخدمة بحالتها الأصلية. الحاويات المخصصة أو المعدلة غير قابلة للإرجاع.",
        },
        {
          q: "كيف أبلغ عن مشكلة في طلبي؟",
          a: "تواصل مع فريق خدمة العملاء فوراً على Hello@salada.sa أو اتصل على 050 016 5914. نهدف إلى حل جميع المخاوف خلال 48 ساعة.",
        },
        {
          q: "هل تقدمون الدعم الفني؟",
          a: "نعم، فريقنا الفني متاح للمساعدة في أسئلة التركيب والصيانة والتشغيل. نوفر الوثائق مع جميع المنتجات ونقدم الدعم في الموقع للتركيبات المعقدة.",
        },
      ],
    },
  ];

  const faqs = isAr ? faqsAr : faqsEn;

  const ui = {
    label: isAr ? "مركز المساعدة" : "Help Center",
    title: isAr ? "الأسئلة الشائعة" : "Frequently Asked Questions",
    description: isAr
      ? "اعثر على إجابات للأسئلة الشائعة حول منتجاتنا والشحن والخدمات."
      : "Find answers to common questions about our products, shipping, and services.",
    placeholder: isAr ? "ابحث في الأسئلة..." : "Search questions...",
    noResults: isAr ? "لا توجد نتائج لـ" : "No results for",
    clear: isAr ? "مسح البحث" : "Clear search",
    ctaTitle: isAr ? "لا تزال لديك أسئلة؟" : "Still have questions?",
    ctaDesc: isAr
      ? "فريقنا هنا للمساعدة. سنرد خلال 24 ساعة."
      : "Our team is here to help. We'll get back to you within 24 hours.",
    ctaBtn: isAr ? "تواصل مع الدعم" : "Contact Support",
  };

  // ── Filter ────────────────────────────────────────────────────────
  const filtered = faqs
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  // flat global index for accordion
  let gIdx = 0;

  return (
    <Layout>
      <SEOHead {...seo} />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: "240px" }} dir={isAr ? "rtl" : "ltr"}>
        <div className="absolute inset-0">
          <img
            src={heroPort}
            alt="FAQ"
            className="w-full h-full object-cover object-center"
            style={{ filter: "grayscale(18%) brightness(0.45)" }}
          />
          <div className="absolute inset-0" style={{ background: "rgba(8,6,2,0.6)" }} />
          <div
            className="absolute bottom-0 inset-x-0"
            style={{
              height: "1.5px",
              background:
                "linear-gradient(to right, transparent, hsl(var(--primary)/0.45) 25%, hsl(var(--primary)/0.45) 75%, transparent)",
            }}
          />
        </div>

        <div
          className="industrial-container relative z-10 flex flex-col justify-center py-10 md:py-14"
          style={{ minHeight: "240px" }}
        >
          <div className="max-w-2xl">
            {/* breadcrumb */}
            <nav className="page-hero-breadcrumb flex items-center gap-1.5 mb-4">
              <Link
                to="/"
                className="hero-crumb label-text text-label-md uppercase tracking-[0.18em]"
                style={{ color: "rgba(255,255,255,0.32)" }}
              >
                {isAr ? "الرئيسية" : "Home"}
              </Link>
              <span style={{ color: "rgba(255,255,255,0.18)" }}>/</span>
              <span
                className="hero-crumb label-text text-label-md uppercase tracking-[0.18em]"
                style={{ color: "hsl(var(--primary))" }}
              >
                {isAr ? "الأسئلة الشائعة" : "FAQ"}
              </span>
            </nav>

            {/* eyebrow */}
            <div className="flex items-center gap-2.5 mb-3">
              <span
                style={{
                  width: "1.2rem",
                  height: "1.5px",
                  background: "hsl(var(--primary)/0.7)",
                  display: "block",
                  flexShrink: 0,
                }}
              />
              <span
                className="label-text text-label-md uppercase tracking-[0.25em] font-bold"
                style={{ color: "hsl(var(--primary))" }}
              >
                {ui.label}
              </span>
            </div>

            <h1
              className="font-black uppercase leading-[0.93] tracking-[-0.025em] mb-3 text-white"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.4rem)" }}
            >
              {ui.title}
            </h1>

            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
              {ui.description}
            </p>

            {/* Search bar */}
            <div className="relative max-w-lg">
              <Search
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  left: isAr ? "auto" : "1rem",
                  right: isAr ? "1rem" : "auto",
                }}
              />
              <input
                type="text"
                placeholder={ui.placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border text-white text-sm py-3 focus:outline-none transition-colors placeholder:text-white/30 backdrop-blur-sm"
                style={{
                  borderColor: "rgba(255,255,255,0.2)",
                  paddingLeft: isAr ? "1rem" : "2.75rem",
                  paddingRight: isAr ? "2.75rem" : "1rem",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "hsl(var(--primary)/0.7)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
                  style={{
                    left: isAr ? "0.75rem" : "auto",
                    right: isAr ? "auto" : "0.75rem",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ CONTENT ──────────────────────────────── */}
      <section className="bg-background border-b border-border py-10 md:py-14" dir={isAr ? "rtl" : "ltr"}>
        <div className="industrial-container">
          <div className="max-w-3xl mx-auto">
            {filtered.length > 0 ? (
              filtered.map((cat) => (
                <div key={cat.category} className="mb-10 last:mb-0">
                  {/* Category heading */}
                  <div className="flex items-center gap-3 mb-5 pb-3 border-b border-border">
                    <span
                      style={{
                        width: "1.2rem",
                        height: "1.5px",
                        background: "hsl(var(--primary)/0.6)",
                        display: "block",
                        flexShrink: 0,
                      }}
                    />
                    <h2
                      className="label-text text-[0.65rem] uppercase tracking-[0.22em] font-bold"
                      style={{ color: "hsl(var(--primary))" }}
                    >
                      {cat.category}
                    </h2>
                  </div>

                  {/* Accordion items */}
                  <div className="space-y-px" style={{ background: "hsl(var(--border))" }}>
                    {cat.items.map((item) => {
                      const idx = gIdx++;
                      const open = openIndex === idx;
                      return (
                        <div key={item.q} className="bg-background">
                          <button
                            onClick={() => setOpenIndex(open ? null : idx)}
                            className="w-full flex items-start justify-between gap-4 px-5 py-4 text-start transition-colors duration-150 hover:bg-secondary/40"
                          >
                            <span
                              className={`text-sm font-semibold leading-snug transition-colors duration-200 ${open ? "text-primary" : "text-foreground"}`}
                            >
                              {item.q}
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 shrink-0 mt-0.5 transition-transform duration-300 ${open ? "rotate-180 text-primary" : "text-muted-foreground"}`}
                            />
                          </button>

                          {/* Answer */}
                          <div
                            className="overflow-hidden transition-all duration-300"
                            style={{ maxHeight: open ? "500px" : "0", opacity: open ? 1 : 0 }}
                          >
                            <div className="px-5 pb-5 pt-0">
                              {/* gold accent line */}
                              <div
                                className="h-px mb-3"
                                style={{ width: "2rem", background: "hsl(var(--primary)/0.4)" }}
                              />
                              <p className="text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <p
                  className="label-text text-[0.65rem] uppercase tracking-[0.2em] mb-3"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {ui.noResults} "{searchQuery}"
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="btn-primary rtl:flex-row-reverse"
                >
                  {ui.clear}
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="relative py-14 md:py-20 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
        <div className="absolute inset-0">
          <img
            src={heroPort}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover"
            style={{ filter: "grayscale(25%) brightness(0.35)" }}
          />
          <div className="absolute inset-0" style={{ background: "rgba(8,6,2,0.82)" }} />
        </div>

        <div className="industrial-container relative z-10">
          <div className="max-w-xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span
                style={{ width: "1.2rem", height: "1.5px", background: "hsl(var(--primary)/0.65)", display: "block" }}
              />
              <span
                className="label-text text-label-md hero-eyebrow-primary uppercase tracking-[0.25em]"
                style={{ color: "hsl(var(--primary))" }}
              >
                {isAr ? "تواصل معنا" : "Get in Touch"}
              </span>
              <span
                style={{ width: "1.2rem", height: "1.5px", background: "hsl(var(--primary)/0.65)", display: "block" }}
              />
            </div>

            <h2
              className="font-black uppercase leading-tight tracking-[-0.025em] mb-3 text-white"
              style={{ fontSize: "clamp(1.3rem, 3vw, 2rem)" }}
            >
              {ui.ctaTitle}
            </h2>

            <p className="text-sm leading-relaxed mb-7" style={{ color: "rgba(255,255,255,0.42)" }}>
              {ui.ctaDesc}
            </p>

            <Link
              to="/contact"
              className="btn-primary rtl:flex-row-reverse"
              style={{ minHeight: "44px" }}
            >
              {ui.ctaBtn}
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
