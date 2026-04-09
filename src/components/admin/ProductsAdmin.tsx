import { useState, useEffect } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Package, 
  Save,
  X,
  Search,
  Image as ImageIcon,
  Upload,
  GripVertical,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Copy,
  Star,
  StarOff,
  Filter,
  MoreVertical,
  RefreshCw
} from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQueryClient } from '@tanstack/react-query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProductSpecification {
  label: string;
  value: string;
}

interface ProductVariant {
  id: string;
  name: string;
  options: { type: string; value: string }[];
  priceModifier: number;
  stock: number;
}

interface BulkPricing {
  minQuantity: number;
  maxQuantity?: number;
  price: number;
}

interface ProductDimensions {
  length?: number;
  width?: number;
  height?: number;
  unit?: string;
}

interface Product {
  id: string;
  title: string;
  sku: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category: string;
  subcategory: string | null;
  images: string[];
  specifications: ProductSpecification[];
  variants: ProductVariant[];
  stock: number;
  status: 'active' | 'draft' | 'out_of_stock';
  bulk_pricing: BulkPricing[];
  seo_title: string | null;
  seo_description: string | null;
  weight: number | null;
  dimensions: ProductDimensions | null;
  tags: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFormData {
  title: string;
  sku: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  category: string;
  subcategory: string;
  images: string[];
  specifications: ProductSpecification[];
  variants: ProductVariant[];
  stock: number;
  status: 'active' | 'draft' | 'out_of_stock';
  bulk_pricing: BulkPricing[];
  seo_title: string;
  seo_description: string;
  weight: number | null;
  dimensions: ProductDimensions;
  tags: string[];
  featured: boolean;
}

const initialFormData: ProductFormData = {
  title: '',
  sku: '',
  slug: '',
  description: '',
  price: 0,
  compare_at_price: null,
  category: '',
  subcategory: '',
  images: [],
  specifications: [],
  variants: [],
  stock: 0,
  status: 'draft',
  bulk_pricing: [],
  seo_title: '',
  seo_description: '',
  weight: null,
  dimensions: { length: undefined, width: undefined, height: undefined, unit: 'm' },
  tags: [],
  featured: false,
};

export function ProductsAdmin() {
  const { language } = useLanguageStore();
  const isArabic = language === 'ar';
  
  const queryClient = useQueryClient();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 25;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match our interface
      const transformedData = (data || []).map(p => ({
        ...p,
        status: p.status as 'active' | 'draft' | 'out_of_stock',
        specifications: (p.specifications as unknown as ProductSpecification[]) || [],
        variants: (p.variants as unknown as ProductVariant[]) || [],
        bulk_pricing: (p.bulk_pricing as unknown as BulkPricing[]) || [],
        dimensions: p.dimensions as ProductDimensions | null,
      }));
      
      setProducts(transformedData);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error(isArabic ? 'خطأ في جلب المنتجات' : 'Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error(isArabic ? 'اسم المنتج مطلوب' : 'Product title is required');
      return;
    }

    if (!formData.sku.trim()) {
      toast.error(isArabic ? 'رمز المنتج مطلوب' : 'SKU is required');
      return;
    }

    if (formData.price <= 0) {
      toast.error(isArabic ? 'السعر يجب أن يكون أكبر من صفر' : 'Price must be greater than zero');
      return;
    }

    if (!formData.category) {
      toast.error(isArabic ? 'الفئة مطلوبة' : 'Category is required');
      return;
    }

    setSaving(true);

    try {
      const productData: any = {
        title: formData.title.trim(),
        sku: formData.sku.toUpperCase().trim(),
        slug: formData.slug || generateSlug(formData.title),
        description: formData.description || null,
        price: formData.price,
        compare_at_price: formData.compare_at_price || null,
        category: formData.category,
        subcategory: formData.subcategory || null,
        images: formData.images,
        specifications: formData.specifications as any,
        variants: formData.variants as any,
        stock: formData.stock,
        status: formData.status,
        bulk_pricing: formData.bulk_pricing as any,
        seo_title: formData.seo_title || null,
        seo_description: formData.seo_description || null,
        weight: formData.weight || null,
        dimensions: formData.dimensions.length || formData.dimensions.width || formData.dimensions.height 
          ? formData.dimensions 
          : null,
        tags: formData.tags,
        featured: formData.featured,
      };

      if (editingProduct) {
        const { error, data, count } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
          .select();

        if (error) throw error;
        if (!data || data.length === 0) {
          toast.error(isArabic ? 'فشل التحديث - تحقق من صلاحيات المسؤول' : 'Update failed - check admin permissions');
          return;
        }
        toast.success(isArabic ? 'تم تحديث المنتج' : 'Product updated');
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData);

        if (error) {
          if (error.code === '23505') {
            toast.error(isArabic ? 'رمز المنتج أو الرابط موجود بالفعل' : 'SKU or slug already exists');
            return;
          }
          throw error;
        }
        toast.success(isArabic ? 'تم إنشاء المنتج' : 'Product created');
      }

      setShowForm(false);
      setEditingProduct(null);
      setFormData(initialFormData);
      fetchProducts();
      // Invalidate React Query cache so shop pages reflect changes
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(isArabic ? 'خطأ في حفظ المنتج' : 'Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      sku: product.sku,
      slug: product.slug,
      description: product.description || '',
      price: product.price,
      compare_at_price: product.compare_at_price,
      category: product.category,
      subcategory: product.subcategory || '',
      images: product.images || [],
      specifications: product.specifications || [],
      variants: product.variants || [],
      stock: product.stock,
      status: product.status,
      bulk_pricing: product.bulk_pricing || [],
      seo_title: product.seo_title || '',
      seo_description: product.seo_description || '',
      weight: product.weight,
      dimensions: product.dimensions || { length: undefined, width: undefined, height: undefined, unit: 'm' },
      tags: product.tags || [],
      featured: product.featured || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(isArabic ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;
      toast.success(isArabic ? 'تم حذف المنتج' : 'Product deleted');
      fetchProducts();
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(isArabic ? 'خطأ في حذف المنتج' : 'Error deleting product');
    }
  };

  const handleDuplicate = async (product: Product) => {
    setEditingProduct(null);
    setFormData({
      title: `${product.title} (Copy)`,
      sku: `${product.sku}-COPY`,
      slug: `${product.slug}-copy`,
      description: product.description || '',
      price: product.price,
      compare_at_price: product.compare_at_price,
      category: product.category,
      subcategory: product.subcategory || '',
      images: product.images || [],
      specifications: product.specifications || [],
      variants: product.variants.map(v => ({ ...v, id: `v-${Date.now()}-${Math.random()}` })) || [],
      stock: product.stock,
      status: 'draft',
      bulk_pricing: product.bulk_pricing || [],
      seo_title: product.seo_title || '',
      seo_description: product.seo_description || '',
      weight: product.weight,
      dimensions: product.dimensions || { length: undefined, width: undefined, height: undefined, unit: 'm' },
      tags: product.tags || [],
      featured: false,
    });
    setShowForm(true);
  };

  const handleToggleStatus = async (product: Product, newStatus: 'active' | 'draft') => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', product.id);

      if (error) throw error;
      toast.success(
        newStatus === 'active'
          ? (isArabic ? 'تم تفعيل المنتج' : 'Product activated')
          : (isArabic ? 'تم إخفاء المنتج' : 'Product set to draft')
      );
      fetchProducts();
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error: any) {
      console.error('Error toggling product:', error);
      toast.error(isArabic ? 'خطأ في تحديث المنتج' : 'Error updating product');
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ featured: !product.featured })
        .eq('id', product.id);

      if (error) throw error;
      toast.success(
        !product.featured
          ? (isArabic ? 'تم تمييز المنتج' : 'Product featured')
          : (isArabic ? 'تم إلغاء تمييز المنتج' : 'Product unfeatured')
      );
      fetchProducts();
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error: any) {
      console.error('Error toggling featured:', error);
      toast.error(isArabic ? 'خطأ في تحديث المنتج' : 'Error updating product');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {

      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Storage upload error:', uploadError);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
      toast.success(isArabic ? `تم رفع ${uploadedUrls.length} صورة` : `${uploadedUrls.length} image(s) uploaded`);
    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast.error(isArabic ? `خطأ في رفع الصور: ${error.message}` : `Error uploading images: ${error.message}`);
    } finally {
      setUploading(false);
      // Reset file input so the same file can be selected again
      e.target.value = '';
    }
  };

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const moveImage = (from: number, to: number) => {
    const newImages = [...formData.images];
    const [removed] = newImages.splice(from, 1);
    newImages.splice(to, 0, removed);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { label: '', value: '' }]
    }));
  };

  const updateSpecification = (index: number, field: 'label' | 'value', value: string) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData(prev => ({ ...prev, specifications: newSpecs }));
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, {
        id: `v-${Date.now()}`,
        name: '',
        options: [{ type: 'size', value: '' }],
        priceModifier: 0,
        stock: 0
      }]
    }));
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...formData.variants];
    (newVariants[index] as any)[field] = value;
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const addBulkPricing = () => {
    setFormData(prev => ({
      ...prev,
      bulk_pricing: [...prev.bulk_pricing, { minQuantity: 1, price: formData.price }]
    }));
  };

  const updateBulkPricing = (index: number, field: string, value: any) => {
    const newPricing = [...formData.bulk_pricing];
    (newPricing[index] as any)[field] = value;
    setFormData(prev => ({ ...prev, bulk_pricing: newPricing }));
  };

  const removeBulkPricing = (index: number) => {
    setFormData(prev => ({
      ...prev,
      bulk_pricing: prev.bulk_pricing.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTagInput.trim() && !formData.tags.includes(newTagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTagInput.trim()]
      }));
      setNewTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || p.category === filterCategory;
    const matchesStatus = !filterStatus || p.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategory, filterStatus]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-500';
      case 'draft': return 'bg-muted text-muted-foreground';
      case 'out_of_stock': return 'bg-red-500/20 text-red-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">
          {isArabic ? 'المنتجات' : 'Products'}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setLoading(true);
              fetchProducts();
              queryClient.invalidateQueries({ queryKey: ['products'] });
            }}
            className="btn-secondary text-sm py-2 px-3"
            title={isArabic ? 'تحديث' : 'Refresh'}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setEditingProduct(null);
              setFormData(initialFormData);
              setShowForm(!showForm);
            }}
            className="btn-primary text-sm py-2 px-4"
          >
            {showForm ? (
              <>
                <X className="w-4 h-4 mr-2" />
                {isArabic ? 'إلغاء' : 'Cancel'}
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                {isArabic ? 'إضافة منتج' : 'Add Product'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border p-6 mb-8">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            {editingProduct 
              ? (isArabic ? 'تعديل المنتج' : 'Edit Product')
              : (isArabic ? 'إضافة منتج جديد' : 'Add New Product')
            }
          </h2>

          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="bg-secondary border border-border p-1 h-auto flex-wrap">
              <TabsTrigger value="basic" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                {isArabic ? 'المعلومات الأساسية' : 'Basic Info'}
              </TabsTrigger>
              <TabsTrigger value="images" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                {isArabic ? 'الصور' : 'Images'}
              </TabsTrigger>
              <TabsTrigger value="pricing" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                {isArabic ? 'التسعير' : 'Pricing'}
              </TabsTrigger>
              <TabsTrigger value="inventory" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                {isArabic ? 'المخزون' : 'Inventory'}
              </TabsTrigger>
              <TabsTrigger value="specs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                {isArabic ? 'المواصفات' : 'Specifications'}
              </TabsTrigger>
              <TabsTrigger value="seo" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                SEO
              </TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isArabic ? 'اسم المنتج *' : 'Product Title *'}
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        title: e.target.value,
                        slug: formData.slug || generateSlug(e.target.value)
                      });
                    }}
                    className="industrial-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isArabic ? 'رمز المنتج (SKU) *' : 'SKU *'}
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                    className="industrial-input label-text uppercase"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {isArabic ? 'الرابط (Slug)' : 'Slug'}
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="industrial-input label-text"
                  placeholder={generateSlug(formData.title) || 'product-slug'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {isArabic ? 'الوصف' : 'Description'}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="industrial-input min-h-[120px]"
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isArabic ? 'الفئة *' : 'Category *'}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="industrial-input"
                    required
                  >
                    <option value="">{isArabic ? 'اختر فئة' : 'Select category'}</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isArabic ? 'الفئة الفرعية' : 'Subcategory'}
                  </label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="industrial-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {isArabic ? 'الوسوم' : 'Tags'}
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map(tag => (
                    <span key={tag} className="bg-secondary px-2 py-1 text-sm flex items-center gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="industrial-input flex-1"
                    placeholder={isArabic ? 'أضف وسم...' : 'Add tag...'}
                  />
                  <button type="button" onClick={addTag} className="btn-secondary px-4">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-secondary border border-border">
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <div>
                  <p className="font-medium">{isArabic ? 'منتج مميز' : 'Featured Product'}</p>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'عرض في الصفحة الرئيسية' : 'Display on homepage'}
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {isArabic ? 'رفع صور' : 'Upload Images'}
                </label>
                <div className="border-2 border-dashed border-border p-8 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={uploading}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {uploading 
                        ? (isArabic ? 'جاري الرفع...' : 'Uploading...')
                        : (isArabic ? 'اضغط لرفع الصور' : 'Click to upload images')
                      }
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {isArabic ? 'أو أضف رابط صورة' : 'Or add image URL'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="industrial-input flex-1"
                    placeholder="https://..."
                  />
                  <button type="button" onClick={addImageUrl} className="btn-secondary px-4">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {formData.images.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isArabic ? 'الصور الحالية' : 'Current Images'} ({formData.images.length})
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((url, index) => (
                      <div key={index} className="relative group border border-border">
                        <img
                          src={url}
                          alt={`Product image ${index + 1}`}
                          loading="lazy"
                          className="w-full h-32 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => moveImage(index, index - 1)}
                              className="p-1 bg-background border border-border"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                          )}
                          {index < formData.images.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveImage(index, index + 1)}
                              className="p-1 bg-background border border-border"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-1 bg-destructive text-destructive-foreground"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {index === 0 && (
                          <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1">
                            {isArabic ? 'رئيسية' : 'Main'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isArabic ? 'السعر (ريال) *' : 'Price (SAR) *'}
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="industrial-input label-text"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isArabic ? 'السعر قبل الخصم (ريال)' : 'Compare at Price (SAR)'}
                  </label>
                  <input
                    type="number"
                    value={formData.compare_at_price || ''}
                    onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value ? Number(e.target.value) : null })}
                    className="industrial-input label-text"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">
                    {isArabic ? 'أسعار الجملة' : 'Bulk Pricing'}
                  </label>
                  <button type="button" onClick={addBulkPricing} className="text-primary text-sm flex items-center gap-1">
                    <Plus className="w-4 h-4" /> {isArabic ? 'إضافة' : 'Add'}
                  </button>
                </div>
                {formData.bulk_pricing.map((bp, index) => (
                  <div key={index} className="flex gap-4 items-center mb-2 p-3 bg-secondary border border-border">
                    <div className="flex-1">
                      <label className="block text-xs text-muted-foreground mb-1">{isArabic ? 'من' : 'Min Qty'}</label>
                      <input
                        type="number"
                        value={bp.minQuantity}
                        onChange={(e) => updateBulkPricing(index, 'minQuantity', Number(e.target.value))}
                        className="industrial-input label-text"
                        min="1"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-muted-foreground mb-1">{isArabic ? 'إلى' : 'Max Qty'}</label>
                      <input
                        type="number"
                        value={bp.maxQuantity || ''}
                        onChange={(e) => updateBulkPricing(index, 'maxQuantity', e.target.value ? Number(e.target.value) : undefined)}
                        className="industrial-input label-text"
                        placeholder={isArabic ? 'غير محدود' : 'Unlimited'}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-muted-foreground mb-1">{isArabic ? 'السعر' : 'Price (SAR)'}</label>
                      <input
                        type="number"
                        value={bp.price}
                        onChange={(e) => updateBulkPricing(index, 'price', Number(e.target.value))}
                        className="industrial-input label-text"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <button type="button" onClick={() => removeBulkPricing(index)} className="text-destructive mt-5">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Inventory Tab */}
            <TabsContent value="inventory" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isArabic ? 'المخزون *' : 'Stock *'}
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="industrial-input label-text"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isArabic ? 'الحالة *' : 'Status *'}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="industrial-input"
                  >
                    <option value="draft">{isArabic ? 'مسودة' : 'Draft'}</option>
                    <option value="active">{isArabic ? 'نشط' : 'Active'}</option>
                    <option value="out_of_stock">{isArabic ? 'نفذ المخزون' : 'Out of Stock'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {isArabic ? 'الوزن (كجم)' : 'Weight (kg)'}
                </label>
                <input
                  type="number"
                  value={formData.weight || ''}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value ? Number(e.target.value) : null })}
                  className="industrial-input label-text w-48"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {isArabic ? 'الأبعاد' : 'Dimensions'}
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="number"
                    value={formData.dimensions.length || ''}
                    onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, length: e.target.value ? Number(e.target.value) : undefined } })}
                    className="industrial-input label-text w-24"
                    placeholder={isArabic ? 'الطول' : 'L'}
                    min="0"
                    step="0.01"
                  />
                  <X className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="number"
                    value={formData.dimensions.width || ''}
                    onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, width: e.target.value ? Number(e.target.value) : undefined } })}
                    className="industrial-input label-text w-24"
                    placeholder={isArabic ? 'العرض' : 'W'}
                    min="0"
                    step="0.01"
                  />
                  <X className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="number"
                    value={formData.dimensions.height || ''}
                    onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, height: e.target.value ? Number(e.target.value) : undefined } })}
                    className="industrial-input label-text w-24"
                    placeholder={isArabic ? 'الارتفاع' : 'H'}
                    min="0"
                    step="0.01"
                  />
                  <select
                    value={formData.dimensions.unit || 'm'}
                    onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, unit: e.target.value } })}
                    className="industrial-input w-20"
                  >
                    <option value="m">m</option>
                    <option value="cm">cm</option>
                    <option value="ft">ft</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">
                    {isArabic ? 'المتغيرات' : 'Variants'}
                  </label>
                  <button type="button" onClick={addVariant} className="text-primary text-sm flex items-center gap-1">
                    <Plus className="w-4 h-4" /> {isArabic ? 'إضافة' : 'Add'}
                  </button>
                </div>
                {formData.variants.map((variant, index) => (
                  <div key={variant.id} className="p-4 bg-secondary border border-border mb-2">
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">{isArabic ? 'الاسم' : 'Name'}</label>
                        <input
                          type="text"
                          value={variant.name}
                          onChange={(e) => updateVariant(index, 'name', e.target.value)}
                          className="industrial-input"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">{isArabic ? 'النوع' : 'Type'}</label>
                        <select
                          value={variant.options[0]?.type || 'size'}
                          onChange={(e) => updateVariant(index, 'options', [{ ...variant.options[0], type: e.target.value }])}
                          className="industrial-input"
                        >
                          <option value="size">{isArabic ? 'الحجم' : 'Size'}</option>
                          <option value="material">{isArabic ? 'المادة' : 'Material'}</option>
                          <option value="color">{isArabic ? 'اللون' : 'Color'}</option>
                          <option value="capacity">{isArabic ? 'السعة' : 'Capacity'}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">{isArabic ? 'القيمة' : 'Value'}</label>
                        <input
                          type="text"
                          value={variant.options[0]?.value || ''}
                          onChange={(e) => updateVariant(index, 'options', [{ ...variant.options[0], value: e.target.value }])}
                          className="industrial-input"
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-xs text-muted-foreground mb-1">{isArabic ? 'فرق السعر' : 'Price +/-'}</label>
                          <input
                            type="number"
                            value={variant.priceModifier}
                            onChange={(e) => updateVariant(index, 'priceModifier', Number(e.target.value))}
                            className="industrial-input label-text"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-muted-foreground mb-1">{isArabic ? 'المخزون' : 'Stock'}</label>
                          <input
                            type="number"
                            value={variant.stock}
                            onChange={(e) => updateVariant(index, 'stock', Number(e.target.value))}
                            className="industrial-input label-text"
                            min="0"
                          />
                        </div>
                        <button type="button" onClick={() => removeVariant(index)} className="text-destructive mt-5">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Specifications Tab */}
            <TabsContent value="specs" className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">
                    {isArabic ? 'المواصفات' : 'Specifications'}
                  </label>
                  <button type="button" onClick={addSpecification} className="text-primary text-sm flex items-center gap-1">
                    <Plus className="w-4 h-4" /> {isArabic ? 'إضافة' : 'Add'}
                  </button>
                </div>
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="flex gap-4 items-center mb-2">
                    <input
                      type="text"
                      value={spec.label}
                      onChange={(e) => updateSpecification(index, 'label', e.target.value)}
                      className="industrial-input flex-1"
                      placeholder={isArabic ? 'التسمية' : 'Label'}
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                      className="industrial-input flex-1"
                      placeholder={isArabic ? 'القيمة' : 'Value'}
                    />
                    <button type="button" onClick={() => removeSpecification(index)} className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {formData.specifications.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border">
                    {isArabic ? 'لا توجد مواصفات. اضغط على إضافة لإضافة مواصفة.' : 'No specifications. Click Add to add one.'}
                  </p>
                )}
              </div>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {isArabic ? 'عنوان SEO' : 'SEO Title'}
                </label>
                <input
                  type="text"
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  className="industrial-input"
                  placeholder={formData.title || (isArabic ? 'عنوان المنتج' : 'Product title')}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.seo_title.length}/60 {isArabic ? 'حرف' : 'characters'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {isArabic ? 'وصف SEO' : 'SEO Description'}
                </label>
                <textarea
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  className="industrial-input min-h-[100px]"
                  rows={3}
                  placeholder={isArabic ? 'وصف قصير للمنتج لمحركات البحث' : 'Short product description for search engines'}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.seo_description.length}/160 {isArabic ? 'حرف' : 'characters'}
                </p>
              </div>

              <div className="p-4 bg-secondary border border-border">
                <p className="text-sm font-medium mb-2">{isArabic ? 'معاينة البحث' : 'Search Preview'}</p>
                <div className="bg-background p-4 border border-border">
                  <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                    {formData.seo_title || formData.title || (isArabic ? 'عنوان المنتج' : 'Product Title')}
                  </p>
                  <p className="text-green-700 text-sm">
                    salada.com/products/{formData.slug || 'product-slug'}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {formData.seo_description || formData.description || (isArabic ? 'وصف المنتج سيظهر هنا...' : 'Product description will appear here...')}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 mt-6 pt-6 border-t border-border">
            <button type="submit" disabled={saving} className="btn-primary">
              <Save className="w-4 h-4 mr-2" />
              {saving 
                ? (isArabic ? 'جاري الحفظ...' : 'Saving...')
                : (isArabic ? 'حفظ المنتج' : 'Save Product')
              }
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingProduct(null);
                setFormData(initialFormData);
              }}
              className="btn-secondary"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </form>
      )}

      {/* Search and Filters */}
      {!showForm && (
        <div className="bg-card border border-border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="industrial-input pl-10 w-full"
                placeholder={isArabic ? 'بحث بالاسم أو الرمز...' : 'Search by name or SKU...'}
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="industrial-input w-full md:w-48"
            >
              <option value="">{isArabic ? 'كل الفئات' : 'All Categories'}</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="industrial-input w-full md:w-40"
            >
              <option value="">{isArabic ? 'كل الحالات' : 'All Status'}</option>
              <option value="active">{isArabic ? 'نشط' : 'Active'}</option>
              <option value="draft">{isArabic ? 'مسودة' : 'Draft'}</option>
              <option value="out_of_stock">{isArabic ? 'نفذ المخزون' : 'Out of Stock'}</option>
            </select>
          </div>
        </div>
      )}

      {/* Products List */}
      {!showForm && (
        loading ? (
          <div className="bg-card border border-border p-12 text-center">
            <p className="text-muted-foreground">{isArabic ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-card border border-border p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {products.length === 0 
                ? (isArabic ? 'لا توجد منتجات بعد' : 'No products yet')
                : (isArabic ? 'لا توجد نتائج' : 'No results found')
              }
            </p>
            {products.length === 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isArabic ? 'إضافة أول منتج' : 'Add First Product'}
              </button>
            )}
          </div>
        ) : (
          <div className="bg-card border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary">
                  <tr>
                    <th className="text-left p-4 text-sm uppercase tracking-wider">
                      {isArabic ? 'المنتج' : 'Product'}
                    </th>
                    <th className="text-left p-4 text-sm uppercase tracking-wider">
                      {isArabic ? 'الرمز' : 'SKU'}
                    </th>
                    <th className="text-left p-4 text-sm uppercase tracking-wider">
                      {isArabic ? 'السعر' : 'Price'}
                    </th>
                    <th className="text-left p-4 text-sm uppercase tracking-wider">
                      {isArabic ? 'المخزون' : 'Stock'}
                    </th>
                    <th className="text-left p-4 text-sm uppercase tracking-wider">
                      {isArabic ? 'الحالة' : 'Status'}
                    </th>
                    <th className="text-left p-4 text-sm uppercase tracking-wider">
                      {isArabic ? 'الإجراءات' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => (
                    <tr key={product.id} className="border-t border-border hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              loading="lazy"
                              className="w-12 h-12 object-cover border border-border"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-muted flex items-center justify-center border border-border">
                              <ImageIcon className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <span className="font-medium line-clamp-1 flex items-center gap-2">
                              {product.title}
                              {product.featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                            </span>
                            <span className="text-xs text-muted-foreground">{product.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 label-text text-sm">{product.sku}</td>
                      <td className="p-4 label-text">
                        SAR {product.price.toLocaleString()}
                        {product.compare_at_price && (
                          <span className="text-xs text-muted-foreground line-through ml-2">
                            SAR {product.compare_at_price.toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td className="p-4 label-text">
                        <span className={product.stock <= 10 ? 'text-red-500' : ''}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs uppercase px-2 py-1 ${getStatusColor(product.status)}`}>
                          {product.status === 'active' && (isArabic ? 'نشط' : 'Active')}
                          {product.status === 'draft' && (isArabic ? 'مسودة' : 'Draft')}
                          {product.status === 'out_of_stock' && (isArabic ? 'نفذ' : 'Out')}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 hover:bg-muted transition-colors"
                            title={isArabic ? 'تعديل' : 'Edit'}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="p-2 hover:bg-muted transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover border border-border">
                              <DropdownMenuItem onClick={() => handleDuplicate(product)}>
                                <Copy className="w-4 h-4 mr-2" />
                                {isArabic ? 'نسخ' : 'Duplicate'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleFeatured(product)}>
                                {product.featured ? (
                                  <>
                                    <StarOff className="w-4 h-4 mr-2" />
                                    {isArabic ? 'إلغاء التمييز' : 'Unfeature'}
                                  </>
                                ) : (
                                  <>
                                    <Star className="w-4 h-4 mr-2" />
                                    {isArabic ? 'تمييز' : 'Feature'}
                                  </>
                                )}
                              </DropdownMenuItem>
                              {product.status === 'active' ? (
                                <DropdownMenuItem onClick={() => handleToggleStatus(product, 'draft')}>
                                  <EyeOff className="w-4 h-4 mr-2" />
                                  {isArabic ? 'إخفاء' : 'Set Draft'}
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleToggleStatus(product, 'active')}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  {isArabic ? 'تفعيل' : 'Activate'}
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                onClick={() => handleDelete(product)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {isArabic ? 'حذف' : 'Delete'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  {isArabic 
                    ? `عرض ${(currentPage - 1) * productsPerPage + 1}-${Math.min(currentPage * productsPerPage, filteredProducts.length)} من ${filteredProducts.length}`
                    : `Showing ${(currentPage - 1) * productsPerPage + 1}-${Math.min(currentPage * productsPerPage, filteredProducts.length)} of ${filteredProducts.length}`
                  }
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 hover:bg-muted disabled:opacity-50 border border-border"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm px-3">{currentPage} / {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 hover:bg-muted disabled:opacity-50 border border-border"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      )}

      {/* Stats */}
      {!showForm && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-card border border-border p-4 text-center">
            <p className="text-2xl font-bold">{products.length}</p>
            <p className="text-sm text-muted-foreground">{isArabic ? 'إجمالي المنتجات' : 'Total Products'}</p>
          </div>
          <div className="bg-card border border-border p-4 text-center">
            <p className="text-2xl font-bold text-green-500">
              {products.filter(p => p.status === 'active').length}
            </p>
            <p className="text-sm text-muted-foreground">{isArabic ? 'نشط' : 'Active'}</p>
          </div>
          <div className="bg-card border border-border p-4 text-center">
            <p className="text-2xl font-bold text-muted-foreground">
              {products.filter(p => p.status === 'draft').length}
            </p>
            <p className="text-sm text-muted-foreground">{isArabic ? 'مسودة' : 'Draft'}</p>
          </div>
          <div className="bg-card border border-border p-4 text-center">
            <p className="text-2xl font-bold text-red-500">
              {products.filter(p => p.stock <= 10).length}
            </p>
            <p className="text-sm text-muted-foreground">{isArabic ? 'مخزون منخفض' : 'Low Stock'}</p>
          </div>
        </div>
      )}
    </div>
  );
}