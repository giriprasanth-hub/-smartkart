const express = require("express");
const router = express.Router();

const {
  createAdmin,
  adminLogin,
  verifyAdmin,
  getAdminById
} = require("../controllers/AdminController");

router.post("/create", createAdmin);
router.post("/login", adminLogin);
router.get("/:id", verifyAdmin, getAdminById); // secure route

module.exports = router;
