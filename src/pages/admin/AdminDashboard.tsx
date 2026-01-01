import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
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
  Plus,
} from 'lucide-react';
import { products } from '@/data/products';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useLanguageStore } from '@/store/languageStore';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { OrdersAdmin } from '@/components/admin/OrdersAdmin';
import { CustomersAdmin } from '@/components/admin/CustomersAdmin';

function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const location = useLocation();
  const { t, isRTL } = useLanguageStore();
  
  const navItems = [
    { icon: LayoutDashboard, label: t('admin.dashboard'), path: '/admin' },
    { icon: Package, label: t('admin.products'), path: '/admin/products' },
    { icon: ShoppingCart, label: t('admin.orders'), path: '/admin/orders' },
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
  
  const stats = [
    { label: t('admin.totalRevenue'), value: 'SAR 125,430', change: '+12.5%', icon: DollarSign },
    { label: t('admin.orders'), value: '156', change: '+8.2%', icon: ShoppingCart },
    { label: t('admin.products'), value: products.length.toString(), change: '0', icon: Box },
    { label: t('admin.customers'), value: '89', change: '+15.3%', icon: Users },
  ];

  const recentOrders = [
    { id: 'SAL-001', customer: 'Acme Corp', total: 12500, status: 'processing' },
    { id: 'SAL-002', customer: 'Global Industries', total: 8900, status: 'shipped' },
    { id: 'SAL-003', customer: 'Tech Solutions', total: 4500, status: 'delivered' },
    { id: 'SAL-004', customer: 'Maritime LLC', total: 25000, status: 'pending' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">{t('admin.dashboard')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-8 h-8 text-primary" />
              <span className={`text-sm font-mono ${stat.change.startsWith('+') ? 'text-green-500' : 'text-muted-foreground'}`}>
                {stat.change}
              </span>
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
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="font-mono text-sm">{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono">SAR {order.total.toLocaleString()}</p>
                  <span className={`text-xs uppercase px-2 py-1 ${
                    order.status === 'delivered' ? 'bg-green-500/20 text-green-500' :
                    order.status === 'shipped' ? 'bg-blue-500/20 text-blue-500' :
                    order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {t(`admin.${order.status}`)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-accent" /> {t('admin.lowStockAlert')}
          </h2>
          <div className="space-y-3">
            {products.filter(p => p.stock <= 15).slice(0, 4).map((product) => (
              <div key={product.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium line-clamp-1">{product.title}</p>
                  <p className="text-xs text-muted-foreground font-mono">{product.sku}</p>
                </div>
                <span className="text-sm font-mono text-accent">{product.stock} {t('admin.left')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsAdmin() {
  const { t } = useLanguageStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">{t('admin.products')}</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="industrial-button text-sm py-2 px-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('admin.addProduct')}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-card border border-border p-6 mb-8">
          <h2 className="text-lg font-bold mb-6">{t('admin.addProduct')}</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Product Title *</label>
              <input type="text" className="industrial-input" placeholder="Heavy-Duty Container" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('admin.sku')} *</label>
              <input type="text" className="industrial-input font-mono" placeholder="SAL-XXX-000" />
            </div>
          </div>

          <div className="mb-6">
            <ImageUpload onUpload={setUploadedImages} existingImages={uploadedImages} />
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">{t('admin.price')} *</label>
              <input type="number" className="industrial-input font-mono" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('admin.stock')} *</label>
              <input type="number" className="industrial-input font-mono" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('admin.status')}</label>
              <select className="industrial-input">
                <option value="active">{t('admin.active')}</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="industrial-button">{t('common.save')}</button>
            <button onClick={() => setShowAddForm(false)} className="industrial-button-outline">{t('common.cancel')}</button>
          </div>
        </div>
      )}

      <div className="bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left p-4 text-sm uppercase tracking-wider">{t('admin.products')}</th>
                <th className="text-left p-4 text-sm uppercase tracking-wider">{t('admin.sku')}</th>
                <th className="text-left p-4 text-sm uppercase tracking-wider">{t('admin.price')}</th>
                <th className="text-left p-4 text-sm uppercase tracking-wider">{t('admin.stock')}</th>
                <th className="text-left p-4 text-sm uppercase tracking-wider">{t('admin.status')}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-border hover:bg-muted/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={product.images[0]} alt="" className="w-10 h-10 object-cover" />
                      <span className="font-medium line-clamp-1">{product.title}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-sm">{product.sku}</td>
                  <td className="p-4 font-mono">SAR {product.price.toLocaleString()}</td>
                  <td className="p-4 font-mono">{product.stock}</td>
                  <td className="p-4">
                    <span className={`text-xs uppercase px-2 py-1 ${
                      product.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'
                    }`}>
                      {t(`admin.${product.status}`)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            <Route path="/customers" element={<CustomersAdmin />} />
            <Route path="/coupons" element={<PlaceholderPage title={t('admin.coupons')} />} />
            <Route path="/settings" element={<PlaceholderPage title={t('admin.settings')} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
