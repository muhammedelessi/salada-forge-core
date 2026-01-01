import { Layout } from '@/components/layout/Layout';

interface PolicyPageProps {
  type: 'privacy' | 'terms' | 'returns';
}

export default function PolicyPage({ type }: PolicyPageProps) {
  const content = {
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'January 1, 2024',
      sections: [
        {
          title: 'Information We Collect',
          content: `We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes:
          
          • Name and contact information
          • Billing and shipping addresses
          • Payment information
          • Order history and preferences
          • Communications with our team`,
        },
        {
          title: 'How We Use Your Information',
          content: `We use the information we collect to:
          
          • Process and fulfill your orders
          • Communicate with you about orders, products, and services
          • Improve our products and services
          • Personalize your experience
          • Protect against fraud and unauthorized transactions`,
        },
        {
          title: 'Information Sharing',
          content: `We do not sell, trade, or otherwise transfer your personal information to outside parties except:
          
          • To trusted third parties who assist us in operating our website and conducting our business
          • When required by law or to protect our rights
          • With your consent`,
        },
        {
          title: 'Data Security',
          content: `We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights.`,
        },
        {
          title: 'Your Rights',
          content: `You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time. Contact us at privacy@salada.com to exercise these rights.`,
        },
      ],
    },
    terms: {
      title: 'Terms of Service',
      lastUpdated: 'January 1, 2024',
      sections: [
        {
          title: 'Acceptance of Terms',
          content: `By accessing and using the SALADA website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.`,
        },
        {
          title: 'Products and Pricing',
          content: `All product descriptions, specifications, and prices are subject to change without notice. We reserve the right to limit quantities, correct errors, and modify or discontinue products at any time. Prices displayed are in US Dollars unless otherwise specified.`,
        },
        {
          title: 'Orders and Payment',
          content: `By placing an order, you represent that you are authorized to use the payment method provided. We reserve the right to refuse or cancel any order for any reason, including limitations on quantities or errors in product information or pricing.`,
        },
        {
          title: 'Shipping and Delivery',
          content: `Delivery times are estimates only and are not guaranteed. SALADA is not responsible for delays caused by shipping carriers, customs, or other factors outside our control. Title and risk of loss pass to you upon delivery to the carrier.`,
        },
        {
          title: 'Limitation of Liability',
          content: `SALADA shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of our products or services. Our total liability shall not exceed the amount you paid for the specific product giving rise to the claim.`,
        },
        {
          title: 'Governing Law',
          content: `These terms shall be governed by and construed in accordance with the laws of the State of Texas, United States, without regard to its conflict of law provisions.`,
        },
      ],
    },
    returns: {
      title: 'Return Policy',
      lastUpdated: 'January 1, 2024',
      sections: [
        {
          title: 'Return Eligibility',
          content: `Standard products may be returned within 30 days of delivery if:
          
          • The product is unused and in original condition
          • Original packaging and documentation are included
          • You have a valid receipt or proof of purchase
          
          Custom or modified containers are not eligible for return.`,
        },
        {
          title: 'Return Process',
          content: `To initiate a return:
          
          1. Contact our customer service at returns@salada.com
          2. Provide your order number and reason for return
          3. Receive a Return Authorization (RA) number
          4. Ship the product back with the RA number clearly marked
          
          Do not return products without an RA number.`,
        },
        {
          title: 'Refunds',
          content: `Once we receive and inspect your return, we will process your refund within 5-7 business days. Refunds will be credited to the original payment method. Original shipping costs are non-refundable unless the return is due to our error.`,
        },
        {
          title: 'Damaged or Defective Products',
          content: `If you receive a damaged or defective product:
          
          • Report the issue within 48 hours of delivery
          • Provide photos of the damage
          • We will arrange for replacement or refund at no additional cost
          • Do not refuse delivery - accept and document the damage`,
        },
        {
          title: 'Exchanges',
          content: `We do not offer direct exchanges. If you need a different product, please return the original item and place a new order. This ensures the fastest processing time.`,
        },
      ],
    },
  };

  const pageContent = content[type];

  return (
    <Layout>
      <section className="bg-secondary border-b border-border py-16">
        <div className="industrial-container">
          <span className="industrial-label mb-4 block">Legal</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{pageContent.title}</h1>
          <p className="text-muted-foreground">
            Last updated: {pageContent.lastUpdated}
          </p>
        </div>
      </section>

      <section className="industrial-section">
        <div className="industrial-container">
          <div className="max-w-3xl mx-auto">
            {pageContent.sections.map((section, index) => (
              <div key={index} className="mb-10">
                <h2 className="text-xl font-bold mb-4">{section.title}</h2>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            ))}

            <div className="mt-12 p-6 bg-secondary border border-border">
              <h3 className="font-bold mb-2">Questions?</h3>
              <p className="text-muted-foreground text-sm">
                If you have any questions about this policy, please contact us at{' '}
                <a href="mailto:legal@salada.com" className="text-primary hover:text-accent">
                  legal@salada.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
