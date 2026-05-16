/* ================================================
   RoyalTag - Theory Assignment 3
   seed.js — Populate MongoDB with 25 sample products
   Run: node seed.js
   ================================================ */

const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGO_URI = 'mongodb://localhost:27017/royaltag_assignment4';

const products = [
    // ── FASHION (8) ────────────────────────────────
    {
        name: 'Premium Polo Shirt',
        price: 49.00,
        category: 'Fashion',
        rating: 4.5,
        stock: 120,
        image: 'product-1.png',
        description: 'Classic polo shirt crafted from premium pique cotton. Perfect for casual or semi-formal occasions.'
    },
    {
        name: 'Formal Dress Shirt',
        price: 65.00,
        category: 'Fashion',
        rating: 4.3,
        stock: 85,
        image: 'product-2.png',
        description: 'Crisp, wrinkle-resistant dress shirt ideal for boardroom meetings and formal events.'
    },
    {
        name: 'Casual Jacket',
        price: 89.00,
        category: 'Fashion',
        rating: 4.7,
        stock: 40,
        image: 'product-3.png',
        description: 'Lightweight casual jacket with a relaxed fit. Features zip pockets and a ribbed collar.'
    },
    {
        name: 'Slim Fit Chinos',
        price: 55.00,
        category: 'Fashion',
        rating: 4.2,
        stock: 95,
        image: 'product-4.png',
        description: 'Modern slim-fit chinos in stretch-cotton blend. Available in multiple colours.'
    },
    {
        name: 'Cotton Kurta',
        price: 39.00,
        category: 'Fashion',
        rating: 4.6,
        stock: 150,
        image: 'product-5.png',
        description: 'Breathable pure-cotton kurta with hand-embroidered collar. Ideal for festive wear.'
    },
    {
        name: 'Classic Waistcoat',
        price: 72.00,
        category: 'Fashion',
        rating: 4.4,
        stock: 30,
        image: 'product-6.png',
        description: 'Tailored waistcoat in herringbone fabric. Pairs beautifully with dress trousers.'
    },
    {
        name: 'Linen Trousers',
        price: 59.00,
        category: 'Fashion',
        rating: 4.1,
        stock: 70,
        image: 'product-7.jpg',
        description: 'Airy linen trousers with a relaxed tapered leg. Perfect for warm weather outings.'
    },
    {
        name: 'Embroidered Shalwar Kameez',
        price: 79.00,
        category: 'Fashion',
        rating: 4.8,
        stock: 60,
        image: 'product-8.jpg',
        description: 'Intricately embroidered shalwar kameez set with matching dupatta. Eid-ready style.'
    },

    // ── ELECTRONICS (6) ────────────────────────────
    {
        name: 'Wireless Noise-Cancelling Headphones',
        price: 149.00,
        category: 'Electronics',
        rating: 4.9,
        stock: 55,
        image: 'product-9.jpg',
        description: 'Over-ear headphones with active noise cancellation, 30-hour battery, and foldable design.'
    },
    {
        name: 'Smart Watch Pro',
        price: 199.00,
        category: 'Electronics',
        rating: 4.6,
        stock: 35,
        image: 'product-10.jpg',
        description: 'Feature-packed smartwatch with health monitoring, GPS, and 7-day battery life.'
    },
    {
        name: 'Portable Bluetooth Speaker',
        price: 59.00,
        category: 'Electronics',
        rating: 4.3,
        stock: 90,
        image: 'product-11.jpg',
        description: 'Compact waterproof speaker with 360° sound and 12-hour playtime.'
    },
    {
        name: 'USB-C Fast Charger',
        price: 24.00,
        category: 'Electronics',
        rating: 4.4,
        stock: 200,
        image: 'product-12.jpg',
        description: '65W GaN fast charger with three ports. Charges laptop, phone, and tablet simultaneously.'
    },
    {
        name: 'Mechanical Gaming Keyboard',
        price: 89.00,
        category: 'Electronics',
        rating: 4.7,
        stock: 45,
        image: 'product-1.png',
        description: 'TKL mechanical keyboard with RGB backlighting and tactile switches.'
    },
    {
        name: 'Wireless Ergonomic Mouse',
        price: 49.00,
        category: 'Electronics',
        rating: 4.5,
        stock: 110,
        image: 'product-2.png',
        description: 'Ergonomic wireless mouse with silent clicks and precision scroll wheel.'
    },

    // ── HOME (5) ────────────────────────────────────
    {
        name: 'Aromatherapy Diffuser',
        price: 34.00,
        category: 'Home',
        rating: 4.2,
        stock: 75,
        image: 'product-3.png',
        description: 'Ultrasonic essential oil diffuser with 7 LED colour modes and auto shut-off.'
    },
    {
        name: 'Bamboo Desk Organiser',
        price: 28.00,
        category: 'Home',
        rating: 4.0,
        stock: 130,
        image: 'product-4.png',
        description: 'Eco-friendly bamboo organiser with 6 compartments. Keeps your workspace tidy.'
    },
    {
        name: 'Premium Throw Blanket',
        price: 44.00,
        category: 'Home',
        rating: 4.6,
        stock: 50,
        image: 'product-5.png',
        description: 'Luxuriously soft sherpa throw blanket. Machine washable, 150×200 cm.'
    },
    {
        name: 'Ceramic Pour-Over Coffee Set',
        price: 55.00,
        category: 'Home',
        rating: 4.7,
        stock: 40,
        image: 'product-6.png',
        description: 'Handcrafted ceramic pour-over set with matching mug and dripper stand.'
    },
    {
        name: 'LED Desk Lamp',
        price: 38.00,
        category: 'Home',
        rating: 4.3,
        stock: 80,
        image: 'product-7.jpg',
        description: 'Touch-controlled LED lamp with 3 colour temperatures and USB charging port.'
    },

    // ── SPORTS (4) ──────────────────────────────────
    {
        name: 'Yoga Mat Pro',
        price: 35.00,
        category: 'Sports',
        rating: 4.5,
        stock: 95,
        image: 'product-8.jpg',
        description: 'Extra-thick non-slip yoga mat with carry strap. 6mm cushioning for joint support.'
    },
    {
        name: 'Resistance Band Set',
        price: 22.00,
        category: 'Sports',
        rating: 4.4,
        stock: 160,
        image: 'product-9.jpg',
        description: 'Set of 5 resistance bands in varying strengths. Ideal for home workouts.'
    },
    {
        name: 'Insulated Water Bottle',
        price: 29.00,
        category: 'Sports',
        rating: 4.8,
        stock: 200,
        image: 'product-10.jpg',
        description: 'Double-wall stainless steel bottle keeps drinks cold 24h / hot 12h. 750ml.'
    },
    {
        name: 'Running Shoes',
        price: 110.00,
        category: 'Sports',
        rating: 4.6,
        stock: 55,
        image: 'product-11.jpg',
        description: 'Lightweight breathable running shoes with responsive foam midsole.'
    },

    // ── BOOKS (2) ───────────────────────────────────
    {
        name: 'Clean Code — Robert C. Martin',
        price: 18.00,
        category: 'Books',
        rating: 4.9,
        stock: 300,
        image: 'product-12.jpg',
        description: 'A handbook of agile software craftsmanship. Essential reading for every developer.'
    },
    {
        name: 'The Pragmatic Programmer',
        price: 20.00,
        category: 'Books',
        rating: 4.8,
        stock: 250,
        image: 'product-1.png',
        description: '20th anniversary edition. Timeless lessons on software development excellence.'
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅  Connected to MongoDB');

        await Product.deleteMany({});
        console.log('🗑️  Cleared existing products');

        await Product.insertMany(products);
        console.log(`🌱  Seeded ${products.length} products successfully`);

        await mongoose.disconnect();
        console.log('👋  Disconnected from MongoDB');
    } catch (err) {
        console.error('❌  Seeding failed:', err.message);
        process.exit(1);
    }
}

seed();
