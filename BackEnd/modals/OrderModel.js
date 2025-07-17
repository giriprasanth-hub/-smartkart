const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'upi', 'card'],
    required: true
  },
  upiId: {
    type: String // Not required
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  totalQuantity: {
    type: Number,
    required: true
  },
  deliveryAddress: {
    type: String,
    required: true
  }
});

const OrderModel = mongoose.model('order', orderSchema);
module.exports = OrderModel;
