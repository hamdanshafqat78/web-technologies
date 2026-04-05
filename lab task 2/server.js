// ============================================
// RoyalTag - Lab Task 2
// server.js - Express + EJS Application
// Based on boilerplate from:
// github.com/mua22/merrn-web-book-demos/node/04-express-with-ejs
// ============================================

// Import the express module
let express = require("express");

// Initialize an express application
let app = express();

// Set EJS as the templating engine
// Express will look for .ejs files inside the /views folder
app.set("view engine", "ejs");

// Serve static files (CSS, JS, images) from the 'public' directory
// Reference these in EJS as /css/style.css, /js/script.js, /images/logo.png
app.use(express.static("public"));

// -----------------------------------------------
// Define route for the Home Page ( / )
// -----------------------------------------------
app.get("/", function (req, res) {
  // Pass product data from server to the EJS view
  let products = [
    { name: "Premium Polo Shirt",  price: "$49.00", imgClass: "img-1" },
    { name: "Formal Dress Shirt",  price: "$65.00", imgClass: "img-2" },
    { name: "Casual Jacket",       price: "$89.00", imgClass: "img-3" },
    { name: "Slim Fit Chinos",     price: "$55.00", imgClass: "img-4" },
    { name: "Cotton Kurta",        price: "$39.00", imgClass: "img-5" },
    { name: "Classic Waistcoat",   price: "$72.00", imgClass: "img-6" }
  ];

  // Render the homepage.ejs view and pass data to it
  return res.render("homepage", {
    pageTitle: "RoyalTag - Home",
    activePage: "home",
    products: products
  });
});

// -----------------------------------------------
// Start the server on port 3000
// -----------------------------------------------
app.listen(3000, function () {
  console.log("Server started at http://localhost:3000");
});

console.log("Console from server.js - RoyalTag Express App");
