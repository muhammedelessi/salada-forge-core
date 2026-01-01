import { Link } from 'react-router-dom';
import { ArrowRight, Box, Truck, Shield, Zap } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { getFeaturedProducts, categories } from '@/data/products';

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();

  const stats = [
    { value: '50K+', label: 'Units Delivered' },
    { value: '25+', label: 'Years Experience' },
    { value: '120+', label: 'Countries Served' },
    { value: '99.8%', label: 'On-Time Delivery' },
  ];

  const features = [
    {
      icon: Box,
      title: 'Industrial Grade',
      description: 'Built to withstand the harshest environments with premium materials.',
    },
    {
      icon: Truck,
      title: 'Global Logistics',
      description: 'Worldwide shipping with real-time tracking and customs support.',
    },
    {
      icon: Shield,
      title: 'Certified Quality',
      description: 'ISO 9001:2015 certified manufacturing and DNV approved containers.',
    },
    {
      icon: Zap,
      title: 'Fast Deployment',
      description: 'Ready-to-ship inventory with rapid deployment capabilities.',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[60%] h-[120%] bg-gradient-to-l from-primary/10 to-transparent" />
        
        <div className="industrial-container relative z-10">
          <div className="max-w-4xl">
            <span className="industrial-label animate-industrial-fade">Industrial Container Solutions</span>
            <h1 className="industrial-heading mt-6 mb-8 animate-industrial-fade delay-100">
              Built for
              <span className="block text-gradient">Industry</span>
            </h1>
            <p className="industrial-subheading max-w-2xl mb-10 animate-industrial-fade delay-200">
              Premium shipping containers, storage solutions, and modular buildings. 
              Engineered for durability. Delivered worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-industrial-fade delay-300">
              <Link to="/shop" className="industrial-button">
                Explore Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link to="/contact" className="industrial-button-outline">
                Request Quote
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-secondary">
        <div className="industrial-container">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`py-10 md:py-16 text-center ${
                  index < stats.length - 1 ? 'border-r border-border' : ''
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

      {/* Categories Section */}
      <section className="industrial-section">
        <div className="industrial-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="industrial-label mb-4 block">Categories</span>
              <h2 className="text-3xl md:text-4xl font-bold">Our Solutions</h2>
            </div>
            <Link
              to="/shop"
              className="text-primary hover:text-accent transition-colors flex items-center gap-2 text-sm uppercase tracking-wider font-medium"
            >
              View All Categories
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.id}`}
                className="group relative bg-card border border-border p-8 md:p-12 hover:border-primary transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <span className="text-sm text-muted-foreground font-mono">
                      {category.count} Products
                    </span>
                  </div>
                  <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all" />
                </div>
                <div className="absolute top-4 right-4 text-6xl font-bold text-border/50 font-mono">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="industrial-section bg-secondary border-y border-border">
        <div className="industrial-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="industrial-label mb-4 block">Featured</span>
              <h2 className="text-3xl md:text-4xl font-bold">Top Products</h2>
            </div>
            <Link
              to="/shop"
              className="text-primary hover:text-accent transition-colors flex items-center gap-2 text-sm uppercase tracking-wider font-medium"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="industrial-section">
        <div className="industrial-container">
          <div className="text-center mb-16">
            <span className="industrial-label mb-4 block">Why SALADA</span>
            <h2 className="text-3xl md:text-4xl font-bold">Built Different</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-card border border-border p-8 hover:border-primary transition-all duration-300"
              >
                <feature.icon className="w-10 h-10 text-primary mb-6" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 container-pattern opacity-20" />
        
        <div className="industrial-container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Scale Your Operations?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-10">
              Get a custom quote for your industrial container needs. 
              Our team is ready to help you find the perfect solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-background text-foreground font-semibold uppercase tracking-wider text-sm transition-all duration-300 hover:bg-secondary"
              >
                Get Quote
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-foreground text-primary-foreground font-semibold uppercase tracking-wider text-sm transition-all duration-300 hover:bg-primary-foreground hover:text-primary"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
