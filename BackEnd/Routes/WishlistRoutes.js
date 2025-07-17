// wishlistRoutes.js
const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  getWishlistByUser
} = require("../controllers/WishlistController");

router.get('/:userId', getWishlistByUser);
router.post('/add', addToWishlist);
router.delete('/:userId/:productId', removeFromWishlist);
router.delete('/clear/:userId', clearWishlist);

module.exports = router;
