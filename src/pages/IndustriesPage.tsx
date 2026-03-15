import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/SEOHead';
import { Breadcrumb } from '@/components/Breadcrumb';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useLanguageStore } from '@/store/languageStore';
import heroPort from '@/assets/hero-port.jpg';

export default function IndustriesPage() {
  const seo = usePageSEO('/industries');
  const { t, isRTL } = useLanguageStore();
  const isAr = isRTL();

  const industries = [
    { name: t('industries.logistics'), desc: t('industries.logisticsDesc'), id: 'logistics' },
    { name: t('industries.construction'), desc: t('industries.constructionDesc'), id: 'construction' },
    { name: t('industries.government'), desc: t('industries.governmentDesc'), id: 'government' },
    { name: t('industries.industrial'), desc: t('industries.industrialDesc'), id: 'industrial' },
    { name: t('industries.storage'), desc: t('industries.storageDesc'), id: 'storage' },
  ];

  return (
    <Layout>
      <SEOHead {...seo} />
      <Breadcrumb items={[{ label: t('nav.industries') }]} />

      {/* Hero */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroPort} alt="Industrial sectors served by Salada" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/70" />
        </div>
        <div className="industrial-container relative z-10 rtl:text-right">
          <span className="industrial-label mb-8 block text-primary">{t('industries.label')}</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-[0.85] text-background">
            {t('industries.pageTitle')}
          </h1>
          <p className="mt-6 text-lg text-background/70 max-w-2xl">
            {t('industries.pageDesc')}
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="border-b border-border bg-secondary">
        <div className="industrial-container py-16 md:py-24 rtl:text-right">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('industries.introTitle')}</h2>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {t('industries.introDesc')}
          </p>
        </div>
      </section>

      {/* Industries */}
      <section className="industrial-section">
        <div className="industrial-container">
          <div className="border-t border-border">
            {industries.map((industry, index) => (
              <div
                key={industry.id}
                id={industry.id}
                dir={isAr ? 'rtl' : 'ltr'}
                className="group flex items-start justify-between py-10 md:py-14 border-b border-border ltr:hover:pl-6 rtl:hover:pr-6 transition-all duration-300"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-6 mb-3">
                    <span className="text-sm font-mono text-muted-foreground">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-2xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tighter group-hover:text-primary transition-colors">
                      {industry.name}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed ltr:ml-14 rtl:mr-14">
                    {industry.desc}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-2 flex-shrink-0">
                  <ArrowRight className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors rtl:rotate-180" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 md:py-48 overflow-hidden bg-primary">
        <div className="industrial-container text-center">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground uppercase tracking-tighter leading-[0.9] mb-4">
            {t('industries.ctaTitle')}
          </h2>
          <p className="text-primary-foreground/70 max-w-xl mx-auto mb-10">
            {t('industries.ctaDesc')}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-10 py-5 bg-background text-foreground font-semibold uppercase tracking-[0.2em] text-sm transition-all duration-300 hover:bg-secondary"
          >
            {t('cta.getQuote')}
          </Link>
        </div>
      </section>
    </Layout>
  );
}
