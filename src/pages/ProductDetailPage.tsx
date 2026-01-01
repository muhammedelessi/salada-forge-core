import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { getProductBySlug, products } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { useCartStore } from '@/store/cartStore';
import {
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Check,
} from 'lucide-react';
import { ProductVariant } from '@/types';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/i18n/translations';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || '');
  const addItem = useCartStore((state) => state.addItem);
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'shipping' | 'bulk'>('specs');

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  // Category translations
  const categoryTranslations: Record<string, string> = {
    'shipping-containers': t.categories.shippingContainers,
    'storage-tanks': t.categories.storageTanks,
    'ibc-containers': t.categories.ibcContainers,
    'specialty-containers': t.categories.specialtyContainers,
    'drums-barrels': t.categories.drumsBarrels,
    'modular-buildings': t.categories.modularBuildings,
  };

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

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary border-b border-border">
        <div className="industrial-container py-4">
          <nav className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
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
              {categoryTranslations[product.category] || product.category.replace('-', ' ')}
            </Link>
            <ChevronIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground truncate max-w-[200px]">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <section className="industrial-section">
        <div className="industrial-container">
          <div className={`grid lg:grid-cols-2 gap-12 ${isRTL ? 'lg:grid-flow-dense' : ''}`}>
            {/* Image Gallery */}
            <div className={`space-y-4 ${isRTL ? 'lg:col-start-2' : ''}`}>
              <div className="aspect-square bg-muted overflow-hidden border border-border">
                <img
                  src={product.images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-muted overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-primary' : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className={isRTL ? 'lg:col-start-1 lg:row-start-1' : ''}>
              <span className="industrial-label mb-2 block">{product.sku}</span>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.title}</h1>

              {/* Price */}
              <div className={`flex items-center gap-4 mb-6 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                <span className="text-3xl font-bold text-primary font-mono">
                  {formatPrice(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-muted-foreground line-through font-mono">
                    {formatPrice(product.compareAtPrice!)}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground mb-8 leading-relaxed">{product.description}</p>

              {/* Variants */}
              {product.variants.length > 1 && (
                <div className="mb-6">
                  <label className="block text-sm uppercase tracking-wider font-semibold mb-3">
                    {t.productDetail.variant}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 border text-sm transition-colors ${
                          selectedVariant?.id === variant.id
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        {variant.name}
                        {variant.priceModifier !== 0 && (
                          <span className={`${isRTL ? 'mr-2' : 'ml-2'} font-mono`}>
                            {variant.priceModifier > 0 ? '+' : ''}
                            {formatPrice(variant.priceModifier)}
                          </span>
                        )}
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
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
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

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.status === 'out_of_stock'}
                className="w-full industrial-button mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {product.status === 'out_of_stock' ? t.product.outOfStock : t.product.addToCart}
              </button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-border">
                <div className="flex flex-col items-center text-center">
                  <Truck className="w-6 h-6 text-primary mb-2" />
                  <span className="text-xs uppercase tracking-wider">{t.productDetail.freeShipping}</span>
                  <span className="text-xs text-muted-foreground">{t.productDetail.ordersOver}</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Shield className="w-6 h-6 text-primary mb-2" />
                  <span className="text-xs uppercase tracking-wider">{t.productDetail.warranty}</span>
                  <span className="text-xs text-muted-foreground">{t.productDetail.yearStandard}</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <RotateCcw className="w-6 h-6 text-primary mb-2" />
                  <span className="text-xs uppercase tracking-wider">{t.productDetail.returnsTitle}</span>
                  <span className="text-xs text-muted-foreground">{t.productDetail.dayPolicy}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16">
            <div className="flex border-b border-border">
              {[
                { id: 'specs', label: t.productDetail.specifications },
                { id: 'shipping', label: t.productDetail.shipping },
                { id: 'bulk', label: t.productDetail.bulkPricing },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-6 py-4 text-sm uppercase tracking-wider font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="py-8">
              {activeTab === 'specs' && (
                <div className="grid md:grid-cols-2 gap-1">
                  {product.specifications.map((spec, index) => (
                    <div
                      key={index}
                      className={`flex justify-between py-3 px-4 bg-secondary even:bg-muted ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <span className="text-muted-foreground">{spec.label}</span>
                      <span className="font-mono">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="max-w-2xl space-y-4">
                  <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <Check className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{t.productDetail.freeShippingOver}</p>
                      <p className="text-sm text-muted-foreground">
                        {t.productDetail.freeShippingDesc}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <Check className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{t.productDetail.worldwideDelivery}</p>
                      <p className="text-sm text-muted-foreground">
                        {t.productDetail.worldwideDeliveryDesc}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <Check className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{t.productDetail.estimatedDelivery}</p>
                      <p className="text-sm text-muted-foreground">
                        {t.productDetail.estimatedDeliveryDesc}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'bulk' && (
                <div>
                  {product.bulkPricing && product.bulkPricing.length > 0 ? (
                    <div className="max-w-md">
                      <p className="text-muted-foreground mb-6">
                        {t.productDetail.saveMore}
                      </p>
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className={`${isRTL ? 'text-right' : 'text-left'} py-3 text-sm uppercase tracking-wider`}>{t.productDetail.quantityLabel}</th>
                            <th className={`${isRTL ? 'text-left' : 'text-right'} py-3 text-sm uppercase tracking-wider`}>{t.productDetail.unitPrice}</th>
                            <th className={`${isRTL ? 'text-left' : 'text-right'} py-3 text-sm uppercase tracking-wider`}>{t.productDetail.savings}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border">
                            <td className={`py-3 font-mono ${isRTL ? 'text-right' : ''}`}>1 - 4</td>
                            <td className={`py-3 ${isRTL ? 'text-left' : 'text-right'} font-mono`}>{formatPrice(product.price)}</td>
                            <td className={`py-3 ${isRTL ? 'text-left' : 'text-right'} text-muted-foreground`}>-</td>
                          </tr>
                          {product.bulkPricing.map((tier, index) => (
                            <tr key={index} className="border-b border-border">
                              <td className={`py-3 font-mono ${isRTL ? 'text-right' : ''}`}>
                                {tier.minQuantity}
                                {tier.maxQuantity ? ` - ${tier.maxQuantity}` : '+'}
                              </td>
                              <td className={`py-3 ${isRTL ? 'text-left' : 'text-right'} font-mono text-primary`}>
                                {formatPrice(tier.price)}
                              </td>
                              <td className={`py-3 ${isRTL ? 'text-left' : 'text-right'} font-mono text-accent`}>
                                {Math.round(((product.price - tier.price) / product.price) * 100)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      {t.productDetail.contactBulk}
                    </p>
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
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
