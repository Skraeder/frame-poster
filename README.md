# FRAME POSTER Marketplace

Sitio web tipo marketplace desarrollado con HTML, CSS y JavaScript puro, preparado para desplegarse en Vercel e integrar Shopify Buy Button.

## Archivos incluidos

- `index.html`
- `styles.css`
- `script.js`

## Cómo abrir localmente

1. Descarga la carpeta.
2. Abre `index.html` en tu navegador.
3. También puedes usar la extensión Live Server en VS Code para verlo con recarga automática.

## Dónde pegar Shopify Buy Button

En `index.html`, busca este comentario dentro de cada producto:

```html
<!-- PEGAR AQUÍ EL SHOPIFY BUY BUTTON DEL PRODUCTO -->
```

Reemplaza el botón temporal:

```html
<button class="buy-button" type="button">Agregar al carrito</button>
```

por el embed real que te da Shopify.

## Cómo desplegar en Vercel

1. Crea un repositorio en GitHub.
2. Sube estos 3 archivos al repositorio.
3. Entra a Vercel.
4. Da clic en Add New Project.
5. Conecta tu repositorio.
6. Framework Preset: Other.
7. Build Command: déjalo vacío.
8. Output Directory: déjalo vacío.
9. Da clic en Deploy.
