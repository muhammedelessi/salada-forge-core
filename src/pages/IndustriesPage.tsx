import { Link } from 'react-router-dom';
import { ArrowRight, HardHat, Fuel, Factory, Anchor, Building2, Landmark } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useLanguageStore } from '@/store/languageStore';
import { cn } from '@/lib/utils';

export default function IndustriesPage() {
  const { t, isRTL } = useLanguageStore();

  const ArrowIcon = () => (
    <ArrowRight className={`w-4 h-4 ${isRTL() ? 'mr-2 rotate-180' : 'ml-2'}`} />
  );

  const industries = [
    {
      icon: HardHat,
      name: t('industries.construction'),
      desc: t('industries.constructionDesc'),
    },
    {
      icon: Fuel,
      name: t('industries.oilGas'),
      desc: t('industries.oilGasDesc'),
    },
    {
      icon: Factory,
      name: t('industries.manufacturing'),
      desc: t('industries.manufacturingDesc'),
    },
    {
      icon: Anchor,
      name: t('industries.logisticsPorts'),
      desc: t('industries.logisticsPortsDesc'),
    },
    {
      icon: Landmark,
      name: t('industries.government'),
      desc: t('industries.governmentDesc'),
    },
    {
      icon: Building2,
      name: t('industries.megaProjects'),
      desc: t('industries.megaProjectsDesc'),
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-secondary border-b border-border py-16 md:py-24">
        <div className={cn('industrial-container', isRTL() && 'text-right')}>
          <span className="industrial-label mb-4 block">{t('industries.label')}</span>
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-6">
            {t('industries.pageTitle')}
          </h1>
          <p className="text-muted-foreground text-xl max-w-3xl leading-relaxed">
            {t('industries.pageDesc')}
          </p>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="industrial-section">
        <div className="industrial-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {industries.map((industry) => (
              <div
                key={industry.name}
                className={cn(
                  'bg-card p-8 md:p-10 hover:bg-secondary transition-all duration-300',
                  isRTL() && 'text-right'
                )}
              >
                <industry.icon className="w-12 h-12 text-primary mb-6" />
                <h3 className="text-xl font-bold mb-4">{industry.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {industry.desc}
                </p>
                <Link
                  to="/contact"
                  className={cn(
                    'inline-flex items-center text-xs uppercase tracking-wider text-primary font-mono hover:underline',
                    isRTL() && 'flex-row-reverse'
                  )}
                >
                  {t('solutions.inquire')}
                  <ArrowIcon />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 bg-primary overflow-hidden">
        <div className="absolute inset-0 container-pattern opacity-10" />
        <div className="industrial-container relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6 uppercase tracking-tight">
            {t('industries.ctaTitle')}
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            {t('industries.ctaDesc')}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-background text-foreground font-semibold uppercase tracking-wider text-sm"
          >
            {t('cta.getQuote')}
          </Link>
        </div>
      </section>
    </Layout>
  );
}
