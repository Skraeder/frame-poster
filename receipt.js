const receiptStatus = document.getElementById("receiptStatus");

function setReceiptStatus(message) {
  if (receiptStatus) receiptStatus.textContent = message;
}

function decodeOrderToken(token) {
  try {
    if (!token) return null;
    const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, "=");
    const json = decodeURIComponent(escape(window.atob(padded)));
    return JSON.parse(json);
  } catch (error) {
    console.error("Order token error:", error);
    return null;
  }
}

async function sendReceiptAfterPayment() {
  const params = new URLSearchParams(window.location.search);
  const orderFromToken = decodeOrderToken(params.get("order_token"));
  const orderRaw = localStorage.getItem("framePosterPendingOrder") || sessionStorage.getItem("framePosterPendingOrder");

  let order = orderFromToken;

  if (!order && orderRaw) {
    try {
      order = JSON.parse(orderRaw);
    } catch (error) {
      setReceiptStatus("Tu pago fue aprobado, pero no se pudo leer el detalle del pedido.");
      return;
    }
  }

  if (!order) {
    setReceiptStatus("Tu pago fue aprobado. No encontramos el detalle del pedido para enviar el recibo automático.");
    return;
  }

  const paymentId = params.get("payment_id") || params.get("collection_id") || "";
  const status = params.get("status") || params.get("collection_status") || "approved";
  const receiptKey = `framePosterReceiptSent_${paymentId || order.orderId}`;

  if (localStorage.getItem(receiptKey)) {
    setReceiptStatus("Tu recibo ya fue enviado al correo registrado.");
    return;
  }

  try {
    const response = await fetch("/api/send-receipt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order,
        mode: "confirmed",
        payment: {
          paymentId,
          status,
          source: "Mercado Pago Checkout Pro"
        }
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Receipt error:", data);
      setReceiptStatus(`Tu pago fue aprobado, pero el recibo no pudo enviarse. Error: ${data.message || data.error || "revisa las variables de Gmail en Vercel"}.`);
      return;
    }

    localStorage.setItem(receiptKey, "true");
    localStorage.removeItem("framePosterPendingOrder");
    sessionStorage.removeItem("framePosterPendingOrder");

    if (data.customerSent && data.storeSent) {
      setReceiptStatus("Listo. Enviamos el recibo al correo registrado y una copia a FRAME POSTER.");
    } else if (data.storeSent && !data.customerSent) {
      setReceiptStatus("Listo. FRAME POSTER recibió el detalle de la venta. El correo del cliente no pudo enviarse; revisa que el correo esté bien escrito.");
    } else if (data.customerSent && !data.storeSent) {
      setReceiptStatus("Listo. El cliente recibió su recibo, pero no pudimos enviar la copia interna a FRAME POSTER.");
    } else {
      setReceiptStatus("Tu pago fue aprobado, pero no se pudo confirmar el envío de correos.");
    }
  } catch (error) {
    console.error("Receipt request error:", error);
    setReceiptStatus("Tu pago fue aprobado. No pudimos conectar con el sistema de recibos en este momento.");
  }
}

sendReceiptAfterPayment();
