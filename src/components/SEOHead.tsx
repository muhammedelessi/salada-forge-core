import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useLanguageStore } from '@/store/languageStore';

interface SEOHeadProps {
  title: string;
  description: string;
  path: string; // e.g. "/solutions" (without /ar prefix)
}

const BASE_URL = 'https://salada.sa';
const OG_IMAGE = `${BASE_URL}/og-image.png`;

export function SEOHead({ title, description, path }: SEOHeadProps) {
  const { language } = useLanguageStore();
  const location = useLocation();
  
  const isArabic = location.pathname.startsWith('/ar');
  const canonicalUrl = isArabic ? `${BASE_URL}/ar${path}` : `${BASE_URL}${path}`;
  const enUrl = `${BASE_URL}${path}`;
  const arUrl = `${BASE_URL}/ar${path}`;

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
    </Helmet>
  );
}
