import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Ship, Plane, Warehouse, Wrench, Settings, Shield, Globe, CheckCircle, Zap, MapPin } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useLanguageStore } from '@/store/languageStore';
import heroImage from '@/assets/hero-logistics.jpg';
import seaImage from '@/assets/solutions-sea.jpg';
import storageImage from '@/assets/solutions-storage.jpg';
import lashingImage from '@/assets/divisions-lashing.jpg';

export default function HomePage() {
  const { t, isRTL } = useLanguageStore();

  const ArrowIcon = () => (
    <ArrowRight className={`w-4 h-4 ${isRTL() ? 'mr-2 rotate-180' : 'ml-2'}`} />
  );

  const solutions = [
    {
      icon: Truck,
      title: t('solutions.landFreight'),
      description: t('solutions.landFreightDesc'),
      image: lashingImage,
      href: '/solutions#land',
    },
    {
      icon: Ship,
      title: t('solutions.seaFreight'),
      description: t('solutions.seaFreightDesc'),
      image: seaImage,
      href: '/solutions#sea',
    },
    {
      icon: Plane,
      title: t('solutions.airFreight'),
      description: t('solutions.airFreightDesc'),
      image: heroImage,
      href: '/solutions#air',
    },
    {
      icon: Warehouse,
      title: t('solutions.storage'),
      description: t('solutions.storageDesc'),
      image: storageImage,
      href: '/solutions#storage',
    },
  ];

  const stats = [
    { value: '15+', label: t('stats.yearsExperience') },
    { value: '500+', label: t('stats.projectsDelivered') },
    { value: '50+', label: t('stats.clientsServed') },
    { value: '99.5%', label: t('stats.onTimeDelivery') },
  ];

  const whySalada = [
    {
      icon: Shield,
      title: t('why.onePartner'),
      description: t('why.onePartnerDesc'),
    },
    {
      icon: Zap,
      title: t('why.rapidDeployment'),
      description: t('why.rapidDeploymentDesc'),
    },
    {
      icon: MapPin,
      title: t('why.nationalCoverage'),
      description: t('why.nationalCoverageDesc'),
    },
    {
      icon: CheckCircle,
      title: t('why.compliance'),
      description: t('why.complianceDesc'),
    },
  ];

  const industries = [
    { name: t('industries.construction'), icon: '🏗️' },
    { name: t('industries.oilGas'), icon: '🛢️' },
    { name: t('industries.manufacturing'), icon: '🏭' },
    { name: t('industries.logisticsPorts'), icon: '🚢' },
    { name: t('industries.government'), icon: '🏛️' },
    { name: t('industries.megaProjects'), icon: '📐' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20" />
        </div>
        
        <div className="industrial-container relative z-10">
          <div className={`max-w-4xl ${isRTL() ? 'mr-0 text-right' : ''}`}>
            <span className="industrial-label animate-industrial-fade">{t('hero.label')}</span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter mt-6 mb-8 animate-industrial-fade delay-100 leading-[0.9]">
              {t('hero.title')}
              <span className="block text-gradient">{t('hero.titleHighlight')}</span>
            </h1>
            <p className={`text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10 animate-industrial-fade delay-200 leading-relaxed ${isRTL() ? 'mr-0' : ''}`}>
              {t('hero.description')}
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 animate-industrial-fade delay-300 ${isRTL() ? 'sm:flex-row-reverse' : ''}`}>
              <Link to="/solutions" className={`industrial-button ${isRTL() ? 'flex-row-reverse' : ''}`}>
                {t('hero.cta')}
                <ArrowIcon />
              </Link>
              <Link to="/contact" className="industrial-button-outline">
                {t('hero.quote')}
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </section>

      {/* Vision 2030 Intro */}
      <section className="border-y border-border bg-secondary/50">
        <div className="industrial-container py-16 md:py-20">
          <div className={`max-w-4xl mx-auto text-center ${isRTL() ? 'text-center' : ''}`}>
            <span className="industrial-label mb-4 block">{t('vision.label')}</span>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 leading-snug">
              {t('vision.title')}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t('vision.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-border">
        <div className="industrial-container">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`py-10 md:py-16 text-center ${
                  index < stats.length - 1 ? `${isRTL() ? 'border-l' : 'border-r'} border-border` : ''
                }`}
              >
                <div className="text-3xl md:text-5xl font-bold text-primary mb-2 font-mono">
                  {stat.value}
                </div>
                <div className="text-sm uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions — Land, Sea, Air, Storage */}
      <section className="industrial-section">
        <div className="industrial-container">
          <div className={`mb-16 ${isRTL() ? 'text-right' : ''}`}>
            <span className="industrial-label mb-4 block">{t('solutions.label')}</span>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight">
              {t('solutions.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {solutions.map((solution) => (
              <Link
                key={solution.title}
                to={solution.href}
                className={`group relative bg-card overflow-hidden ${isRTL() ? 'text-right' : ''}`}
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={solution.image}
                    alt={solution.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                  <solution.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {solution.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 max-w-md">
                    {solution.description}
                  </p>
                  <span className={`inline-flex items-center text-xs uppercase tracking-wider text-primary font-mono opacity-0 group-hover:opacity-100 transition-opacity ${isRTL() ? 'flex-row-reverse' : ''}`}>
                    {t('solutions.learnMore')}
                    <ArrowIcon />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="industrial-section bg-secondary/30 border-y border-border">
        <div className="industrial-container">
          <div className={`grid lg:grid-cols-2 gap-16 items-center ${isRTL() ? 'lg:grid-flow-dense' : ''}`}>
            <div className={isRTL() ? 'text-right lg:col-start-2' : ''}>
              <span className="industrial-label mb-4 block">{t('industries.label')}</span>
              <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-6">
                {t('industries.title')}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {t('industries.description')}
              </p>
              <Link to="/industries" className={`industrial-button ${isRTL() ? 'flex-row-reverse' : ''}`}>
                {t('industries.viewAll')}
                <ArrowIcon />
              </Link>
            </div>
            <div className={`grid grid-cols-2 gap-px bg-border ${isRTL() ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
              {industries.map((industry, index) => (
                <div
                  key={index}
                  className={`bg-card p-6 hover:bg-secondary transition-colors ${isRTL() ? 'text-right' : ''}`}
                >
                  <span className="text-2xl mb-3 block">{industry.icon}</span>
                  <span className="text-sm font-semibold">{industry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Salada */}
      <section className="industrial-section">
        <div className="industrial-container">
          <div className="text-center mb-16">
            <span className="industrial-label mb-4 block">{t('why.label')}</span>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight">
              {t('why.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {whySalada.map((item) => (
              <div
                key={item.title}
                className={`bg-card p-8 hover:bg-secondary transition-all duration-300 ${isRTL() ? 'text-right' : ''}`}
              >
                <item.icon className={`w-10 h-10 text-primary mb-6 ${isRTL() ? 'mr-auto' : ''}`} />
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 container-pattern opacity-10" />
        
        <div className="industrial-container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6 uppercase tracking-tight">
              {t('cta.title')}
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-10">
              {t('cta.description')}
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL() ? 'sm:flex-row-reverse' : ''}`}>
              <Link
                to="/contact"
                className={`inline-flex items-center justify-center px-8 py-4 bg-background text-foreground font-semibold uppercase tracking-wider text-sm transition-all duration-300 hover:bg-secondary ${isRTL() ? 'flex-row-reverse' : ''}`}
              >
                {t('cta.getQuote')}
                <ArrowIcon />
              </Link>
              <Link
                to="/solutions"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-foreground text-primary-foreground font-semibold uppercase tracking-wider text-sm transition-all duration-300 hover:bg-primary-foreground hover:text-primary"
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
