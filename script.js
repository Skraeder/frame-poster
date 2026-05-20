const mobileMenuButton = document.getElementById("mobileMenuButton");
const navMenu = document.getElementById("navMenu");
const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");
const sellerForm = document.getElementById("sellerForm");
const toast = document.getElementById("toast");
const categoryLinks = document.querySelectorAll("[data-filter-link]");
const buyButtons = document.querySelectorAll(".buy-button");
const catalogStatus = document.getElementById("catalogStatus");
const cookieBanner = document.getElementById("cookieBanner");
const acceptCookies = document.getElementById("acceptCookies");

function trackEvent(eventName) {
  console.log("Evento:", eventName);
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function closeMobileMenu() {
  if (!navMenu || !mobileMenuButton) return;
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
    const productCategory = card.dataset.category;
    const shouldShow = category === "Todos" || productCategory === category;
    card.classList.toggle("is-hidden", !shouldShow);
    if (shouldShow) visibleCount += 1;
  });

  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === category);
  });

  updateCatalogStatus(category, visibleCount);
  trackEvent(`filtro:${category}`);
}

if (mobileMenuButton) {
  mobileMenuButton.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    closeMobileMenu();
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => filterProducts(button.dataset.filter));
});

categoryLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const category = link.dataset.filterLink;
    filterProducts(category);
    closeMobileMenu();
  });
});

buyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    trackEvent(button.dataset.track || "clic_compra_temporal");
    showToast("Botón temporal. Aquí se conectará Shopify Buy Button.");
  });
});

document.querySelectorAll("[data-track]").forEach((element) => {
  element.addEventListener("click", () => {
    trackEvent(element.dataset.track);
  });
});

document.querySelectorAll(".product-image").forEach((button) => {
  button.addEventListener("click", () => {
    trackEvent(button.dataset.track || "clic_producto");
  });
});

if (sellerForm) {
  sellerForm.addEventListener("submit", () => {
    trackEvent("formulario_enviado");
    // No se bloquea el envío: Formspree procesa el formulario real.
  });
}

if (cookieBanner && acceptCookies) {
  const acceptedCookies = localStorage.getItem("framePosterCookiesAccepted");
  if (!acceptedCookies) {
    cookieBanner.classList.add("show");
  }

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
