import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/SEOHead';
import { Breadcrumb } from '@/components/Breadcrumb';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useLanguageStore } from '@/store/languageStore';
import heroPort from '@/assets/hero-port.jpg';

export default function WhySaladaPage() {
  const seo = usePageSEO('/why-salada');
  const { t, isRTL } = useLanguageStore();

  const ArrowIcon = () => (
    <ArrowRight className="w-5 h-5 ltr:ml-3 rtl:mr-3 rtl:rotate-180" />
  );

  const checkpoints = [
    t('why.check1'),
    t('why.check2'),
    t('why.check3'),
    t('why.check4'),
    t('why.check5'),
  ];

  return (
    <Layout>
      <SEOHead {...seo} />
      <Breadcrumb items={[{ label: t('nav.whySalada') }]} />

      {/* Hero */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroPort} alt="Why choose Salada Metal Industries" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/70" />
        </div>
        <div className="industrial-container relative z-10 rtl:text-right">
          <span className="industrial-label mb-8 block text-primary">{t('why.label')}</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-[0.85] text-background">
            {t('why.pageTitle')}
          </h1>
        </div>
      </section>

      {/* Checkpoints */}
      <section className="industrial-section">
        <div className="industrial-container">
          <div className="max-w-3xl rtl:text-right">
            <div className="space-y-6 mb-12">
              {checkpoints.map((point) => (
                <div
                  key={point}
                  dir={isRTL() ? 'rtl' : 'ltr'}
                  className="flex items-center gap-4"
                >
                  <div className="w-8 h-8 bg-primary/10 flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-primary" strokeWidth={3} />
                  </div>
                  <span className="text-xl md:text-2xl font-bold uppercase tracking-tight">
                    {point}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t('why.supportingText')}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 md:py-48 overflow-hidden bg-primary">
        <div className="industrial-container text-center">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground uppercase tracking-tighter leading-[0.9] mb-10">
            {t('cta.title')}
          </h2>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-10 py-5 bg-background text-foreground font-semibold uppercase tracking-[0.2em] text-sm transition-all duration-300 hover:bg-secondary rtl:flex-row-reverse"
          >
            {t('cta.getQuote')}
            <ArrowIcon />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
