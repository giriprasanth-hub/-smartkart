const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const http = require("http");
const server = http.createServer(app); // ✅ create HTTP server

const productRoutes = require("./Routes/ProductRoutes");
const UserRoutes = require("./Routes/UserRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const CartRoutes = require("./Routes/CartRoutes");
const wishlistRoutes = require("./Routes/WishlistRoutes");
const userExtraRoutes = require("./Routes/userExtraRoutes");
const adminRoutes = require("./Routes/AdminRoutes");
const settings = require("./Routes/settings")

const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/userextras", userExtraRoutes);
app.use("/files", express.static("./uploads"));
app.use("/profile", express.static(path.join(__dirname, "uploads/profile")));
app.use("/wishlist", wishlistRoutes);
app.use("/cart", CartRoutes);
app.use("/orders", orderRoutes);
app.use("/products", productRoutes);
app.use("/user", UserRoutes);
app.use("/admin", adminRoutes);
app.use("/settings", settings);


// Serve user build
app.use('/userapp', express.static(path.join(__dirname, 'Builds/user')));
app.get('/userapp/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Builds/user', 'index.html'));
});

// Serve admin build
app.use('/adminapp', express.static(path.join(__dirname, 'Builds/admin')));
app.get('/adminapp/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Builds/admin', 'index.html'));
});

console.log("Trying to connect to MongoDB...");

mongoose
  .connect(
    "mongodb+srv://smartkart:uaEXvx0tYevmfKpS@cluster0.vskitll.mongodb.net/smartkartDB?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("MongoDB connected successfully");

    server.listen(3333, (err) => {
      if (err) {
        console.log("Server error:", err);
      } else {
        console.log("Server running on port 3333");
      }
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });
