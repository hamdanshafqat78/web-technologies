/* ================================================
   RoyalTag - Assignment 2
   script.js — Vanilla JavaScript Only
   
   Features:
   1. Hamburger menu toggle (open/close)
   2. Hamburger → X animation via CSS class
   3. Smooth slide-down using CSS max-height transition
   4. BONUS: Close menu when a nav link is clicked
   5. BONUS: Close menu when clicking outside navbar
   ================================================ */


// Select elements
var hamburger = document.getElementById('hamburger-btn');
var navMenu = document.getElementById('nav-menu');

// Only run if navbar elements exist on the page
if (hamburger && navMenu) {

    // -----------------------------------------------
    // 1. Toggle menu open/close on hamburger click
    // -----------------------------------------------
    hamburger.addEventListener('click', function () {

        // Toggle 'open' class on nav menu (triggers CSS max-height transition)
        navMenu.classList.toggle('open');

        // Toggle 'active' class on button (triggers CSS X animation)
        hamburger.classList.toggle('active');

        // Update aria-expanded for accessibility
        var isOpen = navMenu.classList.contains('open');
        hamburger.setAttribute('aria-expanded', isOpen);
    });


    // -----------------------------------------------
    // BONUS: Close menu when any nav link is clicked
    // -----------------------------------------------
    var navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            navMenu.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });


    // -----------------------------------------------
    // BONUS: Close menu when clicking outside navbar
    // -----------------------------------------------
    document.addEventListener('click', function (event) {

        // Check if click is outside both the hamburger and nav menu
        var clickedInsideNav = hamburger.contains(event.target) || navMenu.contains(event.target);

        if (!clickedInsideNav) {
            navMenu.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });

}


// -----------------------------------------------
// Login form: simple submit handler
// -----------------------------------------------
var loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        if (email && password) {
            alert('Login successful! Welcome to RoyalTag.');
        }
    });
}
