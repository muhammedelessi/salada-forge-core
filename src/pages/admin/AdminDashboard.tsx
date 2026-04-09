import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  Menu,
  X,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Box,
  Loader2,
  MessageSquare,
  Inbox,
} from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { OrdersAdmin } from '@/components/admin/OrdersAdmin';
import { CustomersAdmin } from '@/components/admin/CustomersAdmin';
import { SettingsAdmin } from '@/components/admin/SettingsAdmin';
import { CouponsAdmin } from '@/components/admin/CouponsAdmin';
import { ProductsAdmin } from '@/components/admin/ProductsAdmin';
import { InquiriesAdmin } from '@/components/admin/InquiriesAdmin';
import { ContactInquiriesAdmin } from '@/components/admin/ContactInquiriesAdmin';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const location = useLocation();
  const { t, isRTL } = useLanguageStore();
  
  const navItems = [
    { icon: LayoutDashboard, label: t('admin.dashboard'), path: '/admin' },
    { icon: Package, label: t('admin.products'), path: '/admin/products' },
    { icon: ShoppingCart, label: t('admin.orders'), path: '/admin/orders' },
    { icon: MessageSquare, label: isRTL() ? 'طلبات الأسعار' : 'Product Inquiries', path: '/admin/inquiries' },
    { icon: Inbox, label: isRTL() ? 'رسائل التواصل' : 'Contact Messages', path: '/admin/contact' },
    { icon: Users, label: t('admin.customers'), path: '/admin/customers' },
    { icon: Tag, label: t('admin.coupons'), path: '/admin/coupons' },
    { icon: Settings, label: t('admin.settings'), path: '/admin/settings' },
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-background/80 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 ${isRTL() ? 'right-0' : 'left-0'} h-full w-64 bg-sidebar border-${isRTL() ? 'l' : 'r'} border-sidebar-border z-50 transform transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : isRTL() ? 'translate-x-full' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">S</span>
            </div>
            <span className="font-bold">SALADA Admin</span>
          </Link>
          <button onClick={onClose} className="lg:hidden"><X className="w-5 h-5" /></button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                location.pathname === item.path
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <div className="flex justify-center">
            <LanguageSwitcher />
          </div>
          <Link to="/" className="block text-center text-sm text-muted-foreground hover:text-foreground py-2">
            {t('admin.backToStore')}
          </Link>
        </div>
      </aside>
    </>
  );
}

function DashboardOverview() {
  const { t } = useLanguageStore();
  
  // Fetch products count and low stock products
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products-stats'],
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' });
      if (error) throw error;
      return { products: data || [], count: count || 0 };
    },
  });

  // Fetch orders with stats
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders-stats'],
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { orders: data || [], count: count || 0 };
    },
  });

  // Fetch customers count
  const { data: customersData, isLoading: customersLoading } = useQuery({
    queryKey: ['admin-customers-stats'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return { count: count || 0 };
    },
  });

  const isLoading = productsLoading || ordersLoading || customersLoading;

  // Calculate total revenue from orders
  const totalRevenue = ordersData?.orders.reduce((sum, order) => sum + Number(order.total), 0) || 0;
  
  // Get low stock products (stock <= 15)
  const lowStockProducts = productsData?.products.filter(p => p.stock <= 15).slice(0, 4) || [];
  
  // Get recent orders (last 4)
  const recentOrders = ordersData?.orders.slice(0, 4) || [];

  const stats = [
    { label: t('admin.totalRevenue'), value: `SAR ${totalRevenue.toLocaleString()}`, change: '', icon: DollarSign },
    { label: t('admin.orders'), value: (ordersData?.count || 0).toString(), change: '', icon: ShoppingCart },
    { label: t('admin.products'), value: (productsData?.count || 0).toString(), change: '', icon: Box },
    { label: t('admin.customers'), value: (customersData?.count || 0).toString(), change: '', icon: Users },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">{t('admin.dashboard')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-8 h-8 text-primary" />
            </div>
            <p className="text-2xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> {t('admin.recentOrders')}
          </h2>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No orders yet</p>
            ) : (
              recentOrders.map((order) => {
                const shippingAddress = order.shipping_address as { firstName?: string; lastName?: string; company?: string } | null;
                const customerName = shippingAddress?.company || 
                  `${shippingAddress?.firstName || ''} ${shippingAddress?.lastName || ''}`.trim() || 
                  order.guest_email || 
                  'Customer';
                
                return (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="label-text text-sm">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">{customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="label-text">SAR {Number(order.total).toLocaleString()}</p>
                      <span className={`text-xs uppercase px-2 py-1 ${
                        order.status === 'delivered' ? 'bg-green-500/20 text-green-500' :
                        order.status === 'shipped' ? 'bg-blue-500/20 text-blue-500' :
                        order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {t(`admin.${order.status}`) || order.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-card border border-border p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-accent" /> {t('admin.lowStockAlert')}
          </h2>
          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">All products have sufficient stock</p>
            ) : (
              lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium line-clamp-1">{product.title}</p>
                    <p className="text-xs text-muted-foreground label-text">{product.sku}</p>
                  </div>
                  <span className="text-sm label-text text-accent">{product.stock} {t('admin.left')}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <div className="bg-card border border-border p-12 text-center">
        <p className="text-muted-foreground">This section is ready for implementation.</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t, isRTL } = useLanguageStore();
  const navigate = useNavigate();

  const { data: isAdmin, isLoading: authLoading } = useQuery({
    queryKey: ['admin-auth-check'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return false;
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();
      return !!data;
    },
  });

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/', { replace: true });
    }
  }, [authLoading, isAdmin, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className={`${isRTL() ? 'lg:mr-64' : 'lg:ml-64'}`}>
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-6 py-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="w-6 h-6" />
          </button>
        </header>
        
        <main className="p-6 md:p-8">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/products" element={<ProductsAdmin />} />
            <Route path="/orders" element={<OrdersAdmin />} />
            <Route path="/inquiries" element={<InquiriesAdmin />} />
            <Route path="/contact" element={<ContactInquiriesAdmin />} />
            <Route path="/customers" element={<CustomersAdmin />} />
            <Route path="/coupons" element={<CouponsAdmin />} />
            <Route path="/settings" element={<SettingsAdmin />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
