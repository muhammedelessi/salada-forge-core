import { useLanguageStore } from '@/store/languageStore';

interface PageSEO {
  title: string;
  description: string;
}

const seoData: Record<string, { en: PageSEO; ar: PageSEO }> = {
  '/': {
    en: {
      title: 'Salada Metal Industries | Industrial Storage & Steel Solutions in Saudi Arabia',
      description: 'Salada Metal Industries delivers industrial storage systems, steel structures, and custom metal solutions across Saudi Arabia with 25+ years of proven expertise.',
    },
    ar: {
      title: 'صلادة للصناعات المعدنية | حلول التخزين الصناعي والصلب في السعودية',
      description: 'صلادة للصناعات المعدنية تقدم أنظمة تخزين صناعي وهياكل فولاذية وحلول معدنية مخصصة في المملكة العربية السعودية بخبرة تتجاوز 25 عاماً.',
    },
  },
  '/solutions': {
    en: {
      title: 'Industrial Solutions | Racking, Shelving & Steel Structures | Salada',
      description: 'Explore Salada\'s industrial solutions including racking systems, shelving units, steel structures, and custom engineering for warehouses and facilities.',
    },
    ar: {
      title: 'الحلول الصناعية | رفوف وهياكل معدنية | صلادة',
      description: 'استكشف حلول صلادة الصناعية من أنظمة الأرفف والرفوف والهياكل الفولاذية والهندسة المخصصة للمستودعات والمنشآت الصناعية.',
    },
  },
  '/industries': {
    en: {
      title: 'Industries We Serve | Construction, Oil & Gas, Government | Salada',
      description: 'Salada serves construction, oil and gas, manufacturing, logistics, government, and mega-project sectors with certified industrial metal solutions.',
    },
    ar: {
      title: 'القطاعات التي نخدمها | إنشاءات، نفط وغاز، حكومي | صالدة',
      description: 'تخدم صالدة قطاعات الإنشاءات والنفط والغاز والتصنيع واللوجستيات والحكومة والمشاريع العملاقة بحلول معدنية صناعية معتمدة.',
    },
  },
  '/about': {
    en: {
      title: 'About Salada | 25+ Years of Industrial Excellence in Saudi Arabia',
      description: 'Learn about Salada Metal Industries — over 25 years of delivering world-class industrial storage, steel fabrication, and custom engineering across KSA.',
    },
    ar: {
      title: 'عن صالدة | أكثر من 25 عاماً من التميز الصناعي في السعودية',
      description: 'تعرف على صالدة للصناعات المعدنية — أكثر من 25 عاماً في تقديم حلول التخزين الصناعي والتصنيع المعدني والهندسة المخصصة في المملكة.',
    },
  },
  '/contact': {
    en: {
      title: 'Contact Salada | Get a Free Quote for Your Industrial Project',
      description: 'Reach out to Salada Metal Industries for a free project consultation, custom quotes, and partnership opportunities across Saudi Arabia and the region.',
    },
    ar: {
      title: 'تواصل مع صالدة | احصل على عرض سعر مجاني لمشروعك',
      description: 'تواصل مع صالدة للصناعات المعدنية للحصول على استشارة مجانية وعروض أسعار مخصصة وفرص شراكة في المملكة العربية السعودية والمنطقة.',
    },
  },
  '/faq': {
    en: {
      title: 'Frequently Asked Questions | Salada Metal Industries',
      description: 'Find answers to common questions about Salada\'s industrial products, delivery timelines, custom engineering capabilities, and ordering process.',
    },
    ar: {
      title: 'الأسئلة الشائعة | صالدة للصناعات المعدنية',
      description: 'اعثر على إجابات للأسئلة الشائعة حول منتجات صالدة الصناعية ومواعيد التسليم والقدرات الهندسية المخصصة وعملية الطلب.',
    },
  },
  '/why-salada': {
    en: {
      title: 'Why Choose Salada | Certified Industrial Solutions Provider KSA',
      description: 'Discover why leading enterprises choose Salada — Saudi manufacturing advantage, faster delivery, rigorous quality control, and custom engineering.',
    },
    ar: {
      title: 'لماذا صالدة | مزود حلول صناعية معتمد في السعودية',
      description: 'اكتشف لماذا تختار المؤسسات الرائدة صالدة — ميزة التصنيع السعودي، تسليم أسرع، ضبط جودة صارم، وهندسة مخصصة.',
    },
  },
  '/shop': {
    en: {
      title: 'Products & Solutions Catalog | Salada Metal Industries',
      description: 'Browse Salada\'s full catalog of industrial products — racking systems, steel containers, shelving units, and custom metal fabrication solutions.',
    },
    ar: {
      title: 'كتالوج المنتجات والحلول | صالدة للصناعات المعدنية',
      description: 'تصفح كتالوج صالدة الكامل للمنتجات الصناعية — أنظمة الأرفف والحاويات الفولاذية ووحدات الرفوف وحلول التصنيع المعدني المخصصة.',
    },
  },
  '/products': {
    en: {
      title: 'Products & Solutions Catalog | Salada Metal Industries',
      description: 'Browse Salada\'s full catalog of industrial products — racking systems, steel containers, shelving units, and custom metal fabrication solutions.',
    },
    ar: {
      title: 'كتالوج المنتجات والحلول | صالدة للصناعات المعدنية',
      description: 'تصفح كتالوج صالدة الكامل للمنتجات الصناعية — أنظمة الأرفف والحاويات الفولاذية ووحدات الرفوف وحلول التصنيع المعدني المخصصة.',
    },
  },
};

export function usePageSEO(path: string) {
  const { language } = useLanguageStore();
  const pageSeo = seoData[path];
  if (!pageSeo) {
    return { title: 'Salada Metal Industries', description: '', path };
  }
  const data = pageSeo[language] || pageSeo.en;
  return { ...data, path };
}
