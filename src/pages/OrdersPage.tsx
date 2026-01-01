import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/i18n/translations';
import { Package, Clock, CheckCircle, Truck, XCircle, LogOut, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_method: string;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shipping_address: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    title: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  created_at: string;
}

export default function OrdersPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];

  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      // Remove the query param from URL
      window.history.replaceState({}, '', '/orders');
    }
  }, [searchParams]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/auth');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((data || []) as unknown as Order[]);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error(language === 'ar' ? 'خطأ في تحميل الطلبات' : 'Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'processing':
        return <Package className="w-5 h-5" />;
      case 'shipped':
        return <Truck className="w-5 h-5" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      en: {
        pending: 'Pending',
        processing: 'Processing',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
      },
      ar: {
        pending: 'قيد الانتظار',
        processing: 'قيد المعالجة',
        shipped: 'تم الشحن',
        delivered: 'تم التوصيل',
        cancelled: 'ملغي',
      },
    };
    return statusMap[language][status as keyof typeof statusMap.en] || status;
  };

  const content = {
    en: {
      title: 'My Orders',
      logout: 'Logout',
      noOrders: 'No orders yet',
      noOrdersDesc: 'Start shopping to see your orders here',
      shopNow: 'Shop Now',
      orderNumber: 'Order',
      paymentMethod: 'Payment Method',
      creditCard: 'Credit Card',
      bankTransfer: 'Bank Transfer',
      items: 'items',
      viewDetails: 'View Details',
      hideDetails: 'Hide Details',
      shippingAddress: 'Shipping Address',
      orderPlaced: 'Order placed successfully!',
      orderPlacedDesc: 'Thank you for your order. You can track its status here.',
    },
    ar: {
      title: 'طلباتي',
      logout: 'تسجيل الخروج',
      noOrders: 'لا توجد طلبات',
      noOrdersDesc: 'ابدأ التسوق لرؤية طلباتك هنا',
      shopNow: 'تسوق الآن',
      orderNumber: 'طلب',
      paymentMethod: 'طريقة الدفع',
      creditCard: 'بطاقة ائتمان',
      bankTransfer: 'تحويل بنكي',
      items: 'منتجات',
      viewDetails: 'عرض التفاصيل',
      hideDetails: 'إخفاء التفاصيل',
      shippingAddress: 'عنوان الشحن',
      orderPlaced: 'تم تأكيد الطلب بنجاح!',
      orderPlacedDesc: 'شكراً لطلبك. يمكنك متابعة حالته هنا.',
    },
  };

  const c = content[language];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="industrial-container py-12" dir={isRTL() ? 'rtl' : 'ltr'}>
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6 animate-fade-in">
            <div className={`flex items-start gap-4 ${isRTL() ? 'flex-row-reverse' : ''}`}>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className={isRTL() ? 'text-right' : ''}>
                <h3 className="text-lg font-bold text-green-800">{c.orderPlaced}</h3>
                <p className="text-green-700 mt-1">{c.orderPlacedDesc}</p>
              </div>
              <button
                onClick={() => setShowSuccess(false)}
                className="text-green-600 hover:text-green-800 p-1"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className={`flex items-center justify-between mb-8 ${isRTL() ? 'flex-row-reverse' : ''}`}>
          <div>
            <h1 className="text-3xl font-bold">{c.title}</h1>
            <p className="text-muted-foreground mt-1">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className={`industrial-button-outline ${isRTL() ? 'flex-row-reverse' : ''}`}
          >
            <LogOut className="w-4 h-4" />
            {c.logout}
          </button>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-16 bg-secondary border border-border">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold mb-2">{c.noOrders}</h2>
            <p className="text-muted-foreground mb-6">{c.noOrdersDesc}</p>
            <Link to="/shop" className="industrial-button">
              {c.shopNow}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-card border border-border">
                {/* Order Header */}
                <div
                  className={`p-6 cursor-pointer hover:bg-secondary/50 transition-colors ${isRTL() ? 'flex-row-reverse' : ''}`}
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className={`flex items-center justify-between ${isRTL() ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-4 ${isRTL() ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="text-sm font-medium">{getStatusText(order.status)}</span>
                      </div>
                      <div className={isRTL() ? 'text-right' : ''}>
                        <p className="font-mono font-bold">{c.orderNumber} #{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-4 ${isRTL() ? 'flex-row-reverse' : ''}`}>
                      <div className={isRTL() ? 'text-left' : 'text-right'}>
                        <p className="font-bold font-mono text-primary">{formatPrice(order.total)}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} {c.items}
                        </p>
                      </div>
                      {expandedOrder === order.id ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                {expandedOrder === order.id && (
                  <div className="border-t border-border p-6 animate-fade-in">
                    {/* Items */}
                    <div className="space-y-4 mb-6">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-4 ${isRTL() ? 'flex-row-reverse' : ''}`}
                        >
                          <div className="w-16 h-16 bg-muted flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className={`flex-1 ${isRTL() ? 'text-right' : ''}`}>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} x {formatPrice(item.price)}
                            </p>
                          </div>
                          <p className="font-mono">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>

                    {/* Order Info */}
                    <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-border">
                      <div className={isRTL() ? 'text-right' : ''}>
                        <h4 className="font-bold mb-2">{c.shippingAddress}</h4>
                        <p className="text-muted-foreground">
                          {order.shipping_address.firstName} {order.shipping_address.lastName}<br />
                          {order.shipping_address.address1}<br />
                          {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postalCode}<br />
                          {order.shipping_address.country}
                        </p>
                      </div>
                      <div className={isRTL() ? 'text-right' : ''}>
                        <h4 className="font-bold mb-2">{c.paymentMethod}</h4>
                        <p className="text-muted-foreground">
                          {order.payment_method === 'bank_transfer' ? c.bankTransfer : c.creditCard}
                        </p>
                        <div className="mt-4 space-y-1 text-sm">
                          <div className={`flex justify-between ${isRTL() ? 'flex-row-reverse' : ''}`}>
                            <span className="text-muted-foreground">{t.cart.subtotal}</span>
                            <span className="font-mono">{formatPrice(order.subtotal)}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className={`flex justify-between text-primary ${isRTL() ? 'flex-row-reverse' : ''}`}>
                              <span>{t.cart.discount}</span>
                              <span className="font-mono">-{formatPrice(order.discount)}</span>
                            </div>
                          )}
                          <div className={`flex justify-between ${isRTL() ? 'flex-row-reverse' : ''}`}>
                            <span className="text-muted-foreground">{t.cart.shippingLabel}</span>
                            <span className="font-mono">
                              {order.shipping === 0 ? t.cart.free : formatPrice(order.shipping)}
                            </span>
                          </div>
                          <div className={`flex justify-between ${isRTL() ? 'flex-row-reverse' : ''}`}>
                            <span className="text-muted-foreground">{t.cart.tax}</span>
                            <span className="font-mono">{formatPrice(order.tax)}</span>
                          </div>
                          <div className={`flex justify-between font-bold pt-2 border-t border-border ${isRTL() ? 'flex-row-reverse' : ''}`}>
                            <span>{t.cart.total}</span>
                            <span className="font-mono text-primary">{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
