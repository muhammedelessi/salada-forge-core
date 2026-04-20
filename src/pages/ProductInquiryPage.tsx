import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useProduct } from '@/hooks/useProducts';
import { Send, ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/i18n/translations';
import { useLocalizedField } from '@/hooks/useLocalizedField';
import { cn } from '@/lib/utils';
import { productCardImageFrameClass, productThumbImgClass } from '@/lib/productImageFrame';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { FormField, fieldShell, inputHeight, textareaMin } from '@/components/forms/ContactFormFields';

const inquirySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(255),
  email: z.string().trim().email('Invalid email address').max(255),
  phone: z.string().trim().max(50).optional(),
  company: z.string().trim().max(255).optional(),
  quantity: z.number().min(1).optional(),
  message: z.string().trim().max(2000).optional(),
});

export default function ProductInquiryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(slug || '');
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];
  const isAr = isRTL();
  const dir = isAr ? 'rtl' : 'ltr';
  const { getField } = useLocalizedField();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    quantity: searchParams.get('quantity') || '1',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  if (isLoading) {
    return (
      <Layout>
        <div className="industrial-container py-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="industrial-container py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">{t.product.notFound}</h1>
          <Link to="/shop" className="btn-primary">
            {t.product.backToShop}
          </Link>
        </div>
      </Layout>
    );
  }

  const displayProductTitle = getField(product, 'title') ?? product.title;
  const displayProductDescription = getField(product, 'description') ?? product.description ?? '';

  const validateForm = () => {
    try {
      inquirySchema.parse({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
        quantity: formData.quantity ? parseInt(formData.quantity) : undefined,
        message: formData.message || undefined,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('product_inquiries')
        .insert({
          product_id: product.id,
          product_title: displayProductTitle,
          product_sku: product.sku,
          customer_name: formData.name.trim(),
          customer_email: formData.email.trim(),
          customer_phone: formData.phone.trim() || null,
          customer_company: formData.company.trim() || null,
          quantity: formData.quantity ? parseInt(formData.quantity) : null,
          message: formData.message.trim() || null,
          status: 'pending',
        });

      if (error) throw error;

      // Send emails via edge function (fire-and-forget, don't block success)
      supabase.functions.invoke('send-quote-email', {
        body: {
          customerName: formData.name.trim(),
          customerEmail: formData.email.trim(),
          customerPhone: formData.phone.trim() || undefined,
          customerCompany: formData.company.trim() || undefined,
          productTitle: displayProductTitle,
          productSku: product.sku,
          quantity: formData.quantity ? parseInt(formData.quantity) : undefined,
          message: formData.message.trim() || undefined,
          language,
        },
      }).catch((emailError) => {
        console.error('Email sending failed:', emailError);
      });

      setIsSuccess(true);
      toast.success(
        language === 'ar' 
          ? 'تم إرسال طلبك بنجاح! سنتواصل معك قريباً.' 
          : 'Your inquiry has been submitted! We will contact you soon.'
      );
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error(
        language === 'ar'
          ? 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.'
          : 'Error submitting inquiry. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Layout>
        <div className="industrial-container py-24">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4">
              {language === 'ar' ? 'تم إرسال طلبك بنجاح!' : 'Inquiry Submitted Successfully!'}
            </h1>
            <p className="text-muted-foreground mb-8">
              {language === 'ar'
                ? 'شكراً لاهتمامك. سيتواصل معك فريقنا خلال 24 ساعة لمناقشة طلبك.'
                : 'Thank you for your interest. Our team will contact you within 24 hours to discuss your inquiry.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop" className="btn-primary">
                {language === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}
              </Link>
              <Link to="/" className="btn-secondary">
                {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="bg-secondary border-b border-border py-8">
        <div className="industrial-container">
          <Link 
            to={`/product/${product.slug}`}
            className={cn(
              'inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4',
              isRTL && 'flex-row-reverse'
            )}
          >
            <ArrowIcon className="w-4 h-4" />
            {language === 'ar' ? 'العودة للمنتج' : 'Back to Product'}
          </Link>
          <h1 className={cn('text-3xl font-bold', isRTL && 'text-right')}>
            {language === 'ar' ? 'طلب عرض سعر' : 'Request a Quote'}
          </h1>
        </div>
      </section>

      <section className="industrial-section">
        <div className="industrial-container">
          <div className={cn(
            'grid lg:grid-cols-3 gap-12',
            isRTL && 'lg:grid-flow-dense'
          )}>
            {/* Product Summary */}
            <div className={cn('lg:col-span-1', isRTL && 'lg:col-start-3')}>
              <div className="bg-card border border-border p-6 sticky top-24">
                <h2 className={cn('text-lg font-bold mb-4', isRTL && 'text-right')}>
                  {language === 'ar' ? 'المنتج' : 'Product'}
                </h2>
                <div className={cn(productCardImageFrameClass, 'mb-4 border border-border/60 bg-muted/10')}>
                  <img
                    src={product.images[0] || '/placeholder.svg'}
                    alt={displayProductTitle}
                    loading="lazy"
                    decoding="async"
                    className={cn(productThumbImgClass, 'h-full w-full')}
                  />
                </div>
                <h3 className={cn('font-semibold mb-2', isRTL && 'text-right')}>{displayProductTitle}</h3>
                <p className={cn('text-sm text-muted-foreground label-text mb-4', isRTL && 'text-right')}>
                  {t.products.sku}: {product.sku}
                </p>
                {displayProductDescription ? (
                  <p className={cn('text-sm text-muted-foreground line-clamp-3', isRTL && 'text-right')}>
                    {displayProductDescription}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Inquiry Form — same field system as Contact page */}
            <div className={cn('lg:col-span-2', isRTL && 'lg:col-start-1')}>
              <div
                className="border border-border p-8 text-start"
                style={{ background: 'hsl(var(--secondary)/0.3)' }}
                dir={dir}
              >
                <h2
                  className="mb-8 font-bold leading-tight tracking-[-0.02em]"
                  style={{
                    fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                    fontWeight: 700,
                    color: 'hsl(var(--foreground))',
                  }}
                >
                  {language === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid min-w-0 gap-6 md:grid-cols-2">
                    <FormField label={t.contact.name} required error={errors.name}>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={cn(
                          fieldShell,
                          'text-start',
                          errors.name && 'border-destructive focus:border-destructive',
                        )}
                        style={inputHeight}
                      />
                    </FormField>
                    <FormField label={t.checkout.email} required error={errors.email}>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        dir="ltr"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={cn(
                          fieldShell,
                          isAr ? 'text-end' : 'text-start',
                          errors.email && 'border-destructive focus:border-destructive',
                        )}
                        style={inputHeight}
                      />
                    </FormField>
                  </div>

                  <div className="grid min-w-0 gap-6 md:grid-cols-2">
                    <FormField label={t.checkout.company}>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className={cn(fieldShell, 'text-start')}
                        style={inputHeight}
                      />
                    </FormField>
                    <FormField label={t.checkout.phone}>
                      <input
                        type="tel"
                        value={formData.phone}
                        dir="ltr"
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={cn(fieldShell, isAr ? 'text-end' : 'text-start')}
                        style={inputHeight}
                      />
                    </FormField>
                  </div>

                  <FormField label={language === 'ar' ? 'الكمية المطلوبة' : 'Quantity Needed'}>
                    <input
                      type="number"
                      min={1}
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className={cn(fieldShell, 'max-w-[12rem] text-start')}
                      style={inputHeight}
                    />
                  </FormField>

                  <FormField label={language === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={
                        language === 'ar'
                          ? 'أخبرنا عن متطلباتك أو أي تفاصيل إضافية...'
                          : 'Tell us about your requirements or any additional details...'
                      }
                      className={cn(fieldShell, 'text-start')}
                      style={textareaMin}
                    />
                  </FormField>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary inline-flex min-h-[48px] w-full items-center justify-center gap-2 px-10 py-3.5 text-[0.9rem] font-bold disabled:opacity-50 md:w-auto"
                  >
                    {isSubmitting ? (
                      language === 'ar' ? (
                        'جاري الإرسال...'
                      ) : (
                        'Submitting...'
                      )
                    ) : (
                      <>
                        <span>{language === 'ar' ? 'إرسال الطلب' : 'Submit Inquiry'}</span>
                        <Send className="h-4 w-4 shrink-0 rtl:rotate-180" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
