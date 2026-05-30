export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const accessToken = process.env.MP_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(500).json({ error: "Missing Mercado Pago access token" });
    }

    const { cart } = req.body || {};

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const items = cart.map((item) => {
      const quantity = Number(item.quantity || 1);
      const unitPrice = Number(item.price || 0);

      if (!item.name || quantity <= 0 || unitPrice <= 0) {
        throw new Error("Invalid cart item");
      }

      return {
        title: `${item.name}${item.frame ? ` - Marco ${item.frame}` : ""}`,
        quantity,
        currency_id: "MXN",
        unit_price: unitPrice
      };
    });

    const origin = req.headers.origin || `https://${req.headers.host}`;

    const preference = {
      items,
      back_urls: {
        success: `${origin}/success.html`,
        failure: `${origin}/failure.html`,
        pending: `${origin}/pending.html`
      },
      auto_return: "approved",
      statement_descriptor: "FRAME POSTER",
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12
      }
    };

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(preference)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Mercado Pago preference error",
        details: data
      });
    }

    const isTestToken = accessToken.startsWith("TEST-");
    const checkoutUrl = isTestToken
      ? data.sandbox_init_point || data.init_point
      : data.init_point || data.sandbox_init_point;

    return res.status(200).json({ checkoutUrl });
  } catch (error) {
    return res.status(500).json({
      error: "Error creating Mercado Pago preference",
      message: error.message
    });
  }
}
