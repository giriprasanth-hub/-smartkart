const express = require("express");
const router = express.Router();

const { getOrders, createOrder , cancelOrder, generateReport} = require("../controllers/OrderController");

router.get("/", getOrders);


router.post("/", createOrder);
router.get("/report", generateReport);
router.put("/:id/cancel", cancelOrder);



module.exports = router;