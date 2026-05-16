/* ================================================
   RoyalTag - Theory Assignment 3
   server.js — Express application entry point
   ================================================ */

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = 'mongodb://localhost:27017/royaltag_assignment3';

// ── View Engine ──────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Static Files ─────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── Body Parser ──────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ── MongoDB Connection ───────────────────────────
mongoose
    .connect(MONGO_URI)
    .then(() => console.log('✅  MongoDB connected'))
    .catch((err) => console.error('❌  MongoDB connection error:', err.message));

// ════════════════════════════════════════════════
// ROUTES
// ════════════════════════════════════════════════

/* ── HOME ── */
app.get('/', async (req, res) => {
    try {
        // Grab 6 featured products (highest rated) for the home carousel
        const featured = await Product.find().sort({ rating: -1 }).limit(6);
        res.render('index', { featured });
    } catch (err) {
        console.error(err);
        res.render('index', { featured: [] });
    }
});

/* ── PRODUCTS — main assignment route ── */
app.get('/products', async (req, res) => {
    try {
        const LIMIT = 8;
        const page = Math.max(1, parseInt(req.query.page) || 1);

        // Build filter object from query params
        const filter = {};

        if (req.query.search && req.query.search.trim() !== '') {
            filter.name = { $regex: req.query.search.trim(), $options: 'i' };
        }

        if (req.query.category && req.query.category !== 'All') {
            filter.category = req.query.category;
        }

        const minPrice = parseFloat(req.query.minPrice);
        const maxPrice = parseFloat(req.query.maxPrice);
        if (!isNaN(minPrice) || !isNaN(maxPrice)) {
            filter.price = {};
            if (!isNaN(minPrice)) filter.price.$gte = minPrice;
            if (!isNaN(maxPrice)) filter.price.$lte = maxPrice;
        }

        // Sort option
        let sortObj = {};
        switch (req.query.sort) {
            case 'price_asc':  sortObj = { price: 1 };  break;
            case 'price_desc': sortObj = { price: -1 }; break;
            case 'rating':     sortObj = { rating: -1 }; break;
            case 'newest':     sortObj = { createdAt: -1 }; break;
            default:           sortObj = { _id: 1 };   // default: insertion order
        }

        const total      = await Product.countDocuments(filter);
        const totalPages = Math.ceil(total / LIMIT) || 1;
        const safePage   = Math.min(page, totalPages);
        const skip       = (safePage - 1) * LIMIT;

        const products = await Product.find(filter)
            .sort(sortObj)
            .skip(skip)
            .limit(LIMIT);

        // All categories for the filter dropdown
        const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Books'];

        res.render('products', {
            products,
            page: safePage,
            totalPages,
            total,
            query: req.query,
            categories
        });
    } catch (err) {
        console.error(err);
        res.render('products', {
            products: [],
            page: 1,
            totalPages: 1,
            total: 0,
            query: req.query,
            categories: ['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Books']
        });
    }
});

/* ── CART ── */
app.get('/cart', (req, res) => {
    res.render('cart');
});

/* ── LOGIN ── */
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Simple demo validation
    if (email && password) {
        return res.redirect('/');
    }
    res.render('login', { error: 'Please enter valid credentials.' });
});

// ── Start Server ─────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀  RoyalTag server running → http://localhost:${PORT}`);
});
