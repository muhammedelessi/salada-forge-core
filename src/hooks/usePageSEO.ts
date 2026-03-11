import { useLanguageStore } from '@/store/languageStore';

interface PageSEO {
  title: string;
  description: string;
}

const seoData: Record<string, { en: PageSEO; ar: PageSEO }> = {
  '/': {
    en: {
      title: 'Salada Metal Industries | Integrated Metal Solutions',
      description: 'Salada Metal Industries — leading provider of shipping containers, storage tanks, prefab buildings, and industrial metal solutions in Saudi Arabia.',
    },
    ar: {
      title: 'صلادة للصناعات المعدنية | حلول معدنية متكاملة',
      description: 'صلادة للصناعات المعدنية - الشركة الرائدة في حلول الحاويات الصناعية وحاويات الشحن وخزانات التخزين والمباني الجاهزة في المملكة العربية السعودية.',
    },
  },
  '/products': {
    en: {
      title: 'Products | المنتجات - Salada',
      description: 'Browse our full catalog of industrial metal products — shipping containers, storage containers, prefab structures, and cargo securing equipment.',
    },
    ar: {
      title: 'المنتجات | Products - Salada',
      description: 'تصفح كتالوج منتجاتنا الصناعية المعدنية — حاويات شحن، حاويات تخزين، هياكل جاهزة، ومعدات تأمين الشحنات.',
    },
  },
  '/solutions': {
    en: {
      title: 'Solutions | الحلول - Salada',
      description: 'End-to-end logistics and industrial solutions — land freight, sea freight, air freight, and warehousing by Salada Metal Industries.',
    },
    ar: {
      title: 'الحلول | Solutions - Salada',
      description: 'حلول لوجستية وصناعية شاملة — الشحن البري والبحري والجوي والتخزين من صلادة للصناعات المعدنية.',
    },
  },
  '/industries': {
    en: {
      title: 'Industries | القطاعات - Salada',
      description: 'Serving construction, oil & gas, manufacturing, logistics, government, and mega-project sectors across Saudi Arabia.',
    },
    ar: {
      title: 'القطاعات | Industries - Salada',
      description: 'نخدم قطاعات البناء والنفط والغاز والتصنيع واللوجستيات والمشاريع الحكومية والعملاقة في المملكة العربية السعودية.',
    },
  },
  '/about': {
    en: {
      title: 'About Us | من نحن - Salada',
      description: 'Learn about Salada Metal Industries — our history, vision, and commitment to delivering world-class industrial metal solutions.',
    },
    ar: {
      title: 'من نحن | About Us - Salada',
      description: 'تعرف على صلادة للصناعات المعدنية — تاريخنا ورؤيتنا والتزامنا بتقديم حلول معدنية صناعية عالمية المستوى.',
    },
  },
  '/why-salada': {
    en: {
      title: 'Why Salada | لماذا صلادة - Salada',
      description: 'Discover why leading enterprises choose Salada — one-stop partner, rapid deployment, national coverage, and full compliance.',
    },
    ar: {
      title: 'لماذا صلادة | Why Salada - Salada',
      description: 'اكتشف لماذا تختار المؤسسات الرائدة صلادة — شريك واحد، نشر سريع، تغطية وطنية، وامتثال كامل.',
    },
  },
  '/contact': {
    en: {
      title: 'Contact Us | تواصل معنا - Salada',
      description: 'Get in touch with Salada Metal Industries for inquiries, quotes, and partnership opportunities.',
    },
    ar: {
      title: 'تواصل معنا | Contact Us - Salada',
      description: 'تواصل مع صلادة للصناعات المعدنية للاستفسارات وعروض الأسعار وفرص الشراكة.',
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
