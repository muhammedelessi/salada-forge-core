const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend'

interface QuoteEmailRequest {
  customerName: string
  customerEmail: string
  customerPhone?: string
  customerCompany?: string
  productTitle: string
  productSku: string
  quantity?: number
  message?: string
  language: 'en' | 'ar'
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured')

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is not configured')

    const body: QuoteEmailRequest = await req.json()
    const {
      customerName, customerEmail, customerPhone, customerCompany,
      productTitle, productSku, quantity, message, language
    } = body

    if (!customerName || !customerEmail || !productTitle) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const now = new Date()
    const riyadhTime = now.toLocaleString('en-US', { timeZone: 'Asia/Riyadh' })

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'X-Connection-Api-Key': RESEND_API_KEY,
    }

    // --- Admin notification email ---
    const adminHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <h2 style="color:#333;border-bottom:2px solid #d4a843;padding-bottom:10px;">New Quote Request</h2>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <tr><td style="padding:8px;font-weight:bold;color:#555;width:140px;">Customer Name</td><td style="padding:8px;">${customerName}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#555;">Email</td><td style="padding:8px;">${customerEmail}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Phone</td><td style="padding:8px;">${customerPhone || 'N/A'}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#555;">Company</td><td style="padding:8px;">${customerCompany || 'N/A'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Product</td><td style="padding:8px;">${productTitle}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#555;">SKU</td><td style="padding:8px;">${productSku}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Quantity</td><td style="padding:8px;">${quantity || 'N/A'}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#555;">Submitted</td><td style="padding:8px;">${riyadhTime} (Riyadh)</td></tr>
        </table>
        ${message ? `<div style="margin-top:16px;"><strong>Message:</strong><p style="background:#f5f5f5;padding:12px;border-radius:4px;">${message}</p></div>` : ''}
      </div>
    `

    const adminEmailPromise = fetch(`${GATEWAY_URL}/emails`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        from: 'Salada <onboarding@resend.dev>',
        to: ['Hello@salada.sa'],
        subject: `New Quote Request: ${productTitle} — ${customerName}`,
        html: adminHtml,
      }),
    })

    // --- Customer confirmation email ---
    const isAr = language === 'ar'
    const dir = isAr ? 'rtl' : 'ltr'

    const customerHtml = isAr ? `
      <div style="font-family:'Tajawal',Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;" dir="rtl">
        <h2 style="color:#333;">شكراً لك، ${customerName}!</h2>
        <p style="color:#555;line-height:1.8;">لقد استلمنا طلب عرض السعر الخاص بك وسنتواصل معك خلال 24 ساعة عمل.</p>
        <div style="background:#f9f9f9;padding:16px;border-radius:8px;margin:20px 0;">
          <h3 style="color:#333;margin-top:0;">ملخص الطلب</h3>
          <p style="margin:4px 0;color:#555;"><strong>المنتج:</strong> ${productTitle}</p>
          ${quantity ? `<p style="margin:4px 0;color:#555;"><strong>الكمية:</strong> ${quantity}</p>` : ''}
          ${message ? `<p style="margin:4px 0;color:#555;"><strong>الملاحظات:</strong> ${message}</p>` : ''}
        </div>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
        <p style="color:#888;font-size:13px;">للتواصل معنا: Hello@salada.sa | 050 016 5914</p>
      </div>
    ` : `
      <div style="font-family:'DM Sans',Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <h2 style="color:#333;">Thank you, ${customerName}!</h2>
        <p style="color:#555;line-height:1.6;">We have received your quote request and will get back to you within 24 business hours.</p>
        <div style="background:#f9f9f9;padding:16px;border-radius:8px;margin:20px 0;">
          <h3 style="color:#333;margin-top:0;">Request Summary</h3>
          <p style="margin:4px 0;color:#555;"><strong>Product:</strong> ${productTitle}</p>
          ${quantity ? `<p style="margin:4px 0;color:#555;"><strong>Quantity:</strong> ${quantity}</p>` : ''}
          ${message ? `<p style="margin:4px 0;color:#555;"><strong>Notes:</strong> ${message}</p>` : ''}
        </div>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
        <p style="color:#888;font-size:13px;">Contact us: Hello@salada.sa | 050 016 5914</p>
      </div>
    `

    const customerEmailPromise = fetch(`${GATEWAY_URL}/emails`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        from: 'Salada <onboarding@resend.dev>',
        to: [customerEmail],
        subject: isAr ? 'تأكيد طلب عرض السعر — Salada' : 'Quote Request Confirmation — Salada',
        html: customerHtml,
      }),
    })

    // Send both emails in parallel
    const [adminRes, customerRes] = await Promise.all([adminEmailPromise, customerEmailPromise])

    const adminResult = await adminRes.json()
    const customerResult = await customerRes.json()

    console.log('Admin email result:', JSON.stringify(adminResult))
    console.log('Customer email result:', JSON.stringify(customerResult))

    if (!adminRes.ok) {
      console.error(`Admin email failed [${adminRes.status}]:`, JSON.stringify(adminResult))
    }
    if (!customerRes.ok) {
      console.error(`Customer email failed [${customerRes.status}]:`, JSON.stringify(customerResult))
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in send-quote-email:', error)
    return new Response(JSON.stringify({ success: false, error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
