const CartModel = require("../modals/CartModel");
const ProductModel = require("../modals/ProductModel");

const getCart = async (req, res) => {
  try {
    const cart = await CartModel.findOne({ userId: req.params.userId })
      .populate("items.productId", "name price image");

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json(cart);
  } catch (err) {
    console.error("Cart fetch error:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;


  if (!userId || !productId || !quantity) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const product = await ProductModel.findById(productId);
    if (!product) {
      console.log("Product not found:", productId);
      return res.status(404).json({ message: "Product not found" });
    }

    const itemTotal = Number(product.price) * Number(quantity);
    if (isNaN(itemTotal)) {
      console.log("Invalid price/quantity. Price:", product.price, "Qty:", quantity);
      return res.status(400).json({ message: "Invalid price or quantity" });
    }

    let cart = await CartModel.findOne({ userId });

    if (cart) {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
      cart.totalItems += quantity;
      cart.totalAmount += itemTotal;
      cart.updatedAt = new Date();

      await cart.save();
      return res.status(200).json({ message: "Cart updated", cart });
    } else {
      const newCart = new CartModel({
        userId,
        items: [{ productId, quantity }],
        totalAmount: itemTotal,
        totalItems: quantity
      });

      await newCart.save();
      return res.status(201).json({ message: "Cart created", cart: newCart });
    }
  } catch (err) {
    console.error("Cart error:", err);
    res.status(500).json({ error: "Error adding to cart" });
  }
};


const updateCartItem = async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  try {
    const cart = await CartModel.findOne({ userId }).populate("items.productId", "price");

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item.productId._id.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: "Product not in cart" });

    
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity; 
    }

  
    let newTotal = 0;
    let newTotalItems = 0;

    cart.items.forEach(item => {
      newTotal += item.quantity * item.productId.price;
      newTotalItems += item.quantity;
    });

    cart.totalAmount = newTotal;
    cart.totalItems = newTotalItems;
    cart.updatedAt = new Date();

    await cart.save();

    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


const removeCartItem = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const cart = await CartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    cart.updatedAt = new Date();

    await cart.save();
    return res.status(200).json({ message: "Product removed", cart });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const clearCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await CartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    cart.totalAmount = 0;
    cart.totalItems = 0;
    cart.updatedAt = new Date();

    await cart.save();
    return res.status(200).json({ message: "Cart cleared", cart });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
