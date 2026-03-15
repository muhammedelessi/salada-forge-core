import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useCartStore } from '@/store/cartStore';
import { Check, CreditCard, Truck, ArrowLeft, ArrowRight, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/i18n/translations';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

type CheckoutStep = 'shipping' | 'payment' | 'confirmation';
type PaymentMethod = 'credit_card' | 'bank_transfer';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getSubtotal, getShipping, getTax, getTotal, couponCode, couponDiscount, clearCart } = useCartStore();
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [user, setUser] = useState<User | null>(null);
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: language === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia',
  });

  const [billingInfo, setBillingInfo] = useState({
    sameAsShipping: true,
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: language === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const ArrowIcon = isRTL() ? ArrowRight : ArrowLeft;

  if (items.length === 0 && step !== 'confirmation') {
    navigate('/cart');
    return null;
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email for guest checkout
    if (!user && !shippingInfo.email) {
      toast.error(
        language === 'ar' 
          ? 'البريد الإلكتروني مطلوب' 
          : 'Email is required'
      );
      return;
    }
    
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate guest email
    if (!user && !shippingInfo.email) {
      toast.error(language === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required');
      return;
    }

    setIsProcessing(true);
    
    try {
      const orderNumber = `SAL-${Date.now().toString(36).toUpperCase()}`;
      
      const orderData: any = {
        order_number: orderNumber,
        status: paymentMethod === 'bank_transfer' ? 'pending' : 'processing',
        payment_method: paymentMethod,
        subtotal: getSubtotal(),
        shipping: getShipping(),
        tax: getTax(),
        discount: couponDiscount,
        total: getTotal(),
        shipping_address: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          company: shippingInfo.company,
          address1: shippingInfo.address1,
          address2: shippingInfo.address2,
          city: shippingInfo.city,
          state: shippingInfo.state,
          postalCode: shippingInfo.postalCode,
          country: shippingInfo.country,
        },
        billing_address: billingInfo.sameAsShipping ? null : billingInfo,
        items: items.map((item) => ({
          productId: item.product.id,
          title: item.product.title,
          quantity: item.quantity,
          price: item.product.price + (item.selectedVariant?.priceModifier || 0),
          variant: item.selectedVariant?.name || null,
          image: item.product.images[0],
        })),
      };

      // Add user_id for authenticated users or guest_email for guests
      if (user) {
        orderData.user_id = user.id;
      } else {
        orderData.guest_email = shippingInfo.email;
      }

      const { error } = await supabase.from('orders').insert(orderData);

      if (error) throw error;

      clearCart();
      
      // Redirect to orders page for logged in users, or show confirmation for guests
      if (user) {
        navigate('/orders?success=true');
      } else {
        navigate(`/orders?success=true&order=${orderNumber}&email=${encodeURIComponent(shippingInfo.email)}`);
      }
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error(language === 'ar' ? 'خطأ في إنشاء الطلب' : 'Error creating order');
    } finally {
      setIsProcessing(false);
    }
  };

  const countries = [
    { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' },
    { en: 'UAE', ar: 'الإمارات العربية المتحدة' },
    { en: 'Kuwait', ar: 'الكويت' },
    { en: 'Qatar', ar: 'قطر' },
    { en: 'Bahrain', ar: 'البحرين' },
    { en: 'Oman', ar: 'عُمان' },
    { en: 'Egypt', ar: 'مصر' },
    { en: 'Jordan', ar: 'الأردن' },
  ];

  const bankDetails = {
    en: {
      title: 'Bank Transfer Details',
      bankName: 'Bank Name',
      bankNameValue: 'Al Rajhi Bank',
      accountName: 'Account Name',
      accountNameValue: 'SALADA Industrial Solutions',
      accountNumber: 'Account Number (IBAN)',
      accountNumberValue: 'SA0380000000608010167519',
      note: 'Please transfer the total amount and include your order number in the transfer reference. Your order will be processed once payment is confirmed.',
    },
    ar: {
      title: 'بيانات التحويل البنكي',
      bankName: 'اسم البنك',
      bankNameValue: 'مصرف الراجحي',
      accountName: 'اسم الحساب',
      accountNameValue: 'صلادة للحلول الصناعية',
      accountNumber: 'رقم الحساب (آيبان)',
      accountNumberValue: 'SA0380000000608010167519',
      note: 'يرجى تحويل المبلغ الإجمالي وإدراج رقم طلبك في مرجع التحويل. سيتم معالجة طلبك بمجرد تأكيد الدفع.',
    },
  };

  const paymentContent = {
    en: {
      selectPayment: 'Select Payment Method',
      creditCard: 'Credit Card',
      bankTransfer: 'Bank Transfer',
      creditCardDesc: 'Pay securely with Visa, MasterCard, or mada',
      bankTransferDesc: 'Transfer directly to our bank account',
    },
    ar: {
      selectPayment: 'اختر طريقة الدفع',
      creditCard: 'بطاقة ائتمان',
      bankTransfer: 'تحويل بنكي',
      creditCardDesc: 'ادفع بأمان باستخدام فيزا، ماستركارد، أو مدى',
      bankTransferDesc: 'حوّل مباشرة إلى حسابنا البنكي',
    },
  };

  const pc = paymentContent[language];
  const bd = bankDetails[language];

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border">
          <div className="industrial-container py-4">
            <Link to="/" className={`flex items-center gap-3 ${isRTL() ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold tracking-tight">SALADA</span>
            </Link>
          </div>
        </div>

        <div className="industrial-container py-8 lg:py-12">
          <div className={`grid lg:grid-cols-2 gap-8 lg:gap-16 ${isRTL() ? 'lg:grid-flow-dense' : ''}`} dir={isRTL() ? 'rtl' : 'ltr'}>
            {/* Main Form */}
            <div className={isRTL() ? 'lg:col-start-2' : ''}>
              <Link
                to="/cart"
                className={`inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-8 ${isRTL() ? 'flex-row-reverse' : ''}`}
              >
                <ArrowIcon className="w-4 h-4" />
                {t.checkout.backToCart}
              </Link>

              {/* Progress Steps */}
              <div className={`flex items-center gap-4 mb-8 ${isRTL() ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-primary' : 'text-muted-foreground'} ${isRTL() ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 flex items-center justify-center border-2 ${step === 'shipping' ? 'border-primary bg-primary text-primary-foreground' : step === 'payment' ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>
                    {step === 'payment' ? <Check className="w-4 h-4" /> : '1'}
                  </div>
                  <span className="text-sm uppercase tracking-wider font-medium hidden sm:inline">{t.checkout.shippingStep}</span>
                </div>
                <div className="flex-1 h-px bg-border" />
                <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-primary' : 'text-muted-foreground'} ${isRTL() ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 flex items-center justify-center border-2 ${step === 'payment' ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>
                    2
                  </div>
                  <span className="text-sm uppercase tracking-wider font-medium hidden sm:inline">{t.checkout.paymentStep}</span>
                </div>
              </div>

              {/* Guest Checkout Info */}
              {!user && (
                <div className="mb-6 p-4 bg-secondary border border-border">
                  <p className="text-sm text-muted-foreground mb-2">
                    {language === 'ar' 
                      ? 'يمكنك الطلب كضيف أو تسجيل الدخول لتتبع طلباتك بسهولة' 
                      : 'You can checkout as guest or login to easily track your orders'}
                  </p>
                  <Link to="/auth" className="text-primary hover:underline font-medium text-sm">
                    {language === 'ar' ? 'تسجيل الدخول / إنشاء حساب' : 'Login / Create Account'}
                  </Link>
                </div>
              )}

              {step === 'shipping' && (
                <form onSubmit={handleShippingSubmit}>
                  <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isRTL() ? 'flex-row-reverse' : ''}`}>
                    <Truck className="w-5 h-5" />
                    {t.checkout.shippingInfo}
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">{t.checkout.firstName} *</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.firstName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                          className="industrial-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">{t.checkout.lastName} *</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.lastName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                          className="industrial-input"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">{t.checkout.email} *</label>
                      <input
                        type="email"
                        required
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                        className="industrial-input"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">{t.checkout.phone}</label>
                      <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        className="industrial-input"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">{t.checkout.company}</label>
                      <input
                        type="text"
                        value={shippingInfo.company}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, company: e.target.value })}
                        className="industrial-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">{t.checkout.address} *</label>
                      <input
                        type="text"
                        required
                        placeholder={t.checkout.streetAddress}
                        value={shippingInfo.address1}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address1: e.target.value })}
                        className="industrial-input"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder={t.checkout.aptSuite}
                        value={shippingInfo.address2}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address2: e.target.value })}
                        className="industrial-input"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">{t.checkout.city} *</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          className="industrial-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">{t.checkout.state} *</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                          className="industrial-input"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">{t.checkout.postalCode} *</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.postalCode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                          className="industrial-input"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">{t.checkout.country} *</label>
                        <select
                          value={shippingInfo.country}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                          className="industrial-input"
                        >
                          {countries.map((country) => (
                            <option key={country.en} value={language === 'ar' ? country.ar : country.en}>
                              {language === 'ar' ? country.ar : country.en}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full industrial-button mt-8 justify-center">
                    {t.checkout.continueToPayment}
                  </button>
                </form>
              )}

              {step === 'payment' && (
                <form onSubmit={handlePaymentSubmit}>
                  <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isRTL() ? 'flex-row-reverse' : ''}`}>
                    <CreditCard className="w-5 h-5" />
                    {t.checkout.paymentInfo}
                  </h2>

                  {/* Billing Address */}
                  <div className="mb-8">
                    <label className={`flex items-center gap-3 cursor-pointer ${isRTL() ? 'flex-row-reverse' : ''}`}>
                      <input
                        type="checkbox"
                        checked={billingInfo.sameAsShipping}
                        onChange={(e) => setBillingInfo({ ...billingInfo, sameAsShipping: e.target.checked })}
                        className="w-5 h-5 accent-primary"
                      />
                      <span>{t.checkout.billingSame}</span>
                    </label>
                  </div>

                  {!billingInfo.sameAsShipping && (
                    <div className="space-y-4 mb-8 p-4 bg-secondary border border-border">
                      <h3 className="font-medium">{t.checkout.billingAddress}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder={t.checkout.firstName}
                          required
                          value={billingInfo.firstName}
                          onChange={(e) => setBillingInfo({ ...billingInfo, firstName: e.target.value })}
                          className="industrial-input"
                        />
                        <input
                          type="text"
                          placeholder={t.checkout.lastName}
                          required
                          value={billingInfo.lastName}
                          onChange={(e) => setBillingInfo({ ...billingInfo, lastName: e.target.value })}
                          className="industrial-input"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder={t.checkout.address}
                        required
                        value={billingInfo.address1}
                        onChange={(e) => setBillingInfo({ ...billingInfo, address1: e.target.value })}
                        className="industrial-input"
                      />
                      <div className="grid grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder={t.checkout.city}
                          required
                          value={billingInfo.city}
                          onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                          className="industrial-input"
                        />
                        <input
                          type="text"
                          placeholder={t.checkout.state}
                          required
                          value={billingInfo.state}
                          onChange={(e) => setBillingInfo({ ...billingInfo, state: e.target.value })}
                          className="industrial-input"
                        />
                        <input
                          type="text"
                          placeholder={t.checkout.postalCode}
                          required
                          value={billingInfo.postalCode}
                          onChange={(e) => setBillingInfo({ ...billingInfo, postalCode: e.target.value })}
                          className="industrial-input"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  )}

                  {/* Payment Method Selection */}
                  <div className="mb-8">
                    <h3 className="font-medium mb-4">{pc.selectPayment}</h3>
                    <div className="space-y-3">
                      <label
                        className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${
                          paymentMethod === 'credit_card'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        } ${isRTL() ? 'flex-row-reverse' : ''}`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="credit_card"
                          checked={paymentMethod === 'credit_card'}
                          onChange={() => setPaymentMethod('credit_card')}
                          className="w-5 h-5 accent-primary"
                        />
                        <CreditCard className="w-6 h-6 text-primary" />
                        <div className={`flex-1 ${isRTL() ? 'text-right' : ''}`}>
                          <p className="font-medium">{pc.creditCard}</p>
                          <p className="text-sm text-muted-foreground">{pc.creditCardDesc}</p>
                        </div>
                      </label>

                      <label
                        className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${
                          paymentMethod === 'bank_transfer'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        } ${isRTL() ? 'flex-row-reverse' : ''}`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank_transfer"
                          checked={paymentMethod === 'bank_transfer'}
                          onChange={() => setPaymentMethod('bank_transfer')}
                          className="w-5 h-5 accent-primary"
                        />
                        <Building2 className="w-6 h-6 text-primary" />
                        <div className={`flex-1 ${isRTL() ? 'text-right' : ''}`}>
                          <p className="font-medium">{pc.bankTransfer}</p>
                          <p className="text-sm text-muted-foreground">{pc.bankTransferDesc}</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Credit Card Details */}
                  {paymentMethod === 'credit_card' && (
                    <div className="space-y-4 mb-8">
                      <div>
                        <label className="block text-sm font-medium mb-2">{t.checkout.cardNumber} *</label>
                        <input
                          type="text"
                          required
                          placeholder="1234 5678 9012 3456"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                          className="industrial-input font-mono"
                          dir="ltr"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">{t.checkout.nameOnCard} *</label>
                        <input
                          type="text"
                          required
                          value={paymentInfo.cardName}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                          className="industrial-input"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">{t.checkout.expiryDate} *</label>
                          <input
                            type="text"
                            required
                            placeholder="MM/YY"
                            value={paymentInfo.expiry}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry: e.target.value })}
                            className="industrial-input font-mono"
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">{t.checkout.cvv} *</label>
                          <input
                            type="text"
                            required
                            placeholder="123"
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                            className="industrial-input font-mono"
                            dir="ltr"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bank Transfer Details */}
                  {paymentMethod === 'bank_transfer' && (
                    <div className="mb-8 p-6 bg-secondary border border-border">
                      <h3 className="font-bold mb-4">{bd.title}</h3>
                      <div className="space-y-3 text-sm">
                        <div className={`flex justify-between ${isRTL() ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground">{bd.bankName}</span>
                          <span className="font-medium">{bd.bankNameValue}</span>
                        </div>
                        <div className={`flex justify-between ${isRTL() ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground">{bd.accountName}</span>
                          <span className="font-medium">{bd.accountNameValue}</span>
                        </div>
                        <div className={`flex justify-between ${isRTL() ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground">{bd.accountNumber}</span>
                          <span className="font-mono font-medium" dir="ltr">{bd.accountNumberValue}</span>
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-muted-foreground border-t border-border pt-4">
                        {bd.note}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setStep('shipping')}
                      className="industrial-button-outline flex-1 justify-center"
                    >
                      {t.checkout.back}
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="industrial-button flex-1 justify-center disabled:opacity-50"
                    >
                      {isProcessing ? t.checkout.processing : `${t.checkout.pay} ${formatPrice(getTotal())}`}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Order Summary */}
            <div className={`order-first lg:order-last ${isRTL() ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
              <div className="bg-secondary border border-border p-6 lg:sticky lg:top-24">
                <h2 className="text-lg font-bold mb-6">{t.cart.orderSummary}</h2>

                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedVariant?.id || 'default'}`}
                      className={`flex gap-4 ${isRTL() ? 'flex-row-reverse' : ''}`}
                    >
                      <div className="relative w-16 h-16 bg-muted flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        <span className={`absolute -top-2 ${isRTL() ? '-left-2' : '-right-2'} w-5 h-5 bg-primary text-primary-foreground text-xs flex items-center justify-center font-mono`}>
                          {item.quantity}
                        </span>
                      </div>
                      <div className={`flex-1 min-w-0 ${isRTL() ? 'text-right' : ''}`}>
                        <p className="text-sm font-medium line-clamp-1">{item.product.title}</p>
                        {item.selectedVariant && (
                          <p className="text-xs text-muted-foreground">{item.selectedVariant.name}</p>
                        )}
                      </div>
                      <p className="text-sm font-mono">
                        {formatPrice((item.product.price + (item.selectedVariant?.priceModifier || 0)) * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className={`flex justify-between text-sm ${isRTL() ? 'flex-row-reverse' : ''}`}>
                    <span className="text-muted-foreground">{t.cart.subtotal}</span>
                    <span className="font-mono">{formatPrice(getSubtotal())}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className={`flex justify-between text-sm text-primary ${isRTL() ? 'flex-row-reverse' : ''}`}>
                      <span>{t.cart.discount} ({couponCode})</span>
                      <span className="font-mono">-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  <div className={`flex justify-between text-sm ${isRTL() ? 'flex-row-reverse' : ''}`}>
                    <span className="text-muted-foreground">{t.cart.shippingLabel}</span>
                    <span className="font-mono">
                      {getShipping() === 0 ? t.cart.free : formatPrice(getShipping())}
                    </span>
                  </div>
                  <div className={`flex justify-between text-sm ${isRTL() ? 'flex-row-reverse' : ''}`}>
                    <span className="text-muted-foreground">{t.cart.tax}</span>
                    <span className="font-mono">{formatPrice(getTax())}</span>
                  </div>
                </div>

                <div className={`flex justify-between items-center pt-4 mt-4 border-t border-border ${isRTL() ? 'flex-row-reverse' : ''}`}>
                  <span className="text-lg font-bold">{t.cart.total}</span>
                  <span className="text-xl font-bold font-mono text-primary">
                    {formatPrice(getTotal())}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
