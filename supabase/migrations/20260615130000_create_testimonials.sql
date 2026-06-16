-- Customer feedback / testimonials shown on the home page (bilingual)
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sort_order INTEGER NOT NULL DEFAULT 0,
  author_en TEXT NOT NULL,
  author_ar TEXT NOT NULL,
  role_en TEXT,
  role_ar TEXT,
  quote_en TEXT NOT NULL,
  quote_ar TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Public, read-only content
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Testimonials are publicly readable"
ON public.testimonials
FOR SELECT
USING (true);

-- Keep updated_at fresh (function defined in an earlier migration)
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed 5 sample testimonials (replace with real customer feedback later)
INSERT INTO public.testimonials
  (sort_order, rating, author_en, author_ar, role_en, role_ar, quote_en, quote_ar)
VALUES
(1, 5,
 'Khalid Al-Otaibi', 'خالد العتيبي',
 'Operations Manager — Gulf Logistics Group', 'مدير العمليات — مجموعة الخليج اللوجستية',
 'Salada containers withstand tough daily operations, and delivery arrived right on schedule. A reliable partner for our logistics.',
 'حاويات صلادة تتحمّل التشغيل اليومي القاسي، والتسليم كان دقيقاً في موعده. شريك موثوق لعملياتنا اللوجستية.'),
(2, 5,
 'Saad Al-Qahtani', 'سعد القحطاني',
 'Projects Manager — Al-Bunyan Contracting', 'مدير مشاريع — البنيان للمقاولات',
 'The on-site storage units helped us organize project sites and speed up readiness. Excellent build quality.',
 'وحدات التخزين الميدانية ساعدتنا على تنظيم مواقع المشاريع وتسريع الجاهزية. جودة تصنيع ممتازة.'),
(3, 5,
 'Eng. Noura Al-Subaie', 'م. نورة السبيعي',
 'Procurement Director — Government Entity', 'مديرة التوريد — جهة حكومية',
 'Strong commitment to specifications, quality, and fast supply — with the added value of local manufacturing and national content.',
 'التزام قوي بالمواصفات والجودة وسرعة التوريد، مع ميزة التصنيع المحلي ودعم المحتوى الوطني.'),
(4, 5,
 'Fahad Al-Malki', 'فهد المالكي',
 'Plant Manager — Advanced Metal Industries', 'مدير المصنع — صناعات المعادن المتقدمة',
 'Heavy-duty steel solutions well suited to our industrial environment, backed by responsive after-sales service.',
 'حلول معدنية شديدة التحمّل تناسب بيئتنا الصناعية، مع خدمة ما بعد البيع متجاوبة.'),
(5, 5,
 'Reem Al-Dosari', 'ريم الدوسري',
 'Warehouse Manager — National Distribution Centers', 'مديرة المستودعات — مراكز التوزيع الوطنية',
 'Flexible container solutions improved our space utilization and inventory protection. Professional from start to finish.',
 'حلول حاويات مرنة حسّنت استغلال المساحات وحماية المخزون. تعامل احترافي من البداية إلى النهاية.');
