const express = require("express");
const router = express.Router();
const {
  createAddress,
  getAddresses,
  updateAddress,
  addUPI,
  getUPIs,
  addCard,
  getCards,
  createGiftCard,
  getGiftCards,
} = require("../controllers/userExtraController");

// ---- Address ----
router.post("/address", createAddress);
router.get("/address/:userId", getAddresses);
router.put("/address/:id", updateAddress);


// ---- UPI ----
router.post("/upi", addUPI);
router.get("/upi/:userId", getUPIs);

// ---- Cards ----
router.post("/card", addCard);
router.get("/card/:userId", getCards);

// ---- Gift Cards ----
router.post("/giftcard", createGiftCard);
router.get("/giftcard/:userId", getGiftCards);

module.exports = router;
