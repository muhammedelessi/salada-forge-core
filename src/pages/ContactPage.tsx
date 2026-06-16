import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { usePageSEO } from "@/hooks/usePageSEO";
import { Mail, Phone, MapPin, Clock, Send, ArrowRight, Search, Plus } from "lucide-react";
import { toast } from "sonner";
import { useLanguageStore } from "@/store/languageStore";
import { translations } from "@/i18n/translations";
import { supabase } from "@/integrations/supabase/client";
import { Link, useSearchParams } from "react-router-dom";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { PageHero } from "@/components/PageHero";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ProductCard } from "@/components/products/ProductCard";
import { cn } from "@/lib/utils";
import { FormField, fieldShell, inputHeight, textareaMin } from "@/components/forms/ContactFormFields";

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <span
        className="block shrink-0"
        style={{ width: "1.25rem", height: "1.5px", background: "hsl(var(--primary)/0.65)" }}
      />
      <span className="label-text text-label-md uppercase tracking-[0.25em]" style={{ color: "hsl(var(--primary))" }}>
        {text}
      </span>
    </div>
  );
}

interface QuoteFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
}

interface QuoteDraft {
  formData?: Partial<QuoteFormData>;
  selectedProductIds?: string[];
  productNotListed?: boolean;
  customProduct?: { name: string; description: string };
}

/** Persist the in-progress quote/contact form so it survives an accidental tab close. */
const QUOTE_DRAFT_KEY = "salada:quote-draft";

function loadQuoteDraft(): QuoteDraft | null {
  try {
    const raw = localStorage.getItem(QUOTE_DRAFT_KEY);
    return raw ? (JSON.parse(raw) as QuoteDraft) : null;
  } catch {
    return null;
  }
}

function clearQuoteDraft() {
  try {
    localStorage.removeItem(QUOTE_DRAFT_KEY);
  } catch {
    /* ignore storage errors */
  }
}

export default function ContactPage() {
  const seo = usePageSEO("/contact");
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];
  const isAr = isRTL();
  const dir = isAr ? "rtl" : "ltr";

  const [searchParams] = useSearchParams();
  const arrivedForQuote = searchParams.get("type") === "quote";

  const { data: products } = useProducts();
  const { data: categories = [] } = useCategories();

  // Same category labels as the Shop page.
  const categoryTranslations: Record<string, string> = {
    "shipping-containers": t.categories.shippingContainers,
    "storage-tanks": t.categories.storageTanks,
    "ibc-containers": t.categories.ibcContainers,
    "specialty-containers": t.categories.specialtyContainers,
    "drums-barrels": t.categories.drumsBarrels,
    "modular-buildings": t.categories.modularBuildings,
    "spare-parts": t.categories.spareParts || (isAr ? "قطع الغيار" : "Spare Parts"),
    "lashing-equipment": t.categories.lashingEquipment || (isAr ? "معدات الربط" : "Lashing Equipment"),
    "iso-shipping-container": t.categories.isoShipping || (isAr ? "حاويات الشحن" : "Shipping Container"),
    "iso-shipping-containers": t.categories.isoShipping || (isAr ? "حاويات الشحن" : "Shipping Containers"),
    "land-shipping-container": t.categories.landShipping || (isAr ? "حاويات الشحن البري" : "Land Shipping Container"),
    "land-shipping-containers": t.categories.landShipping || (isAr ? "حاويات الشحن البري" : "Land Shipping Containers"),
    "storage-containers": t.categories.storageContainers || (isAr ? "حاويات التخزين" : "Storage Containers"),
  };

  // Restore any draft saved before the user left the site (loaded once).
  const [initialDraft] = useState(loadQuoteDraft);

  const [formData, setFormData] = useState<QuoteFormData>(() => ({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: arrivedForQuote ? "quote" : "",
    message: "",
    ...(initialDraft?.formData || {}),
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* quote-specific state */
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(() => {
    const ids = new Set(initialDraft?.selectedProductIds || []);
    const preselected = searchParams.get("product");
    if (preselected) ids.add(preselected);
    return Array.from(ids);
  });
  const [productNotListed, setProductNotListed] = useState<boolean>(() => initialDraft?.productNotListed ?? false);
  const [customProduct, setCustomProduct] = useState<{ name: string; description: string }>(
    () => initialDraft?.customProduct || { name: "", description: "" },
  );
  const [productDrawerOpen, setProductDrawerOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [drawerCategory, setDrawerCategory] = useState("");
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  const formSectionRef = useRef<HTMLElement>(null);

  const isQuote = arrivedForQuote || formData.subject === "quote";

  const productTitle = (p: { title: string; titleAr?: string }) => (isAr ? p.titleAr || p.title : p.title);

  const toggleProduct = (id: string) =>
    setSelectedProductIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const resetForm = () => {
    setFormData({ name: "", email: "", company: "", phone: "", subject: "", message: "" });
    setSelectedProductIds([]);
    setProductNotListed(false);
    setCustomProduct({ name: "", description: "" });
    setProductSearch("");
    setDrawerCategory("");
    setShowSelectedOnly(false);
    clearQuoteDraft();
  };

  // Auto-scroll to the form when the user arrives via a "Get Quote" link.
  useEffect(() => {
    if (!arrivedForQuote) return;
    const id = setTimeout(() => formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 250);
    return () => clearTimeout(id);
  }, [arrivedForQuote]);

  // Cache the form draft so an accidental tab close / navigation doesn't lose it.
  useEffect(() => {
    const hasContent =
      Object.values(formData).some((v) => v.trim()) ||
      selectedProductIds.length > 0 ||
      customProduct.name.trim() ||
      customProduct.description.trim();
    try {
      if (hasContent) {
        localStorage.setItem(
          QUOTE_DRAFT_KEY,
          JSON.stringify({ formData, selectedProductIds, productNotListed, customProduct }),
        );
      } else {
        localStorage.removeItem(QUOTE_DRAFT_KEY);
      }
    } catch {
      /* ignore storage errors (private mode / quota) */
    }
  }, [formData, selectedProductIds, productNotListed, customProduct]);

  const searchQuery = productSearch.trim().toLowerCase();
  const filteredProducts = (products || []).filter((p) => {
    if (drawerCategory && p.category !== drawerCategory) return false;
    if (!searchQuery) return true;
    return (
      productTitle(p).toLowerCase().includes(searchQuery) ||
      p.sku.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery)
    );
  });
  const selectedProducts = (products || []).filter((p) => selectedProductIds.includes(p.id));
  // The "show selected" button switches the drawer list to only the chosen products.
  const displayedProducts = showSelectedOnly ? selectedProducts : filteredProducts;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject) {
      toast.error(isAr ? "يرجى اختيار الموضوع." : "Please select a subject.");
      return;
    }

    // Resolve selected products (structured) for quote requests.
    const selectedItems = (products || [])
      .filter((p) => selectedProductIds.includes(p.id))
      .map((p) => ({ title: productTitle(p), sku: p.sku }));
    const customName = customProduct.name.trim();
    const customDescription = customProduct.description.trim();
    const customProductPayload =
      productNotListed && customName ? { name: customName, description: customDescription || undefined } : undefined;
    const userNotes = formData.message.trim();

    if (isQuote && selectedItems.length === 0 && !customName) {
      toast.error(
        isAr
          ? "يرجى اختيار منتج واحد على الأقل أو كتابة اسم المنتج المطلوب."
          : "Please select at least one product or enter the product you need.",
      );
      return;
    }

    // Compose a readable summary for the DB record (admin dashboard reads `message`).
    const quoteLines: string[] = [];
    if (selectedItems.length) {
      quoteLines.push(isAr ? "المنتجات المطلوبة:" : "Requested products:");
      selectedItems.forEach((it, i) => quoteLines.push(`${i + 1}. ${it.title} (${it.sku})`));
    }
    if (customProductPayload) {
      quoteLines.push((isAr ? "منتج آخر: " : "Other product: ") + customProductPayload.name);
      if (customProductPayload.description) {
        quoteLines.push((isAr ? "الوصف: " : "Description: ") + customProductPayload.description);
      }
    }
    const composedMessage = [quoteLines.join("\n"), userNotes].filter(Boolean).join("\n\n");
    const emailProductTitle =
      selectedItems.length || customName
        ? [...selectedItems.map((it) => it.title), customName].filter(Boolean).join("، ")
        : formData.subject || "General Inquiry";

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contact_inquiries").insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim() || null,
        phone: formData.phone.trim() || null,
        subject: formData.subject,
        message: composedMessage,
      });
      if (error) throw error;

      // Send email notification (fire-and-forget, don't block success)
      supabase.functions
        .invoke("send-quote-email", {
          body: {
            customerName: formData.name.trim(),
            customerEmail: formData.email.trim(),
            customerPhone: formData.phone.trim() || undefined,
            customerCompany: formData.company.trim() || undefined,
            // Structured list → rendered as a table in the email.
            items: selectedItems.length ? selectedItems : undefined,
            customProduct: customProductPayload,
            // Fallback title for the subject line / older email versions.
            productTitle: emailProductTitle,
            productSku: selectedItems.length === 1 ? selectedItems[0].sku : "—",
            // Only the customer's own notes — products are sent separately above.
            message: userNotes || undefined,
            language: language,
          },
        })
        .catch((err) => console.error("Email failed:", err));

      toast.success(t.contact.messageSent);
      resetForm();
    } catch {
      toast.error(isAr ? "حدث خطأ. يرجى المحاولة مرة أخرى." : "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactItems = [
    {
      icon: Mail,
      title: t.contact.emailLabel,
      lines: ["Hello@salada.sa"],
      href: "mailto:Hello@salada.sa",
      contentDir: "ltr" as const,
    },
    {
      icon: Phone,
      title: t.contact.phoneLabel,
      lines: ["050 016 5914"],
      href: "tel:+966500165914",
      contentDir: "ltr" as const,
    },
    {
      icon: MapPin,
      title: t.contact.headquarters,
      lines: isAr?["أحمد بن محمد العيالي", "RNNA7850, Riyadh, KSA"]:
      ["Ahmed bin Mohammed Al-Ayal", "RNNA7850, Riyadh, KSA"],
    },
    {
      icon: Clock,
      title: t.contact.businessHours,
      lines: isAr
        ? ["الأحد - الخميس: 8:00 ص - 6:00 م", "الجمعة: مغلق"]
        : ["Sun – Thu: 8:00 AM – 6:00 PM", "Fri: Closed"],
    },
  ];

  const subjectOptions = [
    { value: "quote", label: t.contact.requestQuote },
    { value: "product", label: t.contact.productInquiry },
    { value: "order", label: t.contact.orderStatus },
    { value: "support", label: t.contact.technicalSupport },
    { value: "partnership", label: t.contact.partnership },
    { value: "other", label: t.contact.other },
  ] as const;

  return (
    <Layout>
      <SEOHead {...seo} />

      <PageHero
        breadcrumbLabel={t.contact.title}
        title={t.contact.label}
        description={t.contact.description}
        minHeight={240}
      />

      <section className="border-b border-border" dir={dir} style={{ background: "hsl(var(--secondary)/0.3)" }}>
        <div className="industrial-container py-8 md:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactItems.map((item) => {
              const Content = (
                <div
                  className="h-full border border-border p-5 text-start contact-card-hover"
                  style={{ background: "hsl(var(--background))" }}
                >
                  <div
                    className="flex items-center justify-center w-10 h-10 mb-4"
                    style={{ background: "hsl(var(--primary)/0.1)" }}
                  >
                    <item.icon className="h-5 w-5 shrink-0" style={{ color: "hsl(var(--primary))" }} />
                  </div>
                  <p
                    className="mb-2 text-[0.8rem] font-bold uppercase tracking-wider"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {item.title}
                  </p>
                  <div
                    dir={item.contentDir ?? dir}
                    className={item.contentDir === "ltr" ? (isAr ? "text-end" : "text-start") : "text-start"}
                  >
                    {item.lines.map((line, j) => (
                      <p
                        key={j}
                        className="text-base leading-relaxed font-semibold"
                        style={{
                          color: j === 0 ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                        }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              );

              return item.href ? (
                <a key={item.title} href={item.href} className="block h-full">
                  {Content}
                </a>
              ) : (
                <div key={item.title} className="h-full">
                  {Content}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        ref={formSectionRef}
        id="quote-form"
        className="bg-background border-b border-border py-12 md:py-16 scroll-mt-20"
        dir={dir}
      >
        <div className="industrial-container">
          <div className="grid lg:grid-cols-3 gap-10 md:gap-14 items-start">
            <div className="lg:col-span-2 text-start">
              <div
                className="border border-border p-8"
                style={{ background: "hsl(var(--secondary)/0.3)" }}
              >
                <SectionLabel text={isQuote ? (isAr ? "طلب عرض سعر" : "Request a Quote") : t.contact.sendMessage} />
                <h2
                  className="mb-8 font-bold leading-tight tracking-[-0.02em]"
                  style={{
                    fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
                    fontWeight: 700,
                    color: "hsl(var(--foreground))",
                  }}
                >
                  {isQuote
                    ? isAr
                      ? "نموذج طلب عرض سعر"
                      : "Quote Request Form"
                    : isAr
                      ? "أرسل لنا رسالة"
                      : "Send Us a Message"}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6" dir={dir}>
                  <div className="grid min-w-0 gap-6 md:grid-cols-2">
                    <FormField label={t.contact.name} required>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={isAr ? "أدخل اسمك الكامل" : "Enter your full name"}
                        className={`${fieldShell} text-start`}
                        style={inputHeight}
                      />
                    </FormField>
                    <FormField label={t.checkout?.email || (isAr ? "البريد الإلكتروني" : "Email")} required>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        dir="ltr"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@example.com"
                        className={`${fieldShell} ${isAr ? "text-end" : "text-start"}`}
                        style={inputHeight}
                      />
                    </FormField>
                  </div>

                  <div className="grid min-w-0 gap-6 md:grid-cols-2">
                    <FormField label={t.checkout?.company || (isAr ? "الشركة" : "Company")}>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder={isAr ? "اسم الشركة (اختياري)" : "Company name (optional)"}
                        className={`${fieldShell} text-start`}
                        style={inputHeight}
                      />
                    </FormField>
                    <FormField label={t.checkout?.phone || (isAr ? "الهاتف" : "Phone")}>
                      <input
                        type="tel"
                        value={formData.phone}
                        dir="ltr"
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+966 5X XXX XXXX"
                        className={`${fieldShell} ${isAr ? "text-end" : "text-start"}`}
                        style={inputHeight}
                      />
                    </FormField>
                  </div>

                  <FormField label={t.contact.subject} required>
                    <Select
                      value={formData.subject || undefined}
                      onValueChange={(subject) => setFormData((prev) => ({ ...prev, subject }))}
                    >
                      <SelectTrigger
                        dir={dir}
                        className={cn(
                          fieldShell,
                          "h-auto min-h-[48px] w-full justify-between gap-2 rounded-none px-4 py-3 text-base shadow-none ring-0 ring-offset-0",
                          "focus:border-primary focus:ring-0 focus:ring-offset-0 data-[state=open]:border-primary",
                          "disabled:cursor-not-allowed disabled:opacity-50",
                        )}
                      >
                        <SelectValue placeholder={t.contact.selectSubject} />
                      </SelectTrigger>
                      <SelectContent
                        dir={dir}
                        position="popper"
                        className="max-h-[min(22rem,var(--radix-select-content-available-height))] w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] rounded-none border-border bg-background text-foreground shadow-md"
                      >
                        {subjectOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value} className="cursor-pointer py-2.5 text-base">
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  {isQuote && (
                    <FormField label={isAr ? "اختر المنتجات المطلوبة" : "Select the products you need"} required>
                      <button
                        type="button"
                        onClick={() => setProductDrawerOpen(true)}
                        className={cn(fieldShell, "flex items-center justify-between gap-2 text-start")}
                        style={inputHeight}
                      >
                        <span className={selectedProducts.length ? "text-foreground" : "text-muted-foreground"}>
                          {selectedProducts.length
                            ? isAr
                              ? `${selectedProducts.length} منتجات محددة`
                              : `${selectedProducts.length} product(s) selected`
                            : isAr
                              ? "تصفّح واختر المنتجات"
                              : "Browse and select products"}
                        </span>
                        <Plus className="h-4 w-4 shrink-0 text-primary" />
                      </button>

                      <Sheet open={productDrawerOpen} onOpenChange={setProductDrawerOpen}>
                        <SheetContent
                          side="right"
                          dir={dir}
                          className={cn(
                            "flex w-full flex-col gap-0 p-0 sm:max-w-2xl",
                            // In Arabic, move the built-in close (X) button to the left.
                            isAr && "[&>button]:left-4 [&>button]:right-auto",
                          )}
                        >
                          <SheetHeader className={cn("border-b border-border p-4", isAr ? "pl-12 text-start" : "pr-12 text-start")}>
                            <SheetTitle asChild>
                              <span className="block text-lg font-semibold text-foreground text-start">
                                {isAr ? "اختر المنتجات" : "Select Products"}
                                {selectedProducts.length > 0 ? ` (${selectedProducts.length})` : ""}
                              </span>
                            </SheetTitle>
                          </SheetHeader>

                          {!showSelectedOnly && (
                          <>
                          <div className="border-b border-border p-4">
                            <div className="relative">
                              <Search
                                className={cn(
                                  "pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
                                  isAr ? "right-3" : "left-3",
                                )}
                              />
                              <input
                                type="text"
                                dir={dir}
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                                placeholder={isAr ? "ابحث عن منتج بالاسم أو الرمز..." : "Search products by name or SKU..."}
                                className={cn(fieldShell, "text-start", isAr ? "pr-9" : "pl-9")}
                                style={inputHeight}
                              />
                            </div>
                          </div>

                          {/* Category tabs — same filter as the Shop page */}
                          {categories.length > 0 && (
                            <div className="overflow-x-auto border-b border-border scrollbar-none" dir={dir}>
                              <div className="flex items-stretch gap-0 min-w-max px-2">
                                <button
                                  type="button"
                                  onClick={() => setDrawerCategory("")}
                                  className="whitespace-nowrap border-b-2 px-3 py-2.5 text-[0.85rem] font-medium transition-colors duration-150"
                                  style={{
                                    borderColor: !drawerCategory ? "hsl(var(--primary))" : "transparent",
                                    color: !drawerCategory ? "hsl(var(--primary))" : "hsl(var(--foreground)/0.65)",
                                  }}
                                >
                                  {isAr ? "الكل" : "All"}
                                </button>
                                {categories.map((cat) => (
                                  <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setDrawerCategory(cat.id)}
                                    className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-[0.85rem] font-medium transition-colors duration-150"
                                    style={{
                                      borderColor: drawerCategory === cat.id ? "hsl(var(--primary))" : "transparent",
                                      color: drawerCategory === cat.id ? "hsl(var(--primary))" : "hsl(var(--foreground)/0.65)",
                                    }}
                                  >
                                    <span className="min-w-0" dir="auto">
                                      {categoryTranslations[cat.id] || cat.name}
                                    </span>
                                    <span
                                      className="inline-flex shrink-0 select-none rounded px-1.5 py-0.5 text-[0.7rem] leading-none tabular-nums [unicode-bidi:isolate]"
                                      dir="ltr"
                                      style={{ color: "hsl(var(--muted-foreground)/0.75)", background: "hsl(var(--muted) / 0.35)" }}
                                    >
                                      {cat.count}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          </>
                          )}

                          <div className="min-h-0 flex-1 overflow-y-auto p-4">
                            {!products ? (
                              <p className="py-8 text-center text-sm text-muted-foreground">
                                {isAr ? "جارٍ تحميل المنتجات..." : "Loading products..."}
                              </p>
                            ) : displayedProducts.length === 0 ? (
                              <p className="py-8 text-center text-sm text-muted-foreground">
                                {showSelectedOnly
                                  ? isAr
                                    ? "لم تقم بتحديد أي منتج بعد."
                                    : "You haven't selected any products yet."
                                  : isAr
                                    ? "لا توجد منتجات مطابقة."
                                    : "No matching products."}
                              </p>
                            ) : (
                              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                                {displayedProducts.map((p) => (
                                  <ProductCard
                                    key={p.id}
                                    product={p}
                                    variant="default"
                                    dense
                                    selectable
                                    selected={selectedProductIds.includes(p.id)}
                                    onToggleSelect={() => toggleProduct(p.id)}
                                  />
                                ))}
                              </div>
                            )}
                          </div>

                          <SheetFooter className="flex-row gap-2 border-t border-border p-4">
                            <button
                              type="button"
                              onClick={() => setShowSelectedOnly((v) => !v)}
                              disabled={selectedProducts.length === 0}
                              className="btn-secondary flex-1 justify-center disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {showSelectedOnly
                                ? isAr
                                  ? "عرض كل المنتجات"
                                  : "Show all products"
                                : isAr
                                  ? `عرض المحدد (${selectedProducts.length})`
                                  : `Show selected (${selectedProducts.length})`}
                            </button>
                            <SheetClose asChild>
                              <button type="button" className="btn-primary flex-1 justify-center">
                                {isAr ? `تم (${selectedProducts.length})` : `Done (${selectedProducts.length})`}
                              </button>
                            </SheetClose>
                          </SheetFooter>
                        </SheetContent>
                      </Sheet>

                      <label className="mt-3 flex cursor-pointer items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={productNotListed}
                          onChange={(e) => setProductNotListed(e.target.checked)}
                          className="h-4 w-4 shrink-0 accent-[hsl(var(--primary))]"
                        />
                        <span className="text-sm font-medium text-foreground">
                          {isAr ? "المنتج الذي أريده غير موجود في القائمة" : "The product I want isn't listed"}
                        </span>
                      </label>

                      {productNotListed && (
                        <div className="mt-3 flex flex-col gap-4">
                          <input
                            type="text"
                            value={customProduct.name}
                            onChange={(e) => setCustomProduct((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder={isAr ? "اسم المنتج المطلوب" : "Product name"}
                            className={`${fieldShell} text-start`}
                            style={inputHeight}
                          />
                          <textarea
                            value={customProduct.description}
                            onChange={(e) => setCustomProduct((prev) => ({ ...prev, description: e.target.value }))}
                            placeholder={
                              isAr ? "وصف المنتج (اختياري)" : "Product description (optional)"
                            }
                            className={`${fieldShell} text-start`}
                            style={textareaMin}
                          />
                        </div>
                      )}
                    </FormField>
                  )}

                  <FormField
                    label={isQuote ? (isAr ? "ملاحظات إضافية" : "Additional notes") : t.contact.message}
                    required={!isQuote}
                  >
                    <textarea
                      required={!isQuote}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t.contact.messagePlaceholder}
                      className={`${fieldShell} text-start`}
                      style={textareaMin}
                    />
                  </FormField>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary inline-flex min-h-[48px] w-full items-center justify-center gap-2 px-10 py-3.5 text-[0.9rem] font-bold disabled:opacity-50 sm:w-auto"
                  >
                    <span>{isSubmitting ? t.contact.sending : t.contact.send}</span>
                    <Send className="h-4 w-4 shrink-0 rtl:rotate-180" />
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-1 text-start">
              {isQuote && selectedProducts.length > 0 && (
                <div className="mb-6 border border-border p-5">
                  <SectionLabel text={isAr ? `المنتجات المحددة (${selectedProducts.length})` : `Selected Products (${selectedProducts.length})`} />
                  <div className="flex flex-col gap-2">
                    {selectedProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        variant="compact"
                        selectable
                        selected
                        onToggleSelect={() => toggleProduct(p.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6 border border-border p-5" style={{ background: "hsl(var(--primary)/0.05)" }}>
                <SectionLabel text={isAr ? "واتساب" : "WhatsApp"} />
                <p className="mb-4 text-start text-[0.9rem] leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {isAr
                    ? "تواصل معنا مباشرة على واتساب للردود السريعة."
                    : "Chat with us directly on WhatsApp for quick responses."}
                </p>
                <a
                  href="https://wa.me/966500165914"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <span>{isAr ? "ابدأ المحادثة" : "Start Chat"}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </a>
              </div>

              <div className="border-t border-border pt-5 text-start">
                <p
                  className="label-text text-[0.75rem] uppercase tracking-[0.18em] mb-4"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {isAr ? "روابط سريعة" : "Quick Links"}
                </p>
                {[
                  { label: isAr ? "تصفح المنتجات" : "Browse Products", href: "/shop" },
                  { label: isAr ? "حلولنا" : "Our Solutions", href: "/solutions" },
                  { label: isAr ? "لماذا صلادة" : "Why Salada", href: "/why-salada" },
                ].map((lnk) => (
                  <Link
                    key={lnk.href}
                    to={lnk.href}
                    className="flex items-center justify-between py-3 border-b border-border group quick-link-hover"
                    style={{ color: "hsl(var(--foreground)/0.7)", fontSize: "0.8rem", fontWeight: 500 }}
                  >
                    {lnk.label}
                    <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity rtl:rotate-180" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border" dir={dir}>
        <div className="industrial-container py-10 md:py-14">
          <div className="flex items-center justify-between mb-6">
            <div className="text-start">
              <SectionLabel text={t.contact.headquarters} />
              <h2
                className="font-black uppercase leading-tight tracking-[-0.02em]"
                style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)", color: "hsl(var(--foreground))" }}
              >
                {isAr ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia"}
              </h2>
            </div>
            <span
              className="label-text text-[0.75rem] uppercase tracking-[0.16em] shrink-0"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              RNNA7850
            </span>
          </div>
          <div className="w-full overflow-hidden border border-border" style={{ aspectRatio: "21/7" }}>
            <iframe
              title="Salada Metal Industries Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.6!2d46.6753!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sen!2s!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}
