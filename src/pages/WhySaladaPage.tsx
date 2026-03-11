import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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

  const strengths = [
    { title: t('why.onePartner'), desc: t('why.onePartnerDesc') },
    { title: t('why.rapidDeployment'), desc: t('why.rapidDeploymentDesc') },
    { title: t('why.nationalCoverage'), desc: t('why.nationalCoverageDesc') },
    { title: t('why.compliance'), desc: t('why.complianceDesc') },
    { title: t('why.localSupply'), desc: t('why.localSupplyDesc') },
  ];

  return (
    <Layout>
      <SEOHead {...seo} />
      <Breadcrumb items={[{ label: t('nav.whySalada') }]} />
      {/* Hero */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroPort} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/70" />
        </div>
        <div className="industrial-container relative z-10 rtl:text-right">
          <span className="industrial-label mb-8 block text-primary">{t('why.label')}</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-[0.85] text-background">
            {t('why.pageTitle')}
          </h1>
        </div>
      </section>

      {/* Strengths */}
      <section className="industrial-section">
        <div className="industrial-container">
          <div className="border-t border-border">
            {strengths.map((title, index) => (
              <div
                key={title}
                dir={isRTL() ? 'rtl' : 'ltr'}
                className="group flex items-center py-10 md:py-14 border-b border-border ltr:hover:pl-6 rtl:hover:pr-6 transition-all duration-300 gap-8"
              >
                <span className="text-sm font-mono text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tighter group-hover:text-primary transition-colors">
                  {title}
                </span>
              </div>
            ))}
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
