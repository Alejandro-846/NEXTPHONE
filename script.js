const apiURL = 'https://dummyjson.com/products/category/smartphones';
const contenedor = document.getElementById('productos'); 

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch(apiURL);
    const data = await res.json();
    mostrarProductos(data.products);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    contenedor.innerHTML = "<p>Error al cargar los productos.</p>";
  }
});

function mostrarProductos(productos) {
  contenedor.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos productos
  productos.forEach((producto) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="${producto.thumbnail}" alt="${producto.title}"/>
      <h3>${producto.title}</h3>
      <p>${producto.description}</p>
      <strong>$${producto.price}</strong>
      <button onclick="agregarFavorito(${producto.id})">💙 Favorito</button>
    `;
    contenedor.appendChild(card);
  });
}

function agregarFavorito(id) {
  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  if (!favoritos.includes(id)) {
    favoritos.push(id);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    alert(`Producto ${id} agregado a favoritos`);
  } else {
    alert(`Producto ${id} ya está en favoritos`);
  }
}
