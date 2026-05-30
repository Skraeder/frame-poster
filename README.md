# FRAME POSTER

FRAME POSTER is an editorial-style eCommerce project focused on curated poster collections, visual storytelling, and a clean online shopping experience.

The website works as a digital gallery where users can explore poster collections, preview products with different frame and wall combinations, add items to a cart, and complete payment through Mercado Pago Checkout Pro.

## Main Features

- Editorial-style landing page
- Curated product catalog
- Product filtering by category
- Poster preview with frame and wall options
- Shopping cart with quantities and totals
- Mercado Pago Checkout Pro integration
- Customer name and email capture before checkout
- Styled purchase receipt for the customer
- Styled new-order notification for the store owner
- Success, pending, and failure payment pages
- Terms and privacy pages
- Responsive layout for desktop and mobile

## Tech Stack

- HTML
- CSS
- JavaScript
- Vercel Serverless Functions
- Mercado Pago Checkout Pro
- Resend Email API

## Required Vercel Environment Variables

```txt
MP_ACCESS_TOKEN=your_mercado_pago_production_access_token
RESEND_API_KEY=your_resend_api_key
STORE_EMAIL=your_store_email@example.com
RECEIPT_FROM=FRAME POSTER <onboarding@resend.dev>
```

## Project Status

This version is ready to be uploaded to GitHub and deployed through Vercel. Test products were removed from the public catalog, so the store now shows only the final FRAME POSTER catalog.

## Notes

For production email sending, use a verified sender/domain in Resend instead of the default onboarding sender.
