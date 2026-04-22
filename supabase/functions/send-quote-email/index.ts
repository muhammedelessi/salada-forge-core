// IMPORTANT: To receive emails at Hello@salada.sa,
// the domain salada.sa must be verified in Resend:
// 1. Go to resend.com -> Domains -> Add domain -> salada.sa
// 2. Copy the DNS TXT records shown
// 3. Add them to your DNS provider (domain registrar)
// 4. Click "Verify DNS Records" in Resend
// 5. Once verified, update the 'from' address to:
//    'Salada <hello@salada.sa>'
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_GATEWAY_URL = "https://connector-gateway.lovable.dev/resend/emails";
const DEFAULT_FROM = "Salada <hello@salada.sa>";
const ADMIN_TO = "Hello@salada.sa";

interface QuoteEmailRequest {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCompany?: string;
  productTitle: string;
  productSku: string;
  quantity?: number;
  message?: string;
  language: "en" | "ar";
}

async function sendResendEmail(
  lovableApiKey: string,
  resendApiKey: string,
  payload: { from: string; to: string[]; subject: string; html: string },
) {
  const response = await fetch(RESEND_GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableApiKey}`,
      "X-Connection-Api-Key": resendApiKey,
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let result: unknown = text;
  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    // Keep raw text if response is not JSON.
  }

  if (!response.ok) {
    throw new Error(`Resend ${response.status}: ${JSON.stringify(result)}`);
  }

  return result;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const body: QuoteEmailRequest = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerCompany,
      productTitle,
      productSku,
      quantity,
      message,
      language,
    } = body;

    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!customerName || !customerEmail || !productTitle || !productSku || !language) {
      console.error("Missing required fields in send-quote-email payload");
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const riyadhTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Riyadh" });
    const isAr = language === "ar";

    const adminHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <h2 style="color:#333;border-bottom:2px solid #d4a843;padding-bottom:10px;">New Inquiry</h2>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <tr><td style="padding:8px;font-weight:bold;color:#555;width:140px;">Customer Name</td><td style="padding:8px;">${customerName}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#555;">Email</td><td style="padding:8px;">${customerEmail}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Phone</td><td style="padding:8px;">${customerPhone || "N/A"}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#555;">Company</td><td style="padding:8px;">${customerCompany || "N/A"}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Product</td><td style="padding:8px;">${productTitle}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#555;">SKU</td><td style="padding:8px;">${productSku}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Quantity</td><td style="padding:8px;">${quantity ?? "N/A"}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#555;">Submitted</td><td style="padding:8px;">${riyadhTime} (Riyadh)</td></tr>
        </table>
        ${message ? `<div style="margin-top:16px;"><strong>Message:</strong><p style="background:#f5f5f5;padding:12px;border-radius:4px;">${message}</p></div>` : ""}
      </div>
    `;

    const customerHtml = isAr
      ? `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;" dir="rtl">
        <h2 style="color:#333;">شكراً لك، ${customerName}!</h2>
        <p style="color:#555;line-height:1.8;">لقد استلمنا طلبك وسنتواصل معك خلال 24 ساعة عمل.</p>
        <div style="background:#f9f9f9;padding:16px;border-radius:8px;margin:20px 0;">
          <h3 style="color:#333;margin-top:0;">ملخص الطلب</h3>
          <p style="margin:4px 0;color:#555;"><strong>المنتج:</strong> ${productTitle}</p>
          ${quantity ? `<p style="margin:4px 0;color:#555;"><strong>الكمية:</strong> ${quantity}</p>` : ""}
          ${message ? `<p style="margin:4px 0;color:#555;"><strong>الملاحظات:</strong> ${message}</p>` : ""}
        </div>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
        <p style="color:#888;font-size:13px;">للتواصل معنا: Hello@salada.sa | 050 016 5914</p>
      </div>
    `
      : `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <h2 style="color:#333;">Thank you, ${customerName}!</h2>
        <p style="color:#555;line-height:1.6;">We received your request and will get back to you within 24 business hours.</p>
        <div style="background:#f9f9f9;padding:16px;border-radius:8px;margin:20px 0;">
          <h3 style="color:#333;margin-top:0;">Request Summary</h3>
          <p style="margin:4px 0;color:#555;"><strong>Product:</strong> ${productTitle}</p>
          ${quantity ? `<p style="margin:4px 0;color:#555;"><strong>Quantity:</strong> ${quantity}</p>` : ""}
          ${message ? `<p style="margin:4px 0;color:#555;"><strong>Notes:</strong> ${message}</p>` : ""}
        </div>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
        <p style="color:#888;font-size:13px;">Contact us: Hello@salada.sa | 050 016 5914</p>
      </div>
    `;

    try {
      await Promise.all([
        sendResendEmail(resendApiKey, {
          from: DEFAULT_FROM,
          to: [ADMIN_TO],
          subject: `New Quote Request: ${productTitle} — ${customerName}`,
          html: adminHtml,
        }),
        sendResendEmail(resendApiKey, {
          from: DEFAULT_FROM,
          to: [customerEmail],
          subject: isAr ? "تأكيد الطلب — Salada" : "Request Confirmation — Salada",
          html: customerHtml,
        }),
      ]);
    } catch (emailError) {
      console.error("Email send failed:", emailError);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-quote-email:", error);
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
