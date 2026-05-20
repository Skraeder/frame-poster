const mobileMenuButton = document.getElementById("mobileMenuButton");
const navMenu = document.getElementById("navMenu");
const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");
const sellerForm = document.getElementById("sellerForm");
const toast = document.getElementById("toast");
const categoryLinks = document.querySelectorAll("[data-filter-link]");
const buyButtons = document.querySelectorAll(".buy-button");
const catalogStatus = document.getElementById("catalogStatus");
const catalogSection = document.getElementById("catalogo");
const cookieBanner = document.getElementById("cookieBanner");
const acceptCookies = document.getElementById("acceptCookies");

function trackEvent(name, detail = {}) {
  console.log("Evento:", name, detail);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function closeMobileMenu() {
  navMenu.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  mobileMenuButton.setAttribute("aria-expanded", "false");
}

function updateCatalogStatus(category, count) {
  if (!catalogStatus) return;
  catalogStatus.textContent = category === "Todos"
    ? `Mostrando todos los posters disponibles (${count}).`
    : `Mostrando ${count} posters de la colección: ${category}.`;
}

function filterProducts(category) {
  let visibleCount = 0;
  productCards.forEach((card) => {
    const shouldShow = category === "Todos" || card.dataset.category === category;
    card.classList.toggle("is-hidden", !shouldShow);
    if (shouldShow) visibleCount += 1;
  });
  filterButtons.forEach((button) => button.classList.toggle("active", button.dataset.filter === category));
  updateCatalogStatus(category, visibleCount);
  trackEvent("filtro_catalogo", { category, visibleCount });
}

mobileMenuButton.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  document.body.classList.toggle("menu-open", isOpen);
  mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    if (link.dataset.filterLink) return;
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      event.preventDefault();
      closeMobileMenu();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (link.getAttribute("href") === "#catalogo") trackEvent("scroll_catalogo");
    }
  });
});

filterButtons.forEach((button) => button.addEventListener("click", () => filterProducts(button.dataset.filter)));

categoryLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const category = link.dataset.filterLink;
    filterProducts(category);
    closeMobileMenu();
    if (catalogSection) catalogSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll(".product-track").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".product-card");
    trackEvent("clic_producto", { product: card?.dataset.product || "producto" });
  });
});

sellerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sellerForm.reset();
  showToast("Solicitud enviada. Te contactaremos pronto.");
  trackEvent("envio_formulario_vendedor");
});

buyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showToast("Botón temporal. Aquí se conectará Shopify Buy Button.");
    trackEvent("clic_boton_compra", { product: button.dataset.productName || "producto" });
  });
});

document.querySelectorAll('[data-track="whatsapp"]').forEach((link) => link.addEventListener("click", () => trackEvent("clic_whatsapp")));
document.querySelectorAll('[data-track="instagram"]').forEach((link) => link.addEventListener("click", () => trackEvent("clic_instagram")));

if (cookieBanner && !localStorage.getItem("framePosterCookiesAccepted")) {
  cookieBanner.classList.add("show");
}

if (acceptCookies) {
  acceptCookies.addEventListener("click", () => {
    localStorage.setItem("framePosterCookiesAccepted", "true");
    cookieBanner.classList.remove("show");
    trackEvent("cookies_aceptadas");
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMobileMenu();
});

filterProducts("Todos");
