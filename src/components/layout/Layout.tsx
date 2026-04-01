import { useEffect } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useLanguageStore } from "@/store/languageStore";

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export function Layout({ children, hideFooter }: LayoutProps) {
  const { isRTL } = useLanguageStore();

  // Set dir and lang on <html> element so Tailwind rtl: variants work
  useEffect(() => {
    const html = document.documentElement;
    html.dir = isRTL() ? "rtl" : "ltr";
    html.lang = isRTL() ? "ar" : "en";
  }, [isRTL]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
      <WhatsAppButton />
    </div>
  );
}
