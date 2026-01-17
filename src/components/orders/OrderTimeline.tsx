import { Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { cn } from '@/lib/utils';

interface ShippingUpdate {
  status: string;
  timestamp: string;
  note?: string;
}

interface OrderTimelineProps {
  currentStatus: string;
  shippingUpdates: ShippingUpdate[];
  createdAt: string;
}

const statusSteps = [
  { key: 'pending', icon: Clock },
  { key: 'processing', icon: Package },
  { key: 'shipped', icon: Truck },
  { key: 'delivered', icon: CheckCircle },
];

export function OrderTimeline({ currentStatus, shippingUpdates, createdAt }: OrderTimelineProps) {
  const { language, isRTL } = useLanguageStore();

  const statusLabels = {
    en: {
      pending: 'Order Placed',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    },
    ar: {
      pending: 'تم استلام الطلب',
      processing: 'قيد المعالجة',
      shipped: 'تم الشحن',
      delivered: 'تم التوصيل',
      cancelled: 'ملغي',
    },
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Build timeline from shipping updates
  const getUpdateForStatus = (status: string): ShippingUpdate | undefined => {
    return shippingUpdates.find(u => u.status === status);
  };

  // Get current step index
  const getCurrentStepIndex = () => {
    if (currentStatus === 'cancelled') return -1;
    return statusSteps.findIndex(s => s.key === currentStatus);
  };

  const currentStepIndex = getCurrentStepIndex();

  // If cancelled, show a different view
  if (currentStatus === 'cancelled') {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className={cn('flex items-center gap-3', isRTL() && 'flex-row-reverse')}>
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className={isRTL() ? 'text-right' : ''}>
            <p className="font-semibold text-red-800">{statusLabels[language].cancelled}</p>
            {getUpdateForStatus('cancelled') && (
              <p className="text-sm text-red-600">
                {formatDateTime(getUpdateForStatus('cancelled')!.timestamp)}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Desktop Timeline - Horizontal */}
      <div className={cn('hidden md:flex items-start justify-between relative', isRTL() && 'flex-row-reverse')}>
        {/* Progress Line Background */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-muted mx-12" />
        
        {/* Progress Line Filled */}
        <div 
          className="absolute top-5 h-1 bg-primary transition-all duration-500 mx-12"
          style={{ 
            width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
            [isRTL() ? 'right' : 'left']: '3rem',
          }}
        />

        {statusSteps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const update = getUpdateForStatus(step.key);
          const Icon = step.icon;

          return (
            <div 
              key={step.key} 
              className={cn('flex flex-col items-center z-10 flex-1', isRTL() && 'flex-col')}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                  isCompleted
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-muted text-muted-foreground',
                  isCurrent && 'ring-4 ring-primary/20'
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className={cn('mt-3 text-center', isRTL() && 'text-center')}>
                <p
                  className={cn(
                    'text-sm font-medium',
                    isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {statusLabels[language][step.key as keyof typeof statusLabels.en]}
                </p>
                {update ? (
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDateTime(update.timestamp)}
                  </p>
                ) : index === 0 ? (
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDateTime(createdAt)}
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Timeline - Vertical */}
      <div className="md:hidden space-y-0">
        {statusSteps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isLast = index === statusSteps.length - 1;
          const update = getUpdateForStatus(step.key);
          const Icon = step.icon;

          return (
            <div key={step.key} className={cn('flex', isRTL() && 'flex-row-reverse')}>
              {/* Icon and Line */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10',
                    isCompleted
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                    isCurrent && 'ring-4 ring-primary/20'
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      'w-0.5 h-16 transition-all duration-300',
                      isCompleted && index < currentStepIndex ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className={cn('flex-1 pb-8', isRTL() ? 'pr-4 text-right' : 'pl-4')}>
                <p
                  className={cn(
                    'font-medium',
                    isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {statusLabels[language][step.key as keyof typeof statusLabels.en]}
                </p>
                {update ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(update.timestamp)}
                    </p>
                    {update.note && (
                      <p className="text-sm text-muted-foreground mt-1 italic">
                        {update.note}
                      </p>
                    )}
                  </>
                ) : index === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(createdAt)}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'في الانتظار' : 'Pending'}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}