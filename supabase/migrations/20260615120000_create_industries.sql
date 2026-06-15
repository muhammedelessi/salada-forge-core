-- Industries served — bilingual content powering the industry cards & detail pages
CREATE TABLE public.industries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  icon TEXT,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  explanation_en TEXT,
  explanation_ar TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Public, read-only content
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Industries are publicly readable"
ON public.industries
FOR SELECT
USING (true);

-- Keep updated_at fresh (function defined in an earlier migration)
CREATE TRIGGER update_industries_updated_at
BEFORE UPDATE ON public.industries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed the five industries (EN + AR description "الوصف" and explanation "الشرح")
INSERT INTO public.industries
  (slug, sort_order, icon, name_en, name_ar, description_en, description_ar, explanation_en, explanation_ar)
VALUES
('logistics', 1, 'Ship',
 'Logistics & Freight Companies', 'شركات اللوجيستيات والشحن',
 'We provide durable container and steel solutions designed to support frequent shipping, transport, and storage operations with efficiency and reliability.',
 'نوفر حلول حاويات وهياكل معدنية عالية المتانة مصممة لدعم عمليات الشحن، النقل، والتخزين المتكرر بكفاءة وموثوقية.',
 'Salada serves logistics and shipping companies by delivering standard-compliant containers, spare parts, and steel solutions built for demanding operational environments. Our products are designed to withstand repeated handling, stacking, and transportation cycles while helping businesses improve efficiency, reduce downtime, and maintain asset readiness.',
 'تخدم صلادة شركات اللوجيستيات والشحن من خلال توفير حاويات مطابقة للمعايير، وقطع غيار، وتجهيزات معدنية تتحمل ظروف التشغيل القاسية، وتدعم عمليات المناولة المتكررة والتكديس والنقل بين المواقع. تساعد حلولنا على تحسين الكفاءة التشغيلية، تقليل التوقفات، ورفع جاهزية الأصول للاستخدام اليومي.'),
('construction', 2, 'HardHat',
 'Construction Contractors', 'مقاولو البناء',
 'We provide practical storage and site support solutions that help construction contractors operate project sites quickly and efficiently.',
 'نوفر حلول تخزين وتجهيزات ميدانية عملية تساعد مقاولي البناء على دعم مواقع المشاريع بسرعة وكفاءة.',
 'Construction contractors require reliable solutions that can adapt to dynamic site conditions. Salada provides storage containers, steel units, and practical site-support solutions that help protect materials, organize equipment, and improve on-site efficiency. Our solutions are built to support project timelines and enhance overall site management.',
 'تحتاج شركات المقاولات إلى حلول موثوقة تلائم طبيعة العمل الميداني المتغيرة، لذلك نوفر حاويات تخزين، وحدات معدنية، وتجهيزات عملية يمكن استخدامها في مواقع المشاريع لحفظ المواد والمعدات وتنظيمها بشكل آمن. تساعد هذه الحلول على تسريع الجاهزية التشغيلية وتحسين إدارة الموقع ودعم الجداول الزمنية للمشروعات.'),
('government', 3, 'Landmark',
 'Government Projects', 'المشاريع الحكومية',
 'We provide locally manufactured containers and industrial solutions that meet quality standards and support government project requirements.',
 'نوفر حاويات وحلولاً مصنعة محليًا وفق معايير الجودة لدعم متطلبات المشاريع الحكومية والتشغيلية.',
 'Government projects require dependable partners who can deliver quality, compliance, and timely execution. Salada supports public-sector needs through industrial solutions and containers designed to meet operational and technical requirements while maintaining high standards of durability and reliability. Our local manufacturing capability also supports faster delivery and local content goals.',
 'تتطلب المشاريع الحكومية موردًا موثوقًا يلتزم بالجودة، المواصفات، وسرعة التنفيذ. لهذا تقدم صلادة حلولاً صناعية وحاويات مصممة لتلبية الاحتياجات التشغيلية والفنية للجهات الحكومية، مع التركيز على المتانة، الاعتمادية، والالتزام بالمعايير الصناعية. كما يسهم التصنيع المحلي في تسريع التوريد ودعم متطلبات المحتوى المحلي.'),
('industrial', 4, 'Factory',
 'Industrial Facilities', 'المنشآت الصناعية',
 'We provide storage and steel solutions tailored for industrial environments that demand high durability and operational reliability.',
 'نوفر حلول تخزين وهياكل معدنية مناسبة للبيئات الصناعية التي تتطلب تحملًا عاليًا واعتمادية مستمرة.',
 'Salada serves industrial facilities by supplying containers and steel solutions designed to support daily operations in factories and production environments. Our solutions are built for heavy-duty use, material protection, and workplace organization, while also considering safety, durability, and ease of maintenance.',
 'تخدم صلادة المنشآت الصناعية عبر تقديم حلول معدنية وحاويات مخصصة لدعم العمليات التشغيلية اليومية داخل المصانع والمرافق الإنتاجية. صُممت هذه الحلول لتحمل الاستخدام المكثف، وحماية المواد والمعدات، والمساهمة في تنظيم بيئة العمل الصناعية بكفاءة. كما نراعي في تصميمنا عوامل السلامة، التحمل، وسهولة الاستخدام والصيانة.'),
('storage', 5, 'Warehouse',
 'Storage & Distribution Providers', 'مزودو التخزين والتوزيع',
 'We provide flexible container and storage solutions that help storage and distribution providers optimize space and logistics operations.',
 'نوفر حلول حاويات وتخزين مرنة تساعد مزودي التخزين والتوزيع على تحسين إدارة المساحات والعمليات اللوجستية.',
 'Storage and distribution providers need practical solutions that improve space utilization and support smooth goods movement. Salada delivers adaptable containers and steel solutions for warehouses and distribution centers, helping businesses organize inventory, protect stored goods, and improve daily operational efficiency.',
 'يعتمد قطاع التخزين والتوزيع على حلول عملية تزيد من كفاءة الاستفادة من المساحات وتدعم حركة البضائع بسلاسة. لذلك تقدم صلادة حاويات وحلولاً معدنية قابلة للتكيف مع متطلبات المستودعات ومراكز التوزيع، بما يساعد على تنظيم المواد، حماية المخزون، وتحسين كفاءة التشغيل اليومي.');
