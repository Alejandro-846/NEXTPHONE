const API_URL = 'https://dummyjson.com/products';
let allProducts = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();

  const searchInput = document.querySelector('input[type="text"]');
  searchInput.addEventListener("input", applyFilters);
});

async function fetchProducts() {
  try {
    const [res1, res2] = await Promise.all([
      fetch(`${API_URL}?limit=100&skip=0`),
      fetch(`${API_URL}?limit=100&skip=100`)
    ]);

    const data1 = await res1.json();
    const data2 = await res2.json();

    allProducts = [...data1.products, ...data2.products];

    renderProducts(allProducts);
    renderFilters(allProducts);
  } catch (error) {
    console.error("Error al cargar productos:", error);
    document.getElementById("productContainer").innerHTML = "<p>Error al cargar los productos.</p>";
  }
}

function renderProducts(products) {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = "<p>No se encontraron productos.</p>";
    return;
  }

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}" 
           onerror="this.onerror=null;this.src='https://via.placeholder.com/250x180.png?text=No+Image';">
      <h3>${product.title}</h3>
      <p>${product.description.slice(0, 70)}...</p>
      <div class="price-rating">
        <strong>$${product.price}</strong>
        <span>⭐ ${product.rating}</span>
      </div>
    `;

    const button = document.createElement("button");
    button.textContent = "Agregar al carrito";
    button.addEventListener("click", () => addToCart(product));
    card.appendChild(button);

    container.appendChild(card);
  });
}

function renderFilters(products) {
  const categories = [...new Set(products.map(p => p.category))];
  const brands = [...new Set(products.map(p => p.brand))];

  const categoryFilter = document.getElementById("categoryFilters");
  const brandFilter = document.getElementById("brandFilters");

  categoryFilter.innerHTML = "";
  brandFilter.innerHTML = "";

  categories.forEach(cat => {
    const label = document.createElement("label");
    label.innerHTML = `
      <input type="checkbox" class="filter-category" value="${cat}">
      <span>${cat}</span>
    `;
    categoryFilter.appendChild(label);
  });

  brands.forEach(brand => {
    const label = document.createElement("label");
    label.innerHTML = `
      <input type="checkbox" class="filter-brand" value="${brand}">
      <span>${brand}</span>
    `;
    brandFilter.appendChild(label);
  });

  const filterInputs = document.querySelectorAll(".filter-category, .filter-brand");
  filterInputs.forEach(input => {
    input.addEventListener("change", applyFilters);
  });
}

function applyFilters() {
  const selectedCategories = Array.from(document.querySelectorAll(".filter-category:checked")).map(el => el.value);
  const selectedBrands = Array.from(document.querySelectorAll(".filter-brand:checked")).map(el => el.value);
  const searchTerm = document.querySelector('input[type="text"]').value.toLowerCase();

  const filtered = allProducts.filter(product => {
    const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchSearch = product.title.toLowerCase().includes(searchTerm);
    return matchCategory && matchBrand && matchSearch;
  });

  renderProducts(filtered);
}

// -----------------------------
// 📦 LOCAL STORAGE: CARRITO
// -----------------------------

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(p => p.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${product.title} agregado al carrito.`);
}

function toggleCart() {
  const cartPanel = document.getElementById("cartPanel");
  cartPanel.classList.toggle("visible");
  viewCart();
}

function viewCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItems = document.getElementById("cartItems");

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Tu carrito está vacío.</p>";
    return;
  }

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <span>${item.title} (x${item.quantity})</span>
      <span>$${item.price * item.quantity}</span>
      <button onclick="removeFromCart(${item.id})">Eliminar</button>
    `;
    cartItems.appendChild(div);
  });
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(p => p.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  viewCart();
}
const cartPanel = document.querySelector('.cart-panel');
const cartBackdrop = document.getElementById('cartBackdrop');
const cartBtn = document.querySelector('.floating-cart-btn');
const closeCartBtn = document.querySelector('.cart-header button');

cartBtn.addEventListener('click', () => {
  cartPanel.classList.add('visible');
  cartBackdrop.classList.add('visible');
});

closeCartBtn.addEventListener('click', () => {
  cartPanel.classList.remove('visible');
  cartBackdrop.classList.remove('visible');
});

cartBackdrop.addEventListener('click', () => {
  cartPanel.classList.remove('visible');
  cartBackdrop.classList.remove('visible');
});


document.addEventListener('DOMContentLoaded', function () {
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.getElementById('toggleSidebar');

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
});