import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, ChevronDown, ArrowUpRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";
import saladaLogo from "@/assets/SALADA_LOGO.png";

/* ══════════════════════════════════════
   MEGA MENU
══════════════════════════════════════ */
function MegaMenu({
  items,
  isOpen,
  onClose,
}: {
  items: { label: string; desc: string; href: string }[];
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        "absolute top-full inset-x-0 z-50 overflow-hidden",
        "transition-all duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none",
      )}
    >
      {/* hairline gold accent */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(to right, transparent, hsl(var(--gold)/0.5) 30%, hsl(var(--gold)/0.5) 70%, transparent)",
        }}
      />

      <div className="border-b border-warm" style={{ background: "hsl(var(--paper-0))", backdropFilter: "blur(12px)" }}>
        <div className="container-xl py-10">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px" style={{ background: "hsl(var(--border))" }}>
            {items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className="group p-6 flex flex-col gap-1.5 transition-colors duration-200"
                style={{ background: "hsl(var(--paper-0))" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(var(--gold-pale))")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(var(--paper-0))")}
              >
                {/* gold bar */}
                <div
                  className="h-px mb-2 transition-all duration-300"
                  style={{ width: "0", background: "hsl(var(--gold))" }}
                  ref={(el) => {
                    if (!el) return;
                    el.closest("a")!.addEventListener("mouseenter", () => {
                      el.style.width = "1.5rem";
                    });
                    el.closest("a")!.addEventListener("mouseleave", () => {
                      el.style.width = "0";
                    });
                  }}
                />
                <span
                  className="text-xs font-black uppercase tracking-[0.05em] transition-colors duration-200"
                  style={{ color: "hsl(var(--ink-100))" }}
                >
                  {item.label}
                </span>
                <span className="text-[0.7rem] leading-relaxed" style={{ color: "hsl(var(--ink-40))" }}>
                  {item.desc}
                </span>
                <span
                  className="inline-flex items-center gap-1 mt-1 text-[0.6rem] font-mono uppercase tracking-[0.15em] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ color: "hsl(var(--gold))" }}
                >
                  View <ArrowUpRight style={{ width: 10, height: 10 }} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   MOBILE DRAWER
══════════════════════════════════════ */
function MobileDrawer({
  open,
  onClose,
  navLinks,
  isAr,
}: {
  open: boolean;
  onClose: () => void;
  navLinks: { label: string; href: string }[];
  isAr: boolean;
}) {
  return (
    <>
      {/* backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        style={{ background: "hsl(var(--ink-100)/0.35)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      {/* drawer panel */}
      <div
        className={cn(
          "fixed top-0 z-50 h-full w-80 max-w-[90vw] flex flex-col",
          "transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
          isAr ? "right-0" : "left-0",
          open ? "translate-x-0" : isAr ? "translate-x-full" : "-translate-x-full",
        )}
        style={{
          background: "hsl(var(--paper-0))",
          borderRight: isAr ? "none" : "1px solid hsl(var(--border))",
          borderLeft: isAr ? "1px solid hsl(var(--border))" : "none",
        }}
      >
        {/* drawer header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <span className="text-xs font-mono uppercase tracking-[0.25em]" style={{ color: "hsl(var(--gold))" }}>
            Menu
          </span>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 transition-colors duration-200"
            style={{ color: "hsl(var(--ink-40))" }}
            aria-label="Close menu"
          >
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* nav items */}
        <nav className="flex-1 overflow-y-auto px-6 py-8">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={onClose}
              className="flex items-center justify-between py-4 border-b group"
              style={{
                borderColor: "hsl(var(--border))",
                animationDelay: `${i * 40}ms`,
                color: "hsl(var(--ink-100))",
              }}
            >
              <div className={`flex items-center gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
                <span className="text-[0.55rem] font-mono" style={{ color: "hsl(var(--gold))" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-black uppercase tracking-[0.04em] group-hover:text-[hsl(var(--gold))] transition-colors duration-200">
                  {link.label}
                </span>
              </div>
              <ArrowUpRight
                style={{ width: 14, height: 14, color: "hsl(var(--ink-20))", flexShrink: 0 }}
                className="group-hover:text-[hsl(var(--gold))] transition-colors duration-200"
              />
            </Link>
          ))}
        </nav>

        {/* drawer footer */}
        <div className="px-6 py-6 border-t" style={{ borderColor: "hsl(var(--border))" }}>
          <Link
            to="/contact"
            onClick={onClose}
            className="btn-gold w-full flex items-center justify-center gap-2 text-[0.65rem]"
          >
            <span>{isAr ? "اطلب عرض سعر" : "Request a Quote"}</span>
            <ArrowUpRight style={{ width: 14, height: 14 }} />
          </Link>
          <p
            className="text-center mt-4 text-[0.55rem] font-mono uppercase tracking-[0.2em]"
            style={{ color: "hsl(var(--ink-20))" }}
          >
            ISO Certified · DNV Approved
          </p>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════
   SEARCH OVERLAY
══════════════════════════════════════ */
function SearchOverlay({
  open,
  onClose,
  navLinks,
}: {
  open: boolean;
  onClose: () => void;
  navLinks: { label: string; href: string }[];
}) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const results = q.trim() ? navLinks.filter((l) => l.label.toLowerCase().includes(q.toLowerCase())) : [];

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else setQ("");
  }, [open]);

  // close on Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] flex items-start justify-center pt-28 px-4",
        "transition-all duration-300",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
      style={{ background: "hsl(var(--ink-100)/0.5)", backdropFilter: "blur(8px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          "w-full max-w-xl transition-all duration-300",
          open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0",
        )}
        style={{ background: "hsl(var(--paper-0))", border: "1px solid hsl(var(--border))" }}
      >
        {/* search input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
          <Search style={{ width: 16, height: 16, color: "hsl(var(--gold))", flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "hsl(var(--ink-100))" }}
          />
          <button
            onClick={onClose}
            className="text-[0.6rem] font-mono uppercase tracking-[0.15em] px-2 py-1 border"
            style={{ color: "hsl(var(--ink-40))", borderColor: "hsl(var(--border))" }}
          >
            Esc
          </button>
        </div>

        {/* results */}
        {results.length > 0 && (
          <div>
            {results.map((r) => (
              <Link
                key={r.href}
                to={r.href}
                onClick={() => {
                  onClose();
                  setQ("");
                }}
                className="flex items-center justify-between px-5 py-3.5 border-b group transition-colors duration-150"
                style={{ borderColor: "hsl(var(--border))" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(var(--gold-pale))")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span className="text-sm font-semibold" style={{ color: "hsl(var(--ink-100))" }}>
                  {r.label}
                </span>
                <ArrowUpRight style={{ width: 14, height: 14, color: "hsl(var(--gold))" }} />
              </Link>
            ))}
          </div>
        )}

        {q && results.length === 0 && (
          <p className="px-5 py-4 text-sm" style={{ color: "hsl(var(--ink-40))" }}>
            No results for "{q}"
          </p>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   HEADER
══════════════════════════════════════ */
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);
  const megaTimer = useRef<ReturnType<typeof setTimeout>>();
  const { t, isRTL } = useLanguageStore();
  const location = useLocation();
  const isAr = isRTL();

  /* close mobile menu on route change */
  useEffect(() => {
    setIsMenuOpen(false);
    setOpenMega(null);
  }, [location.pathname]);

  /* scroll detection */
  useEffect(() => {
    const fn = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* prevent body scroll when drawer is open */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  /* nav items */
  const navLinks = [
    { label: t("nav.solutions"), href: "/solutions", mega: "solutions" },
    { label: t("nav.shop"), href: "/shop" },
    { label: t("nav.industries"), href: "/industries", mega: "industries" },
    { label: t("nav.whySalada"), href: "/why-salada" },
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  /* mega menu data */
  const solutionsMega = [
    {
      label: isAr ? "حاويات الشحن" : "Shipping Containers",
      desc: isAr ? "حاويات ISO معتمدة بأحجام متعددة" : "ISO-certified containers in multiple sizes",
      href: "/solutions#shipping-containers",
    },
    {
      label: isAr ? "حاويات التخزين" : "Storage Containers",
      desc: isAr ? "وحدات تخزين جاهزة للنشر" : "Deployment-ready storage units",
      href: "/solutions#storage-containers",
    },
    {
      label: t("solutions.landFreight"),
      desc: isAr ? "دعم النقل البري الكامل" : "Complete ground transport support",
      href: "/solutions#land",
    },
    {
      label: t("solutions.seaFreight"),
      desc: isAr ? "البنية التحتية للشحن البحري" : "Maritime cargo infrastructure",
      href: "/solutions#sea",
    },
    {
      label: t("solutions.airFreight"),
      desc: isAr ? "حلول دعم الشحن الجوي" : "Air cargo support solutions",
      href: "/solutions#air",
    },
    {
      label: t("solutions.storage"),
      desc: isAr ? "حلول تخزين جاهزة" : "Modular storage solutions",
      href: "/solutions#storage",
    },
  ];

  const industriesMega = [
    {
      label: t("industries.logistics"),
      desc: isAr ? "حاويات معززة للشحن والنقل" : "Reinforced containers for freight",
      href: "/industries#logistics",
    },
    {
      label: t("industries.construction"),
      desc: isAr ? "حلول تخزين موثوقة في الموقع" : "Reliable on-site storage",
      href: "/industries#construction",
    },
    {
      label: t("industries.government"),
      desc: isAr ? "حاويات متوافقة مع المعايير" : "Standards-aligned containers",
      href: "/industries#government",
    },
    {
      label: t("industries.industrial"),
      desc: isAr ? "حلول للبيئات القاسية" : "Solutions for harsh environments",
      href: "/industries#industrial",
    },
    {
      label: t("industries.storage"),
      desc: isAr ? "حلول تخزين قابلة للتوسع" : "Scalable storage solutions",
      href: "/industries#storage",
    },
  ];

  const megaData: Record<string, typeof solutionsMega> = {
    solutions: solutionsMega,
    industries: industriesMega,
  };

  const handleMegaEnter = (key: string) => {
    clearTimeout(megaTimer.current);
    setOpenMega(key);
  };
  const handleMegaLeave = () => {
    megaTimer.current = setTimeout(() => setOpenMega(null), 180);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50",
          "transition-all duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
          isScrolled ? "shadow-[0_2px_24px_-4px_hsl(var(--ink-100)/0.1)]" : "",
        )}
        style={{
          background: isScrolled ? "hsl(var(--paper-0)/0.97)" : "hsl(var(--paper-0))",
          backdropFilter: isScrolled ? "blur(16px)" : "none",
          borderBottom: `1px solid hsl(var(--border))`,
        }}
      >
        <div className="container-xl">
          <div className={cn("flex items-center justify-between", "h-16 md:h-20", isAr ? "flex-row-reverse" : "")}>
            {/* ── Logo ── */}
            <Link to="/" className="flex items-center shrink-0 hover-lift" aria-label="Salada — Home">
              <img src={saladaLogo} alt="SALADA Metal Industries" className="h-10 md:h-12 w-auto object-contain" />
            </Link>

            {/* ── Desktop nav ── */}
            <nav className={cn("hidden md:flex items-center gap-1", isAr ? "flex-row-reverse" : "")}>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                const hasMega = Boolean(link.mega);
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => hasMega && handleMegaEnter(link.mega!)}
                    onMouseLeave={() => hasMega && handleMegaLeave()}
                  >
                    <Link
                      to={link.href}
                      className={cn(
                        "relative flex items-center gap-1 px-3 py-2",
                        "text-[0.7rem] font-black uppercase tracking-[0.08em]",
                        "transition-colors duration-200 group",
                        isAr ? "flex-row-reverse" : "",
                        isActive
                          ? "text-[hsl(var(--gold))]"
                          : "text-[hsl(var(--ink-60))] hover:text-[hsl(var(--ink-100))]",
                      )}
                    >
                      {link.label}
                      {hasMega && (
                        <ChevronDown
                          className={cn(
                            "transition-transform duration-200",
                            openMega === link.mega ? "rotate-180" : "",
                          )}
                          style={{ width: 12, height: 12 }}
                        />
                      )}
                      {/* active underline */}
                      {isActive && (
                        <span className="absolute bottom-0 inset-x-3 h-px" style={{ background: "hsl(var(--gold))" }} />
                      )}
                      {/* hover underline */}
                      {!isActive && (
                        <span
                          className="absolute bottom-0 h-px transition-all duration-300 w-0 group-hover:w-[calc(100%-1.5rem)]"
                          style={{
                            background: "hsl(var(--ink-100))",
                            left: isAr ? "auto" : "0.75rem",
                            right: isAr ? "0.75rem" : "auto",
                          }}
                        />
                      )}
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* ── Right actions ── */}
            <div className={cn("flex items-center gap-2", isAr ? "flex-row-reverse" : "")}>
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center justify-center w-9 h-9 transition-colors duration-200"
                style={{ color: "hsl(var(--ink-40))" }}
                aria-label="Search"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "hsl(var(--gold))";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "hsl(var(--ink-40))";
                }}
              >
                <Search style={{ width: 17, height: 17 }} />
              </button>

              {/* Language switcher */}
              <LanguageSwitcher />

              {/* CTA — desktop */}
              <Link to="/contact" className="hidden md:inline-flex btn-gold text-[0.6rem] px-5 py-2.5">
                {isAr ? "اطلب عرض سعر" : "Get Quote"}
              </Link>

              {/* Hamburger — mobile */}
              <button
                className="md:hidden flex items-center justify-center w-9 h-9 transition-colors duration-200"
                style={{ color: "hsl(var(--ink-100))" }}
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu style={{ width: 20, height: 20 }} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Mega menus ── */}
        {Object.entries(megaData).map(([key, items]) => (
          <div key={key} onMouseEnter={() => handleMegaEnter(key)} onMouseLeave={handleMegaLeave}>
            <MegaMenu items={items} isOpen={openMega === key} onClose={() => setOpenMega(null)} />
          </div>
        ))}
      </header>

      {/* ── Mobile drawer ── */}
      <MobileDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} navLinks={navLinks} isAr={isAr} />

      {/* ── Search overlay ── */}
      <SearchOverlay open={isSearchOpen} onClose={() => setIsSearchOpen(false)} navLinks={navLinks} />
    </>
  );
}
