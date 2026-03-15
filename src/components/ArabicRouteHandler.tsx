import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useLanguageStore } from '@/store/languageStore';
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import SolutionsPage from '@/pages/SolutionsPage';
import IndustriesPage from '@/pages/IndustriesPage';
import IndustryDetailPage from '@/pages/IndustryDetailPage';
import WhySaladaPage from '@/pages/WhySaladaPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import FAQPage from '@/pages/FAQPage';
import PolicyPage from '@/pages/PolicyPage';
import AuthPage from '@/pages/AuthPage';
import OrdersPage from '@/pages/OrdersPage';
import ProductInquiryPage from '@/pages/ProductInquiryPage';
import NotFound from '@/pages/NotFound';

export default function ArabicRouteHandler() {
  const { setLanguage } = useLanguageStore();

  useEffect(() => {
    setLanguage('ar');
    return () => {
      // Don't reset on unmount — let the store persist the choice
    };
  }, [setLanguage]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/solutions" element={<SolutionsPage />} />
      <Route path="/industries" element={<IndustriesPage />} />
      <Route path="/industries/:id" element={<IndustryDetailPage />} />
      <Route path="/why-salada" element={<WhySaladaPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/products" element={<ShopPage />} />
      <Route path="/product/:slug" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/privacy" element={<PolicyPage type="privacy" />} />
      <Route path="/terms" element={<PolicyPage type="terms" />} />
      <Route path="/returns" element={<PolicyPage type="returns" />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/inquiry/:slug" element={<ProductInquiryPage />} />
      <Route path="/account" element={<AuthPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
