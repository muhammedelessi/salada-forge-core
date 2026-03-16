import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ChevronDown, Search } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/i18n/translations';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { language } = useLanguageStore();
  const t = translations[language];
  const isRTL = language === 'ar';

  const faqsEn = [
    {
      category: 'Orders & Shipping',
      questions: [
        {
          q: 'What are your shipping options?',
          a: 'We offer multiple shipping options including ground freight, rail transport, and ocean freight for international orders. Free shipping is available for orders over 37,500 SAR within Saudi Arabia. Delivery times vary based on location and product availability.',
        },
        {
          q: 'How long does delivery take?',
          a: 'Standard delivery within Saudi Arabia typically takes 3-7 business days. International orders may take 2-6 weeks depending on destination and shipping method. Expedited shipping is available for urgent orders at additional cost.',
        },
        {
          q: 'Do you ship internationally?',
          a: 'Yes, we ship to over 120 countries worldwide. International shipping rates are calculated at checkout based on destination, weight, and dimensions. We handle all customs documentation for hassle-free delivery.',
        },
        {
          q: 'Can I track my order?',
          a: "Absolutely! Once your order ships, you'll receive a tracking number via email. You can also track your order through our website or by contacting our customer service team.",
        },
      ],
    },
    {
      category: 'Products & Quality',
      questions: [
        {
          q: 'Are your containers certified?',
          a: 'Yes, all our containers meet international standards. Our shipping containers are ISO certified, offshore containers are DNV 2.7-1 certified, and all products comply with relevant industry regulations. Certification documents are provided with each purchase.',
        },
        {
          q: 'What materials are your containers made from?',
          a: 'Our shipping containers are primarily made from Corten steel, known for its exceptional weathering properties. Storage tanks use 304 or 316 stainless steel. IBC containers feature HDPE inner bottles with steel cage frames. All materials are selected for durability and longevity.',
        },
        {
          q: 'Do you offer customization?',
          a: 'Yes, we offer extensive customization options including custom paint colors, modifications for doors/windows, insulation, electrical wiring, HVAC systems, and more. Contact our sales team to discuss your specific requirements.',
        },
        {
          q: 'What warranty do you offer?',
          a: 'We provide a 2-year standard warranty covering manufacturing defects. Extended warranty options are available. Warranty terms vary by product type - please refer to product specifications or contact us for details.',
        },
      ],
    },
    {
      category: 'Pricing & Payments',
      questions: [
        {
          q: 'Do you offer bulk discounts?',
          a: 'Yes, we offer tiered bulk pricing on most products. Discounts start at quantities of 5+ units with increasing savings for larger orders. Volume pricing is displayed on product pages where applicable.',
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards (Visa, MasterCard, mada), bank wire transfers, and company purchase orders for approved accounts. Payment terms of Net 30 are available for qualifying business customers.',
        },
        {
          q: 'Can I get a custom quote?',
          a: 'Absolutely! For large orders, custom configurations, or special requirements, contact our sales team for a personalized quote. We typically respond within 24 business hours.',
        },
      ],
    },
    {
      category: 'Returns & Support',
      questions: [
        {
          q: 'What is your return policy?',
          a: 'We offer a 30-day return policy for unused products in original condition. Custom or modified containers are non-returnable. Return shipping costs are the responsibility of the customer unless the return is due to our error. Contact customer service to initiate a return.',
        },
        {
          q: 'How do I report a problem with my order?',
          a: 'Contact our customer service team immediately at Hello@salada.sa or call 050 016 5914. Please have your order number ready and provide photos of any damage or issues. We aim to resolve all concerns within 48 hours.',
        },
        {
          q: 'Do you offer technical support?',
          a: 'Yes, our technical team is available to assist with installation, maintenance, and operational questions. We provide documentation with all products and offer on-site support for complex installations at additional cost.',
        },
      ],
    },
  ];

  const faqsAr = [
    {
      category: 'الطلبات والشحن',
      questions: [
        {
          q: 'ما هي خيارات الشحن المتاحة لديكم؟',
          a: 'نوفر خيارات شحن متعددة تشمل الشحن البري والنقل بالسكك الحديدية والشحن البحري للطلبات الدولية. الشحن مجاني للطلبات التي تتجاوز 37,500 ريال سعودي داخل المملكة العربية السعودية. تختلف أوقات التسليم حسب الموقع وتوفر المنتج.',
        },
        {
          q: 'كم تستغرق مدة التوصيل؟',
          a: 'التوصيل القياسي داخل المملكة العربية السعودية يستغرق عادة من 3 إلى 7 أيام عمل. الطلبات الدولية قد تستغرق من 2 إلى 6 أسابيع حسب الوجهة وطريقة الشحن. يتوفر الشحن السريع للطلبات العاجلة بتكلفة إضافية.',
        },
        {
          q: 'هل تشحنون دولياً؟',
          a: 'نعم، نشحن إلى أكثر من 120 دولة حول العالم. يتم احتساب أسعار الشحن الدولي عند إتمام الطلب بناءً على الوجهة والوزن والأبعاد. نتولى جميع إجراءات التخليص الجمركي لتوصيل سلس بدون متاعب.',
        },
        {
          q: 'هل يمكنني تتبع طلبي؟',
          a: 'بالتأكيد! بمجرد شحن طلبك، ستتلقى رقم التتبع عبر البريد الإلكتروني. يمكنك أيضاً تتبع طلبك من خلال موقعنا الإلكتروني أو بالتواصل مع فريق خدمة العملاء.',
        },
      ],
    },
    {
      category: 'المنتجات والجودة',
      questions: [
        {
          q: 'هل حاوياتكم معتمدة؟',
          a: 'نعم، جميع حاوياتنا تستوفي المعايير الدولية. حاويات الشحن لدينا حاصلة على شهادة ISO، وحاويات العمليات البحرية حاصلة على شهادة DNV 2.7-1، وجميع المنتجات تتوافق مع اللوائح الصناعية ذات الصلة. يتم توفير وثائق الشهادات مع كل عملية شراء.',
        },
        {
          q: 'ما هي المواد المصنوعة منها حاوياتكم؟',
          a: 'حاويات الشحن لدينا مصنوعة أساساً من فولاذ كورتن، المعروف بخصائصه الاستثنائية في مقاومة العوامل الجوية. خزانات التخزين تستخدم الفولاذ المقاوم للصدأ 304 أو 316. حاويات IBC تتميز بزجاجات داخلية من HDPE مع هياكل أقفاص فولاذية. جميع المواد مختارة للمتانة وطول العمر.',
        },
        {
          q: 'هل تقدمون خيارات التخصيص؟',
          a: 'نعم، نقدم خيارات تخصيص واسعة تشمل ألوان الطلاء المخصصة، وتعديلات الأبواب والنوافذ، والعزل الحراري، والتمديدات الكهربائية، وأنظمة التكييف، والمزيد. تواصل مع فريق المبيعات لمناقشة متطلباتك الخاصة.',
        },
        {
          q: 'ما هو الضمان الذي تقدمونه؟',
          a: 'نقدم ضماناً قياسياً لمدة سنتين يغطي عيوب التصنيع. تتوفر خيارات الضمان الممتد. تختلف شروط الضمان حسب نوع المنتج - يرجى الرجوع إلى مواصفات المنتج أو التواصل معنا للحصول على التفاصيل.',
        },
      ],
    },
    {
      category: 'الأسعار والدفع',
      questions: [
        {
          q: 'هل تقدمون خصومات على الكميات؟',
          a: 'نعم، نقدم أسعاراً متدرجة للكميات الكبيرة على معظم المنتجات. تبدأ الخصومات من كميات 5+ وحدات مع توفير متزايد للطلبات الأكبر. يتم عرض أسعار الجملة في صفحات المنتجات حيثما ينطبق ذلك.',
        },
        {
          q: 'ما هي طرق الدفع المقبولة؟',
          a: 'نقبل جميع بطاقات الائتمان الرئيسية (فيزا، ماستركارد، مدى)، والتحويلات البنكية، وأوامر الشراء للشركات للحسابات المعتمدة. تتوفر شروط الدفع الآجل (30 يوماً) للعملاء التجاريين المؤهلين.',
        },
        {
          q: 'هل يمكنني الحصول على عرض سعر مخصص؟',
          a: 'بالتأكيد! للطلبات الكبيرة أو التكوينات المخصصة أو المتطلبات الخاصة، تواصل مع فريق المبيعات للحصول على عرض سعر مخصص. نستجيب عادة خلال 24 ساعة عمل.',
        },
      ],
    },
    {
      category: 'الإرجاع والدعم',
      questions: [
        {
          q: 'ما هي سياسة الإرجاع لديكم؟',
          a: 'نقدم سياسة إرجاع لمدة 30 يوماً للمنتجات غير المستخدمة بحالتها الأصلية. الحاويات المخصصة أو المعدلة غير قابلة للإرجاع. تكاليف شحن الإرجاع على عاتق العميل ما لم يكن الإرجاع بسبب خطأ من جانبنا. تواصل مع خدمة العملاء لبدء عملية الإرجاع.',
        },
        {
          q: 'كيف أبلغ عن مشكلة في طلبي؟',
          a: 'تواصل مع فريق خدمة العملاء فوراً على Hello@salada.sa أو اتصل على 050 016 5914. يرجى تجهيز رقم طلبك وتقديم صور لأي أضرار أو مشاكل. نهدف إلى حل جميع المخاوف خلال 48 ساعة.',
        },
        {
          q: 'هل تقدمون الدعم الفني؟',
          a: 'نعم، فريقنا الفني متاح للمساعدة في أسئلة التركيب والصيانة والتشغيل. نوفر الوثائق مع جميع المنتجات ونقدم الدعم في الموقع للتركيبات المعقدة بتكلفة إضافية.',
        },
      ],
    },
  ];

  const faqs = isRTL ? faqsAr : faqsEn;

  const heroContent = {
    en: {
      label: 'Help Center',
      title: 'Frequently Asked Questions',
      description: "Find answers to common questions about our products, shipping, and services. Can't find what you're looking for? Contact us.",
      searchPlaceholder: 'Search questions...',
      noResults: 'No results found for',
      clearSearch: 'Clear search',
      stillQuestions: 'Still have questions?',
      stillQuestionsDesc: "Our team is here to help. Reach out and we'll get back to you within 24 hours.",
      contactSupport: 'Contact Support',
    },
    ar: {
      label: 'مركز المساعدة',
      title: 'الأسئلة الشائعة',
      description: 'اعثر على إجابات للأسئلة الشائعة حول منتجاتنا والشحن والخدمات. لم تجد ما تبحث عنه؟ تواصل معنا.',
      searchPlaceholder: 'ابحث في الأسئلة...',
      noResults: 'لا توجد نتائج لـ',
      clearSearch: 'مسح البحث',
      stillQuestions: 'لا تزال لديك أسئلة؟',
      stillQuestionsDesc: 'فريقنا هنا للمساعدة. تواصل معنا وسنرد عليك خلال 24 ساعة.',
      contactSupport: 'تواصل مع الدعم',
    },
  };

  const content = heroContent[language];

  const filteredFAQs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  let globalIndex = 0;

  return (
    <Layout>
      <Breadcrumb items={[{ label: isRTL ? 'الأسئلة الشائعة' : 'FAQ' }]} />
      {/* Hero */}
      <section className="bg-secondary border-b border-border py-16 md:py-24" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="industrial-container">
          <span className="industrial-label mb-4 block">{content.label}</span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {content.title}
          </h1>
          <p className="text-muted-foreground max-w-2xl mb-8 text-base">
            {content.description}
          </p>

          {/* Search */}
          <div className="max-w-xl relative">
            <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
            <input
              type="text"
              placeholder={content.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`industrial-input ${isRTL ? 'pr-12' : 'pl-12'}`}
            />
          </div>
        </div>
      </section>

      <section className="industrial-section" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="industrial-container">
          <div className="max-w-3xl mx-auto">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((category) => (
                <div key={category.category} className="mb-12">
                  <h2 className="text-lg md:text-xl font-bold mb-6 text-primary">
                    {category.category}
                  </h2>
                  <div className="space-y-1">
                    {category.questions.map((faq) => {
                      const currentIndex = globalIndex++;
                      return (
                        <div
                          key={faq.q}
                          className="border border-border bg-card"
                        >
                          <button
                            onClick={() =>
                              setOpenIndex(openIndex === currentIndex ? null : currentIndex)
                            }
                            className={`w-full flex items-center justify-between p-6 ${isRTL ? 'text-right' : 'text-left'}`}
                          >
                            <span className={`font-medium ${isRTL ? 'pl-4' : 'pr-4'}`}>{faq.q}</span>
                            <ChevronDown
                              className={`w-5 h-5 flex-shrink-0 transition-transform ${
                                openIndex === currentIndex ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          {openIndex === currentIndex && (
                            <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {content.noResults} "{searchQuery}"
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-primary hover:text-accent transition-colors"
                >
                  {content.clearSearch}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-secondary border-t border-border py-16" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="industrial-container text-center">
          <h2 className="text-2xl font-bold mb-4">{content.stillQuestions}</h2>
          <p className="text-muted-foreground mb-6">
            {content.stillQuestionsDesc}
          </p>
          <a href="/contact" className="industrial-button">
            {content.contactSupport}
          </a>
        </div>
      </section>
    </Layout>
  );
}
