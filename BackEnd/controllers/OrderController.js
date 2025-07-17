const OrderModel = require("../modals/OrderModel");
const UserModel = require("../modals/Usermodel");
const ProductModel = require("../modals/ProductModel");
const UserExtraModel = require("../modals/UserExtrasModel"); 

const createOrder = async (req, res) => {
  try {
    const { userId, products, totalAmount, paymentMethod, upiId, deliveryAddress } = req.body;

    if (!userId || !products || !totalAmount || !paymentMethod || !deliveryAddress) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const totalQuantity = products.length;

    const newOrder = new OrderModel({
      userId,
      products,
      totalAmount,
      totalQuantity,
      paymentMethod,
      deliveryAddress,
      ...(upiId && { upiId }) // Only add if present
    });

    await newOrder.save();

    res.status(200).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Failed to place order", error });
  }
};




const getOrders = async (req, res) => {
  try {
    const { userId } = req.query;

    let query = {};
    if (userId) {
      query.userId = userId;
    }

    const orders = await OrderModel.find(query)
      .populate("userId", "name email")
      .populate("products", "name price image"); 

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Orders" });
  }
};

const generateReport = async (req, res) => {
  try {
    const { reportType, customer, product, startDate, endDate } = req.query;

    const filter = {};

    // Date Filter
    if (reportType === 'weekly') {
      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);
      filter.orderDate = { $gte: last7Days };
    } else if (reportType === 'monthly') {
      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);
      filter.orderDate = { $gte: last30Days };
    } else if (startDate && endDate) {
      filter.orderDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Search by Customer Name
    if (customer) {
      const user = await UserModel.findOne({ name: new RegExp(customer, "i") });
      if (user) filter.userId = user._id;
      else return res.status(200).json([]); // No match
    }

    // Fetch orders and populate product & user
    const orders = await OrderModel.find(filter)
      .populate("userId", "name")
      .populate("products", "name price");

    // Filter by product name
    let finalOrders = orders;
    if (product) {
      finalOrders = orders.filter(order =>
        order.products.some(p => p.name.toLowerCase().includes(product.toLowerCase()))
      );
    }

    res.status(200).json(finalOrders);
  } catch (err) {
    console.error("Report fetch error", err);
    res.status(500).json({ message: "Error generating report" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const result = await OrderModel.findByIdAndUpdate(orderId, { status: "Cancelled" }, { new: true });

    if (!result) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Order cancelled", order: result });
  } catch (err) {
    console.error("Error cancelling order:", err);
    res.status(500).json({ error: "Failed to cancel order" });
  }
};



module.exports = { getOrders, createOrder ,cancelOrder, generateReport };
