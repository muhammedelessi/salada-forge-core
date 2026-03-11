import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/SEOHead';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useLanguageStore } from '@/store/languageStore';
import heroImage from '@/assets/hero-logistics.jpg';
import seaImage from '@/assets/solutions-sea.jpg';
import storageImage from '@/assets/solutions-storage.jpg';
import lashingImage from '@/assets/divisions-lashing.jpg';
import heroPort from '@/assets/hero-port.jpg';

export default function HomePage() {
  const { t, isRTL } = useLanguageStore();

  const ArrowIcon = () => (
    <ArrowRight className={`w-5 h-5 ${isRTL() ? 'mr-3 rotate-180' : 'ml-3'}`} />
  );

  const solutions = [
    { title: t('solutions.landFreight'), image: lashingImage, href: '/solutions#land' },
    { title: t('solutions.seaFreight'), image: seaImage, href: '/solutions#sea' },
    { title: t('solutions.airFreight'), image: heroImage, href: '/solutions#air' },
    { title: t('solutions.storage'), image: storageImage, href: '/solutions#storage' },
  ];

  const stats = [
    { value: '10+', label: t('stats.yearsExperience') },
    { value: '200+', label: t('stats.projectsDelivered') },
    { value: '50+', label: t('stats.clientsServed') },
    { value: '99.5%', label: t('stats.onTimeDelivery') },
  ];

  const seo = usePageSEO('/');

  return (
    <Layout>
      <SEOHead {...seo} />
      {/* ── HERO ── Monumental, cinematic, zero clutter */}
      <section className="relative min-h-screen flex items-end overflow-hidden pb-24 md:pb-32">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Salada Metal Industries — industrial shipping port" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-foreground/20" />
        </div>

        <div className="industrial-container relative z-10">
          <div className={`max-w-5xl ${isRTL() ? 'mr-0 text-right' : ''}`}>
            <h1 className="text-5xl md:text-8xl lg:text-[7rem] font-bold uppercase tracking-tighter leading-[0.85] text-background animate-industrial-fade">
              {t('hero.title')}
              <span className="block text-primary">{t('hero.titleHighlight')}</span>
            </h1>
            <div className={`flex flex-col sm:flex-row gap-4 mt-12 animate-industrial-fade delay-300 ${isRTL() ? 'sm:flex-row-reverse' : ''}`}>
              <Link to="/solutions" className={`industrial-button ${isRTL() ? 'flex-row-reverse' : ''}`}>
                {t('hero.cta')}
                <ArrowIcon />
              </Link>
              <Link to="/contact" className="inline-flex items-center justify-center px-10 py-5 border-2 border-background text-background font-semibold uppercase tracking-[0.2em] text-sm transition-all duration-300 hover:bg-background hover:text-foreground">
                {t('hero.quote')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── Clean horizontal band */}
      <section className="border-b border-border">
        <div className="industrial-container">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`py-14 md:py-20 text-center ${
                  index < stats.length - 1 ? 'border-r border-border' : ''
                }`}
              >
                <div className="text-4xl md:text-6xl font-bold text-primary mb-3 font-mono">
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VISION 2030 ── Single powerful statement */}
      <section className="industrial-section border-b border-border">
        <div className="industrial-container">
          <div className={`max-w-5xl ${isRTL() ? 'mr-0 text-right' : ''}`}>
            <span className="industrial-label mb-8 block">{t('vision.label')}</span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter leading-[0.9]">
              {t('vision.title')}
            </h2>
          </div>
        </div>
      </section>

      {/* ── SOLUTIONS ── Full-bleed image grid, headline overlays only */}
      <section className="border-b border-border">
        <div className="industrial-container py-24 md:py-32">
          <div className={`mb-20 ${isRTL() ? 'text-right' : ''}`}>
            <span className="industrial-label mb-6 block">{t('solutions.label')}</span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter">
              {t('solutions.title')}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {solutions.map((solution) => (
            <Link
              key={solution.title}
              to={solution.href}
              className="group relative aspect-[16/10] overflow-hidden border-b border-r border-border"
            >
              <img
                src={solution.image}
                alt={solution.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className={`absolute bottom-0 left-0 right-0 p-8 md:p-12 ${isRTL() ? 'text-right' : ''}`}>
                <h3 className="text-2xl md:text-4xl font-bold text-background uppercase tracking-tight group-hover:text-primary transition-colors duration-300">
                  {solution.title}
                </h3>
                <span className={`inline-flex items-center text-xs uppercase tracking-[0.25em] text-primary font-mono mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isRTL() ? 'flex-row-reverse' : ''}`}>
                  {t('solutions.learnMore')}
                  <ArrowIcon />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── INDUSTRIES ── Minimal text-only list */}
      <section className="industrial-section border-b border-border">
        <div className="industrial-container">
          <div className={`mb-20 ${isRTL() ? 'text-right' : ''}`}>
            <span className="industrial-label mb-6 block">{t('industries.label')}</span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter">
              {t('industries.title')}
            </h2>
          </div>

          <div className="border-t border-border">
            {[
              t('industries.construction'),
              t('industries.oilGas'),
              t('industries.manufacturing'),
              t('industries.logisticsPorts'),
              t('industries.government'),
              t('industries.megaProjects'),
            ].map((name) => (
              <Link
                key={name}
                to="/industries"
                className={`group flex items-center justify-between py-6 md:py-8 border-b border-border hover:pl-4 transition-all duration-300 ${isRTL() ? 'flex-row-reverse hover:pr-4 hover:pl-0' : ''}`}
              >
                <span className="text-xl md:text-3xl font-bold uppercase tracking-tight group-hover:text-primary transition-colors">
                  {name}
                </span>
                <ArrowRight className={`w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors ${isRTL() ? 'rotate-180' : ''}`} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY SALADA ── Bold headline + minimal grid */}
      <section className="industrial-section border-b border-border">
        <div className="industrial-container">
          <div className={`mb-20 text-center`}>
            <span className="industrial-label mb-6 block">{t('why.label')}</span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter">
              {t('why.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-border">
            {[
              { title: t('why.onePartner') },
              { title: t('why.rapidDeployment') },
              { title: t('why.nationalCoverage') },
              { title: t('why.compliance') },
            ].map((item) => (
              <div
                key={item.title}
                className={`border-b border-r border-border p-10 md:p-12 hover:bg-secondary/50 transition-colors duration-300 ${isRTL() ? 'text-right' : ''}`}
              >
                <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── Full-bleed cinematic */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroPort} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/70" />
        </div>

        <div className="industrial-container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-background mb-10 uppercase tracking-tighter leading-[0.9]">
              {t('cta.title')}
            </h2>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL() ? 'sm:flex-row-reverse' : ''}`}>
              <Link
                to="/contact"
                className={`industrial-button ${isRTL() ? 'flex-row-reverse' : ''}`}
              >
                {t('cta.getQuote')}
                <ArrowIcon />
              </Link>
              <Link
                to="/solutions"
                className="inline-flex items-center justify-center px-10 py-5 border-2 border-background text-background font-semibold uppercase tracking-[0.2em] text-sm transition-all duration-300 hover:bg-background hover:text-foreground"
              >
                {t('cta.browseCatalog')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}