/* ================================================
   RoyalTag - Lab Assignment 4
   Mongoose Order Schema
   ================================================ */

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Order must belong to a user']
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product'
                },
                name: {
                    type: String,
                    required: true
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0
                },
                qty: {
                    type: Number,
                    required: true,
                    min: 1
                }
            }
        ],
        total: {
            type: Number,
            required: true,
            min: 0
        },
        status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
