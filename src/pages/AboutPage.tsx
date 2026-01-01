import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Users, Globe, Zap } from 'lucide-react';

export default function AboutPage() {
  const timeline = [
    { year: '1998', title: 'Founded', description: 'SALADA was established in Houston, Texas with a vision to revolutionize industrial container solutions.' },
    { year: '2005', title: 'Global Expansion', description: 'Opened our first international distribution centers in Europe and Asia.' },
    { year: '2012', title: 'Innovation Hub', description: 'Launched our R&D facility dedicated to developing next-generation container technology.' },
    { year: '2020', title: 'Digital Transformation', description: 'Introduced our digital platform for seamless global ordering and logistics.' },
    { year: '2024', title: 'Industry Leader', description: 'Recognized as the #1 industrial container supplier in North America.' },
  ];

  const values = [
    { icon: Award, title: 'Quality First', description: 'Every product meets the highest international standards.' },
    { icon: Users, title: 'Customer Focus', description: 'Your success is our success. We build lasting partnerships.' },
    { icon: Globe, title: 'Global Reach', description: 'Delivering solutions to over 120 countries worldwide.' },
    { icon: Zap, title: 'Innovation', description: 'Continuously improving our products and processes.' },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-20" />
        <div className="industrial-container relative z-10">
          <span className="industrial-label mb-6 block">About SALADA</span>
          <h1 className="industrial-heading max-w-4xl mb-8">
            Building the Infrastructure
            <span className="block text-gradient">of Tomorrow</span>
          </h1>
          <p className="industrial-subheading max-w-2xl">
            For over 25 years, SALADA has been the trusted partner for industries 
            worldwide, providing premium container solutions that power global commerce.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-secondary">
        <div className="industrial-container">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { value: '25+', label: 'Years of Experience' },
              { value: '50K+', label: 'Units Delivered' },
              { value: '120+', label: 'Countries Served' },
              { value: '500+', label: 'Enterprise Clients' },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`py-12 text-center ${index < 3 ? 'border-r border-border' : ''}`}
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="industrial-label mb-4 block">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                From Humble Beginnings to Global Leader
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 1998 by industry veterans, SALADA began as a small operation 
                  focused on providing quality shipping containers to local businesses in 
                  Texas. Our commitment to excellence quickly earned us a reputation that 
                  extended far beyond state lines.
                </p>
                <p>
                  Today, we operate from multiple continents, serving industries ranging 
                  from oil & gas to pharmaceuticals, construction to agriculture. Our 
                  product line has expanded to include everything from standard shipping 
                  containers to specialized offshore units and modular buildings.
                </p>
                <p>
                  What hasn't changed is our founding principle: deliver the highest 
                  quality products with unmatched service. Every container that leaves 
                  our facility carries the SALADA promise of durability, reliability, 
                  and value.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-card border border-border p-8">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center">
                  <span className="text-6xl font-bold text-primary/30">SALADA</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground p-6">
                <p className="text-2xl font-bold font-mono">25+</p>
                <p className="text-sm">Years Strong</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="industrial-section bg-secondary border-y border-border">
        <div className="industrial-container">
          <div className="text-center mb-12">
            <span className="industrial-label mb-4 block">Our Journey</span>
            <h2 className="text-3xl md:text-4xl font-bold">Milestones</h2>
          </div>

          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border" />
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative flex items-start gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : ''} hidden md:block`} />
                  <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary text-primary-foreground flex items-center justify-center font-bold font-mono z-10">
                      {item.year}
                    </div>
                  </div>
                  <div className="flex-1 pl-8 md:pl-0">
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
            <span className="industrial-label mb-4 block">What Drives Us</span>
            <h2 className="text-3xl md:text-4xl font-bold">Our Values</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-1">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-card border border-border p-8 hover:border-primary transition-colors"
              >
                <value.icon className="w-10 h-10 text-primary mb-6" />
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
            Ready to Partner with SALADA?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses worldwide who trust SALADA for their industrial container needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-background text-foreground font-semibold uppercase tracking-wider text-sm"
            >
              Contact Us
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-foreground text-primary-foreground font-semibold uppercase tracking-wider text-sm hover:bg-primary-foreground hover:text-primary transition-colors"
            >
              View Products
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
