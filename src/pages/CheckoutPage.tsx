import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useCartStore } from '@/store/cartStore';
import { Check, CreditCard, Truck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

type CheckoutStep = 'shipping' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getSubtotal, getShipping, getTax, getTotal, couponCode, couponDiscount, clearCart } = useCartStore();
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);

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
    country: 'United States',
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
    country: 'United States',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  if (items.length === 0 && step !== 'confirmation') {
    navigate('/cart');
    return null;
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      setStep('confirmation');
    }, 2000);
  };

  const orderNumber = `SAL-${Date.now().toString(36).toUpperCase()}`;

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border">
          <div className="industrial-container py-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold tracking-tight">SALADA</span>
            </Link>
          </div>
        </div>

        {step === 'confirmation' ? (
          <div className="industrial-container py-16">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-8">
                <Check className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Order Confirmed</h1>
              <p className="text-muted-foreground mb-2">Thank you for your order!</p>
              <p className="text-lg font-mono mb-8">Order Number: {orderNumber}</p>
              <p className="text-muted-foreground mb-8">
                We've sent a confirmation email to {shippingInfo.email}. 
                You'll receive shipping updates as your order progresses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/shop" className="industrial-button">
                  Continue Shopping
                </Link>
                <Link to="/" className="industrial-button-outline">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="industrial-container py-8 lg:py-12">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
              {/* Main Form */}
              <div>
                <Link
                  to="/cart"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-8"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Cart
                </Link>

                {/* Progress Steps */}
                <div className="flex items-center gap-4 mb-8">
                  <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-primary' : 'text-muted-foreground'}`}>
                    <div className={`w-8 h-8 flex items-center justify-center border-2 ${step === 'shipping' ? 'border-primary bg-primary text-primary-foreground' : step === 'payment' ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>
                      {step === 'payment' ? <Check className="w-4 h-4" /> : '1'}
                    </div>
                    <span className="text-sm uppercase tracking-wider font-medium hidden sm:inline">Shipping</span>
                  </div>
                  <div className="flex-1 h-px bg-border" />
                  <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-primary' : 'text-muted-foreground'}`}>
                    <div className={`w-8 h-8 flex items-center justify-center border-2 ${step === 'payment' ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>
                      2
                    </div>
                    <span className="text-sm uppercase tracking-wider font-medium hidden sm:inline">Payment</span>
                  </div>
                </div>

                {step === 'shipping' && (
                  <form onSubmit={handleShippingSubmit}>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Shipping Information
                    </h2>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">First Name *</label>
                          <input
                            type="text"
                            required
                            value={shippingInfo.firstName}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                            className="industrial-input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Last Name *</label>
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
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <input
                          type="email"
                          required
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                          className="industrial-input"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <input
                          type="tel"
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                          className="industrial-input"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Company (Optional)</label>
                        <input
                          type="text"
                          value={shippingInfo.company}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, company: e.target.value })}
                          className="industrial-input"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Address *</label>
                        <input
                          type="text"
                          required
                          placeholder="Street address"
                          value={shippingInfo.address1}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, address1: e.target.value })}
                          className="industrial-input"
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="Apt, suite, etc. (optional)"
                          value={shippingInfo.address2}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, address2: e.target.value })}
                          className="industrial-input"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">City *</label>
                          <input
                            type="text"
                            required
                            value={shippingInfo.city}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                            className="industrial-input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">State *</label>
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
                          <label className="block text-sm font-medium mb-2">Postal Code *</label>
                          <input
                            type="text"
                            required
                            value={shippingInfo.postalCode}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                            className="industrial-input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Country *</label>
                          <select
                            value={shippingInfo.country}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                            className="industrial-input"
                          >
                            <option>United States</option>
                            <option>Canada</option>
                            <option>United Kingdom</option>
                            <option>Germany</option>
                            <option>France</option>
                            <option>Australia</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="w-full industrial-button mt-8 justify-center">
                      Continue to Payment
                    </button>
                  </form>
                )}

                {step === 'payment' && (
                  <form onSubmit={handlePaymentSubmit}>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Information
                    </h2>

                    {/* Billing Address */}
                    <div className="mb-8">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={billingInfo.sameAsShipping}
                          onChange={(e) => setBillingInfo({ ...billingInfo, sameAsShipping: e.target.checked })}
                          className="w-5 h-5 accent-primary"
                        />
                        <span>Billing address same as shipping</span>
                      </label>
                    </div>

                    {!billingInfo.sameAsShipping && (
                      <div className="space-y-4 mb-8 p-4 bg-secondary border border-border">
                        <h3 className="font-medium">Billing Address</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="First Name"
                            required
                            value={billingInfo.firstName}
                            onChange={(e) => setBillingInfo({ ...billingInfo, firstName: e.target.value })}
                            className="industrial-input"
                          />
                          <input
                            type="text"
                            placeholder="Last Name"
                            required
                            value={billingInfo.lastName}
                            onChange={(e) => setBillingInfo({ ...billingInfo, lastName: e.target.value })}
                            className="industrial-input"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Address"
                          required
                          value={billingInfo.address1}
                          onChange={(e) => setBillingInfo({ ...billingInfo, address1: e.target.value })}
                          className="industrial-input"
                        />
                        <div className="grid grid-cols-3 gap-4">
                          <input
                            type="text"
                            placeholder="City"
                            required
                            value={billingInfo.city}
                            onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                            className="industrial-input"
                          />
                          <input
                            type="text"
                            placeholder="State"
                            required
                            value={billingInfo.state}
                            onChange={(e) => setBillingInfo({ ...billingInfo, state: e.target.value })}
                            className="industrial-input"
                          />
                          <input
                            type="text"
                            placeholder="Postal Code"
                            required
                            value={billingInfo.postalCode}
                            onChange={(e) => setBillingInfo({ ...billingInfo, postalCode: e.target.value })}
                            className="industrial-input"
                          />
                        </div>
                      </div>
                    )}

                    {/* Card Details */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Card Number *</label>
                        <input
                          type="text"
                          required
                          placeholder="1234 5678 9012 3456"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                          className="industrial-input font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Name on Card *</label>
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
                          <label className="block text-sm font-medium mb-2">Expiry Date *</label>
                          <input
                            type="text"
                            required
                            placeholder="MM/YY"
                            value={paymentInfo.expiry}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry: e.target.value })}
                            className="industrial-input font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">CVV *</label>
                          <input
                            type="text"
                            required
                            placeholder="123"
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                            className="industrial-input font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                      <button
                        type="button"
                        onClick={() => setStep('shipping')}
                        className="industrial-button-outline flex-1 justify-center"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="industrial-button flex-1 justify-center disabled:opacity-50"
                      >
                        {isProcessing ? 'Processing...' : `Pay ${formatPrice(getTotal())}`}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Order Summary */}
              <div className="order-first lg:order-last">
                <div className="bg-secondary border border-border p-6 lg:sticky lg:top-24">
                  <h2 className="text-lg font-bold mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                    {items.map((item) => (
                      <div
                        key={`${item.product.id}-${item.selectedVariant?.id || 'default'}`}
                        className="flex gap-4"
                      >
                        <div className="relative w-16 h-16 bg-muted flex-shrink-0">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs flex items-center justify-center font-mono">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
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
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-mono">{formatPrice(getSubtotal())}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-sm text-primary">
                        <span>Discount ({couponCode})</span>
                        <span className="font-mono">-{formatPrice(couponDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-mono">
                        {getShipping() === 0 ? 'FREE' : formatPrice(getShipping())}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-mono">{formatPrice(getTax())}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 mt-4 border-t border-border">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-xl font-bold font-mono text-primary">
                      {formatPrice(getTotal())}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
