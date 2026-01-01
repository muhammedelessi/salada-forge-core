import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t, isRTL } = useLanguageStore();

  const footerLinks = {
    products: [
      { label: t('footer.shippingContainers'), href: '/shop?category=shipping-containers' },
      { label: t('footer.storageTanks'), href: '/shop?category=storage-tanks' },
      { label: t('footer.ibcContainers'), href: '/shop?category=ibc-containers' },
      { label: t('footer.modularBuildings'), href: '/shop?category=modular-buildings' },
    ],
    company: [
      { label: t('footer.aboutUs'), href: '/about' },
      { label: t('nav.contact'), href: '/contact' },
      { label: t('footer.careers'), href: '/careers' },
      { label: t('footer.blog'), href: '/blog' },
    ],
    support: [
      { label: t('nav.faq'), href: '/faq' },
      { label: t('footer.shippingInfo'), href: '/shipping' },
      { label: t('footer.returns'), href: '/returns' },
      { label: t('footer.trackOrder'), href: '/track' },
    ],
    legal: [
      { label: t('footer.privacyPolicy'), href: '/privacy' },
      { label: t('footer.termsOfService'), href: '/terms' },
      { label: t('footer.cookiePolicy'), href: '/cookies' },
    ],
  };

  return (
    <footer className="bg-secondary border-t border-border">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="industrial-container py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="industrial-label mb-4 block">{t('footer.newsletter')}</span>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">{t('footer.stayUpdated')}</h3>
              <p className="text-muted-foreground">
                {t('footer.newsletterDesc')}
              </p>
            </div>
            <div className={`flex gap-2 ${isRTL() ? 'flex-row-reverse' : ''}`}>
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="industrial-input flex-1"
                dir={isRTL() ? 'rtl' : 'ltr'}
              />
              <button className="industrial-button whitespace-nowrap">
                {t('footer.subscribe')}
                <ArrowRight className={`w-4 h-4 ${isRTL() ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="industrial-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold tracking-tight">SALADA</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold uppercase tracking-wider text-sm mb-4">{t('footer.products')}</h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold uppercase tracking-wider text-sm mb-4">{t('footer.company')}</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold uppercase tracking-wider text-sm mb-4">{t('footer.support')}</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold uppercase tracking-wider text-sm mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="industrial-container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} SALADA Industrial. {t('footer.rights')}
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
                {t('footer.isoCertified')}
              </span>
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
                {t('footer.dnvApproved')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
