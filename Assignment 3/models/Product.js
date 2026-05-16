/* ================================================
   RoyalTag - Theory Assignment 3
   Mongoose Product Schema
   ================================================ */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative']
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['Electronics', 'Fashion', 'Home', 'Sports', 'Books']
        },
        rating: {
            type: Number,
            default: 3.0,
            min: 0,
            max: 5
        },
        stock: {
            type: Number,
            default: 0,
            min: 0
        },
        image: {
            type: String,
            default: 'product-1.png'
        },
        description: {
            type: String,
            default: ''
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
