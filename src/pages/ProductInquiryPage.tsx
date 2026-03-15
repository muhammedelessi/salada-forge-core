import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useProduct } from '@/hooks/useProducts';
import { Send, ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/i18n/translations';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

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
          <Link to="/shop" className="industrial-button">
            {t.product.backToShop}
          </Link>
        </div>
      </Layout>
    );
  }

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
          product_title: product.title,
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
              <Link to="/shop" className="industrial-button">
                {language === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}
              </Link>
              <Link to="/" className="industrial-button-outline">
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
                <div className="aspect-square bg-muted overflow-hidden mb-4">
                  <img
                    src={product.images[0] || '/placeholder.svg'}
                    alt={product.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className={cn('font-semibold mb-2', isRTL && 'text-right')}>{product.title}</h3>
                <p className={cn('text-sm text-muted-foreground font-mono mb-4', isRTL && 'text-right')}>
                  SKU: {product.sku}
                </p>
                <p className={cn('text-sm text-muted-foreground line-clamp-3', isRTL && 'text-right')}>
                  {product.description}
                </p>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className={cn('lg:col-span-2', isRTL && 'lg:col-start-1 text-right')}>
              <h2 className="text-xl font-bold mb-6">
                {language === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.contact.name} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={cn('industrial-input', isRTL && 'text-right', errors.name && 'border-destructive')}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                    {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.checkout.email} *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={cn('industrial-input', isRTL && 'text-right', errors.email && 'border-destructive')}
                      dir="ltr"
                    />
                    {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.checkout.company}
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className={cn('industrial-input', isRTL && 'text-right')}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.checkout.phone}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={cn('industrial-input', isRTL && 'text-right')}
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'ar' ? 'الكمية المطلوبة' : 'Quantity Needed'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className={cn('industrial-input max-w-[200px]', isRTL && 'text-right')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
                  </label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={cn('industrial-input resize-none', isRTL && 'text-right')}
                    placeholder={
                      language === 'ar'
                        ? 'أخبرنا عن متطلباتك أو أي تفاصيل إضافية...'
                        : 'Tell us about your requirements or any additional details...'
                    }
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    'industrial-button w-full md:w-auto disabled:opacity-50',
                    isRTL && 'flex-row-reverse'
                  )}
                >
                  {isSubmitting ? (
                    language === 'ar' ? 'جاري الإرسال...' : 'Submitting...'
                  ) : (
                    <>
                      {language === 'ar' ? 'إرسال الطلب' : 'Submit Inquiry'}
                      <Send className={cn('w-4 h-4', isRTL ? 'mr-2 rotate-180' : 'ml-2')} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
