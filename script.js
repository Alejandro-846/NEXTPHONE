const API_URL = 'https://dummyjson.com/products';
let allProducts = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
});

async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}?limit=100`);
    const data = await res.json();
    allProducts = data.products;

    renderProducts(allProducts);
    renderFilters(allProducts);
  } catch (error) {
    console.error("Error loading products:", error);
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
      <img src="${product.thumbnail}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>${product.description.slice(0, 70)}...</p>
      <div class="price-rating">
        <strong>$${product.price}</strong>
        <span>⭐ ${product.rating}</span>
      </div>
      <button>Agregar al carrito</button>
    `;

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

  // Eventos de filtro
  const filterInputs = document.querySelectorAll(".filter-category, .filter-brand");
  filterInputs.forEach(input => {
    input.addEventListener("change", applyFilters);
  });
}

function applyFilters() {
  const selectedCategories = Array.from(document.querySelectorAll(".filter-category:checked")).map(el => el.value);
  const selectedBrands = Array.from(document.querySelectorAll(".filter-brand:checked")).map(el => el.value);

  const filtered = allProducts.filter(product => {
    const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    return matchCategory && matchBrand;
  });

  renderProducts(filtered);
}
