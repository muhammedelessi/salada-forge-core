import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/SEOHead';
import { Breadcrumb } from '@/components/Breadcrumb';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useLanguageStore } from '@/store/languageStore';
import { cn } from '@/lib/utils';
import heroPort from '@/assets/hero-port.jpg';

export default function WhySaladaPage() {
  const seo = usePageSEO('/why-salada');
  const { t, isRTL } = useLanguageStore();

  const ArrowIcon = () => (
    <ArrowRight className={`w-5 h-5 ${isRTL() ? 'mr-3 rotate-180' : 'ml-3'}`} />
  );

  const strengths = [
    t('why.onePartner'),
    t('why.rapidDeployment'),
    t('why.nationalCoverage'),
    t('why.compliance'),
    t('why.localSupply'),
    t('why.continuity'),
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
        <div className={cn('industrial-container relative z-10', isRTL() && 'text-right')}>
          <span className="industrial-label mb-8 block text-primary">{t('why.label')}</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-[0.85] text-background">
            {t('why.pageTitle')}
          </h1>
        </div>
      </section>

      {/* Strengths — Bold numbered list */}
      <section className="industrial-section">
        <div className="industrial-container">
          <div className="border-t border-border">
            {strengths.map((title, index) => (
              <div
                key={title}
                className={cn(
                  'group flex items-center justify-between py-10 md:py-14 border-b border-border hover:pl-6 transition-all duration-300',
                  isRTL() && 'flex-row-reverse hover:pr-6 hover:pl-0'
                )}
              >
                <div className={cn('flex items-center gap-8', isRTL() && 'flex-row-reverse')}>
                  <span className="text-sm font-mono text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tighter group-hover:text-primary transition-colors">
                    {title}
                  </span>
                </div>
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
            className={cn(
              'inline-flex items-center justify-center px-10 py-5 bg-background text-foreground font-semibold uppercase tracking-[0.2em] text-sm transition-all duration-300 hover:bg-secondary',
              isRTL() && 'flex-row-reverse'
            )}
          >
            {t('cta.getQuote')}
            <ArrowIcon />
          </Link>
        </div>
      </section>
    </Layout>
  );
}