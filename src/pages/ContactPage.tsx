import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { usePageSEO } from "@/hooks/usePageSEO";
import { Mail, Phone, MapPin, Clock, Send, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useLanguageStore } from "@/store/languageStore";
import { translations } from "@/i18n/translations";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import heroPort from "@/assets/hero-port.webp";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export default function ContactPage() {
  const seo = usePageSEO("/contact");
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];
  const isAr = isRTL();
  const dir = isAr ? "rtl" : "ltr";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject) {
      toast.error(isAr ? "يرجى اختيار الموضوع." : "Please select a subject.");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contact_inquiries").insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim() || null,
        phone: formData.phone.trim() || null,
        subject: formData.subject,
        message: formData.message.trim(),
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
            productTitle: formData.subject || "General Inquiry",
            productSku: "—",
            message: formData.message.trim(),
            language: language,
          },
        })
        .catch((err) => console.error("Email failed:", err));

      toast.success(t.contact.messageSent);
      setFormData({ name: "", email: "", company: "", phone: "", subject: "", message: "" });
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

      <section className="relative overflow-hidden" dir={dir} style={{ minHeight: "240px" }}>
        <div className="absolute inset-0">
          <img
            src={heroPort}
            alt="Contact Salada"
            className="w-full h-full object-cover"
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
          <div className="max-w-xl text-start">
            <nav className="page-hero-breadcrumb flex items-center gap-1.5 mb-4">
              <Link
                to="/"
                className="hero-crumb label-text text-label-md uppercase tracking-[0.15em]"
                style={{ color: "rgba(255,255,255,0.32)" }}
              >
                {isAr ? "الرئيسية" : "Home"}
              </Link>
              <span style={{ color: "rgba(255,255,255,0.18)" }}>/</span>
              <span
                className="hero-crumb label-text text-label-md uppercase tracking-[0.15em]"
                style={{ color: "hsl(var(--primary))" }}
              >
                {t.contact.title}
              </span>
            </nav>
            <h1 className="hero-title-primary font-black uppercase leading-[0.93] tracking-[-0.025em] text-start">
              {t.contact.label}
            </h1>
            <p
              className="hero-subtitle leading-relaxed text-start"
              style={{ color: "rgba(255,255,255,0.45)", maxWidth: "34rem" }}
            >
              {t.contact.description}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border" dir={dir} style={{ background: "hsl(var(--secondary)/0.3)" }}>
        <div className="industrial-container py-8 md:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactItems.map((item) => {
              const Content = (
                <div
                  className="h-full border border-border p-5 text-start transition-colors duration-200 hover:border-primary/40"
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

      <section className="bg-background border-b border-border py-12 md:py-16" dir={dir}>
        <div className="industrial-container">
          <div className="grid lg:grid-cols-3 gap-10 md:gap-14 items-start">
            <div className="lg:col-span-2 text-start">
              <div
                className="border border-border p-8"
                style={{ background: "hsl(var(--secondary)/0.3)" }}
              >
                <SectionLabel text={t.contact.sendMessage} />
                <h2
                  className="mb-8 font-bold leading-tight tracking-[-0.02em]"
                  style={{
                    fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
                    fontWeight: 700,
                    color: "hsl(var(--foreground))",
                  }}
                >
                  {isAr ? "أرسل لنا رسالة" : "Send Us a Message"}
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

                  <FormField label={t.contact.message} required>
                    <textarea
                      required
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
                    className="flex items-center justify-between py-3 border-b border-border group hover:text-primary transition-colors duration-200"
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
