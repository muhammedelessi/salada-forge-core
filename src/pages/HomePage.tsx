import { Link } from 'react-router-dom';
import { ArrowRight, Anchor, Ship, Shield, Link2, Wrench, Container, Globe, CheckCircle, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useLanguageStore } from '@/store/languageStore';
import heroImage from '@/assets/hero-port.jpg';
import lashingImage from '@/assets/divisions-lashing.jpg';

export default function HomePage() {
  const { t, isRTL } = useLanguageStore();

  const stats = [
    { value: '50K+', label: t('stats.unitsDelivered') },
    { value: '25+', label: t('stats.yearsExperience') },
    { value: '120+', label: t('stats.countriesServed') },
    { value: '99.8%', label: t('stats.onTimeDelivery') },
  ];

  const divisions = [
    {
      icon: Link2,
      title: t('divisions.lashing'),
      description: t('divisions.lashingDesc'),
      href: '/shop?category=lashing-equipment',
      label: '01',
    },
    {
      icon: Container,
      title: t('divisions.container'),
      description: t('divisions.containerDesc'),
      href: '/shop?category=land-shipping-container',
      label: '02',
    },
    {
      icon: Anchor,
      title: t('divisions.port'),
      description: t('divisions.portDesc'),
      href: '/shop?category=spare-parts',
      label: '03',
    },
    {
      icon: Wrench,
      title: t('divisions.hardware'),
      description: t('divisions.hardwareDesc'),
      href: '/shop?category=spare-parts',
      label: '04',
    },
    {
      icon: Ship,
      title: t('divisions.logistics'),
      description: t('divisions.logisticsDesc'),
      href: '/shop?category=storage-containers',
      label: '05',
    },
  ];

  const industries = [
    t('industries.ports'),
    t('industries.shippingLines'),
    t('industries.freightForwarders'),
    t('industries.offshore'),
    t('industries.industrialLogistics'),
    t('industries.maritimeContractors'),
    t('industries.governmentTransport'),
    t('industries.defenseLogistics'),
  ];

  const strengths = [
    {
      icon: Shield,
      title: t('why.certifiedQuality'),
      description: t('why.certifiedQualityDesc'),
    },
    {
      icon: Globe,
      title: t('why.globalLogistics'),
      description: t('why.globalLogisticsDesc'),
    },
    {
      icon: Wrench,
      title: t('why.industrialGrade'),
      description: t('why.industrialGradeDesc'),
    },
    {
      icon: CheckCircle,
      title: t('why.fastDeployment'),
      description: t('why.fastDeploymentDesc'),
    },
  ];

  const ArrowIcon = () => (
    <ArrowRight className={`w-4 h-4 ${isRTL() ? 'mr-2 rotate-180' : 'ml-2'}`} />
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
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
              <Link to="/shop" className={`industrial-button ${isRTL() ? 'flex-row-reverse' : ''}`}>
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

      {/* Stats Section */}
      <section className="border-y border-border bg-secondary/50">
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

      {/* Core Divisions */}
      <section className="industrial-section">
        <div className="industrial-container">
          <div className={`mb-16 ${isRTL() ? 'text-right' : ''}`}>
            <span className="industrial-label mb-4 block">{t('divisions.label')}</span>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight">
              {t('divisions.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {divisions.map((division) => (
              <Link
                key={division.label}
                to={division.href}
                className={`group relative bg-card p-8 md:p-10 hover:bg-secondary transition-all duration-500 ${isRTL() ? 'text-right' : ''}`}
              >
                <div className={`absolute top-6 ${isRTL() ? 'left-6' : 'right-6'} text-5xl font-bold text-border font-mono group-hover:text-primary/20 transition-colors`}>
                  {division.label}
                </div>
                <division.icon className={`w-10 h-10 text-primary mb-6 ${isRTL() ? 'mr-0' : ''}`} />
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {division.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {division.description}
                </p>
                <span className={`inline-flex items-center text-xs uppercase tracking-wider text-primary font-mono opacity-0 group-hover:opacity-100 transition-opacity ${isRTL() ? 'flex-row-reverse' : ''}`}>
                  {t('divisions.explore')}
                  <ArrowIcon />
                </span>
              </Link>
            ))}
            {/* Visual accent card */}
            <div className="relative bg-card overflow-hidden hidden lg:block">
              <img src={lashingImage} alt="" className="w-full h-full object-cover opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-sm text-primary font-mono uppercase tracking-wider">
                  {t('divisions.engineered')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Served */}
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
              <Link to="/contact" className={`industrial-button ${isRTL() ? 'flex-row-reverse' : ''}`}>
                {t('industries.partner')}
                <ArrowIcon />
              </Link>
            </div>
            <div className={`grid grid-cols-2 gap-px bg-border ${isRTL() ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
              {industries.map((industry, index) => (
                <div
                  key={index}
                  className={`bg-card p-6 hover:bg-secondary transition-colors ${isRTL() ? 'text-right' : ''}`}
                >
                  <span className="text-xs text-primary font-mono mb-2 block">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm font-semibold">{industry}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Salada */}
      <section className="industrial-section">
        <div className="industrial-container">
          <div className="text-center mb-16">
            <span className="industrial-label mb-4 block">{t('why.label')}</span>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight">
              {t('why.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {strengths.map((item) => (
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

      {/* Global Presence */}
      <section className="industrial-section bg-secondary/30 border-y border-border">
        <div className="industrial-container">
          <div className="text-center mb-16">
            <span className="industrial-label mb-4 block">{t('global.label')}</span>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4">
              {t('global.title')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('global.description')}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
            {[
              { region: t('global.middleEast'), detail: t('global.middleEastDetail') },
              { region: t('global.africa'), detail: t('global.africaDetail') },
              { region: t('global.asia'), detail: t('global.asiaDetail') },
              { region: t('global.europe'), detail: t('global.europeDetail') },
            ].map((item) => (
              <div key={item.region} className={`bg-card p-8 text-center`}>
                <Globe className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-1">{item.region}</h3>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
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
                to="/shop"
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
