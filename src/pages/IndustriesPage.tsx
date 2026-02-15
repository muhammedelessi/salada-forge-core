import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useLanguageStore } from '@/store/languageStore';
import { cn } from '@/lib/utils';
import heroPort from '@/assets/hero-port.jpg';

export default function IndustriesPage() {
  const { t, isRTL } = useLanguageStore();

  const industries = [
    t('industries.construction'),
    t('industries.oilGas'),
    t('industries.manufacturing'),
    t('industries.logisticsPorts'),
    t('industries.government'),
    t('industries.megaProjects'),
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroPort} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/70" />
        </div>
        <div className={cn('industrial-container relative z-10', isRTL() && 'text-right')}>
          <span className="industrial-label mb-8 block text-primary">{t('industries.label')}</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-[0.85] text-background">
            {t('industries.pageTitle')}
          </h1>
        </div>
      </section>

      {/* Industries — Bold list */}
      <section className="industrial-section">
        <div className="industrial-container">
          <div className="border-t border-border">
            {industries.map((name, index) => (
              <div
                key={name}
                className={cn(
                  'group flex items-center justify-between py-10 md:py-14 border-b border-border hover:pl-6 transition-all duration-300',
                  isRTL() && 'flex-row-reverse hover:pr-6 hover:pl-0'
                )}
              >
                <div className={cn('flex items-center gap-8', isRTL() && 'flex-row-reverse')}>
                  <span className="text-sm font-mono text-muted-foreground">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-2xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tighter group-hover:text-primary transition-colors">
                    {name}
                  </span>
                </div>
                <ArrowRight className={cn(
                  'w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors',
                  isRTL() && 'rotate-180'
                )} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 md:py-48 overflow-hidden bg-primary">
        <div className="industrial-container text-center">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground uppercase tracking-tighter leading-[0.9] mb-10">
            {t('industries.ctaTitle')}
          </h2>
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