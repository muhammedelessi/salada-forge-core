import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { products, categories } from '@/data/products';
import { ChevronDown, Grid, List, SlidersHorizontal, X } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/i18n/translations';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];

  const activeCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('q') || '';
  const priceRange = searchParams.get('price') || '';

  // Category name translations
  const categoryTranslations: Record<string, string> = {
    'shipping-containers': t.categories.shippingContainers,
    'storage-tanks': t.categories.storageTanks,
    'ibc-containers': t.categories.ibcContainers,
    'specialty-containers': t.categories.specialtyContainers,
    'drums-barrels': t.categories.drumsBarrels,
    'modular-buildings': t.categories.modularBuildings,
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const priceRanges = [
    { id: 'under-500', label: `${t.shop.under} ${formatPrice(500)}`, min: 0, max: 500 },
    { id: '500-2000', label: `${formatPrice(500)} - ${formatPrice(2000)}`, min: 500, max: 2000 },
    { id: '2000-5000', label: `${formatPrice(2000)} - ${formatPrice(5000)}`, min: 2000, max: 5000 },
    { id: '5000-10000', label: `${formatPrice(5000)} - ${formatPrice(10000)}`, min: 5000, max: 10000 },
    { id: 'over-10000', label: `${t.shop.over} ${formatPrice(10000)}`, min: 10000, max: Infinity },
  ];

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (activeCategory) {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    if (priceRange) {
      const range = priceRanges.find(r => r.id === priceRange);
      if (range) {
        filtered = filtered.filter((p) => p.price >= range.min && p.price < range.max);
      }
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return filtered;
  }, [activeCategory, searchQuery, sortBy, priceRange]);

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId) {
      searchParams.set('category', categoryId);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };

  const handlePriceRangeChange = (rangeId: string) => {
    if (rangeId && rangeId !== priceRange) {
      searchParams.set('price', rangeId);
    } else {
      searchParams.delete('price');
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };


  return (
    <Layout>
      {/* Page Header */}
      <section className="bg-secondary border-b border-border py-16">
        <div className="industrial-container">
          <span className="industrial-label mb-4 block">{t.shop.catalog}</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {activeCategory
              ? categoryTranslations[activeCategory] || t.shop.allProducts
              : t.shop.allProducts}
          </h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} {t.shop.products}
            {(activeCategory || priceRange) && (
              <button
                onClick={clearFilters}
                className={`${isRTL() ? 'mr-4' : 'ml-4'} text-primary hover:text-accent transition-colors inline-flex items-center gap-1`}
              >
                {t.shop.clearFilters} <X className="w-4 h-4" />
              </button>
            )}
          </p>
        </div>
      </section>

      <div className="industrial-container py-8">
        <div className={`flex flex-col lg:flex-row gap-8 ${isRTL() ? 'lg:flex-row-reverse' : ''}`}>
          {/* Sidebar Filters - Desktop */}
          <aside className={`hidden lg:block w-64 flex-shrink-0 ${isRTL() ? 'text-right' : ''}`}>
            <div className="sticky top-24">
              <h3 className="text-sm uppercase tracking-wider font-semibold mb-6">{t.shop.categories}</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`w-full ${isRTL() ? 'text-right' : 'text-left'} py-2 px-3 text-sm transition-colors ${
                      !activeCategory
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {t.shop.allProducts}
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => handleCategoryChange(category.id)}
                      className={`w-full ${isRTL() ? 'text-right' : 'text-left'} py-2 px-3 text-sm transition-colors ${
                        activeCategory === category.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      {categoryTranslations[category.id] || category.name}
                      <span className={`${isRTL() ? 'float-left' : 'float-right'} font-mono text-xs`}>({category.count})</span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="text-sm uppercase tracking-wider font-semibold mb-4">{t.shop.priceRange}</h3>
                <ul className="space-y-2">
                  {priceRanges.map((range) => (
                    <li key={range.id}>
                      <button
                        onClick={() => handlePriceRangeChange(range.id)}
                        className={`w-full ${isRTL ? 'text-right' : 'text-left'} py-2 px-3 text-sm transition-colors ${
                          priceRange === range.id
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        {range.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 text-sm uppercase tracking-wider"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {t.shop.filters}
              </button>

              <div className={`flex items-center gap-4 ${isRTL ? 'mr-auto' : 'ml-auto'}`}>
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className={`appearance-none bg-secondary border border-border px-4 py-2 ${isRTL ? 'pl-10' : 'pr-10'} text-sm focus:outline-none focus:border-primary`}
                  >
                    <option value="featured">{t.shop.featured}</option>
                    <option value="price-asc">{t.shop.priceLowHigh}</option>
                    <option value="price-desc">{t.shop.priceHighLow}</option>
                    <option value="name-asc">{t.shop.nameAZ}</option>
                    <option value="name-desc">{t.shop.nameZA}</option>
                  </select>
                  <ChevronDown className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none`} />
                </div>

                {/* View Toggle */}
                <div className="hidden sm:flex items-center border border-border">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mb-6 p-4 bg-secondary border border-border">
                <h3 className="text-sm uppercase tracking-wider font-semibold mb-4">{t.shop.categories}</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      handleCategoryChange('');
                      setShowFilters(false);
                    }}
                    className={`px-3 py-1 text-sm ${
                      !activeCategory ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    {language === 'ar' ? 'الكل' : 'All'}
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        handleCategoryChange(category.id);
                        setShowFilters(false);
                      }}
                      className={`px-3 py-1 text-sm ${
                        activeCategory === category.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}
                    >
                      {categoryTranslations[category.id] || category.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-1'
                    : 'space-y-1'
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-4">{t.shop.noProducts}</p>
                <button onClick={clearFilters} className="industrial-button">
                  {t.shop.clearFilters}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
