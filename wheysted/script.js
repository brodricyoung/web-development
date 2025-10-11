// ---------- PRODUCTS ----------
const products = [
  { id: 1, name: "Whey Protein Powder", price: 39.99, image: "images/protein.jpg" },
  { id: 2, name: "Pre-Workout Energy", price: 29.99, image: "images/preworkout.jpg" },
  { id: 3, name: "BCAA Recovery Formula", price: 24.99, image: "images/bcaa.jpg" },
  { id: 4, name: "Vegan Protein Blend", price: 34.99, image: "images/vegan.jpg" },
  { id: 5, name: "Creatine Monohydrate", price: 19.99, image: "images/creatine.jpg" },
];

// ---------- CART ----------
function loadCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("cartCount", cart.reduce((sum, i) => sum + i.quantity, 0));
}

function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  const cart = loadCart();
  if (countEl) countEl.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
}

function addToCart(id) {
  let cart = loadCart();
  const product = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) existing.quantity++;
  else cart.push({...product, quantity: 1});
  saveCart(cart);
  updateCartCount();
  alert("Added to cart!");
}

// ---------- DISPLAY PRODUCTS ----------
function displayProducts(filterText="") {
  const list = document.getElementById("product-list");
  if (!list) return;
  const filtered = products.filter(p => p.name.toLowerCase().includes(filterText.toLowerCase()));
  list.innerHTML = filtered.map(p => `
    <div class="product">
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>$${p.price.toFixed(2)}</p>
      <button class="add-to-cart" onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
  `).join("");
}

// ---------- DISPLAY FEATURED ----------
function displayFeatured() {
  const list = document.getElementById("featured-list");
  if (!list) return;
  const featured = products.slice(0,3);
  list.innerHTML = featured.map(p => `
    <div class="product">
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>$${p.price.toFixed(2)}</p>
      <button class="add-to-cart" onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
  `).join("");
}

// ---------- DISPLAY CART ----------
function displayCart() {
  let cart = loadCart();
  const container = document.getElementById("cart-items");
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    document.getElementById("cart-total").textContent = "0.00";
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <h4>${item.name}</h4>
      <div class="quantity">
        <button onclick="changeQuantity(${item.id}, -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="changeQuantity(${item.id}, 1)">+</button>
      </div>
      <p>$${(item.price * item.quantity).toFixed(2)}</p>
      <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
    </div>
  `).join("");

  const total = cart.reduce((sum,item)=>sum+item.price*item.quantity,0);
  document.getElementById("cart-total").textContent = total.toFixed(2);
  updateCartCount();
}

// ---------- CART FUNCTIONS ----------
function changeQuantity(id, delta) {
  let cart = loadCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <=0) cart = cart.filter(i => i.id !== id);
  saveCart(cart);
  displayCart();
}

function removeItem(id) {
  let cart = loadCart();
  cart = cart.filter(i => i.id !== id);
  saveCart(cart);
  displayCart();
}

// ---------- SEARCH FILTER ----------
const searchInput = document.getElementById("search");
if (searchInput) {
  searchInput.addEventListener("input", e => displayProducts(e.target.value));
}

// ---------- CART BUTTON NAV ----------
const cartIcon = document.getElementById("cart-icon") || document.querySelector(".cart");
if (cartIcon) {
  cartIcon.addEventListener("click", ()=>window.location.href="cart.html");
}

// ---------- INITIALIZE ----------
document.addEventListener("DOMContentLoaded", ()=>{
  updateCartCount();
  displayProducts();
  displayCart();
  displayFeatured();
});
