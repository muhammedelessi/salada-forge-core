import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguageStore } from '@/store/languageStore';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle, 
  Search,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

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
    email: string;
    phone?: string;
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
  user_id: string;
}

const statusOptions = [
  { value: 'pending', labelEn: 'Pending', labelAr: 'قيد الانتظار' },
  { value: 'processing', labelEn: 'Processing', labelAr: 'قيد المعالجة' },
  { value: 'shipped', labelEn: 'Shipped', labelAr: 'تم الشحن' },
  { value: 'delivered', labelEn: 'Delivered', labelAr: 'تم التوصيل' },
  { value: 'cancelled', labelEn: 'Cancelled', labelAr: 'ملغي' },
];

export function OrdersAdmin() {
  const { language, isRTL } = useLanguageStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  const content = {
    en: {
      title: 'Orders Management',
      search: 'Search by order number or customer...',
      allStatuses: 'All Statuses',
      refresh: 'Refresh',
      noOrders: 'No orders found',
      orderNumber: 'Order',
      customer: 'Customer',
      date: 'Date',
      total: 'Total',
      status: 'Status',
      paymentMethod: 'Payment',
      creditCard: 'Card',
      bankTransfer: 'Bank',
      items: 'items',
      updateStatus: 'Update Status',
      shippingAddress: 'Shipping Address',
      orderDetails: 'Order Details',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      tax: 'Tax',
      discount: 'Discount',
      statusUpdated: 'Order status updated successfully',
      statusUpdateError: 'Failed to update order status',
    },
    ar: {
      title: 'إدارة الطلبات',
      search: 'البحث برقم الطلب أو العميل...',
      allStatuses: 'جميع الحالات',
      refresh: 'تحديث',
      noOrders: 'لا توجد طلبات',
      orderNumber: 'طلب',
      customer: 'العميل',
      date: 'التاريخ',
      total: 'الإجمالي',
      status: 'الحالة',
      paymentMethod: 'الدفع',
      creditCard: 'بطاقة',
      bankTransfer: 'تحويل',
      items: 'منتجات',
      updateStatus: 'تحديث الحالة',
      shippingAddress: 'عنوان الشحن',
      orderDetails: 'تفاصيل الطلب',
      subtotal: 'المجموع الفرعي',
      shipping: 'الشحن',
      tax: 'الضريبة',
      discount: 'الخصم',
      statusUpdated: 'تم تحديث حالة الطلب بنجاح',
      statusUpdateError: 'فشل تحديث حالة الطلب',
    },
  };

  const c = content[language];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((data || []) as unknown as Order[]);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error(c.statusUpdateError);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId);
    try {
      // Get current order to append to shipping_updates
      const currentOrder = orders.find(o => o.id === orderId);
      const currentUpdates = (currentOrder as any)?.shipping_updates || [];
      
      // Add new status update with timestamp
      const newUpdate = {
        status: newStatus,
        timestamp: new Date().toISOString(),
      };
      
      const updatedShippingUpdates = [...currentUpdates, newUpdate];

      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          shipping_updates: updatedShippingUpdates,
        })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, shipping_updates: updatedShippingUpdates } as any
          : order
      ));
      toast.success(c.statusUpdated);
    } catch (error: any) {
      console.error('Error updating order:', error);
      toast.error(c.statusUpdateError);
    } finally {
      setUpdatingOrder(null);
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
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
    const option = statusOptions.find(s => s.value === status);
    return option ? (language === 'ar' ? option.labelAr : option.labelEn) : status;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${order.shipping_address.firstName} ${order.shipping_address.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping_address.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
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
          onClick={fetchOrders} 
          className={`btn-secondary text-sm py-2 px-4 ${isRTL() ? 'flex-row-reverse' : ''}`}
        >
          <RefreshCw className="w-4 h-4" />
          {c.refresh}
        </button>
      </div>

      {/* Filters */}
      <div className={`flex flex-col md:flex-row gap-4 mb-6 ${isRTL() ? 'md:flex-row-reverse' : ''}`}>
        <div className="relative flex-1">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL() ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            placeholder={c.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`industrial-input ${isRTL() ? 'pr-10' : 'pl-10'}`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="industrial-input md:w-48"
        >
          <option value="all">{c.allStatuses}</option>
          {statusOptions.map(status => (
            <option key={status.value} value={status.value}>
              {language === 'ar' ? status.labelAr : status.labelEn}
            </option>
          ))}
        </select>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-card border border-border p-12 text-center">
          <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{c.noOrders}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-card border border-border">
              {/* Order Row */}
              <div
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className={`flex items-center gap-4 flex-wrap ${isRTL() ? 'flex-row-reverse' : ''}`}>
                  {/* Order Info */}
                  <div className={`flex-1 min-w-[200px] ${isRTL() ? 'text-right' : ''}`}>
                    <p className="label-text font-bold">{c.orderNumber} #{order.order_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.shipping_address.firstName} {order.shipping_address.lastName}
                    </p>
                  </div>

                  {/* Date */}
                  <div className={`text-sm text-muted-foreground ${isRTL() ? 'text-right' : ''}`}>
                    {formatDate(order.created_at)}
                  </div>

                  {/* Payment */}
                  <div className="text-sm">
                    <span className="px-2 py-1 bg-muted rounded text-xs uppercase">
                      {order.payment_method === 'bank_transfer' ? c.bankTransfer : c.creditCard}
                    </span>
                  </div>

                  {/* Status */}
                  <div 
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${getStatusColor(order.status)} ${isRTL() ? 'flex-row-reverse' : ''}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {getStatusIcon(order.status)}
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      disabled={updatingOrder === order.id}
                      className="bg-transparent border-none text-sm font-medium focus:outline-none cursor-pointer"
                    >
                      {statusOptions.map(status => (
                        <option key={status.value} value={status.value}>
                          {language === 'ar' ? status.labelAr : status.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Total */}
                  <div className={`label-text font-bold text-primary ${isRTL() ? 'text-left' : 'text-right'}`}>
                    {formatPrice(order.total)}
                  </div>

                  {/* Expand Icon */}
                  {expandedOrder === order.id ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order.id && (
                <div className="border-t border-border p-4 bg-muted/30 animate-fade-in">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Items */}
                    <div className="md:col-span-2">
                      <h4 className="font-bold mb-3">{c.orderDetails}</h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div 
                            key={idx} 
                            className={`flex items-center gap-3 p-2 bg-background rounded ${isRTL() ? 'flex-row-reverse' : ''}`}
                          >
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              loading="lazy"
                              decoding="async"
                              width={48}
                              height={48}
                              className="w-12 h-12 object-cover max-w-full"
                            />
                            <div className={`flex-1 ${isRTL() ? 'text-right' : ''}`}>
                              <p className="text-sm font-medium">{item.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.quantity} x {formatPrice(item.price)}
                              </p>
                            </div>
                            <p className="label-text text-sm">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        ))}
                      </div>

                      {/* Totals */}
                      <div className="mt-4 pt-4 border-t border-border space-y-1 text-sm">
                        <div className={`flex justify-between ${isRTL() ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground">{c.subtotal}</span>
                          <span className="label-text">{formatPrice(order.subtotal)}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className={`flex justify-between text-green-600 ${isRTL() ? 'flex-row-reverse' : ''}`}>
                            <span>{c.discount}</span>
                            <span className="label-text">-{formatPrice(order.discount)}</span>
                          </div>
                        )}
                        <div className={`flex justify-between ${isRTL() ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground">{c.shipping}</span>
                          <span className="label-text">{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
                        </div>
                        <div className={`flex justify-between ${isRTL() ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground">{c.tax}</span>
                          <span className="label-text">{formatPrice(order.tax)}</span>
                        </div>
                        <div className={`flex justify-between font-bold pt-2 border-t border-border ${isRTL() ? 'flex-row-reverse' : ''}`}>
                          <span>{c.total}</span>
                          <span className="label-text text-primary">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h4 className="font-bold mb-3">{c.shippingAddress}</h4>
                      <div className={`text-sm text-muted-foreground space-y-1 ${isRTL() ? 'text-right' : ''}`}>
                        <p className="text-foreground font-medium">
                          {order.shipping_address.firstName} {order.shipping_address.lastName}
                        </p>
                        {order.shipping_address.email && (
                          <p>{order.shipping_address.email}</p>
                        )}
                        {order.shipping_address.phone && (
                          <p dir="ltr">{order.shipping_address.phone}</p>
                        )}
                        <p className="pt-2">{order.shipping_address.address1}</p>
                        <p>
                          {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postalCode}
                        </p>
                        <p>{order.shipping_address.country}</p>
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
  );
}
