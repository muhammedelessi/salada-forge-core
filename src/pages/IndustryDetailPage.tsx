import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/SEOHead';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useLanguageStore } from '@/store/languageStore';

const industryData: Record<string, { nameKey: string; descKey: string }> = {
  construction: { nameKey: 'industries.construction', descKey: 'industries.constructionDesc' },
  'oil-gas': { nameKey: 'industries.oilGas', descKey: 'industries.oilGasDesc' },
  manufacturing: { nameKey: 'industries.manufacturing', descKey: 'industries.manufacturingDesc' },
  logistics: { nameKey: 'industries.logisticsPorts', descKey: 'industries.logisticsPortsDesc' },
  government: { nameKey: 'industries.government', descKey: 'industries.governmentDesc' },
  mega: { nameKey: 'industries.megaProjects', descKey: 'industries.megaProjectsDesc' },
};

export default function IndustryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, isRTL } = useLanguageStore();
  const isAr = isRTL();

  const industry = id ? industryData[id] : undefined;
  const name = industry ? t(industry.nameKey) : id ?? '';
  const desc = industry ? t(industry.descKey) : '';

  return (
    <Layout>
      <SEOHead title={`${name} | Salada`} description={desc} />
      <Breadcrumb items={[{ label: t('nav.industries'), href: '/industries' }, { label: name }]} />

      {/* Hero */}
      <section className="industrial-section border-b border-border">
        <div className="industrial-container rtl:text-right">
          <span className="industrial-label mb-8 block text-primary">
            {t('industries.label')}
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-[0.85]">
            {name}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">{desc}</p>
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
            <ArrowRight className="w-5 h-5 ltr:ml-3 rtl:mr-3 rtl:rotate-180" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
