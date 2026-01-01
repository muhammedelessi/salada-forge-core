import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ChevronDown, Search } from 'lucide-react';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'Orders & Shipping',
      questions: [
        {
          q: 'What are your shipping options?',
          a: 'We offer multiple shipping options including ground freight, rail transport, and ocean freight for international orders. Free shipping is available for orders over $10,000 within the continental United States. Delivery times vary based on location and product availability.',
        },
        {
          q: 'How long does delivery take?',
          a: 'Standard delivery within the US typically takes 5-14 business days. International orders may take 2-6 weeks depending on destination and shipping method. Expedited shipping is available for urgent orders at additional cost.',
        },
        {
          q: 'Do you ship internationally?',
          a: 'Yes, we ship to over 120 countries worldwide. International shipping rates are calculated at checkout based on destination, weight, and dimensions. We handle all customs documentation for hassle-free delivery.',
        },
        {
          q: 'Can I track my order?',
          a: 'Absolutely! Once your order ships, you\'ll receive a tracking number via email. You can also track your order through our website or by contacting our customer service team.',
        },
      ],
    },
    {
      category: 'Products & Quality',
      questions: [
        {
          q: 'Are your containers certified?',
          a: 'Yes, all our containers meet international standards. Our shipping containers are ISO certified, offshore containers are DNV 2.7-1 certified, and all products comply with relevant industry regulations. Certification documents are provided with each purchase.',
        },
        {
          q: 'What materials are your containers made from?',
          a: 'Our shipping containers are primarily made from Corten steel, known for its exceptional weathering properties. Storage tanks use 304 or 316 stainless steel. IBC containers feature HDPE inner bottles with steel cage frames. All materials are selected for durability and longevity.',
        },
        {
          q: 'Do you offer customization?',
          a: 'Yes, we offer extensive customization options including custom paint colors, modifications for doors/windows, insulation, electrical wiring, HVAC systems, and more. Contact our sales team to discuss your specific requirements.',
        },
        {
          q: 'What warranty do you offer?',
          a: 'We provide a 2-year standard warranty covering manufacturing defects. Extended warranty options are available. Warranty terms vary by product type - please refer to product specifications or contact us for details.',
        },
      ],
    },
    {
      category: 'Pricing & Payments',
      questions: [
        {
          q: 'Do you offer bulk discounts?',
          a: 'Yes, we offer tiered bulk pricing on most products. Discounts start at quantities of 5+ units with increasing savings for larger orders. Volume pricing is displayed on product pages where applicable.',
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards (Visa, MasterCard, American Express), bank wire transfers, and company purchase orders for approved accounts. Payment terms of Net 30 are available for qualifying business customers.',
        },
        {
          q: 'Can I get a custom quote?',
          a: 'Absolutely! For large orders, custom configurations, or special requirements, contact our sales team for a personalized quote. We typically respond within 24 business hours.',
        },
      ],
    },
    {
      category: 'Returns & Support',
      questions: [
        {
          q: 'What is your return policy?',
          a: 'We offer a 30-day return policy for unused products in original condition. Custom or modified containers are non-returnable. Return shipping costs are the responsibility of the customer unless the return is due to our error. Contact customer service to initiate a return.',
        },
        {
          q: 'How do I report a problem with my order?',
          a: 'Contact our customer service team immediately at support@salada.com or call 1-800-555-0123. Please have your order number ready and provide photos of any damage or issues. We aim to resolve all concerns within 48 hours.',
        },
        {
          q: 'Do you offer technical support?',
          a: 'Yes, our technical team is available to assist with installation, maintenance, and operational questions. We provide documentation with all products and offer on-site support for complex installations at additional cost.',
        },
      ],
    },
  ];

  const filteredFAQs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  let globalIndex = 0;

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-secondary border-b border-border py-16 md:py-24">
        <div className="industrial-container">
          <span className="industrial-label mb-4 block">Help Center</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground max-w-2xl mb-8">
            Find answers to common questions about our products, shipping, 
            and services. Can't find what you're looking for? Contact us.
          </p>

          {/* Search */}
          <div className="max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="industrial-input pl-12"
            />
          </div>
        </div>
      </section>

      <section className="industrial-section">
        <div className="industrial-container">
          <div className="max-w-3xl mx-auto">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((category) => (
                <div key={category.category} className="mb-12">
                  <h2 className="text-xl font-bold mb-6 text-primary">
                    {category.category}
                  </h2>
                  <div className="space-y-1">
                    {category.questions.map((faq) => {
                      const currentIndex = globalIndex++;
                      return (
                        <div
                          key={faq.q}
                          className="border border-border bg-card"
                        >
                          <button
                            onClick={() =>
                              setOpenIndex(openIndex === currentIndex ? null : currentIndex)
                            }
                            className="w-full flex items-center justify-between p-6 text-left"
                          >
                            <span className="font-medium pr-4">{faq.q}</span>
                            <ChevronDown
                              className={`w-5 h-5 flex-shrink-0 transition-transform ${
                                openIndex === currentIndex ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          {openIndex === currentIndex && (
                            <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No results found for "{searchQuery}"
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-primary hover:text-accent transition-colors"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-secondary border-t border-border py-16">
        <div className="industrial-container text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-6">
            Our team is here to help. Reach out and we'll get back to you within 24 hours.
          </p>
          <a href="/contact" className="industrial-button">
            Contact Support
          </a>
        </div>
      </section>
    </Layout>
  );
}
