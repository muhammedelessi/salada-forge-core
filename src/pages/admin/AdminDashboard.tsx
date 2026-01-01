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
} from 'lucide-react';
import { products } from '@/data/products';

function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const location = useLocation();
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: Users, label: 'Customers', path: '/admin/customers' },
    { icon: Tag, label: 'Coupons', path: '/admin/coupons' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-background/80 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50 transform transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
        <div className="absolute bottom-4 left-4 right-4">
          <Link to="/" className="block text-center text-sm text-muted-foreground hover:text-foreground py-2">
            ← Back to Store
          </Link>
        </div>
      </aside>
    </>
  );
}

function DashboardOverview() {
  const stats = [
    { label: 'Total Revenue', value: '$125,430', change: '+12.5%', icon: DollarSign },
    { label: 'Orders', value: '156', change: '+8.2%', icon: ShoppingCart },
    { label: 'Products', value: products.length.toString(), change: '0', icon: Box },
    { label: 'Customers', value: '89', change: '+15.3%', icon: Users },
  ];

  const recentOrders = [
    { id: 'SAL-001', customer: 'Acme Corp', total: 12500, status: 'processing' },
    { id: 'SAL-002', customer: 'Global Industries', total: 8900, status: 'shipped' },
    { id: 'SAL-003', customer: 'Tech Solutions', total: 4500, status: 'delivered' },
    { id: 'SAL-004', customer: 'Maritime LLC', total: 25000, status: 'pending' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      
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
            <TrendingUp className="w-5 h-5 text-primary" /> Recent Orders
          </h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="font-mono text-sm">{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono">${order.total.toLocaleString()}</p>
                  <span className={`text-xs uppercase px-2 py-1 ${
                    order.status === 'delivered' ? 'bg-green-500/20 text-green-500' :
                    order.status === 'shipped' ? 'bg-blue-500/20 text-blue-500' :
                    order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-accent" /> Low Stock Alert
          </h2>
          <div className="space-y-3">
            {products.filter(p => p.stock <= 15).slice(0, 4).map((product) => (
              <div key={product.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium line-clamp-1">{product.title}</p>
                  <p className="text-xs text-muted-foreground font-mono">{product.sku}</p>
                </div>
                <span className="text-sm font-mono text-accent">{product.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsAdmin() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <button className="industrial-button text-sm py-2 px-4">Add Product</button>
      </div>
      <div className="bg-card border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary">
            <tr>
              <th className="text-left p-4 text-sm uppercase tracking-wider">Product</th>
              <th className="text-left p-4 text-sm uppercase tracking-wider">SKU</th>
              <th className="text-left p-4 text-sm uppercase tracking-wider">Price</th>
              <th className="text-left p-4 text-sm uppercase tracking-wider">Stock</th>
              <th className="text-left p-4 text-sm uppercase tracking-wider">Status</th>
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
                <td className="p-4 font-mono">${product.price.toLocaleString()}</td>
                <td className="p-4 font-mono">{product.stock}</td>
                <td className="p-4">
                  <span className={`text-xs uppercase px-2 py-1 ${
                    product.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'
                  }`}>
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-6 py-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="w-6 h-6" />
          </button>
        </header>
        
        <main className="p-6 md:p-8">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/products" element={<ProductsAdmin />} />
            <Route path="/orders" element={<PlaceholderPage title="Orders" />} />
            <Route path="/customers" element={<PlaceholderPage title="Customers" />} />
            <Route path="/coupons" element={<PlaceholderPage title="Coupons" />} />
            <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
