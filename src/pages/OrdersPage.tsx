import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/i18n/translations';
import { Package, Clock, CheckCircle, Truck, XCircle, LogOut, ChevronDown, ChevronUp, ShoppingBag, Search, Mail } from 'lucide-react';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';

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
  guest_email?: string;
  shipping_address: {
    firstName: string;
    lastName: string;
    email?: string;
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
  const [guestOrderNumber, setGuestOrderNumber] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [guestSearching, setGuestSearching] = useState(false);

  useEffect(() => {
    const success = searchParams.get('success');
    const orderNum = searchParams.get('order');
    const email = searchParams.get('email');
    
    if (success === 'true') {
      setShowSuccess(true);
      if (orderNum && email) {
        // Guest order confirmation
        setGuestOrderNumber(orderNum);
        setGuestEmail(decodeURIComponent(email));
        setIsGuestMode(true);
        fetchGuestOrder(orderNum, decodeURIComponent(email));
      }
      // Remove the query params from URL
      window.history.replaceState({}, '', '/orders');
    }
  }, [searchParams]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsGuestMode(false);
        fetchOrders();
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const fetchGuestOrder = async (orderNumber: string, email: string) => {
    setGuestSearching(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber)
        .eq('guest_email', email)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setOrders([data as unknown as Order]);
      } else {
        toast.error(language === 'ar' ? 'الطلب غير موجود' : 'Order not found');
        setOrders([]);
      }
    } catch (error: any) {
      console.error('Error fetching guest order:', error);
      toast.error(language === 'ar' ? 'خطأ في البحث عن الطلب' : 'Error searching for order');
    } finally {
      setGuestSearching(false);
      setLoading(false);
    }
  };

  const handleGuestSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestOrderNumber.trim() || !guestEmail.trim()) {
      toast.error(language === 'ar' ? 'يرجى إدخال رقم الطلب والبريد الإلكتروني' : 'Please enter order number and email');
      return;
    }
    setIsGuestMode(true);
    fetchGuestOrder(guestOrderNumber.trim(), guestEmail.trim());
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
      guestTitle: 'Track Your Order',
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
      guestOrderPlacedDesc: 'Thank you for your order. We sent a confirmation email to track your order.',
      trackOrder: 'Track Order',
      orderNumberLabel: 'Order Number',
      emailLabel: 'Email Address',
      searchOrder: 'Search Order',
      searching: 'Searching...',
      loginPrompt: 'Have an account?',
      loginLink: 'Login to see all orders',
      guestOrderNotFound: 'Order not found. Please check your order number and email.',
    },
    ar: {
      title: 'طلباتي',
      guestTitle: 'تتبع طلبك',
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
      guestOrderPlacedDesc: 'شكراً لطلبك. أرسلنا رسالة تأكيد لتتبع طلبك.',
      trackOrder: 'تتبع الطلب',
      orderNumberLabel: 'رقم الطلب',
      emailLabel: 'البريد الإلكتروني',
      searchOrder: 'البحث عن الطلب',
      searching: 'جارٍ البحث...',
      loginPrompt: 'لديك حساب؟',
      loginLink: 'سجل الدخول لرؤية جميع طلباتك',
      guestOrderNotFound: 'الطلب غير موجود. يرجى التحقق من رقم الطلب والبريد الإلكتروني.',
    },
  };

  const c = content[language];

  if (loading && user) {
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
            <div className={cn('flex items-start gap-4', isRTL() && 'flex-row-reverse')}>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className={isRTL() ? 'text-right' : ''}>
                <h3 className="text-lg font-bold text-green-800">{c.orderPlaced}</h3>
                <p className="text-green-700 mt-1">
                  {isGuestMode && !user ? c.guestOrderPlacedDesc : c.orderPlacedDesc}
                </p>
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
        <div className={cn('flex items-center justify-between mb-8', isRTL() && 'flex-row-reverse')}>
          <div className={isRTL() ? 'text-right' : ''}>
            <h1 className="text-3xl font-bold">{user ? c.title : c.guestTitle}</h1>
            {user && <p className="text-muted-foreground mt-1">{user.email}</p>}
          </div>
          {user && (
            <button
              onClick={handleLogout}
              className={cn('industrial-button-outline', isRTL() && 'flex-row-reverse')}
            >
              <LogOut className="w-4 h-4" />
              {c.logout}
            </button>
          )}
        </div>

        {/* Guest Order Tracking Form */}
        {!user && !isGuestMode && (
          <div className="mb-8">
            <form onSubmit={handleGuestSearch} className="bg-secondary border border-border p-6">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{c.orderNumberLabel}</label>
                  <input
                    type="text"
                    value={guestOrderNumber}
                    onChange={(e) => setGuestOrderNumber(e.target.value)}
                    placeholder="SAL-XXXXX"
                    className="industrial-input"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{c.emailLabel}</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="industrial-input"
                    dir="ltr"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={guestSearching}
                className={cn('industrial-button', isRTL() && 'flex-row-reverse')}
              >
                <Search className={cn('w-4 h-4', isRTL() ? 'ml-2' : 'mr-2')} />
                {guestSearching ? c.searching : c.searchOrder}
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {c.loginPrompt}{' '}
                <Link to="/auth" className="text-primary hover:underline font-medium">
                  {c.loginLink}
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Guest search again option */}
        {!user && isGuestMode && (
          <div className="mb-6">
            <button
              onClick={() => {
                setIsGuestMode(false);
                setOrders([]);
                setGuestOrderNumber('');
                setGuestEmail('');
              }}
              className="text-primary hover:underline text-sm"
            >
              {language === 'ar' ? '← البحث عن طلب آخر' : '← Search for another order'}
            </button>
          </div>
        )}

        {/* Orders List */}
        {(user || isGuestMode) && (
          <>
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-secondary border border-border">
                <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-bold mb-2">
                  {isGuestMode && !user ? c.guestOrderNotFound : c.noOrders}
                </h2>
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
                      className={cn('p-6 cursor-pointer hover:bg-secondary/50 transition-colors', isRTL() && 'flex-row-reverse')}
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    >
                      <div className={cn('flex items-center justify-between', isRTL() && 'flex-row-reverse')}>
                        <div className={cn('flex items-center gap-4', isRTL() && 'flex-row-reverse')}>
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="text-sm font-medium">{getStatusText(order.status)}</span>
                          </div>
                          <div className={isRTL() ? 'text-right' : ''}>
                            <p className="font-mono font-bold">{c.orderNumber} #{order.order_number}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                          </div>
                        </div>
                        <div className={cn('flex items-center gap-4', isRTL() && 'flex-row-reverse')}>
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
                              className={cn('flex items-center gap-4', isRTL() && 'flex-row-reverse')}
                            >
                              <div className="w-16 h-16 bg-muted flex-shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className={cn('flex-1', isRTL() && 'text-right')}>
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
                            {order.guest_email && (
                              <p className="text-muted-foreground mt-2 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {order.guest_email}
                              </p>
                            )}
                          </div>
                          <div className={isRTL() ? 'text-right' : ''}>
                            <h4 className="font-bold mb-2">{c.paymentMethod}</h4>
                            <p className="text-muted-foreground">
                              {order.payment_method === 'bank_transfer' ? c.bankTransfer : c.creditCard}
                            </p>
                            <div className="mt-4 space-y-1 text-sm">
                              <div className={cn('flex justify-between', isRTL() && 'flex-row-reverse')}>
                                <span className="text-muted-foreground">{t.cart.subtotal}</span>
                                <span className="font-mono">{formatPrice(order.subtotal)}</span>
                              </div>
                              {order.discount > 0 && (
                                <div className={cn('flex justify-between text-primary', isRTL() && 'flex-row-reverse')}>
                                  <span>{t.cart.discount}</span>
                                  <span className="font-mono">-{formatPrice(order.discount)}</span>
                                </div>
                              )}
                              <div className={cn('flex justify-between', isRTL() && 'flex-row-reverse')}>
                                <span className="text-muted-foreground">{t.cart.shippingLabel}</span>
                                <span className="font-mono">
                                  {order.shipping === 0 ? t.cart.free : formatPrice(order.shipping)}
                                </span>
                              </div>
                              <div className={cn('flex justify-between', isRTL() && 'flex-row-reverse')}>
                                <span className="text-muted-foreground">{t.cart.tax}</span>
                                <span className="font-mono">{formatPrice(order.tax)}</span>
                              </div>
                              <div className={cn('flex justify-between font-bold pt-2 border-t border-border', isRTL() && 'flex-row-reverse')}>
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
          </>
        )}
      </div>
    </Layout>
  );
}