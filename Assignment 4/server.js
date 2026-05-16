/* ================================================
   RoyalTag - Assignment 4
   server.js — Express app with Admin Panel
   ================================================ */

const express       = require('express');
const mongoose      = require('mongoose');
const path          = require('path');
const session       = require('express-session');
const flash         = require('connect-flash');
const multer        = require('multer');
const fs            = require('fs');
const Product       = require('./models/Product');
const requireAdmin  = require('./middleware/auth');

const app  = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = 'mongodb://localhost:27017/royaltag_assignment4';

// ── Admin Credentials (hard-coded for simplicity) ──
const ADMIN_EMAIL    = 'admin@royaltag.com';
const ADMIN_PASSWORD = 'admin123';

// ── View Engine ──────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Static Files ─────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ── Body Parser ──────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ── Session ──────────────────────────────────────
app.use(session({
    secret: 'royaltag_admin_secret_2025',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 }   // 2 hours
}));

// ── Flash Messages ───────────────────────────────
app.use(flash());

// ── Flash locals (available in all views) ────────
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error   = req.flash('error');
    res.locals.isAdmin = req.session.isAdmin || false;
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

// ════════════════════════════════════════════════
// PUBLIC ROUTES (from Assignment 3)
// ════════════════════════════════════════════════

app.get('/', async (req, res) => {
    try {
        const featured = await Product.find().sort({ rating: -1 }).limit(6);
        res.render('index', { featured });
    } catch { res.render('index', { featured: [] }); }
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

app.get('/cart',  (req, res) => res.render('cart'));
app.get('/login', (req, res) => res.render('login', { error: null }));
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (email && password) return res.redirect('/');
    res.render('login', { error: 'Please enter valid credentials.' });
});

// ════════════════════════════════════════════════
// ADMIN ROUTES
// ════════════════════════════════════════════════

/* ── Admin Login ── */
app.get('/admin/login', (req, res) => {
    if (req.session.isAdmin) return res.redirect('/admin');
    res.render('admin-login', { error: req.flash('error') });
});

app.post('/admin/login', (req, res) => {
    const { email, password } = req.body;
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        req.session.isAdmin = true;
        req.flash('success', 'Welcome back, Admin!');
        return res.redirect('/admin');
    }
    req.flash('error', 'Invalid admin credentials.');
    res.redirect('/admin/login');
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

/* ── Admin Dashboard ── */
app.get('/admin', requireAdmin, async (req, res) => {
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
        res.redirect('/admin/login');
    }
});

/* ── Add Product ── */
app.get('/admin/products/add', requireAdmin, (req, res) => {
    res.render('admin/add-product', {
        categories: ['Electronics','Fashion','Home','Sports','Books'],
        error: req.flash('error'), success: req.flash('success')
    });
});

app.post('/admin/products/add', requireAdmin, upload.single('image'), async (req, res) => {
    try {
        const { name, price, category, rating, stock, description } = req.body;

        // Server-side validation
        if (!name || !price || !category || !rating || !stock) {
            if (req.file) fs.unlinkSync(req.file.path);
            req.flash('error', 'All fields are required.');
            return res.redirect('/admin/products/add');
        }

        const imagePath = req.file
            ? 'uploads/' + req.file.filename
            : 'product-1.png';

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
app.get('/admin/products/edit/:id', requireAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) { req.flash('error', 'Product not found.'); return res.redirect('/admin'); }
        res.render('admin/edit-product', {
            product,
            categories: ['Electronics','Fashion','Home','Sports','Books'],
            error: req.flash('error'), success: req.flash('success')
        });
    } catch {
        req.flash('error', 'Product not found.');
        res.redirect('/admin');
    }
});

app.post('/admin/products/edit/:id', requireAdmin, upload.single('image'), async (req, res) => {
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
            // Delete old uploaded image (not the seeded ones)
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
app.post('/admin/products/delete/:id', requireAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (product && product.image && product.image.startsWith('uploads/')) {
            const imgPath = path.join(__dirname, 'public', product.image);
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }
        req.flash('success', 'Product deleted successfully.');
    } catch {
        req.flash('error', 'Failed to delete product.');
    }
    res.redirect('/admin');
});

// ── Start Server ─────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀  RoyalTag server running → http://localhost:${PORT}`);
    console.log(`🔐  Admin panel           → http://localhost:${PORT}/admin`);
});
