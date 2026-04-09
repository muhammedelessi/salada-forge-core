import { useState, useEffect } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Tag, 
  Percent, 
  DollarSign,
  Calendar,
  Users,
  ToggleLeft,
  ToggleRight,
  X,
  Save,
  Copy,
  Check
} from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  used_count: number;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
}

interface CouponFormData {
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_uses: number | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

const initialFormData: CouponFormData = {
  code: '',
  description: '',
  discount_type: 'percentage',
  discount_value: 10,
  min_order_amount: 0,
  max_uses: null,
  start_date: '',
  end_date: '',
  is_active: true,
};

export function CouponsAdmin() {
  const { language } = useLanguageStore();
  const isArabic = language === 'ar';
  
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState<CouponFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error: any) {
      console.error('Error fetching coupons:', error);
      toast.error(isArabic ? 'خطأ في جلب الكوبونات' : 'Error fetching coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code.trim()) {
      toast.error(isArabic ? 'كود الكوبون مطلوب' : 'Coupon code is required');
      return;
    }

    if (formData.discount_value <= 0) {
      toast.error(isArabic ? 'قيمة الخصم يجب أن تكون أكبر من صفر' : 'Discount value must be greater than zero');
      return;
    }

    if (formData.discount_type === 'percentage' && formData.discount_value > 100) {
      toast.error(isArabic ? 'نسبة الخصم لا يمكن أن تتجاوز 100%' : 'Percentage discount cannot exceed 100%');
      return;
    }

    setSaving(true);

    try {
      const couponData = {
        code: formData.code.toUpperCase().trim(),
        description: formData.description || null,
        discount_type: formData.discount_type,
        discount_value: formData.discount_value,
        min_order_amount: formData.min_order_amount || 0,
        max_uses: formData.max_uses || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        is_active: formData.is_active,
      };

      if (editingCoupon) {
        const { error } = await supabase
          .from('coupons')
          .update(couponData)
          .eq('id', editingCoupon.id);

        if (error) throw error;
        toast.success(isArabic ? 'تم تحديث الكوبون' : 'Coupon updated');
      } else {
        const { error } = await supabase
          .from('coupons')
          .insert(couponData);

        if (error) {
          if (error.code === '23505') {
            toast.error(isArabic ? 'كود الكوبون موجود بالفعل' : 'Coupon code already exists');
            return;
          }
          throw error;
        }
        toast.success(isArabic ? 'تم إنشاء الكوبون' : 'Coupon created');
      }

      setShowForm(false);
      setEditingCoupon(null);
      setFormData(initialFormData);
      fetchCoupons();
    } catch (error: any) {
      console.error('Error saving coupon:', error);
      toast.error(isArabic ? 'خطأ في حفظ الكوبون' : 'Error saving coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_amount: coupon.min_order_amount || 0,
      max_uses: coupon.max_uses,
      start_date: coupon.start_date ? coupon.start_date.split('T')[0] : '',
      end_date: coupon.end_date ? coupon.end_date.split('T')[0] : '',
      is_active: coupon.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (coupon: Coupon) => {
    if (!confirm(isArabic ? 'هل أنت متأكد من حذف هذا الكوبون؟' : 'Are you sure you want to delete this coupon?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', coupon.id);

      if (error) throw error;
      toast.success(isArabic ? 'تم حذف الكوبون' : 'Coupon deleted');
      fetchCoupons();
    } catch (error: any) {
      console.error('Error deleting coupon:', error);
      toast.error(isArabic ? 'خطأ في حذف الكوبون' : 'Error deleting coupon');
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ is_active: !coupon.is_active })
        .eq('id', coupon.id);

      if (error) throw error;
      toast.success(
        coupon.is_active 
          ? (isArabic ? 'تم تعطيل الكوبون' : 'Coupon deactivated')
          : (isArabic ? 'تم تفعيل الكوبون' : 'Coupon activated')
      );
      fetchCoupons();
    } catch (error: any) {
      console.error('Error toggling coupon:', error);
      toast.error(isArabic ? 'خطأ في تحديث الكوبون' : 'Error updating coupon');
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    toast.success(isArabic ? 'تم نسخ الكود' : 'Code copied');
  };

  const getCouponStatus = (coupon: Coupon) => {
    if (!coupon.is_active) {
      return { label: isArabic ? 'معطل' : 'Inactive', color: 'bg-muted text-muted-foreground' };
    }
    
    const now = new Date();
    if (coupon.start_date && new Date(coupon.start_date) > now) {
      return { label: isArabic ? 'مجدول' : 'Scheduled', color: 'bg-blue-500/20 text-blue-500' };
    }
    if (coupon.end_date && new Date(coupon.end_date) < now) {
      return { label: isArabic ? 'منتهي' : 'Expired', color: 'bg-red-500/20 text-red-500' };
    }
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return { label: isArabic ? 'مستنفد' : 'Exhausted', color: 'bg-orange-500/20 text-orange-500' };
    }
    return { label: isArabic ? 'نشط' : 'Active', color: 'bg-green-500/20 text-green-500' };
  };

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discount_type === 'percentage') {
      return `${coupon.discount_value}%`;
    }
    return `SAR ${coupon.discount_value}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">
          {isArabic ? 'الكوبونات' : 'Coupons'}
        </h1>
        <button
          onClick={() => {
            setEditingCoupon(null);
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
              {isArabic ? 'إضافة كوبون' : 'Add Coupon'}
            </>
          )}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border p-6 mb-8">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" />
            {editingCoupon 
              ? (isArabic ? 'تعديل الكوبون' : 'Edit Coupon')
              : (isArabic ? 'إضافة كوبون جديد' : 'Add New Coupon')
            }
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                {isArabic ? 'كود الكوبون *' : 'Coupon Code *'}
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="industrial-input label-text uppercase"
                placeholder="SAVE20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {isArabic ? 'الوصف' : 'Description'}
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="industrial-input"
                placeholder={isArabic ? 'خصم 20% على جميع المنتجات' : '20% off all products'}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                {isArabic ? 'نوع الخصم *' : 'Discount Type *'}
              </label>
              <select
                value={formData.discount_type}
                onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed' })}
                className="industrial-input"
              >
                <option value="percentage">{isArabic ? 'نسبة مئوية (%)' : 'Percentage (%)'}</option>
                <option value="fixed">{isArabic ? 'مبلغ ثابت (ريال)' : 'Fixed Amount (SAR)'}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {isArabic ? 'قيمة الخصم *' : 'Discount Value *'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                  className="industrial-input label-text pr-12"
                  min="0"
                  step={formData.discount_type === 'percentage' ? '1' : '0.01'}
                  max={formData.discount_type === 'percentage' ? '100' : undefined}
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {formData.discount_type === 'percentage' ? '%' : 'SAR'}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {isArabic ? 'الحد الأدنى للطلب (ريال)' : 'Min Order Amount (SAR)'}
              </label>
              <input
                type="number"
                value={formData.min_order_amount}
                onChange={(e) => setFormData({ ...formData, min_order_amount: Number(e.target.value) })}
                className="industrial-input label-text"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                {isArabic ? 'الحد الأقصى للاستخدام' : 'Max Uses'}
              </label>
              <input
                type="number"
                value={formData.max_uses || ''}
                onChange={(e) => setFormData({ ...formData, max_uses: e.target.value ? Number(e.target.value) : null })}
                className="industrial-input label-text"
                min="1"
                placeholder={isArabic ? 'غير محدود' : 'Unlimited'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {isArabic ? 'تاريخ البداية' : 'Start Date'}
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="industrial-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {isArabic ? 'تاريخ الانتهاء' : 'End Date'}
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="industrial-input"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6 p-4 bg-secondary border border-border">
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <div>
              <p className="font-medium">{isArabic ? 'تفعيل الكوبون' : 'Active'}</p>
              <p className="text-sm text-muted-foreground">
                {isArabic ? 'الكوبون سيكون متاحاً للاستخدام فوراً' : 'Coupon will be available for use immediately'}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={saving} className="btn-primary">
              <Save className="w-4 h-4 mr-2" />
              {saving 
                ? (isArabic ? 'جاري الحفظ...' : 'Saving...')
                : (isArabic ? 'حفظ الكوبون' : 'Save Coupon')
              }
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingCoupon(null);
                setFormData(initialFormData);
              }}
              className="btn-secondary"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </form>
      )}

      {/* Coupons List */}
      {loading ? (
        <div className="bg-card border border-border p-12 text-center">
          <p className="text-muted-foreground">{isArabic ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-card border border-border p-12 text-center">
          <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            {isArabic ? 'لا توجد كوبونات بعد' : 'No coupons yet'}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isArabic ? 'إضافة أول كوبون' : 'Add First Coupon'}
          </button>
        </div>
      ) : (
        <div className="bg-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-4 text-sm uppercase tracking-wider">
                    {isArabic ? 'الكود' : 'Code'}
                  </th>
                  <th className="text-left p-4 text-sm uppercase tracking-wider">
                    {isArabic ? 'الخصم' : 'Discount'}
                  </th>
                  <th className="text-left p-4 text-sm uppercase tracking-wider">
                    {isArabic ? 'الحد الأدنى' : 'Min Order'}
                  </th>
                  <th className="text-left p-4 text-sm uppercase tracking-wider">
                    {isArabic ? 'الاستخدام' : 'Usage'}
                  </th>
                  <th className="text-left p-4 text-sm uppercase tracking-wider">
                    {isArabic ? 'الصلاحية' : 'Validity'}
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
                {coupons.map((coupon) => {
                  const status = getCouponStatus(coupon);
                  return (
                    <tr key={coupon.id} className="border-t border-border hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <code className="label-text font-bold text-primary bg-primary/10 px-2 py-1">
                            {coupon.code}
                          </code>
                          <button
                            onClick={() => copyCode(coupon.code)}
                            className="text-muted-foreground hover:text-foreground"
                            title={isArabic ? 'نسخ الكود' : 'Copy code'}
                          >
                            {copiedCode === coupon.code ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        {coupon.description && (
                          <p className="text-xs text-muted-foreground mt-1">{coupon.description}</p>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 label-text font-bold">
                          {coupon.discount_type === 'percentage' ? (
                            <Percent className="w-4 h-4 text-primary" />
                          ) : (
                            <DollarSign className="w-4 h-4 text-primary" />
                          )}
                          {formatDiscount(coupon)}
                        </div>
                      </td>
                      <td className="p-4 label-text text-sm">
                        {coupon.min_order_amount && coupon.min_order_amount > 0
                          ? `SAR ${coupon.min_order_amount}`
                          : '-'
                        }
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="label-text">
                            {coupon.used_count}
                            {coupon.max_uses && ` / ${coupon.max_uses}`}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        {coupon.start_date || coupon.end_date ? (
                          <div className="space-y-1">
                            {coupon.start_date && (
                              <div className="text-xs">
                                <span className="text-muted-foreground">{isArabic ? 'من:' : 'From:'}</span>{' '}
                                {format(new Date(coupon.start_date), 'dd/MM/yyyy')}
                              </div>
                            )}
                            {coupon.end_date && (
                              <div className="text-xs">
                                <span className="text-muted-foreground">{isArabic ? 'إلى:' : 'To:'}</span>{' '}
                                {format(new Date(coupon.end_date), 'dd/MM/yyyy')}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">{isArabic ? 'غير محدد' : 'No limit'}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`text-xs uppercase px-2 py-1 ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleActive(coupon)}
                            className="p-2 hover:bg-muted transition-colors"
                            title={coupon.is_active 
                              ? (isArabic ? 'تعطيل' : 'Deactivate')
                              : (isArabic ? 'تفعيل' : 'Activate')
                            }
                          >
                            {coupon.is_active ? (
                              <ToggleRight className="w-5 h-5 text-green-500" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(coupon)}
                            className="p-2 hover:bg-muted transition-colors"
                            title={isArabic ? 'تعديل' : 'Edit'}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon)}
                            className="p-2 hover:bg-muted transition-colors text-destructive"
                            title={isArabic ? 'حذف' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      {coupons.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-card border border-border p-4 text-center">
            <p className="text-2xl font-bold">{coupons.length}</p>
            <p className="text-sm text-muted-foreground">{isArabic ? 'إجمالي الكوبونات' : 'Total Coupons'}</p>
          </div>
          <div className="bg-card border border-border p-4 text-center">
            <p className="text-2xl font-bold text-green-500">
              {coupons.filter(c => getCouponStatus(c).label === (isArabic ? 'نشط' : 'Active')).length}
            </p>
            <p className="text-sm text-muted-foreground">{isArabic ? 'نشط' : 'Active'}</p>
          </div>
          <div className="bg-card border border-border p-4 text-center">
            <p className="text-2xl font-bold text-red-500">
              {coupons.filter(c => getCouponStatus(c).label === (isArabic ? 'منتهي' : 'Expired')).length}
            </p>
            <p className="text-sm text-muted-foreground">{isArabic ? 'منتهي' : 'Expired'}</p>
          </div>
          <div className="bg-card border border-border p-4 text-center">
            <p className="text-2xl font-bold">
              {coupons.reduce((sum, c) => sum + c.used_count, 0)}
            </p>
            <p className="text-sm text-muted-foreground">{isArabic ? 'إجمالي الاستخدام' : 'Total Uses'}</p>
          </div>
        </div>
      )}
    </div>
  );
}