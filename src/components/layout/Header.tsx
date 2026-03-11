import { Link } from 'react-router-dom';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { cn } from '@/lib/utils';
import saladaLogo from '@/assets/SALADA_LOGO.png';

function MegaMenu({ items, isOpen }: { items: { label: string; desc: string; href: string }[]; isOpen: boolean }) {
  if (!isOpen) return null;
  return (
    <div className="absolute top-full left-0 right-0 bg-background border-b-2 border-primary/30 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="industrial-container py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 rtl:text-right">
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="group p-4 rounded hover:bg-secondary/80 transition-colors border border-transparent hover:border-border"
            >
              <span className="block text-sm font-semibold uppercase tracking-wider group-hover:text-primary transition-colors">
                {item.label}
              </span>
              <span className="block text-xs text-muted-foreground mt-1 leading-relaxed">
                {item.desc}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const megaTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const { t, isRTL } = useLanguageStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) searchRef.current?.focus();
  }, [isSearchOpen]);

  const isAr = isRTL();

  const solutionsMega = [
    { label: isAr ? 'حاويات الشحن' : 'Shipping Containers', desc: isAr ? 'حاويات ISO معتمدة بأحجام متعددة' : 'ISO-certified containers in multiple sizes', href: '/solutions#shipping-containers' },
    { label: isAr ? 'حاويات التخزين' : 'Storage Containers', desc: isAr ? 'وحدات تخزين جاهزة للنشر' : 'Deployment-ready storage units', href: '/solutions#storage-containers' },
    { label: t('solutions.landFreight'), desc: isAr ? 'دعم النقل البري الكامل' : 'Complete ground transport support', href: '/solutions#land' },
    { label: t('solutions.seaFreight'), desc: isAr ? 'البنية التحتية للشحن البحري' : 'Maritime cargo infrastructure', href: '/solutions#sea' },
    { label: t('solutions.airFreight'), desc: isAr ? 'حلول دعم الشحن الجوي' : 'Air cargo support solutions', href: '/solutions#air' },
    { label: t('solutions.storage'), desc: isAr ? 'حلول تخزين جاهزة' : 'Modular storage solutions', href: '/solutions#storage' },
  ];

  const industriesMega = [
    { label: t('industries.construction'), desc: isAr ? 'تخزين الموقع والوحدات الجاهزة' : 'On-site storage & modular units', href: '/industries#construction' },
    { label: t('industries.oilGas'), desc: isAr ? 'حاويات متخصصة للطاقة' : 'Specialized energy containers', href: '/industries#oil-gas' },
    { label: t('industries.manufacturing'), desc: isAr ? 'حلول المستودعات الصناعية' : 'Industrial warehouse solutions', href: '/industries#manufacturing' },
    { label: t('industries.logisticsPorts'), desc: isAr ? 'بنية تحتية مينائية كاملة' : 'Complete port infrastructure', href: '/industries#logistics' },
    { label: t('industries.government'), desc: isAr ? 'دعم القطاع الحكومي' : 'Public sector support', href: '/industries#government' },
    { label: t('industries.megaProjects'), desc: isAr ? 'بنية تحتية للمشاريع الكبرى' : 'Mega project infrastructure', href: '/industries#mega' },
  ];

  const navLinks = [
    { label: t('nav.solutions'), href: '/solutions', mega: 'solutions' },
    { label: t('nav.shop'), href: '/shop' },
    { label: t('nav.industries'), href: '/industries', mega: 'industries' },
    { label: t('nav.whySalada'), href: '/why-salada' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.contact'), href: '/contact' },
  ];

  const handleMegaEnter = (key: string) => {
    clearTimeout(megaTimeoutRef.current);
    setOpenMega(key);
  };

  const handleMegaLeave = () => {
    megaTimeoutRef.current = setTimeout(() => setOpenMega(null), 200);
  };

  const searchResults = searchQuery.trim() ? navLinks.filter(l =>
    l.label.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out",
      isScrolled
        ? "bg-background/98 backdrop-blur-md border-b-2 border-primary/40 shadow-[0_4px_30px_-4px_hsl(var(--primary)/0.25)]"
        : "bg-background/80 backdrop-blur-sm border-b border-primary/20 shadow-[0_2px_10px_-4px_hsl(var(--primary)/0.1)]"
    )}>
      <div className="industrial-container">
        <div className="flex items-center justify-between h-24 md:h-32 rtl:flex-row-reverse">
          {/* Logo */}
          <Link to="/" className="flex items-center hover-lift">
            <img src={saladaLogo} alt="SALADA Metal Industries" className="h-20 md:h-28 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 rtl:flex-row-reverse">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => link.mega && handleMegaEnter(link.mega)}
                onMouseLeave={() => link.mega && handleMegaLeave()}
              >
                <Link
                  to={link.href}
                  className="relative text-sm uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors font-medium group inline-flex items-center gap-1 rtl:flex-row-reverse"
                >
                  {link.label}
                  {link.mega && <ChevronDown className="w-3.5 h-3.5" />}
                  <span className="absolute -bottom-1 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ltr:left-0 rtl:right-0" />
                </Link>
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3 rtl:flex-row-reverse">
            {/* Search toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-primary transition-colors focus-ring rounded"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <LanguageSwitcher />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 focus-ring rounded"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className={cn(
          'overflow-hidden transition-all duration-300 border-t border-border',
          isSearchOpen ? 'max-h-20 py-4' : 'max-h-0 py-0 border-transparent'
        )}>
          <div className="relative">
            <Search className="absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ltr:left-4 rtl:right-4" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث في الموقع...' : 'Search the site...'}
              className="w-full py-3 bg-secondary/50 border border-border text-sm focus:outline-none focus:border-primary transition-colors ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4 rtl:text-right"
            />
          </div>
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 bg-background border border-border shadow-lg mt-1 z-50">
              {searchResults.map((r) => (
                <Link
                  key={r.href}
                  to={r.href}
                  onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                  className="block px-4 py-3 text-sm hover:bg-secondary transition-colors rtl:text-right"
                >
                  {r.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          'md:hidden border-t border-border overflow-hidden transition-all duration-300',
          isMenuOpen ? 'max-h-[500px] py-6' : 'max-h-0 py-0'
        )}>
          <nav className="flex flex-col gap-4 rtl:text-right">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-lg uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mega Menus */}
      <MegaMenu items={solutionsMega} isOpen={openMega === 'solutions'} />
      <MegaMenu items={industriesMega} isOpen={openMega === 'industries'} />
    </header>
  );
}
