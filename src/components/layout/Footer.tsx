import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import saladaLogo from '@/assets/SALADA_LOGO.png';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t, isRTL } = useLanguageStore();

  const footerLinks = {
    solutions: [
      { label: t('footer.landFreight'), href: '/solutions#land' },
      { label: t('footer.seaFreight'), href: '/solutions#sea' },
      { label: t('footer.airFreight'), href: '/solutions#air' },
      { label: t('footer.storageUnits'), href: '/solutions#storage' },
      { label: t('footer.spareParts'), href: '/solutions#spare' },
      { label: t('footer.customEng'), href: '/solutions#custom' },
    ],
    company: [
      { label: t('footer.aboutUs'), href: '/about' },
      { label: t('footer.whySalada'), href: '/why-salada' },
      { label: t('footer.industriesServed'), href: '/industries' },
      { label: t('footer.contactUs'), href: '/contact' },
    ],
    support: [
      { label: t('footer.faqLink'), href: '/faq' },
      { label: t('footer.shippingInfo'), href: '/shipping' },
    ],
  };

  return (
    <footer className="bg-secondary border-t border-border">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="industrial-container py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="rtl:text-right md:order-1 rtl:md:order-2">
              <span className="industrial-label mb-4 block">{t('footer.newsletter')}</span>
              <h3 className="text-xl md:text-2xl font-bold mb-2">{t('footer.stayUpdated')}</h3>
              <p className="text-muted-foreground">
                {t('footer.newsletterDesc')}
              </p>
            </div>
            <div className="flex gap-2 rtl:flex-row-reverse md:order-2 rtl:md:order-1">
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="industrial-input flex-1 rtl:text-right"
                dir="ltr"
              />
              <button className="industrial-button whitespace-nowrap rtl:flex-row-reverse">
                {t('footer.subscribe')}
                <ArrowRight className="w-4 h-4 ltr:ml-2 rtl:mr-2 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="industrial-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 rtl:text-right">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center mb-6 hover-lift">
              <img 
                src={saladaLogo} 
                alt="Salada Metal Industries logo" 
                className="h-8 md:h-10 w-auto object-contain"
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
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="industrial-container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 rtl:md:flex-row-reverse">
            <p className="text-sm text-muted-foreground">
              © {currentYear} SALADA. {t('footer.rights')}
            </p>
            <div className="flex items-center gap-6 rtl:flex-row-reverse">
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
