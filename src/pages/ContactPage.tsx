import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/SEOHead';
import { Breadcrumb } from '@/components/Breadcrumb';
import { usePageSEO } from '@/hooks/usePageSEO';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/i18n/translations';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

export default function ContactPage() {
  const seo = usePageSEO('/contact');
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          company: formData.company.trim() || null,
          phone: formData.phone.trim() || null,
          subject: formData.subject,
          message: formData.message.trim(),
        });

      if (error) throw error;

      toast.success(t.contact.messageSent);
      setFormData({ name: '', email: '', company: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error(isRTL() ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAr = isRTL();

  const contactInfo = [
    {
      icon: Mail,
      title: t.contact.emailLabel,
      details: ['Hello@salada.sa'],
    },
    {
      icon: Phone,
      title: t.contact.phoneLabel,
      details: ['050 016 5914'],
    },
    {
      icon: MapPin,
      title: t.contact.headquarters,
      details: ['أحمد بن محمد العيالي', 'RNNA7850, Riyadh'],
    },
    {
      icon: Clock,
      title: t.contact.businessHours,
      details: isAr
        ? ['الأحد - الخميس: 8:00 ص - 6:00 م', 'الجمعة: مغلق'] 
        : ['Mon - Fri: 8:00 AM - 6:00 PM CST', 'Sat: 9:00 AM - 1:00 PM CST'],
    },
  ];

  return (
    <Layout>
      <SEOHead {...seo} />
      <Breadcrumb items={[{ label: t.nav.contact }]} />

      {/* Hero */}
      <section className="bg-secondary border-b border-border py-16 md:py-24">
        <div className="industrial-container rtl:text-right">
          <span className="industrial-label mb-4 block">{t.contact.label}</span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{t.contact.title}</h1>
          <p className="text-muted-foreground max-w-2xl text-base">
            {t.contact.description}
          </p>
        </div>
      </section>

      <section className="industrial-section">
        <div className="industrial-container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2 rtl:text-right lg:order-1 rtl:lg:order-2">
              <h2 className="text-2xl font-bold mb-6">{t.contact.sendMessage}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.contact.name} *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="industrial-input rtl:text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.checkout.email} *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="industrial-input"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.checkout.company}</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="industrial-input rtl:text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.checkout.phone}</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="industrial-input"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t.contact.subject} *</label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="industrial-input rtl:text-right"
                  >
                    <option value="">{t.contact.selectSubject}</option>
                    <option value="quote">{t.contact.requestQuote}</option>
                    <option value="product">{t.contact.productInquiry}</option>
                    <option value="order">{t.contact.orderStatus}</option>
                    <option value="support">{t.contact.technicalSupport}</option>
                    <option value="partnership">{t.contact.partnership}</option>
                    <option value="other">{t.contact.other}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t.contact.message} *</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="industrial-input resize-none rtl:text-right"
                    placeholder={t.contact.messagePlaceholder}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="industrial-button disabled:opacity-50 rtl:flex-row-reverse"
                >
                  {isSubmitting ? t.contact.sending : t.contact.send}
                  <Send className="w-4 h-4 ltr:ml-2 rtl:mr-2 rtl:rotate-180" />
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="rtl:text-right lg:order-2 rtl:lg:order-1">
              <h2 className="text-2xl font-bold mb-6">{t.contact.contactInfo}</h2>
              
              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <div 
                    key={info.title} 
                    dir={isAr ? 'rtl' : 'ltr'}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{info.title}</h3>
                      {info.details.map((detail, index) => (
                        <p key={index} className="text-muted-foreground text-sm">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="border-t border-border">
        <div className="industrial-container py-16">
          <h2 className="text-2xl font-bold mb-8 rtl:text-right">
            {t.contact.headquarters}
          </h2>
          <div className="w-full aspect-[21/9] md:aspect-[3/1] border border-border overflow-hidden">
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

      {/* Global Offices */}
      <section className="industrial-section bg-secondary border-t border-border">
        <div className="industrial-container">
          <h2 className="text-2xl font-bold mb-8 text-center">{t.contact.globalOffices}</h2>
          
          <div className="grid md:grid-cols-1 max-w-md mx-auto gap-1">
            <div className="bg-card border border-border p-6 rtl:text-right">
              <h3 className="font-bold text-lg mb-1">{isAr ? 'الرياض' : 'Riyadh'}</h3>
              <p className="text-primary text-sm font-mono mb-2">{isAr ? 'السعودية (المقر الرئيسي)' : 'Saudi Arabia (HQ)'}</p>
              <p className="text-muted-foreground text-sm">أحمد بن محمد العيالي, RNNA7850</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
