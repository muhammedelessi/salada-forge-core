import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/SEOHead';
import { Breadcrumb } from '@/components/Breadcrumb';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useLanguageStore } from '@/store/languageStore';
import { cn } from '@/lib/utils';
import heroPort from '@/assets/hero-port.jpg';

export default function IndustriesPage() {
  const seo = usePageSEO('/industries');
  const { t, isRTL } = useLanguageStore();
  const isAr = isRTL();

  const industries = [
    { name: t('industries.construction'), desc: t('industries.constructionDesc'), id: 'construction' },
    { name: t('industries.oilGas'), desc: t('industries.oilGasDesc'), id: 'oil-gas' },
    { name: t('industries.manufacturing'), desc: t('industries.manufacturingDesc'), id: 'manufacturing' },
    { name: t('industries.logisticsPorts'), desc: t('industries.logisticsPortsDesc'), id: 'logistics' },
    { name: t('industries.government'), desc: t('industries.governmentDesc'), id: 'government' },
    { name: t('industries.megaProjects'), desc: t('industries.megaProjectsDesc'), id: 'mega' },
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
        <div className={cn('industrial-container relative z-10', isAr && 'text-right')}>
          <span className="industrial-label mb-8 block text-primary">{t('industries.label')}</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-[0.85] text-background">
            {t('industries.pageTitle')}
          </h1>
          <p className="mt-6 text-lg text-background/70 max-w-2xl">
            {t('industries.pageDesc')}
          </p>
        </div>
      </section>

      {/* Industries — with descriptions */}
      <section className="industrial-section">
        <div className="industrial-container">
          <div className="border-t border-border">
            {industries.map((industry, index) => (
              <div
                key={industry.id}
                id={industry.id}
                className={cn(
                  'group flex items-start justify-between py-10 md:py-14 border-b border-border hover:pl-6 transition-all duration-300',
                  isAr && 'flex-row-reverse hover:pr-6 hover:pl-0'
                )}
              >
                <div className={cn('flex-1', isAr && 'text-right')}>
                  <div className={cn('flex items-center gap-6 mb-3', isAr && 'flex-row-reverse')}>
                    <span className="text-sm font-mono text-muted-foreground">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-2xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tighter group-hover:text-primary transition-colors">
                      {industry.name}
                    </span>
                  </div>
                  <p className={cn('text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed', isAr ? 'mr-14' : 'ml-14')}>
                    {industry.desc}
                  </p>
                </div>
                <div className={cn('flex items-center gap-3 mt-2 flex-shrink-0', isAr && 'flex-row-reverse')}>
                  <Link
                    to="/contact"
                    className="hidden md:inline-flex text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors font-medium"
                  >
                    {isAr ? 'اعرف المزيد' : 'Learn More'}
                  </Link>
                  <ArrowRight className={cn(
                    'w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors',
                    isAr && 'rotate-180'
                  )} />
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-10 py-5 bg-background text-foreground font-semibold uppercase tracking-[0.2em] text-sm transition-all duration-300 hover:bg-secondary"
            >
              {t('cta.getQuote')}
            </Link>
            <Link
              to="/solutions"
              className="inline-flex items-center justify-center px-10 py-5 border-2 border-primary-foreground text-primary-foreground font-semibold uppercase tracking-[0.2em] text-sm transition-all duration-300 hover:bg-primary-foreground hover:text-primary"
            >
              {isAr ? 'استكشف الحلول' : 'Explore Solutions'}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
