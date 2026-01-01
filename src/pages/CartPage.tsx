import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useCartStore } from '@/store/cartStore';
import { Minus, Plus, X, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/i18n/translations';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal, getShipping, getTax, getTotal, couponCode, couponDiscount, applyCoupon, removeCoupon } = useCartStore();
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: language === 'ar' ? 'SAR' : 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  if (items.length === 0) {
    return (
      <Layout>
        <section className="industrial-section">
          <div className="industrial-container">
            <div className="max-w-lg mx-auto text-center py-16">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
              <h1 className="text-3xl font-bold mb-4">{t.cart.empty}</h1>
              <p className="text-muted-foreground mb-8">
                {t.cart.emptyDesc}
              </p>
              <Link to="/shop" className="industrial-button">
                {t.cart.continueShopping}
                <ArrowIcon className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-secondary border-b border-border py-16">
        <div className="industrial-container">
          <span className="industrial-label mb-4 block">{t.cart.title}</span>
          <h1 className="text-4xl md:text-5xl font-bold">{t.cart.yourCart}</h1>
        </div>
      </section>

      <section className="industrial-section">
        <div className="industrial-container">
          <div className={`grid lg:grid-cols-3 gap-8 ${isRTL ? 'lg:grid-flow-dense' : ''}`}>
            {/* Cart Items */}
            <div className={`lg:col-span-2 ${isRTL ? 'lg:col-start-2' : ''}`}>
              <div className="space-y-1">
                {items.map((item) => {
                  const itemPrice = item.product.price + (item.selectedVariant?.priceModifier || 0);
                  const itemTotal = itemPrice * item.quantity;

                  return (
                    <div
                      key={`${item.product.id}-${item.selectedVariant?.id || 'default'}`}
                      className="bg-card border border-border p-4 md:p-6"
                    >
                      <div className={`flex gap-4 md:gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {/* Image */}
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="w-24 h-24 md:w-32 md:h-32 bg-muted flex-shrink-0"
                        >
                          <img
                            src={item.product.images[0]}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className={`flex justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={isRTL ? 'text-right' : ''}>
                              <Link
                                to={`/product/${item.product.slug}`}
                                className="font-semibold hover:text-primary transition-colors line-clamp-2"
                              >
                                {item.product.title}
                              </Link>
                              <p className="text-sm text-muted-foreground font-mono mt-1">
                                {item.product.sku}
                              </p>
                              {item.selectedVariant && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {item.selectedVariant.name}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => removeItem(item.product.id, item.selectedVariant?.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <div className={`flex items-center justify-between mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-border">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity - 1,
                                    item.selectedVariant?.id
                                  )
                                }
                                className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-12 h-8 flex items-center justify-center font-mono text-sm">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity + 1,
                                    item.selectedVariant?.id
                                  )
                                }
                                className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Price */}
                            <div className={isRTL ? 'text-left' : 'text-right'}>
                              <p className="font-bold font-mono text-lg">{formatPrice(itemTotal)}</p>
                              <p className="text-sm text-muted-foreground font-mono">
                                {formatPrice(itemPrice)} {t.cart.each}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                to="/shop"
                className={`inline-flex items-center gap-2 mt-6 text-muted-foreground hover:text-foreground transition-colors text-sm uppercase tracking-wider ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <ArrowIcon className={`w-4 h-4 ${isRTL ? '' : 'rotate-180'}`} />
                {t.cart.continueShopping}
              </Link>
            </div>

            {/* Order Summary */}
            <div className={`lg:col-span-1 ${isRTL ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
              <div className="bg-card border border-border p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">{t.cart.orderSummary}</h2>

                {/* Coupon */}
                <div className="mb-6 pb-6 border-b border-border">
                  {couponCode ? (
                    <div className={`flex items-center justify-between bg-primary/10 p-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={isRTL ? 'text-right' : ''}>
                        <span className="text-sm font-mono text-primary">{couponCode}</span>
                        <p className="text-xs text-muted-foreground">{t.cart.applied}</p>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const input = e.currentTarget.coupon as HTMLInputElement;
                        if (applyCoupon(input.value)) {
                          input.value = '';
                        }
                      }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        name="coupon"
                        placeholder={t.cart.couponPlaceholder}
                        className="industrial-input flex-1"
                      />
                      <button type="submit" className="industrial-button px-4">
                        {t.cart.apply}
                      </button>
                    </form>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-muted-foreground">{t.cart.subtotal}</span>
                    <span className="font-mono">{formatPrice(getSubtotal())}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className={`flex justify-between text-primary ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span>{t.cart.discount}</span>
                      <span className="font-mono">-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-muted-foreground">{t.cart.shippingLabel}</span>
                    <span className="font-mono">
                      {getShipping() === 0 ? t.cart.free : formatPrice(getShipping())}
                    </span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-muted-foreground">{t.cart.tax}</span>
                    <span className="font-mono">{formatPrice(getTax())}</span>
                  </div>
                </div>

                <div className={`flex justify-between items-center py-4 border-t border-border mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-lg font-bold">{t.cart.total}</span>
                  <span className="text-2xl font-bold font-mono text-primary">
                    {formatPrice(getTotal())}
                  </span>
                </div>

                <Link to="/checkout" className="w-full industrial-button justify-center">
                  {t.cart.proceedToCheckout}
                  <ArrowIcon className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </Link>

                {getSubtotal() < 10000 && (
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    {t.cart.addMoreForFree.replace('{amount}', formatPrice(10000 - getSubtotal()))}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
