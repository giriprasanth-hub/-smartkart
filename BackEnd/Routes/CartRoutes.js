const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require("../controllers/CartController");

router.get("/:userId", getCart);
router.post("/add", addToCart);
router.put("/update/:userId", updateCartItem);
router.delete("/:userId/:productId", removeCartItem);
router.delete("/clear/:userId", clearCart);

module.exports = router;
