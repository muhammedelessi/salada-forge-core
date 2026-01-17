import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguageStore } from '@/store/languageStore';
import { Loader2, Mail, Phone, Building2, Calendar, MessageSquare, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function ContactInquiriesAdmin() {
  const { isRTL } = useLanguageStore();
  const queryClient = useQueryClient();
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [notes, setNotes] = useState('');

  const { data: inquiries, isLoading } = useQuery({
    queryKey: ['contact-inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ContactInquiry[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('contact_inquiries')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-inquiries'] });
      toast.success(isRTL() ? 'تم تحديث الحالة' : 'Status updated');
    },
  });

  const updateNotesMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { error } = await supabase
        .from('contact_inquiries')
        .update({ notes })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-inquiries'] });
      toast.success(isRTL() ? 'تم حفظ الملاحظات' : 'Notes saved');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_inquiries')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-inquiries'] });
      setSelectedInquiry(null);
      toast.success(isRTL() ? 'تم حذف الاستفسار' : 'Inquiry deleted');
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-500';
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-500';
      case 'responded': return 'bg-green-500/20 text-green-500';
      case 'closed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSubjectLabel = (subject: string) => {
    const labels: Record<string, { en: string; ar: string }> = {
      quote: { en: 'Request Quote', ar: 'طلب عرض سعر' },
      product: { en: 'Product Inquiry', ar: 'استفسار عن منتج' },
      order: { en: 'Order Status', ar: 'حالة الطلب' },
      support: { en: 'Technical Support', ar: 'دعم فني' },
      partnership: { en: 'Partnership', ar: 'شراكة' },
      other: { en: 'Other', ar: 'أخرى' },
    };
    return labels[subject]?.[isRTL() ? 'ar' : 'en'] || subject;
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
      <h1 className="text-2xl font-bold mb-8">
        {isRTL() ? 'رسائل التواصل' : 'Contact Messages'}
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Inquiries List */}
        <div className="lg:col-span-1 bg-card border border-border">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">
              {isRTL() ? 'الرسائل' : 'Messages'} ({inquiries?.length || 0})
            </h2>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {inquiries?.length === 0 ? (
              <p className="text-muted-foreground text-sm p-4 text-center">
                {isRTL() ? 'لا توجد رسائل' : 'No messages yet'}
              </p>
            ) : (
              inquiries?.map((inquiry) => (
                <div
                  key={inquiry.id}
                  onClick={() => {
                    setSelectedInquiry(inquiry);
                    setNotes(inquiry.notes || '');
                  }}
                  className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedInquiry?.id === inquiry.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-medium text-sm line-clamp-1">{inquiry.name}</p>
                    <span className={`text-xs px-2 py-0.5 ${getStatusColor(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{getSubjectLabel(inquiry.subject)}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{inquiry.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Inquiry Details */}
        <div className="lg:col-span-2 bg-card border border-border">
          {selectedInquiry ? (
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">{selectedInquiry.name}</h2>
                  <p className="text-muted-foreground text-sm">{getSubjectLabel(selectedInquiry.subject)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={selectedInquiry.status}
                    onValueChange={(status) => {
                      updateStatusMutation.mutate({ id: selectedInquiry.id, status });
                      setSelectedInquiry({ ...selectedInquiry, status });
                    }}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">{isRTL() ? 'جديد' : 'New'}</SelectItem>
                      <SelectItem value="in_progress">{isRTL() ? 'قيد المعالجة' : 'In Progress'}</SelectItem>
                      <SelectItem value="responded">{isRTL() ? 'تم الرد' : 'Responded'}</SelectItem>
                      <SelectItem value="closed">{isRTL() ? 'مغلق' : 'Closed'}</SelectItem>
                    </SelectContent>
                  </Select>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-2 text-destructive hover:bg-destructive/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{isRTL() ? 'حذف الرسالة' : 'Delete Message'}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {isRTL() 
                            ? 'هل أنت متأكد من حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء.'
                            : 'Are you sure you want to delete this message? This action cannot be undone.'}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{isRTL() ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(selectedInquiry.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isRTL() ? 'حذف' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-muted/50">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{isRTL() ? 'البريد الإلكتروني' : 'Email'}</p>
                    <a href={`mailto:${selectedInquiry.email}`} className="text-sm hover:text-primary">
                      {selectedInquiry.email}
                    </a>
                  </div>
                </div>
                {selectedInquiry.phone && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{isRTL() ? 'الهاتف' : 'Phone'}</p>
                      <a href={`tel:${selectedInquiry.phone}`} className="text-sm hover:text-primary">
                        {selectedInquiry.phone}
                      </a>
                    </div>
                  </div>
                )}
                {selectedInquiry.company && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{isRTL() ? 'الشركة' : 'Company'}</p>
                      <p className="text-sm">{selectedInquiry.company}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-muted/50">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{isRTL() ? 'تاريخ الإرسال' : 'Submitted'}</p>
                    <p className="text-sm">{new Date(selectedInquiry.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold">{isRTL() ? 'الرسالة' : 'Message'}</h3>
                </div>
                <div className="p-4 bg-muted/50 whitespace-pre-wrap text-sm">
                  {selectedInquiry.message}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">{isRTL() ? 'ملاحظات داخلية' : 'Internal Notes'}</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isRTL() ? 'أضف ملاحظات...' : 'Add notes...'}
                  className="w-full p-3 border border-border bg-background text-sm min-h-[100px] resize-none"
                />
                <button
                  onClick={() => updateNotesMutation.mutate({ id: selectedInquiry.id, notes })}
                  disabled={updateNotesMutation.isPending}
                  className="mt-2 px-4 py-2 bg-primary text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-50"
                >
                  {updateNotesMutation.isPending 
                    ? (isRTL() ? 'جاري الحفظ...' : 'Saving...') 
                    : (isRTL() ? 'حفظ الملاحظات' : 'Save Notes')}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{isRTL() ? 'اختر رسالة لعرض التفاصيل' : 'Select a message to view details'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}