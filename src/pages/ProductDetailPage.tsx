import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/products/ProductCard';
import { StickyAddToCart } from '@/components/products/StickyAddToCart';
import {
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Check,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { ProductVariant } from '@/types';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/i18n/translations';
import { cn } from '@/lib/utils';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || '');
  const { data: allProducts = [] } = useProducts();
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'shipping' | 'bulk'>('specs');

  // Reset selected variant when product changes
  useEffect(() => {
    if (product?.variants?.length) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImage(0);
  }, [slug]);

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  // Category translations
  const categoryTranslations: Record<string, string> = {
    'shipping-containers': t.categories.shippingContainers,
    'storage-tanks': t.categories.storageTanks,
    'ibc-containers': t.categories.ibcContainers,
    'specialty-containers': t.categories.specialtyContainers,
    'drums-barrels': t.categories.drumsBarrels,
    'modular-buildings': t.categories.modularBuildings,
    'spare-parts': language === 'ar' ? 'قطع الغيار' : 'Spare Parts',
    'lashing-equipment': language === 'ar' ? 'معدات الربط' : 'Lashing Equipment',
    'iso-shipping-containers': language === 'ar' ? 'حاويات شحن ISO' : 'ISO Shipping Containers',
    'storage-containers': language === 'ar' ? 'حاويات التخزين' : 'Storage Containers',
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="industrial-container py-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="industrial-container py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">{t.product.notFound}</h1>
          <Link to="/shop" className="industrial-button">
            {t.product.backToShop}
          </Link>
        </div>
      </Layout>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const currentPrice = product.price + (selectedVariant?.priceModifier || 0);
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary border-b border-border">
        <div className="industrial-container py-4">
          <nav className={cn('flex items-center gap-2 text-sm', isRTL && 'flex-row-reverse')}>
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              {t.productDetail.home}
            </Link>
            <ChevronIcon className="w-4 h-4 text-muted-foreground" />
            <Link to="/shop" className="text-muted-foreground hover:text-foreground transition-colors">
              {t.productDetail.shop}
            </Link>
            <ChevronIcon className="w-4 h-4 text-muted-foreground" />
            <Link
              to={`/shop?category=${product.category}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {categoryTranslations[product.category] || product.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </Link>
            <ChevronIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground truncate max-w-[200px]">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <section className="industrial-section">
        <div className="industrial-container">
          <div className={cn('grid lg:grid-cols-2 gap-12', isRTL && 'lg:grid-flow-dense')}>
            {/* Image Gallery */}
            <div className={cn('space-y-4', isRTL && 'lg:col-start-2')}>
              <div className="aspect-square bg-muted overflow-hidden border border-border relative group">
                <img
                  src={product.images[selectedImage] || '/placeholder.svg'}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        'aspect-square bg-muted overflow-hidden border-2 transition-all duration-200',
                        selectedImage === index 
                          ? 'border-primary' 
                          : 'border-border hover:border-muted-foreground'
                      )}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className={cn(isRTL && 'lg:col-start-1 lg:row-start-1')}>
              <span className="industrial-label mb-2 block">{product.sku}</span>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">{product.title}</h1>

              {/* Contact Us Section */}
              <div className={cn('flex items-center gap-4 mb-6', isRTL && 'flex-row-reverse justify-end')}>
                <span className="text-lg text-muted-foreground">
                  {language === 'ar' ? 'للحصول على السعر، تواصل معنا' : 'Contact us for pricing'}
                </span>
              </div>

              <p className="text-muted-foreground mb-8 leading-relaxed">{product.description}</p>

              {/* Variants */}
              {product.variants && product.variants.length > 1 && (
                <div className="mb-6">
                  <label className="block text-sm uppercase tracking-wider font-semibold mb-3">
                    {t.productDetail.variant}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={cn(
                          'px-4 py-2 border text-sm transition-all duration-200',
                          selectedVariant?.id === variant.id
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary'
                        )}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <label className="block text-sm uppercase tracking-wider font-semibold mb-3">
                  {t.productDetail.quantity}
                </label>
                <div className={cn('flex items-center gap-4', isRTL && 'flex-row-reverse')}>
                  <div className="flex items-center border border-border">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 h-12 text-center bg-transparent border-x border-border font-mono focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.stock} {t.productDetail.inStock}
                  </span>
                </div>
              </div>

              {/* Contact Us Button */}
              <Link
                to={`/inquiry/${product.slug}?quantity=${quantity}`}
                className="industrial-button w-full mb-6 inline-flex items-center justify-center py-5 text-base"
              >
                <MessageSquare className={cn('w-5 h-5', isRTL ? 'ml-2' : 'mr-2')} />
                {language === 'ar' ? 'تواصل معنا للحصول على عرض سعر' : 'Contact Us for a Quote'}
              </Link>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-border">
                <div className="flex flex-col items-center text-center group">
                  <Truck className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs uppercase tracking-wider">{t.productDetail.freeShipping}</span>
                  <span className="text-xs text-muted-foreground">{t.productDetail.ordersOver}</span>
                </div>
                <div className="flex flex-col items-center text-center group">
                  <Shield className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs uppercase tracking-wider">{t.productDetail.warranty}</span>
                  <span className="text-xs text-muted-foreground">{t.productDetail.yearStandard}</span>
                </div>
                <div className="flex flex-col items-center text-center group">
                  <RotateCcw className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs uppercase tracking-wider">{t.productDetail.returnsTitle}</span>
                  <span className="text-xs text-muted-foreground">{t.productDetail.dayPolicy}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16">
            <div className="flex border-b border-border overflow-x-auto">
              {[
                { id: 'specs', label: t.productDetail.specifications },
                { id: 'shipping', label: t.productDetail.shipping },
                { id: 'bulk', label: t.productDetail.bulkPricing },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    'px-6 py-4 text-sm uppercase tracking-wider font-medium transition-all duration-200 whitespace-nowrap relative',
                    activeTab === tab.id
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-scale-in" />
                  )}
                </button>
              ))}
            </div>

            <div className="py-8 animate-fade-in" key={activeTab}>
              {activeTab === 'specs' && (
                <div className="grid md:grid-cols-2 gap-1">
                  {product.specifications && product.specifications.length > 0 ? (
                    product.specifications.map((spec, index) => (
                      <div
                        key={index}
                        className={cn(
                          'flex justify-between py-3 px-4 bg-secondary even:bg-muted transition-colors hover:bg-muted/80',
                          isRTL && 'flex-row-reverse'
                        )}
                      >
                        <span className="text-muted-foreground">{spec.label}</span>
                        <span className="font-mono">{spec.value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground col-span-2">
                      {language === 'ar' ? 'لا توجد مواصفات متاحة' : 'No specifications available'}
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="max-w-2xl space-y-4">
                  {[
                    { title: t.productDetail.freeShippingOver, desc: t.productDetail.freeShippingDesc },
                    { title: t.productDetail.worldwideDelivery, desc: t.productDetail.worldwideDeliveryDesc },
                    { title: t.productDetail.estimatedDelivery, desc: t.productDetail.estimatedDeliveryDesc },
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className={cn(
                        'flex items-start gap-3 animate-slide-up',
                        isRTL && 'flex-row-reverse text-right'
                      )}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'bulk' && (
                <div>
                  {product.bulkPricing && product.bulkPricing.length > 0 ? (
                    <div className="max-w-md">
                      <p className="text-muted-foreground mb-6">{t.productDetail.saveMore}</p>
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className={cn('py-3 text-sm uppercase tracking-wider', isRTL ? 'text-right' : 'text-left')}>
                              {t.productDetail.quantityLabel}
                            </th>
                            <th className={cn('py-3 text-sm uppercase tracking-wider', isRTL ? 'text-left' : 'text-right')}>
                              {t.productDetail.unitPrice}
                            </th>
                            <th className={cn('py-3 text-sm uppercase tracking-wider', isRTL ? 'text-left' : 'text-right')}>
                              {t.productDetail.savings}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border">
                            <td className={cn('py-3 font-mono', isRTL && 'text-right')}>1 - 4</td>
                            <td className={cn('py-3 font-mono', isRTL ? 'text-left' : 'text-right')}>
                              {formatPrice(product.price)}
                            </td>
                            <td className={cn('py-3 text-muted-foreground', isRTL ? 'text-left' : 'text-right')}>-</td>
                          </tr>
                          {product.bulkPricing.map((tier, index) => (
                            <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                              <td className={cn('py-3 font-mono', isRTL && 'text-right')}>
                                {tier.minQuantity}
                                {tier.maxQuantity ? ` - ${tier.maxQuantity}` : '+'}
                              </td>
                              <td className={cn('py-3 font-mono text-primary', isRTL ? 'text-left' : 'text-right')}>
                                {formatPrice(tier.price)}
                              </td>
                              <td className={cn('py-3 font-mono text-accent', isRTL ? 'text-left' : 'text-right')}>
                                {Math.round(((product.price - tier.price) / product.price) * 100)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">{t.productDetail.contactBulk}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="industrial-section bg-secondary border-t border-border">
          <div className="industrial-container">
            <h2 className="text-2xl font-bold mb-8">{t.productDetail.relatedProducts}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
              {relatedProducts.map((relatedProduct, index) => (
                <div 
                  key={relatedProduct.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={relatedProduct} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sticky Add to Cart for Mobile */}
      <StickyAddToCart
        product={product}
        selectedVariant={selectedVariant}
        quantity={quantity}
      />
    </Layout>
  );
}
