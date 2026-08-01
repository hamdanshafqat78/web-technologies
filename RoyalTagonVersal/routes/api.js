/* ================================================
   RoyalTag - Lab Assignment 4
   routes/api.js — RESTful API Routes (/api/v1)
   All routes return JSON (no EJS rendering)
   ================================================ */

const express     = require('express');
const jwt         = require('jsonwebtoken');
const Product     = require('../models/Product');
const User        = require('../models/User');
const Order       = require('../models/Order');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// ════════════════════════════════════════════════
// AUTH ENDPOINTS
// ════════════════════════════════════════════════

/**
 * POST /api/v1/auth/login
 * Public — Authenticate user and return JWT token
 */
router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both email and password.'
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        // Compare password using bcrypt
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        // Generate JWT token
        const payload = {
            user_id: user._id,
            role:    user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h'
        });

        res.status(200).json({
            success: true,
            message: `Welcome back, ${user.name}!`,
            token,
            user: {
                id:    user._id,
                name:  user.name,
                email: user.email,
                role:  user.role
            }
        });

    } catch (err) {
        console.error('API Login Error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.'
        });
    }
});

// ════════════════════════════════════════════════
// PUBLIC PRODUCT ENDPOINTS
// ════════════════════════════════════════════════

/**
 * GET /api/v1/products
 * Public — List products with pagination, search, category & price filters
 *
 * Query params: page, search, category, minPrice, maxPrice, sort
 */
router.get('/products', async (req, res) => {
    try {
        const LIMIT = 8;
        const page  = Math.max(1, parseInt(req.query.page) || 1);
        const filter = {};

        // Search by name
        if (req.query.search && req.query.search.trim()) {
            filter.name = { $regex: req.query.search.trim(), $options: 'i' };
        }

        // Filter by category
        if (req.query.category && req.query.category !== 'All') {
            filter.category = req.query.category;
        }

        // Filter by price range
        const minP = parseFloat(req.query.minPrice);
        const maxP = parseFloat(req.query.maxPrice);
        if (!isNaN(minP) || !isNaN(maxP)) {
            filter.price = {};
            if (!isNaN(minP)) filter.price.$gte = minP;
            if (!isNaN(maxP)) filter.price.$lte = maxP;
        }

        // Sort
        let sortObj = {};
        switch (req.query.sort) {
            case 'price_asc':  sortObj = { price:  1 }; break;
            case 'price_desc': sortObj = { price: -1 }; break;
            case 'rating':     sortObj = { rating:-1 }; break;
            case 'newest':     sortObj = { createdAt:-1 }; break;
            default:           sortObj = { _id: 1 };
        }

        const total      = await Product.countDocuments(filter);
        const totalPages = Math.ceil(total / LIMIT) || 1;
        const safePage   = Math.min(page, totalPages);
        const products   = await Product.find(filter)
            .sort(sortObj)
            .skip((safePage - 1) * LIMIT)
            .limit(LIMIT);

        res.status(200).json({
            success: true,
            count: total,
            page: safePage,
            totalPages,
            products
        });

    } catch (err) {
        console.error('API Products Error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products.'
        });
    }
});

/**
 * GET /api/v1/products/:id
 * Public — Get a single product by ID
 */
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.'
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (err) {
        // Handle invalid ObjectId format
        if (err.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID format.'
            });
        }
        console.error('API Product Detail Error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product.'
        });
    }
});

// ════════════════════════════════════════════════
// PROTECTED ENDPOINTS (Require JWT)
// ════════════════════════════════════════════════

/**
 * GET /api/v1/user/profile
 * Protected — Returns authenticated user's data
 */
router.get('/user/profile', verifyToken, async (req, res) => {
    try {
        // req.user._id was set by verifyToken middleware
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id:        user._id,
                name:      user.name,
                email:     user.email,
                role:      user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (err) {
        console.error('API Profile Error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile.'
        });
    }
});

/**
 * POST /api/v1/orders
 * Protected — Submit a new order
 *
 * Body: { items: [{ product: "id", name: "...", price: 49, qty: 2 }, ...] }
 */
router.post('/orders', verifyToken, async (req, res) => {
    try {
        const { items } = req.body;

        // Validate items array
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Order must contain at least one item.'
            });
        }

        // Validate each item
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (!item.name || !item.price || !item.qty) {
                return res.status(400).json({
                    success: false,
                    message: `Item at index ${i} is missing required fields (name, price, qty).`
                });
            }
            if (item.price < 0 || item.qty < 1) {
                return res.status(400).json({
                    success: false,
                    message: `Item at index ${i} has invalid price or quantity.`
                });
            }
        }

        // Calculate total
        const total = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

        // Create order
        const order = await Order.create({
            user:  req.user._id,
            items: items.map(item => ({
                product: item.product || undefined,
                name:    item.name,
                price:   item.price,
                qty:     item.qty
            })),
            total
        });

        res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            order: {
                id:     order._id,
                items:  order.items,
                total:  order.total,
                status: order.status,
                createdAt: order.createdAt
            }
        });

    } catch (err) {
        console.error('API Order Error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to place order.'
        });
    }
});

module.exports = router;
