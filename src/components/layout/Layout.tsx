import { Header } from './Header';
import { Footer } from './Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { useLanguageStore } from '@/store/languageStore';

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export function Layout({ children, hideFooter }: LayoutProps) {
  const { isRTL } = useLanguageStore();
  
  return (
    <div className="min-h-screen flex flex-col" dir={isRTL() ? 'rtl' : 'ltr'}>
      <Header />
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
      {!hideFooter && <Footer />}
      <WhatsAppButton />
    </div>
  );
}
