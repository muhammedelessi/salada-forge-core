import { Link } from 'react-router-dom';
import { ArrowRight, Container, Warehouse } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/SEOHead';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useLanguageStore } from '@/store/languageStore';
import { cn } from '@/lib/utils';
import heroPort from '@/assets/hero-port.jpg';
import { useProducts } from '@/hooks/useProducts';

export default function SolutionsPage() {
  const seo = usePageSEO('/solutions');
  const { t, isRTL } = useLanguageStore();
  const { data: products = [] } = useProducts();

  const ArrowIcon = () => (
    <ArrowRight className={`w-5 h-5 ${isRTL() ? 'mr-3 rotate-180' : 'ml-3'}`} />
  );

  const shippingContainers = products.filter(p => p.category === 'iso-shipping-container' && p.status === 'active');
  const storageContainers = products.filter(p => p.category === 'storage-containers' && p.status === 'active');

  const isAr = isRTL();

  const mainSolutions = [
    {
      id: 'shipping-containers',
      icon: Container,
      title: isAr ? 'حاويات الشحن' : 'Shipping Containers',
      subtitle: isAr ? 'حاويات شحن ISO معتمدة' : 'ISO Certified Shipping Containers',
      description: isAr
        ? 'حاويات شحن ISO معتمدة بأحجام متعددة — 10 أقدام، 20 قدمًا، 40 قدمًا — بارتفاعات قياسية وعالية. مثالية للشحن البري والبحري والتخزين الصناعي.'
        : 'ISO-certified shipping containers in multiple sizes — 10ft, 20ft, 40ft — in standard and high-cube configurations. Ideal for land freight, sea freight, and industrial storage.',
      products: shippingContainers,
      shopLink: '/shop?category=iso-shipping-container',
      color: 'bg-primary',
    },
    {
      id: 'storage-containers',
      icon: Warehouse,
      title: isAr ? 'حاويات التخزين' : 'Storage Containers',
      subtitle: isAr ? 'وحدات تخزين متينة وجاهزة للنشر' : 'Durable, Deployment-Ready Storage Units',
      description: isAr
        ? 'وحدات تخزين متينة بأحجام 5 أقدام إلى 20 قدمًا، مصممة لمواقع البناء والمنشآت الصناعية والمراكز اللوجستية. جاهزة للنشر السريع في أي بيئة.'
        : 'Heavy-duty storage units from 5ft to 20ft, engineered for construction sites, industrial facilities, and logistics hubs. Ready for rapid deployment in any environment.',
      products: storageContainers,
      shopLink: '/shop?category=storage-containers',
      color: 'bg-accent',
    },
  ];

  return (
    <Layout>
      <SEOHead {...seo} />
      {/* Hero */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroPort} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/70" />
        </div>
        <div className={cn('industrial-container relative z-10', isAr && 'text-right')}>
          <span className="industrial-label mb-8 block text-primary">{t('solutions.label')}</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-[0.85] text-background">
            {t('solutions.pageTitle')}
          </h1>
        </div>
      </section>

      {/* Main Solutions */}
      {mainSolutions.map((solution, index) => (
        <section key={solution.id} id={solution.id} className="border-b border-border">
          {/* Solution Header */}
          <div className={cn(
            'grid grid-cols-1 lg:grid-cols-2 min-h-[50vh]',
            index % 2 === 1 && 'lg:[direction:rtl]'
          )}>
            {/* Hero image — first product image */}
            <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-muted">
              {solution.products[0]?.images?.[0] && (
                <img
                  src={solution.products[0].images[0]}
                  alt={solution.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Content */}
            <div className={cn(
              'flex flex-col justify-center p-12 md:p-20 lg:p-24',
              index % 2 === 1 && 'lg:[direction:ltr]',
              isAr && 'text-right'
            )}>
              <div className={cn('flex items-center gap-3 mb-6', isAr && 'flex-row-reverse')}>
                <solution.icon className="w-8 h-8 text-primary" />
                <span className="industrial-label">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter leading-[0.9] mb-6">
                {solution.title}
              </h2>
              <p className="text-lg text-muted-foreground mb-4 font-medium">
                {solution.subtitle}
              </p>
              <p className="text-muted-foreground mb-10 max-w-lg leading-relaxed">
                {solution.description}
              </p>
              <div className={cn('flex flex-wrap gap-4', isAr && 'flex-row-reverse')}>
                <Link
                  to={solution.shopLink}
                  className={cn('industrial-button', isAr && 'flex-row-reverse')}
                >
                  {isAr ? 'تصفح المنتجات' : 'Browse Products'}
                  <ArrowIcon />
                </Link>
                <Link
                  to="/contact"
                  className={cn(
                    'inline-flex items-center justify-center px-8 py-4 border-2 border-border font-semibold uppercase tracking-[0.15em] text-sm transition-all duration-300 hover:bg-secondary',
                    isAr && 'flex-row-reverse'
                  )}
                >
                  {t('solutions.inquire')}
                </Link>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {solution.products.length > 0 && (
            <div className="bg-secondary/50 border-t border-border">
              <div className="industrial-container py-12">
                <h3 className={cn(
                  'text-sm uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-8',
                  isAr && 'text-right'
                )}>
                  {isAr ? 'المنتجات المتوفرة' : 'Available Products'}
                  <span className="text-primary ml-2">({solution.products.length})</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1">
                  {solution.products.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      className="group bg-card border border-border hover:border-primary transition-all duration-200"
                    >
                      <div className="aspect-square overflow-hidden bg-muted">
                        {product.images?.[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div className={cn('p-3', isAr && 'text-right')}>
                        <p className="text-sm font-semibold truncate">{product.title}</p>
                        <p className="text-xs text-muted-foreground font-mono mt-1">{product.sku}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
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
