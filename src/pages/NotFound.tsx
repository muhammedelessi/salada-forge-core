import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLanguageStore } from '@/store/languageStore';
import { Layout } from '@/components/layout/Layout';

const NotFound = () => {
  const location = useLocation();
  const { language, isRTL } = useLanguageStore();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const content = {
    en: {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist or has been moved.',
      backHome: 'Back to Home',
      browseProducts: 'Browse Products',
    },
    ar: {
      title: 'الصفحة غير موجودة',
      description: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
      backHome: 'العودة للرئيسية',
      browseProducts: 'تصفح المنتجات',
    },
  };

  const t = content[language];

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center" dir={isRTL() ? 'rtl' : 'ltr'}>
        <div className="text-center px-4">
          <h1 className="text-8xl font-bold text-primary font-mono mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t.title}</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {t.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="industrial-button">
              {t.backHome}
            </Link>
            <Link to="/shop" className="industrial-button-outline">
              {t.browseProducts}
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
