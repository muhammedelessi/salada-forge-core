import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Award, Users, Globe, Zap } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/i18n/translations';
import { cn } from '@/lib/utils';

export default function AboutPage() {
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];

  const ArrowIcon = isRTL() ? ArrowLeft : ArrowRight;

  const timeline = [
    { year: '1998', title: t.about.timeline.founded, description: t.about.timeline.foundedDesc },
    { year: '2005', title: t.about.timeline.globalExpansion, description: t.about.timeline.globalExpansionDesc },
    { year: '2012', title: t.about.timeline.innovationHub, description: t.about.timeline.innovationHubDesc },
    { year: '2020', title: t.about.timeline.digitalTransformation, description: t.about.timeline.digitalTransformationDesc },
    { year: '2024', title: t.about.timeline.industryLeader, description: t.about.timeline.industryLeaderDesc },
  ];

  const values = [
    { icon: Award, title: t.about.qualityFirst, description: t.about.qualityFirstDesc },
    { icon: Users, title: t.about.customerFocus, description: t.about.customerFocusDesc },
    { icon: Globe, title: t.about.globalReach, description: t.about.globalReachDesc },
    { icon: Zap, title: t.about.innovation, description: t.about.innovationDesc },
  ];

  const stats = [
    { value: '25+', label: t.about.yearsExperience },
    { value: '50K+', label: t.about.unitsDelivered },
    { value: '120+', label: t.about.countriesServed },
    { value: '500+', label: t.about.enterpriseClients },
  ];

  return (
    <Layout>
      {/* About Salada - Bilingual Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-20" />
        <div className="industrial-container relative z-10">
          {/* Heading */}
          <div className="mb-6">
            <h1 className="industrial-heading max-w-4xl mb-2">About Salada</h1>
            <p className="text-2xl md:text-3xl font-bold text-muted-foreground" dir="rtl" style={{ textAlign: 'right' }}>عن سلادا</p>
          </div>

          {/* Paragraph 1 */}
          <div className="max-w-3xl mb-6">
            <p className="text-lg text-muted-foreground leading-relaxed mb-2">
              Salada is a Saudi-based container manufacturer specializing in dry and storage container solutions.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed" dir="rtl" style={{ textAlign: 'right' }}>
              سلادا شركة سعودية متخصصة في تصنيع الحاويات الجافة وحلول التخزين.
            </p>
          </div>

          {/* Paragraph 2 */}
          <div className="max-w-3xl mb-12">
            <p className="text-lg text-muted-foreground leading-relaxed mb-2">
              With a focus on industrial quality and local production, we aim to support Saudi Arabia's growing logistics, construction, and industrial sectors.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed" dir="rtl" style={{ textAlign: 'right' }}>
              نركز على الجودة الصناعية والإنتاج المحلي لدعم قطاعات اللوجستيات والبناء والصناعة في المملكة العربية السعودية.
            </p>
          </div>

          {/* Vision, Mission, Commitment Cards */}
          <div className="grid md:grid-cols-3 gap-1">
            {/* Vision */}
            <div className="bg-card border border-border p-8 hover:border-primary transition-colors">
              <h3 className="text-xl font-bold mb-1">Our Vision</h3>
              <p className="text-lg font-bold text-muted-foreground mb-4" dir="rtl" style={{ textAlign: 'right' }}>رؤيتنا</p>
              <p className="text-muted-foreground text-sm mb-2">
                To become a trusted Saudi manufacturer of container solutions serving local and regional markets.
              </p>
              <p className="text-muted-foreground text-sm" dir="rtl" style={{ textAlign: 'right' }}>
                أن نكون الشركة السعودية الموثوقة في تصنيع حلول الحاويات لخدمة الأسواق المحلية والإقليمية.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-card border border-border p-8 hover:border-primary transition-colors">
              <h3 className="text-xl font-bold mb-1">Our Mission</h3>
              <p className="text-lg font-bold text-muted-foreground mb-4" dir="rtl" style={{ textAlign: 'right' }}>مهمتنا</p>
              <p className="text-muted-foreground text-sm mb-2">
                To deliver durable, reliable, and customizable container products that meet industrial standards and project demands.
              </p>
              <p className="text-muted-foreground text-sm" dir="rtl" style={{ textAlign: 'right' }}>
                تقديم منتجات حاويات متينة وموثوقة وقابلة للتخصيص تلبي المعايير الصناعية ومتطلبات المشاريع.
              </p>
            </div>

            {/* Commitment */}
            <div className="bg-card border border-border p-8 hover:border-primary transition-colors">
              <h3 className="text-xl font-bold mb-1">Our Commitment</h3>
              <p className="text-lg font-bold text-muted-foreground mb-4" dir="rtl" style={{ textAlign: 'right' }}>التزامنا</p>
              <p className="text-muted-foreground text-sm mb-2">
                We are committed to quality manufacturing, fast delivery, and long-term partnerships with our clients.
              </p>
              <p className="text-muted-foreground text-sm" dir="rtl" style={{ textAlign: 'right' }}>
                نلتزم بالتصنيع عالي الجودة والتسليم السريع وبناء شراكات طويلة الأمد مع عملائنا.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-secondary">
        <div className="industrial-container">
          <div className={cn('grid grid-cols-2 md:grid-cols-4', isRTL() && 'direction-rtl')}>
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  'py-12 text-center',
                  index < 3 && 'md:border-r border-border',
                  index === 1 && 'border-r border-border md:border-r',
                  isRTL() && index < 3 && 'md:border-l md:border-r-0',
                  isRTL() && index === 1 && 'border-l border-r-0'
                )}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2 font-mono">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="industrial-section">
        <div className="industrial-container">
          <div className={cn('grid lg:grid-cols-2 gap-12 items-center', isRTL() && 'lg:grid-flow-dense')}>
            <div className={cn(isRTL() && 'text-right lg:col-start-2')}>
              <span className="industrial-label mb-4 block">{t.about.storyLabel}</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t.about.storyTitle}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{t.about.storyP1}</p>
                <p>{t.about.storyP2}</p>
                <p>{t.about.storyP3}</p>
              </div>
            </div>
            <div className={cn('relative', isRTL() && 'lg:col-start-1 lg:row-start-1')}>
              <div className="aspect-square bg-card border border-border p-8">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center">
                  <span className="text-6xl font-bold text-primary/30">SALADA</span>
                </div>
              </div>
              <div className={cn(
                'absolute -bottom-4 bg-primary text-primary-foreground p-6',
                isRTL() ? '-left-4' : '-right-4'
              )}>
                <p className="text-2xl font-bold font-mono">25+</p>
                <p className="text-sm">{t.about.yearsStrong}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="industrial-section bg-secondary border-y border-border">
        <div className="industrial-container">
          <div className="text-center mb-12">
            <span className="industrial-label mb-4 block">{t.about.journeyLabel}</span>
            <h2 className="text-3xl md:text-4xl font-bold">{t.about.milestones}</h2>
          </div>

          <div className="relative">
            <div className={cn(
              'absolute top-0 bottom-0 w-px bg-border',
              isRTL() ? 'right-8 md:right-1/2' : 'left-8 md:left-1/2'
            )} />
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={cn(
                    'relative flex items-start gap-8',
                    !isRTL() && (index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'),
                    isRTL() && (index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'),
                    isRTL() && 'flex-row-reverse'
                  )}
                >
                  <div className={cn(
                    'flex-1 hidden md:block',
                    !isRTL() && index % 2 === 0 && 'text-right',
                    isRTL() && index % 2 === 0 && 'text-left'
                  )} />
                  <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary text-primary-foreground flex items-center justify-center font-bold font-mono z-10">
                      {item.year}
                    </div>
                  </div>
                  <div className={cn(
                    'flex-1',
                    !isRTL() && 'pl-0',
                    isRTL() && 'pr-0 text-right'
                  )}>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="industrial-section">
        <div className="industrial-container">
          <div className="text-center mb-12">
            <span className="industrial-label mb-4 block">{t.about.valuesLabel}</span>
            <h2 className="text-3xl md:text-4xl font-bold">{t.about.ourValues}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-1">
            {values.map((value) => (
              <div
                key={value.title}
                className={cn(
                  'bg-card border border-border p-8 hover:border-primary transition-colors',
                  isRTL() && 'text-right'
                )}
              >
                <value.icon className={cn('w-10 h-10 text-primary mb-6', isRTL() && 'mr-0')} />
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 bg-primary overflow-hidden">
        <div className="absolute inset-0 container-pattern opacity-20" />
        <div className="industrial-container relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            {t.about.partnerCTA}
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            {t.about.partnerDesc}
          </p>
          <div className={cn(
            'flex flex-col sm:flex-row gap-4 justify-center',
            isRTL() && 'sm:flex-row-reverse'
          )}>
            <Link
              to="/contact"
              className={cn(
                'inline-flex items-center justify-center px-8 py-4 bg-background text-foreground font-semibold uppercase tracking-wider text-sm',
                isRTL() && 'flex-row-reverse'
              )}
            >
              {t.about.contactUs}
              <ArrowIcon className={cn('w-4 h-4', isRTL() ? 'mr-2' : 'ml-2')} />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-foreground text-primary-foreground font-semibold uppercase tracking-wider text-sm hover:bg-primary-foreground hover:text-primary transition-colors"
            >
              {t.about.viewProducts}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}