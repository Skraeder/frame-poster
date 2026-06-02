import nodemailer from "nodemailer";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatMXN(value) {
  return `$${Number(value || 0).toLocaleString("es-MX")} MXN`;
}

function renderItems(cart) {
  return cart.map((item) => {
    const quantity = Number(item.quantity || 1);
    const price = Number(item.price || 0);
    const subtotal = price * quantity;
    const category = item.category || "Poster";
    return `
      <tr>
        <td style="padding:18px 0;border-bottom:1px solid #e8e1d8;">
          <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#8f1f19;font-weight:700;margin-bottom:8px;">Poster comprado</div>
          <strong style="display:block;font-size:18px;line-height:1.35;color:#111111;margin-bottom:8px;">${escapeHtml(item.name)}</strong>
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:8px;">
            <tr>
              <td style="font-size:13px;color:#6b625a;padding:3px 0;">Colección</td>
              <td align="right" style="font-size:13px;color:#111111;padding:3px 0;font-weight:600;">${escapeHtml(category)}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:#6b625a;padding:3px 0;">Marco seleccionado</td>
              <td align="right" style="font-size:13px;color:#111111;padding:3px 0;font-weight:600;">${escapeHtml(item.frame || "Negro")}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:#6b625a;padding:3px 0;">Cantidad</td>
              <td align="right" style="font-size:13px;color:#111111;padding:3px 0;font-weight:600;">${quantity}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:#6b625a;padding:3px 0;">Precio unitario</td>
              <td align="right" style="font-size:13px;color:#111111;padding:3px 0;font-weight:600;">${formatMXN(price)}</td>
            </tr>
          </table>
        </td>
        <td align="right" style="padding:18px 0;border-bottom:1px solid #e8e1d8;font-size:17px;color:#111111;font-weight:700;white-space:nowrap;vertical-align:top;">
          ${formatMXN(subtotal)}
        </td>
      </tr>`;
  }).join("");
}
function renderShipping(order) {
  const shipping = order.shipping || order.customer || {};
  const address = [shipping.address, shipping.city, shipping.state, shipping.zip].filter(Boolean).join(", ");
  const phone = shipping.phone || order.customer?.phone || "";

  return `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border:1px solid #e8e1d8;border-radius:16px;padding:0;margin:20px 0 24px;">
      <tr>
        <td style="padding:18px 20px;">
          <h3 style="margin:0 0 10px 0;font-size:16px;color:#111111;">Datos de entrega</h3>
          <p style="margin:0;font-size:14px;line-height:1.65;color:#2b2b2b;">${escapeHtml(address || "Dirección no registrada")}</p>
          ${phone ? `<p style="margin:8px 0 0 0;font-size:14px;line-height:1.65;color:#2b2b2b;">Teléfono: ${escapeHtml(phone)}</p>` : ""}
        </td>
      </tr>
    </table>`;
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
                        <td style="font-size:13px;color:#6b625a;">Número de pedido</td>
                        <td align="right" style="font-size:14px;color:#111111;font-weight:700;">${escapeHtml(order.orderId || "FRAME-ORDER")}</td>
                      </tr>
                      <tr>
                        <td style="padding-top:8px;font-size:13px;color:#6b625a;">Fecha</td>
                        <td align="right" style="padding-top:8px;font-size:14px;color:#111111;">${escapeHtml(date)}</td>
                      </tr>
                      <tr>
                        <td style="padding-top:8px;font-size:13px;color:#6b625a;">Cliente</td>
                        <td align="right" style="padding-top:8px;font-size:14px;color:#111111;">${escapeHtml(order.customer?.name || "Cliente")}</td>
                      </tr>
                      ${storeView ? `<tr>
                        <td style="padding-top:8px;font-size:13px;color:#6b625a;">Correo</td>
                        <td align="right" style="padding-top:8px;font-size:14px;color:#111111;">${escapeHtml(order.customer?.email || "")}</td>
                      </tr>` : ""}
                      <tr>
                        <td style="padding-top:8px;font-size:13px;color:#6b625a;">ID de pago</td>
                        <td align="right" style="padding-top:8px;font-size:14px;color:#111111;">${escapeHtml(payment.paymentId || "Pendiente")}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${renderShipping(order)}

              <h2 style="margin:0 0 6px 0;font-size:18px;">Detalle del pedido</h2>
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:22px;">
                ${renderItems(cart)}
                <tr>
                  <td style="padding:16px 0 4px 0;font-size:14px;color:#6b625a;">Envío</td>
                  <td align="right" style="padding:16px 0 4px 0;font-size:14px;color:#111111;">Gratis</td>
                </tr>
                <tr>
                  <td style="padding:10px 0 0 0;font-size:18px;font-weight:700;color:#111111;">Total pagado</td>
                  <td align="right" style="padding:10px 0 0 0;font-size:20px;font-weight:700;color:#111111;">${formatMXN(total)}</td>
                </tr>
              </table>

              <div style="background:#f4f1eb;border-radius:16px;padding:18px 20px;margin:24px 0;">
                <p style="margin:0;font-size:14px;line-height:1.6;color:#2b2b2b;">
                  ${storeView
                    ? "Esta notificación fue generada automáticamente después de la confirmación de Mercado Pago. Prepara el pedido y confirma la entrega con el cliente."
                    : "Te contactaremos pronto para dar seguimiento a la preparación y entrega de tu poster."}
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 34px;background:#ffffff;border-top:1px solid #e8e1d8;">
              <p style="margin:0;font-size:13px;line-height:1.6;color:#6b625a;">FRAME POSTER · Posters editoriales para espacios con intención.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function sendEmail({ to, subject, html, replyTo }) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPassword = String(process.env.GMAIL_APP_PASSWORD || "").replace(/\s/g, "");

  if (!gmailUser || !gmailPassword) {
    throw new Error("Missing GMAIL_USER or GMAIL_APP_PASSWORD");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: gmailUser,
      pass: gmailPassword
    }
  });

  return transporter.sendMail({
    from: `FRAME POSTER <${gmailUser}>`,
    to,
    subject,
    html,
    ...(replyTo ? { replyTo } : {})
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { order, payment, mode = "confirmed" } = req.body || {};
    const storeEmail = process.env.STORE_EMAIL || process.env.GMAIL_USER;

    if (!order?.customer?.email || !/^\S+@\S+\.\S+$/.test(order.customer.email) || !Array.isArray(order.cart) || order.cart.length === 0) {
      return res.status(400).json({ error: "Missing or invalid order data" });
    }

    if (!storeEmail) {
      return res.status(500).json({ error: "Missing STORE_EMAIL" });
    }

    const isBackup = mode === "precheckout";

    const customerHtml = baseEmail({
      title: "Gracias por tu compra",
      subtitle: "Tu pedido de FRAME POSTER fue recibido correctamente.",
      intro: "Tu pago fue procesado mediante Mercado Pago. Aquí tienes el recibo y el resumen de tu compra.",
      order,
      payment: payment || {},
      storeView: false
    });

    const storeHtml = baseEmail({
      title: isBackup ? "Pedido iniciado" : "Nueva venta recibida",
      subtitle: isBackup ? "Un cliente inició el pago en FRAME POSTER." : "Un cliente completó una compra en FRAME POSTER.",
      intro: isBackup
        ? "Este correo es un respaldo del pedido antes de Mercado Pago. Úsalo para ver poster, dirección y contacto; confirma el cobro con el correo de Mercado Pago."
        : "Se confirmó una nueva orden. Revisa los detalles para preparar el pedido y coordinar la entrega.",
      order,
      payment: payment || {},
      storeView: true
    });

    if (isBackup) {
      const storeResult = await sendEmail({
        to: storeEmail,
        subject: `Pedido iniciado FRAME POSTER · ${order.orderId || "Orden"}`,
        html: storeHtml,
        replyTo: order.customer.email
      });

      return res.status(200).json({
        ok: true,
        mode,
        storeSent: true,
        customerSent: false,
        storeMessageId: storeResult.messageId,
        customerMessageId: null
      });
    }

    const [storeResult, customerResult] = await Promise.allSettled([
      sendEmail({
        to: storeEmail,
        subject: `Nueva venta FRAME POSTER · ${order.orderId || "Orden"}`,
        html: storeHtml,
        replyTo: order.customer.email
      }),
      sendEmail({
        to: order.customer.email,
        subject: `Tu pedido FRAME POSTER está confirmado · ${order.orderId || "Orden"}`,
        html: customerHtml
      })
    ]);

    const storeSent = storeResult.status === "fulfilled";
    const customerSent = customerResult.status === "fulfilled";

    if (!storeSent && !customerSent) {
      const firstError = storeResult.reason || customerResult.reason;
      return res.status(500).json({
        ok: false,
        error: "Receipt email error",
        message: firstError?.message || "No emails could be sent"
      });
    }

    return res.status(200).json({
      ok: true,
      storeSent,
      customerSent,
      storeMessageId: storeSent ? storeResult.value.messageId : null,
      customerMessageId: customerSent ? customerResult.value.messageId : null,
      warnings: {
        store: storeSent ? null : (storeResult.reason?.message || "Store email failed"),
        customer: customerSent ? null : (customerResult.reason?.message || "Customer email failed")
      }
    });
  } catch (error) {
    return res.status(500).json({ error: "Receipt email error", message: error.message });
  }
}
