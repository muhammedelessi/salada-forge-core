import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/i18n/translations';
import { cn } from '@/lib/utils';

export default function ContactPage() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(t.contact.messageSent);
      setFormData({ name: '', email: '', company: '', phone: '', subject: '', message: '' });
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t.contact.emailLabel,
      details: ['sales@salada.com', 'support@salada.com'],
    },
    {
      icon: Phone,
      title: t.contact.phoneLabel,
      details: isRTL 
        ? ['+966 11 234 5678', '+966 11 234 5679'] 
        : ['+1 (800) 555-0123', '+1 (713) 555-0456'],
    },
    {
      icon: MapPin,
      title: t.contact.headquarters,
      details: ['أحمد بن محمد العيالي', 'RNNA7850, Riyadh'],
    },
    {
      icon: Clock,
      title: t.contact.businessHours,
      details: isRTL 
        ? ['الأحد - الخميس: 8:00 ص - 6:00 م', 'الجمعة: مغلق'] 
        : ['Mon - Fri: 8:00 AM - 6:00 PM CST', 'Sat: 9:00 AM - 1:00 PM CST'],
    },
  ];

  const globalOffices = [
    { city: isRTL ? 'الرياض' : 'Riyadh', country: isRTL ? 'السعودية (المقر الرئيسي)' : 'Saudi Arabia (HQ)', address: 'أحمد بن محمد العيالي, RNNA7850' },
    { city: isRTL ? 'دبي' : 'Dubai', country: isRTL ? 'الإمارات' : 'UAE', address: isRTL ? 'ميناء جبل علي' : 'Jebel Ali Port' },
    { city: isRTL ? 'جدة' : 'Jeddah', country: isRTL ? 'السعودية' : 'Saudi Arabia', address: isRTL ? 'ميناء جدة الإسلامي' : 'Jeddah Islamic Port' },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-secondary border-b border-border py-16 md:py-24">
        <div className={cn('industrial-container', isRTL && 'text-right')}>
          <span className="industrial-label mb-4 block">{t.contact.label}</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.contact.title}</h1>
          <p className={cn('text-muted-foreground max-w-2xl', isRTL && 'mr-0')}>
            {t.contact.description}
          </p>
        </div>
      </section>

      <section className="industrial-section">
        <div className="industrial-container">
          <div className={cn(
            'grid lg:grid-cols-3 gap-12',
            isRTL && 'lg:grid-flow-dense'
          )}>
            {/* Contact Form */}
            <div className={cn('lg:col-span-2', isRTL && 'lg:col-start-2 text-right')}>
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
                      className={cn('industrial-input', isRTL && 'text-right')}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.checkout.email} *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={cn('industrial-input', isRTL && 'text-right')}
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
                      className={cn('industrial-input', isRTL && 'text-right')}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.checkout.phone}</label>
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
                  <label className="block text-sm font-medium mb-2">{t.contact.subject} *</label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={cn('industrial-input', isRTL && 'text-right')}
                    dir={isRTL ? 'rtl' : 'ltr'}
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
                    className={cn('industrial-input resize-none', isRTL && 'text-right')}
                    placeholder={t.contact.messagePlaceholder}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    'industrial-button disabled:opacity-50',
                    isRTL && 'flex-row-reverse'
                  )}
                >
                  {isSubmitting ? t.contact.sending : t.contact.send}
                  <Send className={cn('w-4 h-4', isRTL ? 'mr-2 rotate-180' : 'ml-2')} />
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className={cn(isRTL && 'lg:col-start-1 lg:row-start-1 text-right')}>
              <h2 className="text-2xl font-bold mb-6">{t.contact.contactInfo}</h2>
              
              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <div 
                    key={info.title} 
                    className={cn('flex gap-4', isRTL && 'flex-row-reverse')}
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

              {/* Map Placeholder */}
              <div className="mt-8 aspect-square bg-card border border-border flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">{t.contact.interactiveMap}</p>
                  <p className="text-xs">Riyadh, Saudi Arabia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Offices */}
      <section className="industrial-section bg-secondary border-t border-border">
        <div className="industrial-container">
          <h2 className="text-2xl font-bold mb-8 text-center">{t.contact.globalOffices}</h2>
          
          <div className="grid md:grid-cols-3 gap-1">
            {globalOffices.map((office) => (
              <div 
                key={office.city} 
                className={cn(
                  'bg-card border border-border p-6',
                  isRTL && 'text-right'
                )}
              >
                <h3 className="font-bold text-lg mb-1">{office.city}</h3>
                <p className="text-primary text-sm font-mono mb-2">{office.country}</p>
                <p className="text-muted-foreground text-sm">{office.address}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}