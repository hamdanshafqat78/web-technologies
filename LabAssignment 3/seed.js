/* ================================================
   RoyalTag - Lab Assignment 3
   seed.js — Populate MongoDB with products + admin user
   Run: node seed.js
   ================================================ */

const mongoose = require('mongoose');
const Product  = require('./models/Product');
const User     = require('./models/User');

const MONGO_URI = 'mongodb://localhost:27017/royaltag_lab3';

const products = [
    // ── FASHION (8) ────────────────────────────────
    { name: 'Premium Polo Shirt', price: 49.00, category: 'Fashion', rating: 4.5, stock: 120, image: 'images/product-1.png', description: 'Classic polo shirt crafted from premium pique cotton.' },
    { name: 'Formal Dress Shirt', price: 65.00, category: 'Fashion', rating: 4.3, stock: 85, image: 'images/product-2.png', description: 'Crisp, wrinkle-resistant dress shirt for formal events.' },
    { name: 'Casual Jacket', price: 89.00, category: 'Fashion', rating: 4.7, stock: 40, image: 'images/product-3.png', description: 'Lightweight casual jacket with zip pockets and ribbed collar.' },
    { name: 'Slim Fit Chinos', price: 55.00, category: 'Fashion', rating: 4.2, stock: 95, image: 'images/product-4.png', description: 'Modern slim-fit chinos in stretch-cotton blend.' },
    { name: 'Cotton Kurta', price: 39.00, category: 'Fashion', rating: 4.6, stock: 150, image: 'images/product-5.png', description: 'Breathable pure-cotton kurta with hand-embroidered collar.' },
    { name: 'Classic Waistcoat', price: 72.00, category: 'Fashion', rating: 4.4, stock: 30, image: 'images/product-6.png', description: 'Tailored waistcoat in herringbone fabric.' },
    { name: 'Linen Trousers', price: 59.00, category: 'Fashion', rating: 4.1, stock: 70, image: 'images/product-7.jpg', description: 'Airy linen trousers with a relaxed tapered leg.' },
    { name: 'Embroidered Shalwar Kameez', price: 79.00, category: 'Fashion', rating: 4.8, stock: 60, image: 'images/product-8.jpg', description: 'Intricately embroidered shalwar kameez set.' },

    // ── ELECTRONICS (6) ────────────────────────────
    { name: 'Wireless Noise-Cancelling Headphones', price: 149.00, category: 'Electronics', rating: 4.9, stock: 55, image: 'images/product-9.jpg', description: 'Over-ear headphones with ANC and 30-hour battery.' },
    { name: 'Smart Watch Pro', price: 199.00, category: 'Electronics', rating: 4.6, stock: 35, image: 'images/product-10.jpg', description: 'Feature-packed smartwatch with health monitoring and GPS.' },
    { name: 'Portable Bluetooth Speaker', price: 59.00, category: 'Electronics', rating: 4.3, stock: 90, image: 'images/product-11.jpg', description: 'Compact waterproof speaker with 360° sound.' },
    { name: 'USB-C Fast Charger', price: 24.00, category: 'Electronics', rating: 4.4, stock: 200, image: 'images/product-12.jpg', description: '65W GaN fast charger with three ports.' },
    { name: 'Mechanical Gaming Keyboard', price: 89.00, category: 'Electronics', rating: 4.7, stock: 45, image: 'images/product-1.png', description: 'TKL mechanical keyboard with RGB backlighting.' },
    { name: 'Wireless Ergonomic Mouse', price: 49.00, category: 'Electronics', rating: 4.5, stock: 110, image: 'images/product-2.png', description: 'Ergonomic wireless mouse with silent clicks.' },

    // ── HOME (5) ────────────────────────────────────
    { name: 'Aromatherapy Diffuser', price: 34.00, category: 'Home', rating: 4.2, stock: 75, image: 'images/product-3.png', description: 'Ultrasonic essential oil diffuser with 7 LED modes.' },
    { name: 'Bamboo Desk Organiser', price: 28.00, category: 'Home', rating: 4.0, stock: 130, image: 'images/product-4.png', description: 'Eco-friendly bamboo organiser with 6 compartments.' },
    { name: 'Premium Throw Blanket', price: 44.00, category: 'Home', rating: 4.6, stock: 50, image: 'images/product-5.png', description: 'Luxuriously soft sherpa throw blanket. 150×200 cm.' },
    { name: 'Ceramic Pour-Over Coffee Set', price: 55.00, category: 'Home', rating: 4.7, stock: 40, image: 'images/product-6.png', description: 'Handcrafted ceramic pour-over set with matching mug.' },
    { name: 'LED Desk Lamp', price: 38.00, category: 'Home', rating: 4.3, stock: 80, image: 'images/product-7.jpg', description: 'Touch-controlled LED lamp with USB charging port.' },

    // ── SPORTS (4) ──────────────────────────────────
    { name: 'Yoga Mat Pro', price: 35.00, category: 'Sports', rating: 4.5, stock: 95, image: 'images/product-8.jpg', description: 'Extra-thick non-slip yoga mat with carry strap.' },
    { name: 'Resistance Band Set', price: 22.00, category: 'Sports', rating: 4.4, stock: 160, image: 'images/product-9.jpg', description: 'Set of 5 resistance bands in varying strengths.' },
    { name: 'Insulated Water Bottle', price: 29.00, category: 'Sports', rating: 4.8, stock: 200, image: 'images/product-10.jpg', description: 'Double-wall stainless steel bottle. 750ml.' },
    { name: 'Running Shoes', price: 110.00, category: 'Sports', rating: 4.6, stock: 55, image: 'images/product-11.jpg', description: 'Lightweight breathable running shoes.' },

    // ── BOOKS (2) ───────────────────────────────────
    { name: 'Clean Code — Robert C. Martin', price: 18.00, category: 'Books', rating: 4.9, stock: 300, image: 'images/product-12.jpg', description: 'A handbook of agile software craftsmanship.' },
    { name: 'The Pragmatic Programmer', price: 20.00, category: 'Books', rating: 4.8, stock: 250, image: 'images/product-1.png', description: '20th anniversary edition. Timeless lessons.' }
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅  Connected to MongoDB');

        // Clear existing data
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing products');

        await User.deleteMany({});
        console.log('🗑️  Cleared existing users');

        // Seed products
        await Product.insertMany(products);
        console.log(`🌱  Seeded ${products.length} products successfully`);

        // Seed admin user (password will be hashed by pre-save hook)
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@royaltag.com',
            password: 'admin123',
            role: 'admin'
        });
        console.log(`👤  Admin user created: ${admin.email} / admin123`);

        // Seed a demo customer user
        const customer = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'customer123',
            role: 'customer'
        });
        console.log(`👤  Customer user created: ${customer.email} / customer123`);

        await mongoose.disconnect();
        console.log('👋  Disconnected from MongoDB');
    } catch (err) {
        console.error('❌  Seeding failed:', err.message);
        process.exit(1);
    }
}

seed();
