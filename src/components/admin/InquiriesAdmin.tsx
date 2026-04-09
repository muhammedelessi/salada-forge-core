import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguageStore } from '@/store/languageStore';
import {
  MessageSquare,
  Search,
  Loader2,
  Eye,
  Trash2,
  X,
  Mail,
  Phone,
  Building,
  Package,
  Calendar,
  Hash,
  User,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ProductInquiry {
  id: string;
  product_id: string;
  product_title: string;
  product_sku: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_company: string | null;
  quantity: number | null;
  message: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function InquiriesAdmin() {
  const { t, isRTL } = useLanguageStore();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<ProductInquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const { data: inquiries, isLoading } = useQuery({
    queryKey: ['admin-inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ProductInquiry[];
    },
  });

  const updateInquiryMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const { error } = await supabase
        .from('product_inquiries')
        .update({ status, notes: notes || null, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
      toast.success(isRTL() ? 'تم تحديث الطلب' : 'Inquiry updated');
      setSelectedInquiry(null);
    },
    onError: () => {
      toast.error(isRTL() ? 'خطأ في التحديث' : 'Error updating inquiry');
    },
  });

  const deleteInquiryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('product_inquiries')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
      toast.success(isRTL() ? 'تم حذف الطلب' : 'Inquiry deleted');
      setSelectedInquiry(null);
    },
    onError: () => {
      toast.error(isRTL() ? 'خطأ في الحذف' : 'Error deleting inquiry');
    },
  });

  const filteredInquiries = inquiries?.filter((inquiry) => {
    const matchesSearch =
      inquiry.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.product_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inquiry.customer_company?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'contacted':
        return 'bg-blue-500/20 text-blue-500';
      case 'completed':
        return 'bg-green-500/20 text-green-500';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'contacted':
        return Mail;
      case 'completed':
        return CheckCircle;
      case 'cancelled':
        return XCircle;
      default:
        return Clock;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL() ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          {isRTL() ? 'طلبات الأسعار' : 'Product Inquiries'}
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className={cn('absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground', isRTL() ? 'right-3' : 'left-3')} />
          <input
            type="text"
            placeholder={isRTL() ? 'بحث...' : 'Search inquiries...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn('industrial-input w-full', isRTL() ? 'pr-10' : 'pl-10')}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="industrial-input w-full md:w-48"
        >
          <option value="all">{isRTL() ? 'جميع الحالات' : 'All Status'}</option>
          <option value="pending">{isRTL() ? 'قيد الانتظار' : 'Pending'}</option>
          <option value="contacted">{isRTL() ? 'تم التواصل' : 'Contacted'}</option>
          <option value="completed">{isRTL() ? 'مكتمل' : 'Completed'}</option>
          <option value="cancelled">{isRTL() ? 'ملغي' : 'Cancelled'}</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: isRTL() ? 'الكل' : 'Total', count: inquiries?.length || 0, color: 'text-foreground' },
          { label: isRTL() ? 'قيد الانتظار' : 'Pending', count: inquiries?.filter(i => i.status === 'pending').length || 0, color: 'text-yellow-500' },
          { label: isRTL() ? 'تم التواصل' : 'Contacted', count: inquiries?.filter(i => i.status === 'contacted').length || 0, color: 'text-blue-500' },
          { label: isRTL() ? 'مكتمل' : 'Completed', count: inquiries?.filter(i => i.status === 'completed').length || 0, color: 'text-green-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border p-4 text-center">
            <p className={cn('text-2xl font-bold', stat.color)}>{stat.count}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Inquiries Table */}
      <div className="bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className={cn('px-4 py-3 text-xs uppercase tracking-wider', isRTL() ? 'text-right' : 'text-left')}>
                  {isRTL() ? 'العميل' : 'Customer'}
                </th>
                <th className={cn('px-4 py-3 text-xs uppercase tracking-wider', isRTL() ? 'text-right' : 'text-left')}>
                  {isRTL() ? 'المنتج' : 'Product'}
                </th>
                <th className={cn('px-4 py-3 text-xs uppercase tracking-wider', isRTL() ? 'text-right' : 'text-left')}>
                  {isRTL() ? 'الكمية' : 'Qty'}
                </th>
                <th className={cn('px-4 py-3 text-xs uppercase tracking-wider', isRTL() ? 'text-right' : 'text-left')}>
                  {isRTL() ? 'الحالة' : 'Status'}
                </th>
                <th className={cn('px-4 py-3 text-xs uppercase tracking-wider', isRTL() ? 'text-right' : 'text-left')}>
                  {isRTL() ? 'التاريخ' : 'Date'}
                </th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-center">
                  {isRTL() ? 'إجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    {isRTL() ? 'لا توجد طلبات' : 'No inquiries found'}
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry) => {
                  const StatusIcon = getStatusIcon(inquiry.status);
                  return (
                    <tr key={inquiry.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium">{inquiry.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{inquiry.customer_email}</p>
                          {inquiry.customer_company && (
                            <p className="text-xs text-muted-foreground">{inquiry.customer_company}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium line-clamp-1">{inquiry.product_title}</p>
                        {inquiry.product_sku && (
                          <p className="text-xs text-muted-foreground label-text">{inquiry.product_sku}</p>
                        )}
                      </td>
                      <td className="px-4 py-4 label-text">
                        {inquiry.quantity || '-'}
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn('inline-flex items-center gap-1 px-2 py-1 text-xs uppercase', getStatusColor(inquiry.status))}>
                          <StatusIcon className="w-3 h-3" />
                          {inquiry.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(inquiry.created_at)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedInquiry(inquiry);
                              setAdminNotes(inquiry.notes || '');
                            }}
                            className="p-2 hover:bg-muted transition-colors"
                            title={isRTL() ? 'عرض' : 'View'}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(isRTL() ? 'هل تريد حذف هذا الطلب؟' : 'Delete this inquiry?')) {
                                deleteInquiryMutation.mutate(inquiry.id);
                              }
                            }}
                            className="p-2 hover:bg-destructive/20 text-destructive transition-colors"
                            title={isRTL() ? 'حذف' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold">{isRTL() ? 'تفاصيل الطلب' : 'Inquiry Details'}</h2>
              <button onClick={() => setSelectedInquiry(null)} className="p-2 hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {isRTL() ? 'معلومات العميل' : 'Customer Information'}
                </h3>
                <div className="grid md:grid-cols-2 gap-4 bg-muted/50 p-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedInquiry.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${selectedInquiry.customer_email}`} className="text-primary hover:underline">
                      {selectedInquiry.customer_email}
                    </a>
                  </div>
                  {selectedInquiry.customer_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a href={`tel:${selectedInquiry.customer_phone}`} className="text-primary hover:underline">
                        {selectedInquiry.customer_phone}
                      </a>
                    </div>
                  )}
                  {selectedInquiry.customer_company && (
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedInquiry.customer_company}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  {isRTL() ? 'معلومات المنتج' : 'Product Information'}
                </h3>
                <div className="bg-muted/50 p-4 space-y-2">
                  <p className="font-medium">{selectedInquiry.product_title}</p>
                  {selectedInquiry.product_sku && (
                    <p className="text-sm text-muted-foreground label-text">SKU: {selectedInquiry.product_sku}</p>
                  )}
                  {selectedInquiry.quantity && (
                    <p className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-muted-foreground" />
                      {isRTL() ? 'الكمية:' : 'Quantity:'} <span className="label-text">{selectedInquiry.quantity}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Message */}
              {selectedInquiry.message && (
                <div>
                  <h3 className="font-semibold mb-3">{isRTL() ? 'الرسالة' : 'Message'}</h3>
                  <p className="bg-muted/50 p-4 whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              )}

              {/* Timestamp */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {isRTL() ? 'تم الإرسال:' : 'Submitted:'} {formatDate(selectedInquiry.created_at)}
              </div>

              {/* Status & Notes */}
              <div className="border-t border-border pt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isRTL() ? 'الحالة' : 'Status'}
                  </label>
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) => setSelectedInquiry({ ...selectedInquiry, status: e.target.value })}
                    className="industrial-input w-full md:w-48"
                  >
                    <option value="pending">{isRTL() ? 'قيد الانتظار' : 'Pending'}</option>
                    <option value="contacted">{isRTL() ? 'تم التواصل' : 'Contacted'}</option>
                    <option value="completed">{isRTL() ? 'مكتمل' : 'Completed'}</option>
                    <option value="cancelled">{isRTL() ? 'ملغي' : 'Cancelled'}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isRTL() ? 'ملاحظات الإدارة' : 'Admin Notes'}
                  </label>
                  <textarea
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="industrial-input w-full resize-none"
                    placeholder={isRTL() ? 'أضف ملاحظات...' : 'Add notes...'}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => updateInquiryMutation.mutate({
                      id: selectedInquiry.id,
                      status: selectedInquiry.status,
                      notes: adminNotes,
                    })}
                    disabled={updateInquiryMutation.isPending}
                    className="btn-primary"
                  >
                    {updateInquiryMutation.isPending
                      ? (isRTL() ? 'جاري الحفظ...' : 'Saving...')
                      : (isRTL() ? 'حفظ التغييرات' : 'Save Changes')}
                  </button>
                  <button
                    onClick={() => setSelectedInquiry(null)}
                    className="btn-secondary"
                  >
                    {isRTL() ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}