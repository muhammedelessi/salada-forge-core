import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Ship, Plane, Warehouse, Wrench, Settings } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useLanguageStore } from '@/store/languageStore';
import { cn } from '@/lib/utils';
import heroImage from '@/assets/hero-logistics.jpg';
import seaImage from '@/assets/solutions-sea.jpg';
import storageImage from '@/assets/solutions-storage.jpg';
import lashingImage from '@/assets/divisions-lashing.jpg';

export default function SolutionsPage() {
  const { t, isRTL } = useLanguageStore();

  const ArrowIcon = () => (
    <ArrowRight className={`w-4 h-4 ${isRTL() ? 'mr-2 rotate-180' : 'ml-2'}`} />
  );

  const solutionSections = [
    {
      id: 'land',
      icon: Truck,
      title: t('solutions.landFreight'),
      challenge: t('solutions.landChallenge'),
      solution: t('solutions.landSolution'),
      impact: t('solutions.landImpact'),
      image: lashingImage,
    },
    {
      id: 'sea',
      icon: Ship,
      title: t('solutions.seaFreight'),
      challenge: t('solutions.seaChallenge'),
      solution: t('solutions.seaSolution'),
      impact: t('solutions.seaImpact'),
      image: seaImage,
    },
    {
      id: 'air',
      icon: Plane,
      title: t('solutions.airFreight'),
      challenge: t('solutions.airChallenge'),
      solution: t('solutions.airSolution'),
      impact: t('solutions.airImpact'),
      image: heroImage,
    },
    {
      id: 'storage',
      icon: Warehouse,
      title: t('solutions.storage'),
      challenge: t('solutions.storageChallenge'),
      solution: t('solutions.storageSolution'),
      impact: t('solutions.storageImpact'),
      image: storageImage,
    },
    {
      id: 'spare',
      icon: Wrench,
      title: t('solutions.spareParts'),
      challenge: t('solutions.spareChallenge'),
      solution: t('solutions.spareSolution'),
      impact: t('solutions.spareImpact'),
      image: lashingImage,
    },
    {
      id: 'custom',
      icon: Settings,
      title: t('solutions.customEng'),
      challenge: t('solutions.customChallenge'),
      solution: t('solutions.customSolution'),
      impact: t('solutions.customImpact'),
      image: seaImage,
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-secondary border-b border-border py-16 md:py-24">
        <div className={cn('industrial-container', isRTL() && 'text-right')}>
          <span className="industrial-label mb-4 block">{t('solutions.label')}</span>
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-6">
            {t('solutions.pageTitle')}
          </h1>
          <p className="text-muted-foreground text-xl max-w-3xl leading-relaxed">
            {t('solutions.pageDesc')}
          </p>
        </div>
      </section>

      {/* Solution Sections */}
      {solutionSections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className={cn(
            'industrial-section border-b border-border',
            index % 2 === 1 && 'bg-secondary/30'
          )}
        >
          <div className="industrial-container">
            <div className={cn(
              'grid lg:grid-cols-2 gap-12 items-center',
              index % 2 === 1 && 'lg:grid-flow-dense',
              isRTL() && 'lg:grid-flow-dense'
            )}>
              <div className={cn(
                isRTL() && 'text-right',
                index % 2 === 1 && !isRTL() && 'lg:col-start-2',
                index % 2 === 1 && isRTL() && 'lg:col-start-1'
              )}>
                <section.icon className="w-12 h-12 text-primary mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-6">{section.title}</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-primary font-mono mb-2">
                      {t('solutions.challengeLabel')}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{section.challenge}</p>
                  </div>
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-primary font-mono mb-2">
                      {t('solutions.solutionLabel')}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{section.solution}</p>
                  </div>
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-primary font-mono mb-2">
                      {t('solutions.impactLabel')}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{section.impact}</p>
                  </div>
                </div>

                <Link to="/contact" className={cn('industrial-button mt-8', isRTL() && 'flex-row-reverse')}>
                  {t('solutions.inquire')}
                  <ArrowIcon />
                </Link>
              </div>

              <div className={cn(
                'relative aspect-[4/3] overflow-hidden',
                index % 2 === 1 && !isRTL() && 'lg:col-start-1 lg:row-start-1',
                index % 2 === 1 && isRTL() && 'lg:col-start-2 lg:row-start-1'
              )}>
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      ))}

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
            className="inline-flex items-center justify-center px-8 py-4 bg-background text-foreground font-semibold uppercase tracking-wider text-sm"
          >
            {t('cta.getQuote')}
          </Link>
        </div>
      </section>
    </Layout>
  );
}
