import { useState } from 'react';
import { 
  Store, 
  CreditCard, 
  Truck, 
  Receipt, 
  Bell, 
  Globe,
  Save,
  Mail,
  Phone,
  MapPin,
  Building,
  Percent,
  Package
} from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  city: string;
  country: string;
  postalCode: string;
  currency: string;
  taxNumber: string;
}

interface ShippingSettings {
  freeShippingThreshold: number;
  standardShippingRate: number;
  expressShippingRate: number;
  enableFreeShipping: boolean;
  enableExpressShipping: boolean;
  estimatedDeliveryDays: number;
  expressDeliveryDays: number;
}

interface TaxSettings {
  enableTax: boolean;
  taxRate: number;
  taxIncludedInPrice: boolean;
  taxLabel: string;
}

interface NotificationSettings {
  emailNewOrder: boolean;
  emailOrderStatus: boolean;
  emailLowStock: boolean;
  lowStockThreshold: number;
}

interface PaymentSettings {
  enableCOD: boolean;
  enableBankTransfer: boolean;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankIBAN: string;
}

export function SettingsAdmin() {
  const { language } = useLanguageStore();
  const isArabic = language === 'ar';

  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: 'SALADA',
    storeEmail: 'info@salada.com',
    storePhone: '+966 50 123 4567',
    storeAddress: 'King Fahd Road',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    postalCode: '12345',
    currency: 'SAR',
    taxNumber: '300000000000003',
  });

  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    freeShippingThreshold: 500,
    standardShippingRate: 25,
    expressShippingRate: 50,
    enableFreeShipping: true,
    enableExpressShipping: true,
    estimatedDeliveryDays: 5,
    expressDeliveryDays: 2,
  });

  const [taxSettings, setTaxSettings] = useState<TaxSettings>({
    enableTax: true,
    taxRate: 15,
    taxIncludedInPrice: false,
    taxLabel: 'VAT',
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNewOrder: true,
    emailOrderStatus: true,
    emailLowStock: true,
    lowStockThreshold: 10,
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    enableCOD: true,
    enableBankTransfer: true,
    bankName: 'Al Rajhi Bank',
    bankAccountName: 'SALADA Trading Co.',
    bankAccountNumber: '1234567890',
    bankIBAN: 'SA0000000000001234567890',
  });

  const handleSaveStore = () => {
    toast.success(isArabic ? 'تم حفظ إعدادات المتجر' : 'Store settings saved');
  };

  const handleSaveShipping = () => {
    toast.success(isArabic ? 'تم حفظ إعدادات الشحن' : 'Shipping settings saved');
  };

  const handleSaveTax = () => {
    toast.success(isArabic ? 'تم حفظ إعدادات الضرائب' : 'Tax settings saved');
  };

  const handleSaveNotifications = () => {
    toast.success(isArabic ? 'تم حفظ إعدادات الإشعارات' : 'Notification settings saved');
  };

  const handleSavePayment = () => {
    toast.success(isArabic ? 'تم حفظ إعدادات الدفع' : 'Payment settings saved');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">
        {isArabic ? 'الإعدادات' : 'Settings'}
      </h1>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="bg-secondary border border-border p-1 h-auto flex-wrap">
          <TabsTrigger value="store" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Store className="w-4 h-4 mr-2" />
            {isArabic ? 'المتجر' : 'Store'}
          </TabsTrigger>
          <TabsTrigger value="shipping" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Truck className="w-4 h-4 mr-2" />
            {isArabic ? 'الشحن' : 'Shipping'}
          </TabsTrigger>
          <TabsTrigger value="tax" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Receipt className="w-4 h-4 mr-2" />
            {isArabic ? 'الضرائب' : 'Tax'}
          </TabsTrigger>
          <TabsTrigger value="payment" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <CreditCard className="w-4 h-4 mr-2" />
            {isArabic ? 'الدفع' : 'Payment'}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bell className="w-4 h-4 mr-2" />
            {isArabic ? 'الإشعارات' : 'Notifications'}
          </TabsTrigger>
        </TabsList>

        {/* Store Settings */}
        <TabsContent value="store">
          <div className="bg-card border border-border p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              {isArabic ? 'معلومات المتجر' : 'Store Information'}
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  {isArabic ? 'اسم المتجر' : 'Store Name'}
                </label>
                <input
                  type="text"
                  value={storeSettings.storeName}
                  onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                  className="industrial-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {isArabic ? 'البريد الإلكتروني' : 'Email'}
                </label>
                <input
                  type="email"
                  value={storeSettings.storeEmail}
                  onChange={(e) => setStoreSettings({ ...storeSettings, storeEmail: e.target.value })}
                  className="industrial-input"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {isArabic ? 'رقم الهاتف' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  value={storeSettings.storePhone}
                  onChange={(e) => setStoreSettings({ ...storeSettings, storePhone: e.target.value })}
                  className="industrial-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Receipt className="w-4 h-4" />
                  {isArabic ? 'الرقم الضريبي' : 'Tax Number (VAT)'}
                </label>
                <input
                  type="text"
                  value={storeSettings.taxNumber}
                  onChange={(e) => setStoreSettings({ ...storeSettings, taxNumber: e.target.value })}
                  className="industrial-input font-mono"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {isArabic ? 'العنوان' : 'Address'}
              </label>
              <input
                type="text"
                value={storeSettings.storeAddress}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeAddress: e.target.value })}
                className="industrial-input"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {isArabic ? 'المدينة' : 'City'}
                </label>
                <input
                  type="text"
                  value={storeSettings.city}
                  onChange={(e) => setStoreSettings({ ...storeSettings, city: e.target.value })}
                  className="industrial-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {isArabic ? 'البلد' : 'Country'}
                </label>
                <input
                  type="text"
                  value={storeSettings.country}
                  onChange={(e) => setStoreSettings({ ...storeSettings, country: e.target.value })}
                  className="industrial-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {isArabic ? 'الرمز البريدي' : 'Postal Code'}
                </label>
                <input
                  type="text"
                  value={storeSettings.postalCode}
                  onChange={(e) => setStoreSettings({ ...storeSettings, postalCode: e.target.value })}
                  className="industrial-input font-mono"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {isArabic ? 'العملة' : 'Currency'}
              </label>
              <input
                type="text"
                value="SAR - Saudi Riyal"
                disabled
                className="industrial-input bg-muted cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {isArabic ? 'العملة ثابتة على الريال السعودي' : 'Currency is fixed to Saudi Riyal'}
              </p>
            </div>

            <button onClick={handleSaveStore} className="industrial-button">
              <Save className="w-4 h-4 mr-2" />
              {isArabic ? 'حفظ الإعدادات' : 'Save Settings'}
            </button>
          </div>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping">
          <div className="bg-card border border-border p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              {isArabic ? 'إعدادات الشحن' : 'Shipping Settings'}
            </h2>

            <div className="space-y-6">
              {/* Free Shipping */}
              <div className="flex items-center justify-between p-4 bg-secondary border border-border">
                <div>
                  <Label className="text-base font-medium">
                    {isArabic ? 'تفعيل الشحن المجاني' : 'Enable Free Shipping'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'تقديم شحن مجاني عند تجاوز حد معين' : 'Offer free shipping above a threshold'}
                  </p>
                </div>
                <Switch
                  checked={shippingSettings.enableFreeShipping}
                  onCheckedChange={(checked) => setShippingSettings({ ...shippingSettings, enableFreeShipping: checked })}
                />
              </div>

              {shippingSettings.enableFreeShipping && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isArabic ? 'حد الشحن المجاني (ريال)' : 'Free Shipping Threshold (SAR)'}
                  </label>
                  <input
                    type="number"
                    value={shippingSettings.freeShippingThreshold}
                    onChange={(e) => setShippingSettings({ ...shippingSettings, freeShippingThreshold: Number(e.target.value) })}
                    className="industrial-input font-mono w-48"
                  />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isArabic ? 'تكلفة الشحن العادي (ريال)' : 'Standard Shipping Rate (SAR)'}
                  </label>
                  <input
                    type="number"
                    value={shippingSettings.standardShippingRate}
                    onChange={(e) => setShippingSettings({ ...shippingSettings, standardShippingRate: Number(e.target.value) })}
                    className="industrial-input font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isArabic ? 'أيام التوصيل المتوقعة' : 'Estimated Delivery Days'}
                  </label>
                  <input
                    type="number"
                    value={shippingSettings.estimatedDeliveryDays}
                    onChange={(e) => setShippingSettings({ ...shippingSettings, estimatedDeliveryDays: Number(e.target.value) })}
                    className="industrial-input font-mono"
                  />
                </div>
              </div>

              {/* Express Shipping */}
              <div className="flex items-center justify-between p-4 bg-secondary border border-border">
                <div>
                  <Label className="text-base font-medium">
                    {isArabic ? 'تفعيل الشحن السريع' : 'Enable Express Shipping'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'تقديم خيار شحن سريع بتكلفة إضافية' : 'Offer express shipping for additional cost'}
                  </p>
                </div>
                <Switch
                  checked={shippingSettings.enableExpressShipping}
                  onCheckedChange={(checked) => setShippingSettings({ ...shippingSettings, enableExpressShipping: checked })}
                />
              </div>

              {shippingSettings.enableExpressShipping && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isArabic ? 'تكلفة الشحن السريع (ريال)' : 'Express Shipping Rate (SAR)'}
                    </label>
                    <input
                      type="number"
                      value={shippingSettings.expressShippingRate}
                      onChange={(e) => setShippingSettings({ ...shippingSettings, expressShippingRate: Number(e.target.value) })}
                      className="industrial-input font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isArabic ? 'أيام التوصيل السريع' : 'Express Delivery Days'}
                    </label>
                    <input
                      type="number"
                      value={shippingSettings.expressDeliveryDays}
                      onChange={(e) => setShippingSettings({ ...shippingSettings, expressDeliveryDays: Number(e.target.value) })}
                      className="industrial-input font-mono"
                    />
                  </div>
                </div>
              )}

              <button onClick={handleSaveShipping} className="industrial-button">
                <Save className="w-4 h-4 mr-2" />
                {isArabic ? 'حفظ الإعدادات' : 'Save Settings'}
              </button>
            </div>
          </div>
        </TabsContent>

        {/* Tax Settings */}
        <TabsContent value="tax">
          <div className="bg-card border border-border p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Percent className="w-5 h-5 text-primary" />
              {isArabic ? 'إعدادات الضرائب' : 'Tax Settings'}
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-secondary border border-border">
                <div>
                  <Label className="text-base font-medium">
                    {isArabic ? 'تفعيل الضريبة' : 'Enable Tax'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'احتساب الضريبة على الطلبات' : 'Calculate tax on orders'}
                  </p>
                </div>
                <Switch
                  checked={taxSettings.enableTax}
                  onCheckedChange={(checked) => setTaxSettings({ ...taxSettings, enableTax: checked })}
                />
              </div>

              {taxSettings.enableTax && (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {isArabic ? 'نسبة الضريبة (%)' : 'Tax Rate (%)'}
                      </label>
                      <input
                        type="number"
                        value={taxSettings.taxRate}
                        onChange={(e) => setTaxSettings({ ...taxSettings, taxRate: Number(e.target.value) })}
                        className="industrial-input font-mono"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {isArabic ? 'مسمى الضريبة' : 'Tax Label'}
                      </label>
                      <input
                        type="text"
                        value={taxSettings.taxLabel}
                        onChange={(e) => setTaxSettings({ ...taxSettings, taxLabel: e.target.value })}
                        className="industrial-input"
                        placeholder="VAT, GST, etc."
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary border border-border">
                    <div>
                      <Label className="text-base font-medium">
                        {isArabic ? 'الضريبة مشمولة في السعر' : 'Tax Included in Price'}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'الأسعار المعروضة تشمل الضريبة' : 'Displayed prices include tax'}
                      </p>
                    </div>
                    <Switch
                      checked={taxSettings.taxIncludedInPrice}
                      onCheckedChange={(checked) => setTaxSettings({ ...taxSettings, taxIncludedInPrice: checked })}
                    />
                  </div>
                </>
              )}

              <button onClick={handleSaveTax} className="industrial-button">
                <Save className="w-4 h-4 mr-2" />
                {isArabic ? 'حفظ الإعدادات' : 'Save Settings'}
              </button>
            </div>
          </div>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <div className="bg-card border border-border p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              {isArabic ? 'إعدادات الدفع' : 'Payment Settings'}
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-secondary border border-border">
                <div>
                  <Label className="text-base font-medium">
                    {isArabic ? 'الدفع عند الاستلام' : 'Cash on Delivery (COD)'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'السماح بالدفع نقداً عند التوصيل' : 'Allow payment upon delivery'}
                  </p>
                </div>
                <Switch
                  checked={paymentSettings.enableCOD}
                  onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, enableCOD: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary border border-border">
                <div>
                  <Label className="text-base font-medium">
                    {isArabic ? 'التحويل البنكي' : 'Bank Transfer'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'السماح بالدفع عبر التحويل البنكي' : 'Allow payment via bank transfer'}
                  </p>
                </div>
                <Switch
                  checked={paymentSettings.enableBankTransfer}
                  onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, enableBankTransfer: checked })}
                />
              </div>

              {paymentSettings.enableBankTransfer && (
                <div className="p-4 bg-muted/50 border border-border space-y-4">
                  <h3 className="font-medium">{isArabic ? 'معلومات الحساب البنكي' : 'Bank Account Details'}</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {isArabic ? 'اسم البنك' : 'Bank Name'}
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.bankName}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, bankName: e.target.value })}
                        className="industrial-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {isArabic ? 'اسم صاحب الحساب' : 'Account Holder Name'}
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.bankAccountName}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, bankAccountName: e.target.value })}
                        className="industrial-input"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {isArabic ? 'رقم الحساب' : 'Account Number'}
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.bankAccountNumber}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, bankAccountNumber: e.target.value })}
                        className="industrial-input font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {isArabic ? 'رقم الآيبان' : 'IBAN'}
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.bankIBAN}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, bankIBAN: e.target.value })}
                        className="industrial-input font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button onClick={handleSavePayment} className="industrial-button">
                <Save className="w-4 h-4 mr-2" />
                {isArabic ? 'حفظ الإعدادات' : 'Save Settings'}
              </button>
            </div>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <div className="bg-card border border-border p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              {isArabic ? 'إعدادات الإشعارات' : 'Notification Settings'}
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-secondary border border-border">
                <div>
                  <Label className="text-base font-medium">
                    {isArabic ? 'إشعار الطلبات الجديدة' : 'New Order Notifications'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'استلام بريد عند وصول طلب جديد' : 'Receive email when new order is placed'}
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailNewOrder}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNewOrder: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary border border-border">
                <div>
                  <Label className="text-base font-medium">
                    {isArabic ? 'تحديثات حالة الطلب' : 'Order Status Updates'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'إرسال بريد للعميل عند تغيير حالة الطلب' : 'Send email to customer when order status changes'}
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailOrderStatus}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailOrderStatus: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary border border-border">
                <div>
                  <Label className="text-base font-medium">
                    {isArabic ? 'تنبيه نقص المخزون' : 'Low Stock Alerts'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'استلام بريد عندما يقل المخزون عن حد معين' : 'Receive email when stock falls below threshold'}
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailLowStock}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailLowStock: checked })}
                />
              </div>

              {notificationSettings.emailLowStock && (
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    {isArabic ? 'حد التنبيه للمخزون' : 'Low Stock Threshold'}
                  </label>
                  <input
                    type="number"
                    value={notificationSettings.lowStockThreshold}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, lowStockThreshold: Number(e.target.value) })}
                    className="industrial-input font-mono w-48"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {isArabic ? 'سيتم إرسال تنبيه عندما يقل المخزون عن هذا الرقم' : 'Alert will be sent when stock falls below this number'}
                  </p>
                </div>
              )}

              <button onClick={handleSaveNotifications} className="industrial-button">
                <Save className="w-4 h-4 mr-2" />
                {isArabic ? 'حفظ الإعدادات' : 'Save Settings'}
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}