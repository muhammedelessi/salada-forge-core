import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import saladaLogo from '@/assets/SALADA_LOGO.png';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t, isRTL } = useLanguageStore();

  const footerLinks = {
    solutions: [
      { label: t('footer.lashingEquipment'), href: '/shop?category=lashing-equipment' },
      { label: t('footer.containerInfra'), href: '/shop?category=land-shipping-container' },
      { label: t('footer.spareParts'), href: '/shop?category=spare-parts' },
      { label: t('footer.storageContainers'), href: '/shop?category=storage-containers' },
    ],
    company: [
      { label: t('footer.aboutUs'), href: '/about' },
      { label: t('nav.contact'), href: '/contact' },
      { label: t('footer.careers'), href: '/careers' },
    ],
    support: [
      { label: t('nav.faq'), href: '/faq' },
      { label: t('footer.shippingInfo'), href: '/shipping' },
      { label: t('footer.trackOrder'), href: '/track' },
    ],
    legal: [
      { label: t('footer.privacyPolicy'), href: '/privacy' },
      { label: t('footer.termsOfService'), href: '/terms' },
    ],
  };

  return (
    <footer className="bg-secondary border-t border-border">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="industrial-container py-16">
          <div className={`grid md:grid-cols-2 gap-8 items-center ${isRTL() ? 'md:grid-flow-dense' : ''}`}>
            <div className={isRTL() ? 'text-right md:col-start-2' : ''}>
              <span className="industrial-label mb-4 block">{t('footer.newsletter')}</span>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">{t('footer.stayUpdated')}</h3>
              <p className="text-muted-foreground">
                {t('footer.newsletterDesc')}
              </p>
            </div>
            <div className={`flex gap-2 ${isRTL() ? 'flex-row-reverse md:col-start-1 md:row-start-1' : ''}`}>
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className={`industrial-input flex-1 ${isRTL() ? 'text-right' : ''}`}
                dir={isRTL() ? 'rtl' : 'ltr'}
              />
              <button className={`industrial-button whitespace-nowrap ${isRTL() ? 'flex-row-reverse' : ''}`}>
                {t('footer.subscribe')}
                <ArrowRight className={`w-4 h-4 ${isRTL() ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="industrial-container py-16">
        <div className={`grid grid-cols-2 md:grid-cols-5 gap-8 ${isRTL() ? 'text-right' : ''}`}>
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center mb-6 hover-lift">
              <img 
                src={saladaLogo} 
                alt="SALADA" 
                className="h-20 md:h-28 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-semibold uppercase tracking-wider text-sm mb-4">{t('footer.solutions')}</h4>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
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
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
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
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
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
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
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
          <div className={`flex flex-col md:flex-row justify-between items-center gap-4 ${isRTL() ? 'md:flex-row-reverse' : ''}`}>
            <p className="text-sm text-muted-foreground">
              © {currentYear} SALADA. {t('footer.rights')}
            </p>
            <div className={`flex items-center gap-6 ${isRTL() ? 'flex-row-reverse' : ''}`}>
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
