# Assignment 2 — RoyalTag Fashion Store

## Overview

**RoyalTag** is a static, multi-page e-commerce front-end for a men's premium fashion brand.  
It is built with **pure HTML5, vanilla CSS3, and vanilla JavaScript** — no frameworks, no libraries.

The project has **4 HTML pages**, **1 CSS file**, **1 JavaScript file**, and **1 image asset** (the brand logo).

---

## Technologies Used

| Technology | Version / Type | Purpose |
|---|---|---|
| HTML5 | Standard | Page structure and semantic markup |
| CSS3 | Vanilla (no library) | All styling, layout, animations, responsive design |
| JavaScript (ES5) | Vanilla (no library) | Hamburger menu toggle + login form handler |
| CSS Grid | Native | Product card layout |
| CSS Flexbox | Native | Navbar, hero, login card layout |
| CSS Media Queries | Native | Full responsive breakpoints |
| CSS Transitions | Native | Hamburger → X animation, menu slide-down |
| `localStorage` / Backend | ❌ None | Cart is UI-only (static empty state) |

---

## File Structure

```
assignment 2/
├── index.html       ← Home page (Hero + Featured Products)
├── products.html    ← Full product listing page
├── cart.html        ← Shopping cart page (empty state only)
├── login.html       ← Login/auth page with form
├── style.css        ← All CSS for all 4 pages
├── script.js        ← Hamburger menu + login form logic
└── images/
    └── logo.png     ← Brand logo used in navbar and login card
```

---

## File-by-File Breakdown

---

### `index.html` — Home Page (120 lines)

#### What it does
The landing/home page of the RoyalTag store.

#### Line-by-line breakdown

| Lines | What is implemented |
|-------|---------------------|
| 1–9 | Standard HTML5 boilerplate. Sets charset=UTF-8, viewport for responsiveness, a meta description for SEO ("RoyalTag - Premium Fashion Store"), and page title. Links `style.css`. |
| 13–32 | **Navbar** — A `<nav class="navbar">` with a `.nav-container` div. Inside: (1) a logo anchor linking to `index.html` with an `<img>` and a `<span class="logo-text">RoyalTag</span>`, (2) a `<button class="hamburger" id="hamburger-btn">` with 3 empty `<span>` children (these become the 3 bars / X icon via CSS), (3) a `<ul class="nav-links" id="nav-menu">` with 4 `<li>` items linking to all 4 pages. The Home link has `class="active"` to show it is the current page. |
| 35–42 | **Hero Section** — A `<section class="hero">` wrapping a `.hero-content` div. Contains: a small label `<p class="hero-label">New Collection 2025</p>`, a big `<h1>Elevate Your Style</h1>`, a tagline paragraph, and a `<a href="products.html" class="btn-primary">Shop Now</a>` call-to-action button. |
| 45–110 | **Featured Products Section** — A `<section class="products-section" id="featured">`. Contains a `.section-header` with an `<h2>Featured Products</h2>` + subtitle paragraph, then a `.product-grid` div holding **6 product cards**. Each `.product-card` has: a `.product-img .img-N` div (N = 1–6, styled as colorful CSS gradient placeholders), a `.product-info` div with an `<h3>` product name, `<p class="price">` dollar amount, and a `<button class="btn-cart">Add to Cart</button>`. Products listed: Premium Polo Shirt ($49), Formal Dress Shirt ($65), Casual Jacket ($89), Slim Fit Chinos ($55), Cotton Kurta ($39), Classic Waistcoat ($72). After the grid there is a `.view-all-wrap` div with a `<a href="products.html" class="btn-outline">View All Products</a>` link. |
| 113–115 | **Footer** — A `<footer class="footer">` with a copyright paragraph `© 2025 RoyalTag`. |
| 117 | Loads `script.js` at the bottom of `<body>` so JavaScript runs after the DOM is ready. |

---

### `products.html` — Products Page (162 lines)

#### What it does
Displays the complete product catalogue — all 12 items in a grid.

#### Line-by-line breakdown

| Lines | What is implemented |
|-------|---------------------|
| 1–9 | Same boilerplate as index.html. Different title ("RoyalTag - Products") and meta description. `style.css` linked. |
| 13–31 | **Same Navbar** as index.html. The only difference: the `class="active"` is on the Products `<a>` link (line 26), not Home, so the active highlight moves to the correct page. |
| 34–37 | **Page Header** — A `<div class="page-header">` (not a `<section>`) with `<h1>All Products</h1>` and a subtitle paragraph. This is the dark banner at the top of inner pages. |
| 40–152 | **Products Grid** — Same `.products-section` and `.product-grid` container as the home page, but now has **12 product cards** instead of 6. Each card follows the exact same structure: `.product-img .img-N`, `.product-info`, `<h3>`, `.price`, `<button class="btn-cart">`. The 6 extra products (not on home page) are: Linen Trousers ($59, img-7), Embroidered Shalwar Kameez ($79, img-8), Denim Jacket ($95, img-9), V-Neck Sweater ($45, img-10), Oxford Button Shirt ($69, img-11), Festive Sherwani ($199, img-12). |
| 155–157 | Same footer. |
| 159 | `<script src="script.js">` loaded at bottom. |

> **Note:** There is no `.section-header` div on this page — the page header banner serves that role. There is also no "View All" button since this IS the all-products page.

---

### `cart.html` — Cart Page (62 lines)

#### What it does
The shopping cart page. Currently shows only an **empty cart state** — no real cart functionality (no items, no JS cart logic).

#### Line-by-line breakdown

| Lines | What is implemented |
|-------|---------------------|
| 1–9 | Boilerplate. Title "RoyalTag - Cart", meta description. `style.css` linked. |
| 13–31 | **Same Navbar**. `class="active"` is on the Cart `<a>` link (line 27). |
| 34–37 | **Page Header** — `<h1>Shopping Cart</h1>` with subtitle "Review your selected items". |
| 40–52 | **Cart Section** — A `<section class="cart-section">` with a `.cart-container`. Inside is a single `.cart-empty` div containing: a `.cart-icon` div with the 🛒 emoji, an `<h2>Your cart is empty</h2>`, a paragraph "Looks like you haven't added anything yet.", and a `<a href="products.html" class="btn-primary">Start Shopping</a>` button to redirect back. |
| 55–57 | Footer. |
| 59 | `script.js` loaded. |

> **Note:** The "Add to Cart" buttons on the product pages do not actually add items to this cart — there is no JavaScript cart logic implemented. The cart page is a static UI placeholder.

---

### `login.html` — Login Page (93 lines)

#### What it does
The user login page with an email/password form. Form submission is handled by JavaScript and shows an alert — no backend authentication.

#### Line-by-line breakdown

| Lines | What is implemented |
|-------|---------------------|
| 1–9 | Boilerplate. Title "RoyalTag - Login", meta description. `style.css` linked. |
| 13–31 | **Same Navbar**. `class="active"` is on the Login `<a>` link (line 28). |
| 34–83 | **Login Section** — A `<section class="login-section">` containing a `.login-card` div. Inside the card: (1) a `.login-header` with the logo image, `<h1>Welcome Back</h1>`, and subtitle. (2) A `<form class="login-form" id="login-form">` containing: a `.form-group` for email (`<input type="email" id="email" required>`), a `.form-group` for password (`<input type="password" id="password" required>`), a `.form-options` row with a checkbox "Remember me" (`<input type="checkbox" id="remember">`) and a "Forgot Password?" link (`<a href="#" class="forgot-link">`), and a `<button type="submit" class="btn-login">Login</button>`. (3) A `.signup-text` paragraph "Don't have an account? Create one" with a `href="#"` link (no destination). |
| 86–88 | Footer. |
| 90 | `script.js` loaded. |

---

### `style.css` — All Styles (717 lines)

One single CSS file styles all 4 pages. It is organized into clearly commented sections.

#### Section-by-section breakdown

| Lines | Section | What is implemented |
|-------|---------|---------------------|
| 1–12 | **File header comment** | Documents the file name, purpose, and the 4 breakpoints used: Desktop (>900px), Tablet (≤900px), Mobile (≤768px), Small Mobile (≤480px). |
| 16–30 | **CSS Reset** | `* { margin:0; padding:0; box-sizing:border-box; }` — removes all default browser spacing. `body` sets the global font stack (`'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`), dark text color (`#333333`), and off-white background (`#f5f5f0`). `a { text-decoration: none; }` removes underlines from all links globally. |
| 37–133 | **Navbar — Desktop** | `.navbar` is dark navy (`#1a1a2e`), `position: sticky; top: 0; z-index: 999` so it stays at the top while scrolling. `.nav-container` uses `max-width: 1200px`, `display: flex; justify-content: space-between` to place logo on left and links on right, `height: 70px`. `.logo` uses flexbox with `gap: 10px` to align image and text. `.logo img` is `height: 42px`. `.logo-text` is gold (`#e8b86d`), bold, `letter-spacing: 2px`. `.nav-links` uses `display: flex; gap: 35px` for horizontal menu. Nav link colors are `#cccccc` grey, turning gold (`#e8b86d`) on `:hover` and when `.active`. `.hamburger` is `display: none` on desktop — hidden. Each hamburger `<span>` is `26px × 3px` white bar with `border-radius: 2px`. The `.hamburger.active` rules animate the 3 bars into an X: `span:nth-child(1)` is translated down 8px then rotated 45°, `span:nth-child(2)` fades out and scales to 0, `span:nth-child(3)` is translated up 8px and rotated -45°. All with `transition: transform 0.3s ease, opacity 0.3s ease`. |
| 140–191 | **Hero — Home Page** | `.hero` is `height: 88vh`, minimum 500px, with a 3-stop diagonal gradient (`#1a1a2e → #16213e → #0f3460`). Content is centered using `display: flex; align-items: center; justify-content: center; text-align: center`. `.hero-content` is capped at `max-width: 680px`. `.hero-label` is small gold uppercase text with `letter-spacing: 4px`. `.hero h1` is `3.5rem`, white, bold. `.hero-tagline` is light grey. `.btn-primary` is a gold (`#e8b86d`) filled button with dark navy text, darkens to `#d4a055` on hover. |
| 198–213 | **Page Header** | `.page-header` — dark navy banner used on products and cart pages. `padding: 50px 20px`, centered. `h1` is white `2.2rem`, `p` is grey. |
| 220–331 | **Products Section** | `.products-section` is `max-width: 1200px; margin: 0 auto; padding: 60px 20px`. `.section-header` is centered, `<h2>` is `2rem` dark navy. `.product-grid` is `display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px` — 3 columns on desktop. `.product-card` is white with a light grey border. `.product-img` is `height: 240px`. Classes `.img-1` through `.img-12` are 12 unique CSS gradient placeholders instead of real product photos. `.product-info` has `padding: 18px 20px`. `.price` is gold, bold, `1.1rem`. `.btn-cart` is full-width, dark navy background, white text, uppercase; turns gold with dark text on `:hover`. `.btn-outline` is an outlined button (2px solid dark navy border, fills dark on hover) used for the "View All" link. |
| 338–374 | **Cart Page** | `.cart-section` is `min-height: 60vh`, centered via flexbox. `.cart-container` is max `700px`. `.cart-empty` is white, bordered, centered, `padding: 60px 20px`. `.cart-icon` is `font-size: 4rem` for the emoji. |
| 381–505 | **Login Page** | `.login-section` takes up `calc(100vh - 70px)` (full viewport height minus navbar), uses flexbox to center vertically and horizontally. `.login-card` is white, bordered, `max-width: 420px`. `.login-logo` is `height: 50px`. `.login-form` is a flex column with `gap: 20px`. Each `.form-group` stacks label above input. `.form-group input` has a border that turns gold (`.e8b86d`) on `:focus` and no outline ring (clean look). `.form-options` uses `space-between` to push checkbox left and "Forgot Password?" right. `.btn-login` is full-width, dark navy, uppercase, turns gold on hover. `.signup-text` and its link are styled in grey and gold respectively. |
| 512–518 | **Footer** | `.footer` is dark navy (`#1a1a2e`), light grey text, `text-align: center`, `padding: 22px 20px`. |
| 525–540 | **Media Query ≤ 900px (Tablet)** | Product grid switches to **2 columns** (`repeat(2, 1fr)`). Product image height reduces to `210px`. Hero h1 shrinks from `3.5rem` to `2.8rem`. |
| 548–655 | **Media Query ≤ 768px (Mobile)** | **Hamburger becomes visible** (`display: flex`). Nav links become `position: absolute; top: 70px; width: 100%; flex-direction: column`. They are hidden by `max-height: 0; overflow: hidden` and slide down with `transition: max-height 0.35s ease` when JS adds `.open` class (which sets `max-height: 400px`). Each nav item gets a bottom border. Link padding increases for touch friendliness. Hero height becomes `auto`, h1 shrinks to `2rem`. Product grid switches to **1 column**. Login card padding shrinks. |
| 662–716 | **Media Query ≤ 480px (Small Mobile)** | Navbar height reduces to `60px`, nav-links top repositioned to `60px`. Logo image shrinks to `34px`, logo text to `1.1rem`. Hero h1 shrinks to `1.7rem`. Product images reduce to `200px`. Product info padding tightens. Cart icon shrinks to `3rem`. |

---

### `script.js` — JavaScript Logic (87 lines)

No libraries — pure vanilla ES5 JavaScript.

#### Line-by-line breakdown

| Lines | What is implemented |
|-------|---------------------|
| 1–11 | **File header comment** — Documents all 5 features: hamburger toggle, hamburger→X animation, smooth slide-down, close on nav link click, close on outside click. |
| 15–16 | **Element selection** — `var hamburger = document.getElementById('hamburger-btn')` and `var navMenu = document.getElementById('nav-menu')` grab the two navbar elements by their IDs. Uses `var` (ES5, not `const`/`let`). |
| 19–67 | **Guard check** — `if (hamburger && navMenu)` — the entire menu block only runs if both elements exist on the page. This prevents errors on pages where they might be missing. |
| 24–35 | **Feature 1 & 2: Hamburger toggle** — An `'click'` event listener on `hamburger`. On each click: `navMenu.classList.toggle('open')` adds/removes the `open` class on the `<ul>`, which CSS uses to slide the menu down (max-height transition). `hamburger.classList.toggle('active')` adds/removes the `active` class on the button, which CSS uses to animate the 3 bars into an X. `hamburger.setAttribute('aria-expanded', isOpen)` updates the accessibility attribute to reflect the current open/closed state. |
| 41–49 | **Bonus Feature: Close on nav link click** — `document.querySelectorAll('.nav-links a')` selects all 4 nav links. A `'click'` listener is added to each via `forEach`. When any link is clicked: removes `open` from navMenu, removes `active` from hamburger, resets `aria-expanded` to `'false'`. This closes the mobile menu when navigating to a page. |
| 55–65 | **Bonus Feature: Close on outside click** — A `'click'` listener on `document` (the whole page). On every click, it checks `hamburger.contains(event.target) || navMenu.contains(event.target)` — if the click originated inside the hamburger button or nav menu, `clickedInsideNav` is `true`. If it is `false` (clicked somewhere else on the page), the menu is closed by removing `open`/`active` and resetting `aria-expanded`. |
| 73–86 | **Login Form Handler** — `var loginForm = document.getElementById('login-form')` selects the form (only exists on login.html). Inside an `if (loginForm)` guard: a `'submit'` event listener is added. `event.preventDefault()` stops the browser from actually submitting/reloading the page. The email and password field values are read. If both have values (truthy), `alert('Login successful! Welcome to RoyalTag.')` is shown. There is **no real authentication** — this is front-end only. |

---

### `images/logo.png` — Brand Logo (303 KB)

A single PNG image file used in:
- The **navbar** on all 4 pages (`<img src="images/logo.png" alt="RoyalTag Logo">`)
- The **login card header** (`<img src="images/logo.png" alt="RoyalTag" class="login-logo">`)

---

## Color Palette

| Color | Hex | Used For |
|-------|-----|---------|
| Dark Navy (Primary) | `#1a1a2e` | Navbar, footer, buttons, headings |
| Deep Blue (Gradient) | `#16213e` / `#0f3460` | Hero gradient |
| Gold (Accent) | `#e8b86d` | Logo text, prices, active links, CTA buttons, focus borders |
| Gold Dark (Hover) | `#d4a055` | Hover state for gold elements |
| Off-White (Background) | `#f5f5f0` | Page background |
| White | `#ffffff` | Cards, product cards, login card |
| Light Grey | `#aaaaaa` / `#cccccc` / `#888888` | Subtitles, secondary text, nav links |
| Border | `#eaeaea` | Card borders |
| Panel Divider | `#2e2e4e` | Mobile nav item borders |

---

## Responsive Breakpoints

| Breakpoint | Width | Key Changes |
|-----------|-------|-------------|
| Desktop | > 900px | 3-column product grid, horizontal navbar links, hamburger hidden |
| Tablet | ≤ 900px | 2-column product grid, smaller hero h1 |
| Mobile | ≤ 768px | 1-column product grid, hamburger menu visible, vertical slide-down nav |
| Small Mobile | ≤ 480px | Smaller navbar, smaller fonts, compact hero and product cards |

---

## What is NOT Implemented (Gaps)

- **No real cart functionality** — "Add to Cart" buttons exist but do nothing. Cart page is a static empty state with no items.
- **No real authentication** — Login form only shows a JavaScript `alert()` on submit.
- **No product images** — Product cards use CSS gradient placeholder divs (`img-1` through `img-12`) instead of real photos.
- **No backend / database** — Fully static site, no server-side code.
- **No "Forgot Password" or "Create Account"** — Those links point to `href="#"` (no destination).
- **No search, filtering, or sorting** — Products page has no filter controls.
- **No quantity or price total** on the cart page.
