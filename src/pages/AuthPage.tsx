import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/i18n/translations';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthPage() {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguageStore();
  const t = translations[language];
  
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate('/orders');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate('/orders');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error(language === 'ar' ? 'بيانات الدخول غير صحيحة' : 'Invalid email or password');
          } else {
            toast.error(error.message);
          }
          return;
        }
        
        toast.success(language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Logged in successfully');
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: formData.fullName,
            },
          },
        });
        
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error(language === 'ar' ? 'هذا البريد مسجل مسبقاً' : 'This email is already registered');
          } else {
            toast.error(error.message);
          }
          return;
        }
        
        toast.success(language === 'ar' ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const content = {
    en: {
      loginTitle: 'Welcome Back',
      loginDesc: 'Sign in to your account to view orders',
      signupTitle: 'Create Account',
      signupDesc: 'Join SALADA to track your orders',
      email: 'Email',
      password: 'Password',
      fullName: 'Full Name',
      login: 'Sign In',
      signup: 'Create Account',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      switchToSignup: 'Create one',
      switchToLogin: 'Sign in',
    },
    ar: {
      loginTitle: 'مرحباً بعودتك',
      loginDesc: 'سجل الدخول لعرض طلباتك',
      signupTitle: 'إنشاء حساب',
      signupDesc: 'انضم إلى صلادة لتتبع طلباتك',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      fullName: 'الاسم الكامل',
      login: 'تسجيل الدخول',
      signup: 'إنشاء الحساب',
      noAccount: 'ليس لديك حساب؟',
      hasAccount: 'لديك حساب بالفعل؟',
      switchToSignup: 'أنشئ واحداً',
      switchToLogin: 'سجل الدخول',
    },
  };

  const c = content[language];

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-16" dir={isRTL() ? 'rtl' : 'ltr'}>
        <div className="w-full max-w-md px-4">
          <div className="bg-card border border-border p-8">
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-2xl">S</span>
                </div>
              </Link>
              <h1 className="text-2xl font-bold mb-2">
                {isLogin ? c.loginTitle : c.signupTitle}
              </h1>
              <p className="text-muted-foreground">
                {isLogin ? c.loginDesc : c.signupDesc}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium mb-2">{c.fullName}</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="industrial-input"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">{c.email}</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="industrial-input"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{c.password}</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="industrial-input"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 ${isRTL() ? 'left-3' : 'right-3'} text-muted-foreground hover:text-foreground`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full industrial-button justify-center disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  isLogin ? c.login : c.signup
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? c.noAccount : c.hasAccount}{' '}
              </span>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? c.switchToSignup : c.switchToLogin}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
