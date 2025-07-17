const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true 
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: String,
      price: Number
    }
  ],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const WishlistModel = mongoose.model('Wishlist', wishlistSchema);
module.exports = WishlistModel;
  