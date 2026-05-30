function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatMXN(value) {
  return `$${Number(value || 0).toLocaleString("es-MX")} MXN`;
}

function renderItems(cart) {
  return cart.map((item) => {
    const quantity = Number(item.quantity || 1);
    const price = Number(item.price || 0);
    return `
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid #e8e1d8;">
          <strong style="font-size:15px;color:#111111;">${escapeHtml(item.name)}</strong><br>
          <span style="font-size:13px;color:#6b625a;">Marco: ${escapeHtml(item.frame || "Negro")} · Cantidad: ${quantity}</span>
        </td>
        <td align="right" style="padding:16px 0;border-bottom:1px solid #e8e1d8;font-size:15px;color:#111111;white-space:nowrap;">
          ${formatMXN(price * quantity)}
        </td>
      </tr>`;
  }).join("");
}

function baseEmail({ title, subtitle, order, payment, intro, storeView = false }) {
  const cart = Array.isArray(order.cart) ? order.cart : [];
  const total = Number(order.total || cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0));
  const date = new Date(order.createdAt || Date.now()).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f1eb;font-family:Arial,Helvetica,sans-serif;color:#111111;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4f1eb;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:680px;background:#fbfaf7;border:1px solid #ded6cd;border-radius:22px;overflow:hidden;">
          <tr>
            <td style="padding:34px 34px 26px 34px;background:#111111;color:#f4f1eb;">
              <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#d8c8b8;margin-bottom:18px;">FRAME POSTER</div>
              <h1 style="margin:0;font-size:30px;line-height:1.15;font-weight:700;">${escapeHtml(title)}</h1>
              <p style="margin:12px 0 0 0;font-size:15px;line-height:1.6;color:#d8c8b8;">${escapeHtml(subtitle)}</p>
            </td>
          </tr>

          <tr>
            <td style="padding:30px 34px 12px 34px;">
              <p style="margin:0 0 22px 0;font-size:16px;line-height:1.65;color:#2b2b2b;">${escapeHtml(intro)}</p>

              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border:1px solid #e8e1d8;border-radius:16px;padding:0;margin-bottom:24px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="font-size:13px;color:#6b625a;">Order number</td>
                        <td align="right" style="font-size:14px;color:#111111;font-weight:700;">${escapeHtml(order.orderId || "FRAME-ORDER")}</td>
                      </tr>
                      <tr>
                        <td style="padding-top:8px;font-size:13px;color:#6b625a;">Date</td>
                        <td align="right" style="padding-top:8px;font-size:14px;color:#111111;">${escapeHtml(date)}</td>
                      </tr>
                      <tr>
                        <td style="padding-top:8px;font-size:13px;color:#6b625a;">Customer</td>
                        <td align="right" style="padding-top:8px;font-size:14px;color:#111111;">${escapeHtml(order.customer?.name || "Cliente")}</td>
                      </tr>
                      ${storeView ? `<tr>
                        <td style="padding-top:8px;font-size:13px;color:#6b625a;">Email</td>
                        <td align="right" style="padding-top:8px;font-size:14px;color:#111111;">${escapeHtml(order.customer?.email || "")}</td>
                      </tr>` : ""}
                      <tr>
                        <td style="padding-top:8px;font-size:13px;color:#6b625a;">Payment ID</td>
                        <td align="right" style="padding-top:8px;font-size:14px;color:#111111;">${escapeHtml(payment.paymentId || "Pending")}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <h2 style="margin:0 0 6px 0;font-size:18px;">Order details</h2>
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:22px;">
                ${renderItems(cart)}
                <tr>
                  <td style="padding:16px 0 4px 0;font-size:14px;color:#6b625a;">Shipping</td>
                  <td align="right" style="padding:16px 0 4px 0;font-size:14px;color:#111111;">Free</td>
                </tr>
                <tr>
                  <td style="padding:10px 0 0 0;font-size:18px;font-weight:700;color:#111111;">Total paid</td>
                  <td align="right" style="padding:10px 0 0 0;font-size:20px;font-weight:700;color:#111111;">${formatMXN(total)}</td>
                </tr>
              </table>

              <div style="background:#f4f1eb;border-radius:16px;padding:18px 20px;margin:24px 0;">
                <p style="margin:0;font-size:14px;line-height:1.6;color:#2b2b2b;">
                  ${storeView
                    ? "This notification was generated automatically after a Mercado Pago checkout confirmation."
                    : "We will contact you soon with the next steps for preparation and delivery of your poster."}
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 34px;background:#ffffff;border-top:1px solid #e8e1d8;">
              <p style="margin:0;font-size:13px;line-height:1.6;color:#6b625a;">FRAME POSTER · Editorial posters for spaces that feel yours.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RECEIPT_FROM || "FRAME POSTER <onboarding@resend.dev>";

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ from, to, subject, html })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Resend email error");
  }

  return data;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { order, payment } = req.body || {};
    const storeEmail = process.env.STORE_EMAIL;

    if (!order?.customer?.email || !Array.isArray(order.cart) || order.cart.length === 0) {
      return res.status(400).json({ error: "Missing order data" });
    }

    if (!storeEmail) {
      return res.status(500).json({ error: "Missing STORE_EMAIL" });
    }

    const customerHtml = baseEmail({
      title: "Thank you for your purchase",
      subtitle: "Your FRAME POSTER order was received successfully.",
      intro: "Your payment was processed through Mercado Pago. Here is your purchase receipt.",
      order,
      payment: payment || {},
      storeView: false
    });

    const storeHtml = baseEmail({
      title: "New order received",
      subtitle: "A customer completed a purchase in FRAME POSTER.",
      intro: "A new order was confirmed. Review the purchase details below to prepare the order.",
      order,
      payment: payment || {},
      storeView: true
    });

    await sendEmail({
      to: order.customer.email,
      subject: `Your FRAME POSTER order is confirmed · ${order.orderId || "Order"}`,
      html: customerHtml
    });

    await sendEmail({
      to: storeEmail,
      subject: `New FRAME POSTER order · ${order.orderId || "Order"}`,
      html: storeHtml
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: "Receipt email error", message: error.message });
  }
}
