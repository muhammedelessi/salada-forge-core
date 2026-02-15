import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useLanguageStore } from '@/store/languageStore';
import { cn } from '@/lib/utils';
import heroImage from '@/assets/hero-logistics.jpg';
import seaImage from '@/assets/solutions-sea.jpg';
import storageImage from '@/assets/solutions-storage.jpg';
import lashingImage from '@/assets/divisions-lashing.jpg';
import heroPort from '@/assets/hero-port.jpg';

export default function SolutionsPage() {
  const { t, isRTL } = useLanguageStore();

  const ArrowIcon = () => (
    <ArrowRight className={`w-5 h-5 ${isRTL() ? 'mr-3 rotate-180' : 'ml-3'}`} />
  );

  const sections = [
    { id: 'land', title: t('solutions.landFreight'), image: lashingImage },
    { id: 'sea', title: t('solutions.seaFreight'), image: seaImage },
    { id: 'air', title: t('solutions.airFreight'), image: heroImage },
    { id: 'storage', title: t('solutions.storage'), image: storageImage },
    { id: 'spare', title: t('solutions.spareParts'), image: heroPort },
    { id: 'custom', title: t('solutions.customEng'), image: lashingImage },
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
          <span className="industrial-label mb-8 block text-primary">{t('solutions.label')}</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-[0.85] text-background">
            {t('solutions.pageTitle')}
          </h1>
        </div>
      </section>

      {/* Solution Sections — Alternating full-bleed */}
      {sections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className="border-b border-border"
        >
          <div className={cn(
            'grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]',
            index % 2 === 1 && 'lg:[direction:rtl]'
          )}>
            {/* Image */}
            <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
              <img
                src={section.image}
                alt={section.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content — only headline + CTA */}
            <div className={cn(
              'flex flex-col justify-center p-12 md:p-20 lg:p-24',
              index % 2 === 1 && 'lg:[direction:ltr]',
              isRTL() && 'text-right'
            )}>
              <span className="industrial-label mb-6 block">{String(index + 1).padStart(2, '0')}</span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter leading-[0.9] mb-10">
                {section.title}
              </h2>
              <Link
                to="/contact"
                className={cn('industrial-button self-start', isRTL() && 'flex-row-reverse self-end')}
              >
                {t('solutions.inquire')}
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="industrial-section bg-primary">
        <div className="industrial-container text-center">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground uppercase tracking-tighter leading-[0.9] mb-10">
            {t('cta.title')}
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