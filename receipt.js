const receiptStatus = document.getElementById("receiptStatus");

function setReceiptStatus(message) {
  if (receiptStatus) receiptStatus.textContent = message;
}

async function sendReceiptAfterPayment() {
  const orderRaw = localStorage.getItem("framePosterPendingOrder");

  if (!orderRaw) {
    setReceiptStatus("Tu pago fue aprobado. No encontramos el detalle local del pedido para enviar el recibo automático.");
    return;
  }

  let order;
  try {
    order = JSON.parse(orderRaw);
  } catch (error) {
    setReceiptStatus("Tu pago fue aprobado, pero no se pudo leer el detalle del pedido.");
    return;
  }

  const params = new URLSearchParams(window.location.search);
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
      setReceiptStatus("Tu pago fue aprobado. El recibo automático todavía no está configurado por completo.");
      return;
    }

    localStorage.setItem(receiptKey, "true");
    localStorage.removeItem("framePosterPendingOrder");
    setReceiptStatus("Listo. Enviamos el recibo al correo registrado y una copia a FRAME POSTER.");
  } catch (error) {
    console.error("Receipt request error:", error);
    setReceiptStatus("Tu pago fue aprobado. No pudimos enviar el recibo automático en este momento.");
  }
}

sendReceiptAfterPayment();
