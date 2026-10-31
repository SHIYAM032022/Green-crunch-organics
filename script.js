/* GREEN CRUNCH ORGANICS - EDIT THESE SETTINGS BEFORE PUBLISHING */
const BUSINESS = {
  // Use country code + number, digits only. Example India: 919876543210
  whatsappNumber: "919629935384",
  email: "hello@yourbusiness.com",
  // Paste your active payment link from your payment provider here.
  // Example: https://rzp.io/i/your-payment-link
  paymentLink: ""
};

/* Starter sample catalogue. Replace names, prices, pack sizes and descriptions
   with your actual products. Do not claim "organic" or "chemical-free" unless
   your ingredients, process and applicable certifications support the claim. */
const PRODUCTS = [
  { id: 1, name: "Millet Crunch Biscuits", description: "A crisp snack idea with millet-based ingredients.", price: 120, pack: "200 g", emoji: "🌾", tag: "CUSTOMER FAVOURITE" },
  { id: 2, name: "Oats & Nut Cookies", description: "A satisfying cookie with oats and nutty goodness.", price: 150, pack: "200 g", emoji: "🥜", tag: "WHOLESOME PICK" },
  { id: 3, name: "Classic Jaggery Biscuits", description: "A simple biscuit concept with a warm jaggery note.", price: 130, pack: "200 g", emoji: "🍪", tag: "MADE WITH CARE" }
];

let cart = [];
const money = n => "₹" + Number(n).toLocaleString("en-IN");
const grid = document.getElementById("productGrid");
const drawer = document.getElementById("cartDrawer");

function renderProducts() {
  grid.innerHTML = PRODUCTS.map(p => `
    <article class="product-card">
      <div class="product-visual">${p.emoji}<span>${p.tag}</span></div>
      <div class="product-info">
        <h3>${p.name}</h3><p>${p.description}</p>
        <div class="product-foot"><div><div class="price">${money(p.price)}</div><small>${p.pack}</small></div>
        <button class="add-btn" data-add="${p.id}">Add to cart +</button></div>
      </div>
    </article>`).join("");
}
function addToCart(id) {
  const item = cart.find(x => x.id === id);
  if (item) item.qty++; else cart.push({ ...PRODUCTS.find(p => p.id === id), qty: 1 });
  renderCart(); showToast("Added to your cart");
}
function changeQty(id, amount) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += amount;
  cart = cart.filter(x => x.qty > 0);
  renderCart();
}
function total() { return cart.reduce((sum, p) => sum + p.price * p.qty, 0); }
function renderCart() {
  document.getElementById("cartCount").textContent = cart.reduce((s,p)=>s+p.qty,0);
  document.getElementById("cartTotal").textContent = money(total());
  document.getElementById("cartItems").innerHTML = cart.length ? cart.map(p => `
    <div class="cart-line"><div><strong>${p.name}</strong><small>${p.pack} · ${money(p.price)} each</small></div>
    <div class="qty-controls"><button data-minus="${p.id}">−</button><span>${p.qty}</span><button data-plus="${p.id}">+</button></div></div>`).join("") : '<p class="empty-cart">Your cart is waiting for something good.</p>';
}
function openCart() { document.body.classList.add("cart-open"); drawer.setAttribute("aria-hidden","false"); }
function closeCart() { document.body.classList.remove("cart-open"); drawer.setAttribute("aria-hidden","true"); }
function showToast(msg) {
  const el = document.getElementById("toast"); el.textContent = msg; el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2200);
}
function orderMessage() {
  const lines = cart.map(p => `• ${p.name} (${p.pack}) x ${p.qty} = ${money(p.price*p.qty)}`).join("\n");
  return `Hello Green Crunch Organics! I would like to place an order:\n\n${lines}\n\nSubtotal: ${money(total())}\n\nPlease confirm availability, delivery charges and payment details.`;
}
function openWhatsApp(message) {
  if (!BUSINESS.whatsappNumber || BUSINESS.whatsappNumber.includes("your")) {
    showToast("Please add your WhatsApp number in script.js"); return;
  }
  window.open(`https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
}

grid.addEventListener("click", e => { const b=e.target.closest("[data-add]"); if(b) addToCart(Number(b.dataset.add)); });
document.getElementById("cartItems").addEventListener("click", e => {
  const plus=e.target.closest("[data-plus]"), minus=e.target.closest("[data-minus]");
  if(plus) changeQty(Number(plus.dataset.plus),1);
  if(minus) changeQty(Number(minus.dataset.minus),-1);
});
document.getElementById("cartOpen").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
document.getElementById("cartBackdrop").addEventListener("click", closeCart);
document.getElementById("whatsappCheckout").addEventListener("click", () => {
  if(!cart.length) return showToast("Your cart is empty");
  openWhatsApp(orderMessage());
});
document.getElementById("onlinePayment").addEventListener("click", e => {
  if(!cart.length) { e.preventDefault(); showToast("Add products to your cart first"); return; }
  if(!BUSINESS.paymentLink) {
    e.preventDefault();
    showToast("Online payment is not set up yet. Please use WhatsApp.");
    return;
  }
  // This opens a payment link you configure. Confirm the final amount/order with the customer.
  e.preventDefault();
  openWhatsApp(orderMessage() + "\n\nI would like to pay online. Please share/confirm the payment link and final amount.");
  window.open(BUSINESS.paymentLink, "_blank");
});
document.getElementById("contactWhatsApp").addEventListener("click", e => {
  e.preventDefault(); openWhatsApp("Hello Green Crunch Organics! I would like to know more about your products.");
});
document.getElementById("displayPhone").textContent = BUSINESS.whatsappNumber || "Add your number in script.js";
document.getElementById("displayEmail").textContent = BUSINESS.email || "Add your email in script.js";
document.getElementById("contactWhatsApp").href = `https://wa.me/${BUSINESS.whatsappNumber}`;
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("mainNav").classList.toggle("open"));
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("mainNav").classList.remove("open")));
renderProducts(); renderCart();
