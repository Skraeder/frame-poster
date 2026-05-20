const mobileMenuButton = document.getElementById("mobileMenuButton");
const navMenu = document.getElementById("navMenu");
const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");
const sellerForm = document.getElementById("sellerForm");
const quoteForm = document.getElementById("quoteForm");
const toast = document.getElementById("toast");
const categoryLinks = document.querySelectorAll("[data-filter-link]");
const buyButtons = document.querySelectorAll(".buy-button");
const previewButtons = document.querySelectorAll(".preview-button");
const catalogStatus = document.getElementById("catalogStatus");
const cookieBanner = document.getElementById("cookieBanner");
const acceptCookies = document.getElementById("acceptCookies");

const cartOpenButton = document.getElementById("cartOpenButton");
const cartCloseButton = document.getElementById("cartCloseButton");
const continueShoppingButton = document.getElementById("continueShoppingButton");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");

const frameOptions = document.querySelectorAll(".frame-option");
const previewModal = document.getElementById("previewModal");
const previewCloseButton = document.getElementById("previewCloseButton");
const previewWall = document.getElementById("previewWall");
const mockupFrame = document.getElementById("mockupFrame");
const previewImage = document.getElementById("previewImage");
const previewTitle = document.getElementById("previewTitle");
const previewPrice = document.getElementById("previewPrice");
const previewFrameLabel = document.getElementById("previewFrameLabel");
const previewWallLabel = document.getElementById("previewWallLabel");
const previewAddButton = document.getElementById("previewAddButton");
const previewFrameButtons = document.querySelectorAll(".preview-frame-btn");
const previewWallButtons = document.querySelectorAll(".preview-wall-btn");

let selectedFrame = { name: "Negro", className: "frame-negro" };
let selectedWall = { name: "Azul", className: "wall-azul" };
let cart = [];
let currentPreviewProduct = null;

function trackEvent(eventName) { console.log("Evento:", eventName); }
function formatMXN(value) { return `$${Number(value).toLocaleString("es-MX")} MXN`; }
function showToast(message) { if (!toast) return; toast.textContent = message; toast.classList.add("show"); window.setTimeout(() => toast.classList.remove("show"), 2600); }
function closeMobileMenu() { if (!navMenu || !mobileMenuButton) return; navMenu.classList.remove("is-open"); document.body.classList.remove("menu-open"); mobileMenuButton.setAttribute("aria-expanded", "false"); }
function updateCatalogStatus(category, count) { if (!catalogStatus) return; catalogStatus.textContent = category === "Todos" ? `Mostrando todos los posters disponibles (${count}).` : `Mostrando ${count} posters de la colección: ${category}.`; }
function filterProducts(category) { let visibleCount = 0; productCards.forEach((card) => { const shouldShow = category === "Todos" || card.dataset.category === category; card.classList.toggle("is-hidden", !shouldShow); if (shouldShow) visibleCount += 1; }); filterButtons.forEach((button) => button.classList.toggle("active", button.dataset.filter === category)); updateCatalogStatus(category, visibleCount); trackEvent(`filtro:${category}`); }
function getProductFromCard(card) { return { name: card.dataset.name, price: Number(card.dataset.price), image: card.dataset.image, frame: selectedFrame.name, frameClass: selectedFrame.className }; }
function updateCartButton() { const count = cart.reduce((sum, item) => sum + item.quantity, 0); if (cartOpenButton) cartOpenButton.textContent = `Carrito (${count})`; }
function cartSubtotalValue() { return cart.reduce((sum, item) => sum + item.price * item.quantity, 0); }
function renderCart() { updateCartButton(); if (!cartItems || !cartSubtotal || !cartTotal) return; if (cart.length === 0) { cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío. Agrega un poster para verlo aquí.</p>'; } else { cartItems.innerHTML = cart.map((item) => `\n      <article class="cart-item" data-key="${item.key}">\n        <img src="${item.image}" alt="${item.name}">\n        <div>\n          <h3>${item.name}</h3>\n          <p>Marco: ${item.frame}</p>\n          <p>Precio unitario: ${formatMXN(item.price)}</p>\n          <p>Subtotal: ${formatMXN(item.price * item.quantity)}</p>\n          <div class="cart-row-actions">\n            <div class="qty-control">\n              <button class="qty-btn" type="button" data-action="decrease" data-key="${item.key}">−</button>\n              <strong>${item.quantity}</strong>\n              <button class="qty-btn" type="button" data-action="increase" data-key="${item.key}">+</button>\n            </div>\n            <button class="cart-remove" type="button" data-action="remove" data-key="${item.key}">Eliminar</button>\n          </div>\n        </div>\n      </article>`).join(""); } const subtotal = cartSubtotalValue(); cartSubtotal.textContent = formatMXN(subtotal); cartTotal.textContent = formatMXN(subtotal); }
function addToCart(product) { const key = `${product.name}__${product.frame}`; const existing = cart.find((item) => item.key === key); if (existing) { existing.quantity += 1; } else { cart.push({ ...product, key, quantity: 1 }); } renderCart(); openCart(); showToast(`${product.name} agregado con marco ${product.frame}.`); trackEvent(`carrito_agregar:${product.name}:${product.frame}`); }
function openCart() { document.body.classList.add("cart-open"); if (cartDrawer) cartDrawer.setAttribute("aria-hidden", "false"); }
function closeCart() { document.body.classList.remove("cart-open"); if (cartDrawer) cartDrawer.setAttribute("aria-hidden", "true"); }
function updatePreviewVisual() { if (mockupFrame) { mockupFrame.classList.remove("frame-cafe", "frame-negro", "frame-beige"); mockupFrame.classList.add(selectedFrame.className); } if (previewWall) { previewWall.classList.remove("wall-azul", "wall-blanco", "wall-cafe", "wall-negro"); previewWall.classList.add(selectedWall.className); } if (previewFrameLabel) previewFrameLabel.textContent = `Marco: ${selectedFrame.name}`; if (previewWallLabel) previewWallLabel.textContent = `Pared: ${selectedWall.name}`; frameOptions.forEach((button) => button.classList.toggle("selected", button.dataset.frame === selectedFrame.name)); previewFrameButtons.forEach((button) => button.classList.toggle("selected", button.dataset.frame === selectedFrame.name)); previewWallButtons.forEach((button) => button.classList.toggle("selected", button.dataset.wall === selectedWall.name)); }
function openPreview(product) { currentPreviewProduct = product; if (previewImage) { previewImage.src = product.image; previewImage.alt = product.name; } if (previewTitle) previewTitle.textContent = product.name; if (previewPrice) previewPrice.textContent = formatMXN(product.price); updatePreviewVisual(); if (previewModal) { previewModal.classList.add("is-open"); previewModal.setAttribute("aria-hidden", "false"); document.body.classList.add("modal-open"); } trackEvent(`preview:${product.name}:${selectedFrame.name}:${selectedWall.name}`); }
function closePreview() { if (previewModal) { previewModal.classList.remove("is-open"); previewModal.setAttribute("aria-hidden", "true"); document.body.classList.remove("modal-open"); } }

if (mobileMenuButton) { mobileMenuButton.addEventListener("click", () => { const isOpen = navMenu.classList.toggle("is-open"); document.body.classList.toggle("menu-open", isOpen); mobileMenuButton.setAttribute("aria-expanded", String(isOpen)); }); }
document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener("click", closeMobileMenu));
filterButtons.forEach((button) => button.addEventListener("click", () => filterProducts(button.dataset.filter)));
categoryLinks.forEach((link) => { link.addEventListener("click", () => { filterProducts(link.dataset.filterLink); closeMobileMenu(); }); });
frameOptions.forEach((button) => { button.addEventListener("click", () => { selectedFrame = { name: button.dataset.frame, className: button.dataset.frameClass }; updatePreviewVisual(); showToast(`Marco seleccionado: ${selectedFrame.name}`); trackEvent(`marco:${selectedFrame.name}`); }); });
previewFrameButtons.forEach((button) => { button.addEventListener("click", () => { selectedFrame = { name: button.dataset.frame, className: button.dataset.frameClass }; updatePreviewVisual(); trackEvent(`preview_marco:${selectedFrame.name}`); }); });
previewWallButtons.forEach((button) => { button.addEventListener("click", () => { selectedWall = { name: button.dataset.wall, className: button.dataset.wallClass }; updatePreviewVisual(); trackEvent(`preview_pared:${selectedWall.name}`); }); });
buyButtons.forEach((button) => { button.addEventListener("click", () => { const card = button.closest(".product-card"); addToCart(getProductFromCard(card)); }); });
previewButtons.forEach((button) => { button.addEventListener("click", () => { const card = button.closest(".product-card"); openPreview(getProductFromCard(card)); }); });
if (previewAddButton) { previewAddButton.addEventListener("click", () => { if (!currentPreviewProduct) return; addToCart({ ...currentPreviewProduct, frame: selectedFrame.name, frameClass: selectedFrame.className }); closePreview(); }); }
if (previewCloseButton) previewCloseButton.addEventListener("click", closePreview);
if (previewModal) previewModal.addEventListener("click", (event) => { if (event.target === previewModal) closePreview(); });
if (cartOpenButton) cartOpenButton.addEventListener("click", openCart);
if (cartCloseButton) cartCloseButton.addEventListener("click", closeCart);
if (continueShoppingButton) continueShoppingButton.addEventListener("click", closeCart);
if (cartOverlay) cartOverlay.addEventListener("click", closeCart);
if (cartItems) { cartItems.addEventListener("click", (event) => { const button = event.target.closest("button[data-action]"); if (!button) return; const key = button.dataset.key; const action = button.dataset.action; const item = cart.find((cartItem) => cartItem.key === key); if (!item) return; if (action === "increase") item.quantity += 1; if (action === "decrease") { item.quantity -= 1; if (item.quantity <= 0) cart = cart.filter((cartItem) => cartItem.key !== key); } if (action === "remove") cart = cart.filter((cartItem) => cartItem.key !== key); renderCart(); }); }
if (checkoutButton) { checkoutButton.addEventListener("click", () => { if (cart.length === 0) { showToast("Tu carrito está vacío."); return; } showToast("Checkout pendiente de conexión con Shopify Buy Button."); trackEvent("checkout_temporal"); }); }
document.querySelectorAll("[data-track]").forEach((element) => element.addEventListener("click", () => trackEvent(element.dataset.track)));
document.querySelectorAll(".product-image").forEach((button) => button.addEventListener("click", () => trackEvent(button.dataset.track || "clic_producto")));
if (sellerForm) sellerForm.addEventListener("submit", () => trackEvent("formulario_vendedores_enviado"));
if (quoteForm) quoteForm.addEventListener("submit", () => trackEvent("formulario_cotizacion_enviado"));
if (cookieBanner && acceptCookies) { const acceptedCookies = localStorage.getItem("framePosterCookiesAccepted"); if (!acceptedCookies) cookieBanner.classList.add("show"); acceptCookies.addEventListener("click", () => { localStorage.setItem("framePosterCookiesAccepted", "true"); cookieBanner.classList.remove("show"); trackEvent("cookies_aceptadas"); }); }
window.addEventListener("keydown", (event) => { if (event.key === "Escape") { closeMobileMenu(); closeCart(); closePreview(); } });
filterProducts("Todos");
renderCart();
updatePreviewVisual();
