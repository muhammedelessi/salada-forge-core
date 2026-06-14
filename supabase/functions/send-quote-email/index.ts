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

interface QuoteProduct {
  title: string;
  sku?: string;
  quantity?: number;
}

interface QuoteEmailRequest {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCompany?: string;
  productTitle: string;
  productSku: string;
  quantity?: number;
  /** Structured list of selected products (preferred over productTitle when present). */
  items?: QuoteProduct[];
  /** Custom product the customer typed when their product wasn't listed. */
  customProduct?: { name: string; description?: string };
  message?: string;
  language: "en" | "ar";
}

/** Minimal HTML escaping for interpolated, user-supplied values. */
function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Renders the requested products as a clean, numbered table plus an optional
 * "other product" note. Returns "" when there is nothing structured to show.
 */
function productsBlockHtml(
  items: QuoteProduct[] | undefined,
  customProduct: { name: string; description?: string } | undefined,
  lang: "en" | "ar",
): string {
  const list = (items || []).filter((it) => it && it.title);
  if (list.length === 0 && !customProduct?.name) return "";

  const isAr = lang === "ar";
  const align = isAr ? "right" : "left";
  const heading = isAr ? `المنتجات المطلوبة (${list.length})` : `Requested Products (${list.length})`;
  const colProduct = isAr ? "المنتج" : "Product";
  const colSku = isAr ? "الرمز" : "SKU";
  const colQty = isAr ? "الكمية" : "Qty";
  const hasQty = list.some((it) => it.quantity != null);

  const rows = list
    .map(
      (it, i) => `
      <tr style="background:${i % 2 ? "#faf7ec" : "#ffffff"};">
        <td style="padding:9px 8px;border:1px solid #ece6d6;text-align:center;color:#999;width:34px;">${i + 1}</td>
        <td style="padding:9px 8px;border:1px solid #ece6d6;font-weight:600;color:#333;">${esc(it.title)}</td>
        <td style="padding:9px 8px;border:1px solid #ece6d6;color:#777;white-space:nowrap;">${esc(it.sku || "—")}</td>
        ${hasQty ? `<td style="padding:9px 8px;border:1px solid #ece6d6;color:#555;text-align:center;">${it.quantity ?? "—"}</td>` : ""}
      </tr>`,
    )
    .join("");

  const table = list.length
    ? `
    <table style="width:100%;border-collapse:collapse;margin:8px 0 4px;font-size:14px;" dir="${isAr ? "rtl" : "ltr"}">
      <thead>
        <tr style="background:#d4a843;color:#ffffff;">
          <th style="padding:9px 8px;border:1px solid #d4a843;text-align:center;width:34px;">#</th>
          <th style="padding:9px 8px;border:1px solid #d4a843;text-align:${align};">${colProduct}</th>
          <th style="padding:9px 8px;border:1px solid #d4a843;text-align:${align};width:130px;">${colSku}</th>
          ${hasQty ? `<th style="padding:9px 8px;border:1px solid #d4a843;text-align:center;width:70px;">${colQty}</th>` : ""}
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`
    : "";

  const custom = customProduct?.name
    ? `
    <div style="margin:10px 0 4px;padding:10px 12px;background:#fff8e7;border:1px solid #f0e0b8;border-radius:6px;" dir="${isAr ? "rtl" : "ltr"}">
      <strong style="color:#9a7b1f;">${isAr ? "منتج آخر (غير مدرج في القائمة):" : "Other product (not listed):"}</strong>
      <div style="color:#555;margin-top:4px;">${esc(customProduct.name)}</div>
      ${customProduct.description ? `<div style="color:#777;font-size:13px;margin-top:4px;">${esc(customProduct.description)}</div>` : ""}
    </div>`
    : "";

  return `<h3 style="color:#333;margin:22px 0 6px;">${heading}</h3>${table}${custom}`;
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
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    const body: QuoteEmailRequest = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerCompany,
      productTitle,
      productSku,
      quantity,
      items,
      customProduct,
      message,
      language,
    } = body;

    if (!resendApiKey || !lovableApiKey) {
      console.error("Email keys are not configured", {
        hasResend: Boolean(resendApiKey),
        hasLovable: Boolean(lovableApiKey),
      });
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

    // When a structured product list is provided, render it as a table instead
    // of cramming every product into a single comma-joined line.
    const hasStructuredProducts = Boolean((items && items.length) || customProduct?.name);
    const adminProductsBlock = productsBlockHtml(items, customProduct, "en");
    const customerProductsBlock = productsBlockHtml(items, customProduct, language);

    const adminHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <h2 style="color:#333;border-bottom:2px solid #d4a843;padding-bottom:10px;">New Inquiry</h2>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <tr><td style="padding:8px;font-weight:bold;color:#555;width:140px;">Customer Name</td><td style="padding:8px;">${esc(customerName)}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#555;">Email</td><td style="padding:8px;">${esc(customerEmail)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Phone</td><td style="padding:8px;">${esc(customerPhone || "N/A")}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#555;">Company</td><td style="padding:8px;">${esc(customerCompany || "N/A")}</td></tr>
          ${
            hasStructuredProducts
              ? ""
              : `<tr><td style="padding:8px;font-weight:bold;color:#555;">Product</td><td style="padding:8px;">${esc(productTitle)}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#555;">SKU</td><td style="padding:8px;">${esc(productSku)}</td></tr>`
          }
          ${quantity != null ? `<tr><td style="padding:8px;font-weight:bold;color:#555;">Quantity</td><td style="padding:8px;">${quantity}</td></tr>` : ""}
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#555;">Submitted</td><td style="padding:8px;">${riyadhTime} (Riyadh)</td></tr>
        </table>
        ${adminProductsBlock}
        ${message ? `<div style="margin-top:16px;"><strong>Message:</strong><p style="background:#f5f5f5;padding:12px;border-radius:4px;white-space:pre-wrap;">${esc(message)}</p></div>` : ""}
      </div>
    `;

    const customerHtml = isAr
      ? `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;" dir="rtl">
        <h2 style="color:#333;">شكراً لك، ${esc(customerName)}!</h2>
        <p style="color:#555;line-height:1.8;">لقد استلمنا طلبك وسنتواصل معك خلال 24 ساعة عمل.</p>
        <div style="background:#f9f9f9;padding:16px;border-radius:8px;margin:20px 0;">
          <h3 style="color:#333;margin-top:0;">ملخص الطلب</h3>
          ${
            hasStructuredProducts
              ? customerProductsBlock
              : `<p style="margin:4px 0;color:#555;"><strong>المنتج:</strong> ${esc(productTitle)}</p>`
          }
          ${quantity ? `<p style="margin:4px 0;color:#555;"><strong>الكمية:</strong> ${quantity}</p>` : ""}
          ${message ? `<p style="margin:8px 0 4px;color:#555;"><strong>الملاحظات:</strong></p><p style="margin:0;color:#555;white-space:pre-wrap;">${esc(message)}</p>` : ""}
        </div>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
        <p style="color:#888;font-size:13px;">للتواصل معنا: Hello@salada.sa | 050 016 5914</p>
      </div>
    `
      : `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <h2 style="color:#333;">Thank you, ${esc(customerName)}!</h2>
        <p style="color:#555;line-height:1.6;">We received your request and will get back to you within 24 business hours.</p>
        <div style="background:#f9f9f9;padding:16px;border-radius:8px;margin:20px 0;">
          <h3 style="color:#333;margin-top:0;">Request Summary</h3>
          ${
            hasStructuredProducts
              ? customerProductsBlock
              : `<p style="margin:4px 0;color:#555;"><strong>Product:</strong> ${esc(productTitle)}</p>`
          }
          ${quantity ? `<p style="margin:4px 0;color:#555;"><strong>Quantity:</strong> ${quantity}</p>` : ""}
          ${message ? `<p style="margin:8px 0 4px;color:#555;"><strong>Notes:</strong></p><p style="margin:0;color:#555;white-space:pre-wrap;">${esc(message)}</p>` : ""}
        </div>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
        <p style="color:#888;font-size:13px;">Contact us: Hello@salada.sa | 050 016 5914</p>
      </div>
    `;

    try {
      await Promise.all([
        sendResendEmail(lovableApiKey, resendApiKey, {
          from: DEFAULT_FROM,
          to: [ADMIN_TO],
          subject: `New Quote Request: ${productTitle} — ${customerName}`,
          html: adminHtml,
        }),
        sendResendEmail(lovableApiKey, resendApiKey, {
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
