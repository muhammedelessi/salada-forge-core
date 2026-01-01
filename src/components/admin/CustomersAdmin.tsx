import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguageStore } from '@/store/languageStore';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Package, 
  ChevronDown, 
  ChevronUp,
  ShoppingBag,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  items: Array<{ title: string; quantity: number }>;
}

interface CustomerWithOrders extends Profile {
  email?: string;
  orders: Order[];
  totalSpent: number;
  orderCount: number;
}

export function CustomersAdmin() {
  const { language, isRTL } = useLanguageStore();
  const [customers, setCustomers] = useState<CustomerWithOrders[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);

  const content = {
    en: {
      title: 'Customer Management',
      search: 'Search by name, email, or phone...',
      refresh: 'Refresh',
      noCustomers: 'No customers found',
      customer: 'Customer',
      email: 'Email',
      phone: 'Phone',
      joined: 'Joined',
      orders: 'Orders',
      totalSpent: 'Total Spent',
      orderHistory: 'Order History',
      noOrders: 'No orders yet',
      orderNumber: 'Order',
      status: 'Status',
      total: 'Total',
      date: 'Date',
      items: 'items',
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    },
    ar: {
      title: 'إدارة العملاء',
      search: 'البحث بالاسم أو البريد أو الهاتف...',
      refresh: 'تحديث',
      noCustomers: 'لا يوجد عملاء',
      customer: 'العميل',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      joined: 'تاريخ الانضمام',
      orders: 'الطلبات',
      totalSpent: 'إجمالي المشتريات',
      orderHistory: 'سجل الطلبات',
      noOrders: 'لا توجد طلبات',
      orderNumber: 'طلب',
      status: 'الحالة',
      total: 'الإجمالي',
      date: 'التاريخ',
      items: 'منتجات',
      pending: 'قيد الانتظار',
      processing: 'قيد المعالجة',
      shipped: 'تم الشحن',
      delivered: 'تم التوصيل',
      cancelled: 'ملغي',
    },
  };

  const c = content[language];

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Combine profiles with their orders
      const customersWithOrders: CustomerWithOrders[] = (profiles || []).map((profile: Profile) => {
        const customerOrders = (orders || []).filter((order: any) => order.user_id === profile.user_id);
        const totalSpent = customerOrders.reduce((sum: number, order: any) => sum + Number(order.total), 0);
        
        return {
          ...profile,
          orders: customerOrders.map((order: any) => ({
            id: order.id,
            order_number: order.order_number,
            status: order.status,
            total: order.total,
            created_at: order.created_at,
            items: order.items || [],
          })),
          totalSpent,
          orderCount: customerOrders.length,
        };
      });

      setCustomers(customersWithOrders);
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      toast.error(language === 'ar' ? 'خطأ في تحميل العملاء' : 'Error loading customers');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-600';
      case 'processing': return 'bg-blue-500/20 text-blue-600';
      case 'shipped': return 'bg-purple-500/20 text-purple-600';
      case 'delivered': return 'bg-green-500/20 text-green-600';
      case 'cancelled': return 'bg-red-500/20 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    return c[status as keyof typeof c] || status;
  };

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchQuery.toLowerCase();
    return (
      customer.full_name?.toLowerCase().includes(searchLower) ||
      customer.phone?.includes(searchQuery) ||
      customer.user_id.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div dir={isRTL() ? 'rtl' : 'ltr'}>
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 ${isRTL() ? 'md:flex-row-reverse' : ''}`}>
        <h1 className="text-2xl font-bold">{c.title}</h1>
        <button 
          onClick={fetchCustomers} 
          className={`industrial-button-outline text-sm py-2 px-4 ${isRTL() ? 'flex-row-reverse' : ''}`}
        >
          <RefreshCw className="w-4 h-4" />
          {c.refresh}
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL() ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            placeholder={c.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`industrial-input ${isRTL() ? 'pr-10' : 'pl-10'}`}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border p-4">
          <div className={`flex items-center gap-3 ${isRTL() ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className={isRTL() ? 'text-right' : ''}>
              <p className="text-2xl font-bold">{customers.length}</p>
              <p className="text-xs text-muted-foreground">{c.customer}</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border p-4">
          <div className={`flex items-center gap-3 ${isRTL() ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 bg-blue-500/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <div className={isRTL() ? 'text-right' : ''}>
              <p className="text-2xl font-bold">{customers.reduce((sum, c) => sum + c.orderCount, 0)}</p>
              <p className="text-xs text-muted-foreground">{c.orders}</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border p-4 col-span-2">
          <div className={`flex items-center gap-3 ${isRTL() ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 bg-green-500/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-green-500" />
            </div>
            <div className={isRTL() ? 'text-right' : ''}>
              <p className="text-2xl font-bold font-mono">
                {formatPrice(customers.reduce((sum, c) => sum + c.totalSpent, 0))}
              </p>
              <p className="text-xs text-muted-foreground">{c.totalSpent}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customers List */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-card border border-border p-12 text-center">
          <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{c.noCustomers}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="bg-card border border-border">
              {/* Customer Row */}
              <div
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedCustomer(expandedCustomer === customer.id ? null : customer.id)}
              >
                <div className={`flex items-center gap-4 flex-wrap ${isRTL() ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar & Name */}
                  <div className={`flex items-center gap-3 flex-1 min-w-[200px] ${isRTL() ? 'flex-row-reverse' : ''}`}>
                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {customer.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className={isRTL() ? 'text-right' : ''}>
                      <p className="font-medium">{customer.full_name || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(customer.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className={`text-sm ${isRTL() ? 'text-right' : ''}`}>
                    {customer.phone && (
                      <p className="flex items-center gap-1 text-muted-foreground" dir="ltr">
                        <Phone className="w-3 h-3" />
                        {customer.phone}
                      </p>
                    )}
                  </div>

                  {/* Orders Count */}
                  <div className={`text-center ${isRTL() ? 'text-right' : ''}`}>
                    <p className="text-lg font-bold">{customer.orderCount}</p>
                    <p className="text-xs text-muted-foreground">{c.orders}</p>
                  </div>

                  {/* Total Spent */}
                  <div className={`${isRTL() ? 'text-left' : 'text-right'}`}>
                    <p className="font-mono font-bold text-primary">{formatPrice(customer.totalSpent)}</p>
                    <p className="text-xs text-muted-foreground">{c.totalSpent}</p>
                  </div>

                  {/* Expand Icon */}
                  {expandedCustomer === customer.id ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Expanded Order History */}
              {expandedCustomer === customer.id && (
                <div className="border-t border-border p-4 bg-muted/30 animate-fade-in">
                  <h4 className={`font-bold mb-4 ${isRTL() ? 'text-right' : ''}`}>{c.orderHistory}</h4>
                  
                  {customer.orders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">{c.noOrders}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {customer.orders.map((order) => (
                        <div 
                          key={order.id} 
                          className={`flex items-center gap-4 p-3 bg-background rounded border border-border ${isRTL() ? 'flex-row-reverse' : ''}`}
                        >
                          <div className={`flex-1 ${isRTL() ? 'text-right' : ''}`}>
                            <p className="font-mono text-sm font-medium">
                              {c.orderNumber} #{order.order_number}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {order.items.reduce((sum, item) => sum + item.quantity, 0)} {c.items} • {formatDate(order.created_at)}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                          <p className="font-mono font-medium">{formatPrice(order.total)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
