import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useLanguageStore } from '@/store/languageStore';

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
}

const BASE_URL = 'https://salada.sa';
const OG_IMAGE = `${BASE_URL}/og-image.jpg`;

function getJsonLd(path: string): object | null {
  if (path === '/') {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Salada Metal Industries",
      "url": BASE_URL,
      "logo": `${BASE_URL}/logo.png`,
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "sales",
        "areaServed": "SA",
        "availableLanguage": ["Arabic", "English"]
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "SA"
      },
      "sameAs": []
    };
  }

  if (path === '/faq') {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "What are your shipping options?", "acceptedAnswer": { "@type": "Answer", "text": "We offer multiple shipping options including ground freight, rail transport, and ocean freight for international orders. Free shipping is available for orders over 37,500 SAR within Saudi Arabia." } },
        { "@type": "Question", "name": "How long does delivery take?", "acceptedAnswer": { "@type": "Answer", "text": "Standard delivery within Saudi Arabia typically takes 3-7 business days. International orders may take 2-6 weeks depending on destination and shipping method." } },
        { "@type": "Question", "name": "Are your containers certified?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, all our containers meet international standards. Our shipping containers are ISO certified, offshore containers are DNV 2.7-1 certified, and all products comply with relevant industry regulations." } },
        { "@type": "Question", "name": "Do you offer customization?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, we offer extensive customization options including custom paint colors, modifications for doors/windows, insulation, electrical wiring, HVAC systems, and more." } },
        { "@type": "Question", "name": "Do you offer bulk discounts?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, we offer tiered bulk pricing on most products. Discounts start at quantities of 5+ units with increasing savings for larger orders." } },
        { "@type": "Question", "name": "What payment methods do you accept?", "acceptedAnswer": { "@type": "Answer", "text": "We accept all major credit cards (Visa, MasterCard, mada), bank wire transfers, and company purchase orders for approved accounts." } },
        { "@type": "Question", "name": "What is your return policy?", "acceptedAnswer": { "@type": "Answer", "text": "We offer a 30-day return policy for unused products in original condition. Custom or modified containers are non-returnable." } },
        { "@type": "Question", "name": "Do you offer technical support?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, our technical team is available to assist with installation, maintenance, and operational questions. We provide documentation with all products." } },
      ]
    };
  }

  if (path === '/solutions') {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Solutions", "item": `${BASE_URL}/solutions` },
      ]
    };
  }

  if (path === '/industries') {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Industries", "item": `${BASE_URL}/industries` },
      ]
    };
  }

  return null;
}

export function SEOHead({ title, description, path }: SEOHeadProps) {
  const { language } = useLanguageStore();
  const location = useLocation();
  
  const isArabic = location.pathname.startsWith('/ar');
  const canonicalUrl = isArabic ? `${BASE_URL}/ar${path}` : `${BASE_URL}${path}`;
  const enUrl = `${BASE_URL}${path}`;
  const arUrl = `${BASE_URL}/ar${path}`;
  const jsonLd = getJsonLd(path);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="ar" href={arUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:locale" content={isArabic ? 'ar_SA' : 'en_US'} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
