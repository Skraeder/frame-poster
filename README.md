# FRAME POSTER

FRAME POSTER is an editorial-style eCommerce project focused on poster collections, visual storytelling, and a clean online shopping experience.

The website works as a digital gallery where users can explore poster collections, preview products with different frame and wall combinations, add items to a cart, and complete payment through Mercado Pago Checkout Pro.

## Main Features

- Editorial-style landing page
- Curated product catalog
- Product filtering by category
- Poster preview with frame and wall options
- Shopping cart with quantities and totals
- Mercado Pago Checkout Pro integration
- Customer contact and shipping information before checkout
- Styled purchase receipt for the customer
- Styled new-order notification for the store owner
- Gmail SMTP email sending through Vercel Functions
- Success, pending, and failure payment pages
- Terms and privacy pages
- Responsive layout for desktop and mobile

## Tech Stack

- HTML
- CSS
- JavaScript
- Vercel Serverless Functions
- Mercado Pago Checkout Pro
- Gmail SMTP

## Required Vercel Environment Variables

```txt
MP_ACCESS_TOKEN=your_mercado_pago_production_access_token
GMAIL_USER=your_gmail_account@gmail.com
GMAIL_APP_PASSWORD=your_google_app_password
STORE_EMAIL=your_store_email@gmail.com
```

## Project Status

This version is ready to be uploaded to GitHub and deployed through Vercel. It includes two temporary $25 MXN test products so the payment and receipt flow can be validated before removing them from the final public catalog.

## Notes

The automatic receipt is triggered from the payment success page after Mercado Pago redirects the customer back to the store. For a production business, the next improvement would be a Mercado Pago webhook so receipts are sent even if the customer closes the browser after paying.
