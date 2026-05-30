# FRAME POSTER - Preview con paredes y marcos CSS

Esta carpeta contiene la versión final lista para GitHub y Vercel.

## Incluye

- `index.html`
- `styles.css`
- `script.js`
- `terminos.html`
- `privacidad.html`
- `README.md`
- `assets/`
  - 20 imágenes de posters
  - `frame_poster_qr.png`
  - paredes de referencia:
    - `wall_blue.png`
    - `wall_white.png`
    - `wall_brown.png`
    - `wall_black.png`

## Cambios principales

- Ya no se usan imágenes PNG de marcos.
- Los marcos son CSS/HTML con esquinas rectas, grosor, profundidad, sombra y margen tipo paspartú.
- Marcos disponibles: Café, Negro y Beige.
- Paredes disponibles: Azul, Blanco, Café y Negro.
- El preview muestra el poster dentro del marco sobre una pared real.
- Las especificaciones usan: 48 cm x 60 cm, Impresión premium y Marco incluido.
- El carrito guarda el marco seleccionado.

## Instrucciones

1. Sube todo a GitHub.
2. Reemplaza archivos anteriores.
3. Haz commit.
4. Espera el despliegue automático en Vercel.
5. Prueba carrito.
6. Prueba selector de marco.
7. Prueba selector de pared.
8. Prueba preview.
9. Prueba WhatsApp, Instagram y QR.
10. Prueba términos y privacidad.

## Receipt Email Setup

This version includes a post-purchase receipt flow:

- The customer enters name and email before checkout.
- After a successful Mercado Pago payment, the success page calls `/api/send-receipt`.
- The customer receives a styled purchase receipt.
- The store owner receives a styled new-order notification.

Required Vercel environment variables:

```txt
MP_ACCESS_TOKEN=your_mercado_pago_production_access_token
RESEND_API_KEY=your_resend_api_key
STORE_EMAIL=your_store_email@example.com
RECEIPT_FROM=FRAME POSTER <onboarding@resend.dev>
```

For a production sender, replace `RECEIPT_FROM` with a verified domain sender in Resend.
