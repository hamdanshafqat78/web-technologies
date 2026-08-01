/* ================================================
   RoyalTag - Lab Assignment 4
   server.js — Express app with Authentication,
   RBAC, and RESTful API with JWT
   ================================================ */

require('dotenv').config();

const express       = require('express');
const mongoose      = require('mongoose');
const path          = require('path');
const session       = require('express-session');
const MongoStore    = require('connect-mongo');
const flash         = require('connect-flash');
const multer        = require('multer');
const fs            = require('fs');
const Product       = require('./models/Product');
const User          = require('./models/User');
const Order         = require('./models/Order');
const { isLoggedIn, isAdmin } = require('./middleware/auth');
const apiRoutes     = require('./routes/api');

const app  = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/royaltag_lab4';

// ── View Engine ──────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Static Files ─────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
try {
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
} catch (err) {
    console.warn('Uploads directory creation skipped:', err.message);
}

// ── Body Parser ──────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ── Session with MongoDB Store ───────────────────
app.use(session({
    secret: 'royaltag_auth_secret_2025',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGO_URI,
        collectionName: 'sessions'
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }   // 24 hours
}));

// ── Flash Messages ───────────────────────────────
app.use(flash());

// ── Global Locals (available in all views) ───────
app.use((req, res, next) => {
    res.locals.success     = req.flash('success');
    res.locals.error       = req.flash('error');
    res.locals.currentUser = req.session.user || null;
    next();
});

// ── Multer — Image Upload ─────────────────────────
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename:    (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1e6) + ext);
    }
});
const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// ── MongoDB Connection ───────────────────────────
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅  MongoDB connected'))
    .catch(err  => console.error('❌  MongoDB error:', err.message));

// ── Mount RESTful API Routes ─────────────────────
app.use('/api/v1', apiRoutes);

// ════════════════════════════════════════════════
// PUBLIC ROUTES
// ════════════════════════════════════════════════

app.get('/', async (req, res) => {
    try {
        const featured = await Product.find().sort({ rating: -1 }).limit(6);
        res.render('index', { featured });
    } catch (err) {
        console.error(err);
        res.render('index', { featured: [] });
    }
});

app.get('/products', async (req, res) => {
    try {
        const LIMIT = 8;
        const page  = Math.max(1, parseInt(req.query.page) || 1);
        const filter = {};

        if (req.query.search && req.query.search.trim())
            filter.name = { $regex: req.query.search.trim(), $options: 'i' };
        if (req.query.category && req.query.category !== 'All')
            filter.category = req.query.category;

        const minP = parseFloat(req.query.minPrice);
        const maxP = parseFloat(req.query.maxPrice);
        if (!isNaN(minP) || !isNaN(maxP)) {
            filter.price = {};
            if (!isNaN(minP)) filter.price.$gte = minP;
            if (!isNaN(maxP)) filter.price.$lte = maxP;
        }

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
        const products   = await Product.find(filter).sort(sortObj).skip((safePage-1)*LIMIT).limit(LIMIT);
        const categories = ['All','Electronics','Fashion','Home','Sports','Books'];

        res.render('products', { products, page: safePage, totalPages, total, query: req.query, categories });
    } catch (err) {
        console.error(err);
        res.render('products', { products:[], page:1, totalPages:1, total:0, query:req.query, categories:['All','Electronics','Fashion','Home','Sports','Books'] });
    }
});

app.get('/cart', (req, res) => res.render('cart'));

/* ── On-Sale Products ── */
app.get('/onsale-products', async (req, res) => {
    try {
        const onsaleProducts = await Product.find({ isOnSale: true }).sort({ createdAt: -1 });
        res.render('onsale', { onsaleProducts });
    } catch (err) {
        console.error(err);
        res.render('onsale', { onsaleProducts: [] });
    }
});


// ════════════════════════════════════════════════
// AUTHENTICATION ROUTES
// ════════════════════════════════════════════════

/* ── Registration Page ── */
app.get('/register', (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('register');
});

app.post('/register', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Server-side validation
        if (!name || !email || !password) {
            req.flash('error', 'All fields are required.');
            return res.redirect('/register');
        }
        if (password.length < 6) {
            req.flash('error', 'Password must be at least 6 characters.');
            return res.redirect('/register');
        }
        if (password !== confirmPassword) {
            req.flash('error', 'Passwords do not match.');
            return res.redirect('/register');
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            req.flash('error', 'An account with that email already exists.');
            return res.redirect('/register');
        }

        // Create user (password is hashed automatically by pre-save hook)
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password
        });

        // Auto-login after registration
        req.session.user = {
            _id:   user._id,
            name:  user.name,
            email: user.email,
            role:  user.role
        };

        req.flash('success', `Welcome to RoyalTag, ${user.name}! Your account has been created.`);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Registration failed. Please try again.');
        res.redirect('/register');
    }
});

/* ── Login ── */
app.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('login');
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            req.flash('error', 'Please enter both email and password.');
            return res.redirect('/login');
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        // Compare hashed password using bcrypt
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        // Set session with user data
        req.session.user = {
            _id:   user._id,
            name:  user.name,
            email: user.email,
            role:  user.role
        };

        req.flash('success', `Welcome back, ${user.name}!`);

        // Redirect admin to dashboard, customer to home
        if (user.role === 'admin') {
            return res.redirect('/admin');
        }
        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Login failed. Please try again.');
        res.redirect('/login');
    }
});

/* ── Logout ── */
app.get('/logout', (req, res) => {
    const userName = req.session.user ? req.session.user.name : '';
    req.session.destroy((err) => {
        if (err) console.error(err);
        res.redirect('/login');
    });
});

/* ── Profile (Protected — requires login) ── */
app.get('/profile', isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id).select('-password');
        if (!user) {
            req.flash('error', 'User not found.');
            return res.redirect('/');
        }
        res.render('profile', { user });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Could not load profile.');
        res.redirect('/');
    }
});

/* ── Checkout (Protected — requires login) ── */
app.get('/checkout', isLoggedIn, (req, res) => {
    res.render('checkout');
});

/* ── Place Order (Protected — session auth, decrements stock) ── */
app.post('/place-order', isLoggedIn, async (req, res) => {
    try {
        const { items } = req.body;

        // Validate incoming cart items
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty.' });
        }

        // ── Decrement stock for every ordered item ──────────────
        for (const item of items) {
            if (!item.name || !item.qty || item.qty < 1) continue;

            const product = await Product.findOne({ name: item.name });
            if (!product) continue;

            // Clamp: never go below 0
            const newStock = Math.max(0, product.stock - item.qty);
            await Product.findByIdAndUpdate(product._id, { stock: newStock });
        }

        // ── Calculate total server-side (never trust client) ────
        const total = items.reduce((sum, i) => sum + (parseFloat(i.price) * parseInt(i.qty)), 0);

        // ── Save Order to MongoDB ───────────────────────────────
        await Order.create({
            user:  req.session.user._id,
            items: items.map(i => ({
                name:  i.name,
                price: parseFloat(i.price),
                qty:   parseInt(i.qty)
            })),
            total
        });

        return res.status(200).json({
            success: true,
            message: `Order placed! Thank you, ${req.session.user.name}.`
        });

    } catch (err) {
        console.error('Place Order Error:', err);
        return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
});

// ════════════════════════════════════════════════
// ADMIN ROUTES (Protected by isAdmin middleware)
// ════════════════════════════════════════════════

/* ── Admin Dashboard ── */
app.get('/admin', isAdmin, async (req, res) => {
    try {
        const products   = await Product.find().sort({ createdAt: -1 });
        const total      = products.length;
        const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
        const lowStock   = products.filter(p => p.stock > 0 && p.stock < 20).length;
        const outStock   = products.filter(p => p.stock === 0).length;
        const cats       = [...new Set(products.map(p => p.category))].length;

        res.render('admin/dashboard', {
            products, stats: { total, totalValue, lowStock, outStock, cats },
            success: req.flash('success'), error: req.flash('error')
        });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to load dashboard.');
        res.redirect('/');
    }
});

/* ── Add Product ── */
app.get('/admin/products/add', isAdmin, (req, res) => {
    res.render('admin/add-product', {
        categories: ['Electronics','Fashion','Home','Sports','Books'],
        error: req.flash('error'), success: req.flash('success')
    });
});

app.post('/admin/products/add', isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { name, price, category, rating, stock, description } = req.body;

        if (!name || !price || !category || !rating || !stock) {
            if (req.file) fs.unlinkSync(req.file.path);
            req.flash('error', 'All fields are required.');
            return res.redirect('/admin/products/add');
        }

        const imagePath = req.file
            ? 'uploads/' + req.file.filename
            : 'images/product-1.png';

        await Product.create({
            name: name.trim(),
            price:       parseFloat(price),
            category,
            rating:      parseFloat(rating),
            stock:       parseInt(stock),
            description: description ? description.trim() : '',
            image:       imagePath
        });

        req.flash('success', `"${name}" added successfully!`);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to add product: ' + err.message);
        res.redirect('/admin/products/add');
    }
});

/* ── Edit Product ── */
app.get('/admin/products/edit/:id', isAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) { req.flash('error', 'Product not found.'); return res.redirect('/admin'); }
        res.render('admin/edit-product', {
            product,
            categories: ['Electronics','Fashion','Home','Sports','Books'],
            error: req.flash('error'), success: req.flash('success')
        });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Product not found.');
        res.redirect('/admin');
    }
});

app.post('/admin/products/edit/:id', isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { name, price, category, rating, stock, description } = req.body;

        if (!name || !price || !category || !rating || !stock) {
            if (req.file) fs.unlinkSync(req.file.path);
            req.flash('error', 'All fields are required.');
            return res.redirect(`/admin/products/edit/${req.params.id}`);
        }

        const product = await Product.findById(req.params.id);
        if (!product) { req.flash('error', 'Product not found.'); return res.redirect('/admin'); }

        // Replace image only if new one uploaded
        if (req.file) {
            if (product.image && product.image.startsWith('uploads/')) {
                const oldPath = path.join(__dirname, 'public', product.image);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            product.image = 'uploads/' + req.file.filename;
        }

        product.name        = name.trim();
        product.price       = parseFloat(price);
        product.category    = category;
        product.rating      = parseFloat(rating);
        product.stock       = parseInt(stock);
        product.description = description ? description.trim() : '';

        await product.save();
        req.flash('success', `"${name}" updated successfully!`);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to update product: ' + err.message);
        res.redirect(`/admin/products/edit/${req.params.id}`);
    }
});

/* ── Delete Product ── */
app.post('/admin/products/delete/:id', isAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (product && product.image && product.image.startsWith('uploads/')) {
            const imgPath = path.join(__dirname, 'public', product.image);
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }
        req.flash('success', 'Product deleted successfully.');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to delete product.');
    }
    res.redirect('/admin');
});

// ── Export App & Start Server ─────────────────────
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀  RoyalTag server running → http://localhost:${PORT}`);
        console.log(`🔐  Admin panel           → http://localhost:${PORT}/admin`);
        console.log(`📡  REST API              → http://localhost:${PORT}/api/v1`);
    });
}

module.exports = app;
