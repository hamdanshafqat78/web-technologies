/* ================================================
   RoyalTag - Theory Assignment 3
   public/script.js — Client-side JavaScript
   ================================================ */

// ── Hamburger Menu ──────────────────────────────
var hamburger = document.getElementById('hamburger-btn');
var navMenu   = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
        navMenu.classList.toggle('open');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', navMenu.classList.contains('open'));
    });

    document.querySelectorAll('.nav-links a').forEach(function (link) {
        link.addEventListener('click', function () {
            navMenu.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('click', function (e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

// ── Mobile Filter Sidebar Toggle ────────────────
var mobileFilterBtn = document.getElementById('mobile-filter-toggle');
var filterSidebar   = document.getElementById('filter-sidebar');

if (mobileFilterBtn && filterSidebar) {
    mobileFilterBtn.addEventListener('click', function () {
        var isOpen = filterSidebar.classList.toggle('open');
        mobileFilterBtn.setAttribute('aria-expanded', isOpen);
    });
}

// ── Simple Cart (localStorage) ──────────────────
var cart = JSON.parse(localStorage.getItem('royaltag_cart') || '[]');

function saveCart() {
    localStorage.setItem('royaltag_cart', JSON.stringify(cart));
}

function addToCart(name, price) {
    var existing = cart.find(function (item) { return item.name === name; });
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name: name, price: price, qty: 1 });
    }
    saveCart();

    // Visual feedback
    var toast = document.createElement('div');
    toast.style.cssText =
        'position:fixed;bottom:28px;right:28px;background:#1a1a2e;color:#e8b86d;' +
        'padding:14px 24px;border-radius:4px;font-weight:700;font-size:0.9rem;' +
        'box-shadow:0 6px 24px rgba(0,0,0,0.2);z-index:9999;animation:fadeIn 0.3s ease;';
    toast.textContent = '✓ ' + name + ' added to cart!';
    document.body.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 2500);
}

// ── Render Cart Page ─────────────────────────────
function renderCart() {
    var container = document.getElementById('cart-items-container');
    var emptyState = document.getElementById('cart-empty-state');
    var summary    = document.getElementById('cart-summary');
    var totalEl    = document.getElementById('cart-total-price');

    if (!container) return;

    cart = JSON.parse(localStorage.getItem('royaltag_cart') || '[]');

    if (cart.length === 0) {
        emptyState.style.display = 'block';
        summary.style.display    = 'none';
        container.innerHTML      = '';
        return;
    }

    emptyState.style.display = 'none';
    summary.style.display    = 'block';

    var html = '';
    var total = 0;

    cart.forEach(function (item, idx) {
        total += item.price * item.qty;
        html +=
            '<div class="cart-item">' +
            '<span class="cart-item-name">' + item.name + ' &times;' + item.qty + '</span>' +
            '<span class="cart-item-price">$' + (item.price * item.qty).toFixed(2) + '</span>' +
            '<button class="cart-remove-btn" onclick="removeFromCart(' + idx + ')" aria-label="Remove">&times;</button>' +
            '</div>';
    });

    container.innerHTML = html;
    totalEl.textContent = '$' + total.toFixed(2);
}

function removeFromCart(idx) {
    cart.splice(idx, 1);
    saveCart();
    renderCart();
}

// Run on cart page
if (document.getElementById('cart-items-container')) {
    renderCart();
}

// ── Add fadeIn keyframe ──────────────────────────
var styleTag = document.createElement('style');
styleTag.textContent = '@keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }';
document.head.appendChild(styleTag);
