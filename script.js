/* ==== EDIT YOUR BUSINESS DETAILS HERE ==== */
const CONFIG = {
  name: "Urban Cafe",
  address: "Sector 28, Chandigarh Ram place",
  phone: "+91 1254631212",
  email: "info@urbancafe.com",
  hours: "Mon-Sun: 8:00 AM - 10:00 PM",
  // WhatsApp number: country code + number, digits only. Example: "919876543210". Leave "" until you have a real number.
  whatsapp: "",
  whatsappMessage: "Hello Urban Cafe! I would like to know more about your menu."
};
/* ======================================== */

const MENU = {
  Coffee: [["Espresso", 100], ["Cappuccino", 150], ["Cafe Latte", 170], ["Cold Coffee", 160], ["Mocha", 180]],
  Tea: [["Masala Chai", 60], ["Green Tea", 80], ["Lemon Tea", 70]],
  Food: [["Veg Sandwich", 120], ["Cheese Burger", 180], ["Margherita Pizza", 220], ["French Fries", 100], ["Garlic Bread", 130]],
  Desserts: [["Chocolate Brownie", 120], ["Chocolate Cake", 150], ["Chocolate Donut", 90], ["Vanilla Ice Cream", 100]]
};

const $ = (s) => document.querySelector(s);
const toast = $("#toast");
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 4500);
}

/* Business details (phone and email become tap-to-call / tap-to-email once filled in) */
const isSet = (v) => v && !v.trim().startsWith("[");
document.querySelectorAll("[data-biz]").forEach((el) => {
  const k = el.dataset.biz, v = CONFIG[k];
  if (!v) return;
  if (isSet(v) && (k === "phone" || k === "email")) {
    const a = document.createElement("a");
    a.href = k === "phone" ? "tel:" + v.replace(/[^\d+]/g, "") : "mailto:" + v.trim();
    a.textContent = v;
    el.textContent = "";
    el.appendChild(a);
  } else el.textContent = v;
});
$("#year").textContent = new Date().getFullYear();

/* Sticky nav + back-to-top */
const nav = $("#nav"), topBtn = $("#top");
function onScroll() {
  nav.classList.toggle("solid", window.scrollY > 40);
  topBtn.classList.toggle("show", window.scrollY > 600);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* Mobile menu */
const burger = $("#burger"), links = $("#links");
function setMenu(open) {
  links.classList.toggle("open", open);
  nav.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
burger.addEventListener("click", () => setMenu(!links.classList.contains("open")));
links.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("click", (e) => { if (links.classList.contains("open") && !e.target.closest("#nav")) setMenu(false); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && links.classList.contains("open")) { setMenu(false); burger.focus(); }
});
window.matchMedia("(min-width:821px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

/* Menu tabs (click + arrow-key support) */
const tabs = $("#tabs"), grid = $("#menuGrid");
const subtitles = { Coffee: "Brewed fresh", Tea: "Hot and soothing", Food: "Made to order", Desserts: "Sweet endings" };
function renderMenu(cat) {
  grid.innerHTML = MENU[cat].map(([n, p]) =>
    `<div class="item"><div><h3>${n}</h3><small>${subtitles[cat]}</small></div><span class="price">₹${p}</span></div>`).join("");
  grid.setAttribute("aria-labelledby", "tab-" + cat);
  tabs.querySelectorAll(".tab").forEach((t) => {
    const on = t.dataset.cat === cat;
    t.setAttribute("aria-selected", on);
    t.tabIndex = on ? 0 : -1;
  });
}
Object.keys(MENU).forEach((cat) => {
  const b = document.createElement("button");
  b.className = "tab"; b.type = "button"; b.id = "tab-" + cat; b.dataset.cat = cat; b.textContent = cat;
  b.setAttribute("role", "tab");
  b.setAttribute("aria-controls", "menuGrid");
  b.addEventListener("click", () => renderMenu(cat));
  tabs.appendChild(b);
});
tabs.addEventListener("keydown", (e) => {
  const all = [...tabs.querySelectorAll(".tab")];
  let i = all.indexOf(document.activeElement);
  if (i < 0) return;
  if (e.key === "ArrowRight") i = (i + 1) % all.length;
  else if (e.key === "ArrowLeft") i = (i - 1 + all.length) % all.length;
  else if (e.key === "Home") i = 0;
  else if (e.key === "End") i = all.length - 1;
  else return;
  e.preventDefault();
  all[i].focus();
  all[i].click();
});
renderMenu("Coffee");

/* Scroll reveal */
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in"));
}

/* Image fallback: a branded placeholder replaces any photo that fails to load */
const PLACEHOLDER = "data:image/svg+xml," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a3825"/><stop offset="1" stop-color="#c68642"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><text x="200" y="160" text-anchor="middle" font-family="Georgia,serif" font-size="28" fill="#fbf6ec">URBAN CAFE</text></svg>');
function fallback(img) {
  if (img.dataset.fb) return;
  img.dataset.fb = "1";
  img.removeAttribute("srcset");
  img.src = PLACEHOLDER;
}
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", () => fallback(img));
  // catches images that already failed before this script ran
  if (img.getAttribute("loading") !== "lazy" && img.complete && img.naturalWidth === 0) fallback(img);
});

/* Contact form (demo only: nothing is sent anywhere) */
const form = $("#form"), status = $("#status");
const rules = {
  name: [(v) => v.trim().length > 1, "Please enter your full name."],
  email: [(v) => /^\S+@\S+\.\S+$/.test(v.trim()), "Please enter a valid email address."],
  phone: [(v) => v.trim() === "" || /^\+?[\d\s()-]{7,20}$/.test(v.trim()), "Enter a valid phone number or leave it blank."],
  msg: [(v) => v.trim().length > 4, "Please write a short message."]
};
function check(id) {
  const f = form.elements.namedItem(id), [test, msg] = rules[id], ok = test(f.value);
  f.classList.toggle("invalid", !ok);
  f.setAttribute("aria-invalid", !ok);
  $("#" + id + "-err").textContent = ok ? "" : msg;
  return ok;
}
Object.keys(rules).forEach((id) => {
  const f = form.elements.namedItem(id), s = document.createElement("span");
  s.className = "err"; s.id = id + "-err";
  f.after(s);
  f.setAttribute("aria-describedby", s.id);
  f.addEventListener("input", () => { if (f.classList.contains("invalid")) check(id); });
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let first = null;
  Object.keys(rules).forEach((id) => { if (!check(id) && !first) first = form.elements.namedItem(id); });
  if (first) { status.textContent = "Please fix the highlighted fields."; first.focus(); return; }
  status.textContent = "Demo only: this form has no backend, so your message was not sent. Connect a form service to go live.";
  form.reset();
});

/* WhatsApp: floating button, Order Now and offer buttons */
function openWhatsApp(text) {
  const num = CONFIG.whatsapp.replace(/\D/g, "");
  if (num.length < 8) {
    showToast("WhatsApp number not set yet. Add it to CONFIG.whatsapp in script.js.");
    return;
  }
  const a = document.createElement("a");
  a.href = `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
  a.target = "_blank"; a.rel = "noopener";
  a.click();
}
$("#wa").addEventListener("click", (e) => { e.preventDefault(); openWhatsApp(CONFIG.whatsappMessage); });
document.querySelectorAll("[data-wa]").forEach((a) =>
  a.addEventListener("click", (e) => { e.preventDefault(); openWhatsApp(a.dataset.wa); }));

/* Social placeholders */
document.querySelectorAll("[data-social]").forEach((a) =>
  a.addEventListener("click", (e) => { e.preventDefault(); showToast("Social link placeholder. Add your profile URL in index.html."); }));