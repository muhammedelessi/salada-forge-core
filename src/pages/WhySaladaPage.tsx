import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, MapPin, CheckCircle, Award, Handshake } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useLanguageStore } from '@/store/languageStore';
import { cn } from '@/lib/utils';

export default function WhySaladaPage() {
  const { t, isRTL } = useLanguageStore();

  const ArrowIcon = () => (
    <ArrowRight className={`w-4 h-4 ${isRTL() ? 'mr-2 rotate-180' : 'ml-2'}`} />
  );

  const strengths = [
    { icon: Handshake, title: t('why.onePartner'), desc: t('why.onePartnerDesc') },
    { icon: Zap, title: t('why.rapidDeployment'), desc: t('why.rapidDeploymentDesc') },
    { icon: MapPin, title: t('why.nationalCoverage'), desc: t('why.nationalCoverageDesc') },
    { icon: CheckCircle, title: t('why.compliance'), desc: t('why.complianceDesc') },
    { icon: Award, title: t('why.localSupply'), desc: t('why.localSupplyDesc') },
    { icon: Shield, title: t('why.continuity'), desc: t('why.continuityDesc') },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-secondary border-b border-border py-16 md:py-24">
        <div className={cn('industrial-container', isRTL() && 'text-right')}>
          <span className="industrial-label mb-4 block">{t('why.label')}</span>
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-6">
            {t('why.pageTitle')}
          </h1>
          <p className="text-muted-foreground text-xl max-w-3xl leading-relaxed">
            {t('why.pageDesc')}
          </p>
        </div>
      </section>

      {/* Strengths Grid */}
      <section className="industrial-section">
        <div className="industrial-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {strengths.map((item) => (
              <div
                key={item.title}
                className={cn(
                  'bg-card p-8 md:p-10 hover:bg-secondary transition-all duration-300',
                  isRTL() && 'text-right'
                )}
              >
                <item.icon className="w-12 h-12 text-primary mb-6" />
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
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
            {t('cta.title')}
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <Link
            to="/contact"
            className={cn(
              'inline-flex items-center justify-center px-8 py-4 bg-background text-foreground font-semibold uppercase tracking-wider text-sm',
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
