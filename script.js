const mobileMenuButton = document.getElementById("mobileMenuButton");
const navMenu = document.getElementById("navMenu");
const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");
const sellerForm = document.getElementById("sellerForm");
const toast = document.getElementById("toast");
const categoryLinks = document.querySelectorAll("[data-filter-link]");
const buyButtons = document.querySelectorAll(".buy-button");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

function closeMobileMenu() {
  navMenu.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  mobileMenuButton.setAttribute("aria-expanded", "false");
}

function filterProducts(category) {
  productCards.forEach((card) => {
    const productCategory = card.dataset.category;
    const shouldShow = category === "Todos" || productCategory === category;
    card.classList.toggle("is-hidden", !shouldShow);
  });

  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === category);
  });
}

mobileMenuButton.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  document.body.classList.toggle("menu-open", isOpen);
  mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);

    if (target) {
      event.preventDefault();
      closeMobileMenu();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterProducts(button.dataset.filter);
  });
});

categoryLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const category = link.dataset.filterLink;
    filterProducts(category);
  });
});

sellerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sellerForm.reset();
  showToast("Solicitud enviada. Te contactaremos pronto.");
});

buyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showToast("Botón temporal. Aquí se conectará Shopify Buy Button.");
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});
