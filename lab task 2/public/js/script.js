/* ================================================
   RoyalTag - Lab Task 2 (Express + EJS)
   public/js/script.js
   Client-side JavaScript — served as static file
   Referenced in EJS as: src="/js/script.js"
   ================================================ */

// Select navbar elements
var hamburger = document.getElementById('hamburger-btn');
var navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {

    // Toggle menu open/close on hamburger click
    hamburger.addEventListener('click', function () {
        navMenu.classList.toggle('open');
        hamburger.classList.toggle('active');
        var isOpen = navMenu.classList.contains('open');
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a nav link is clicked
    document.querySelectorAll('.nav-links a').forEach(function (link) {
        link.addEventListener('click', function () {
            navMenu.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside the navbar
    document.addEventListener('click', function (event) {
        var clickedInside = hamburger.contains(event.target) || navMenu.contains(event.target);
        if (!clickedInside) {
            navMenu.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}
