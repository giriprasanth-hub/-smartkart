const WishlistModel = require("../modals/WishlistModel");


const getWishlist = async (req, res) => {
  try {
    const wishlist = await WishlistModel.find()
  .populate("userId", "name email")
  .populate("items.productId", "name price image");
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
};

const getWishlistByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const wishlist = await WishlistModel.findOne({ userId })
      .populate("items.productId", "name price image");

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    console.error("Wishlist fetch error:", error);
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
};


const addToWishlist = async (req, res) => {
  const { userId, productId, name, price } = req.body;

  try {
    let wishlist = await WishlistModel.findOne({ userId });

    if (wishlist) {
      const alreadyExists = wishlist.items.some(item => item.productId.toString() === productId);
      

      if (alreadyExists) {
        return res.status(200).json({ message: "Product already in wishlist" , wishlist });
      }
      
      wishlist.items.push({ productId, name, price });
      wishlist.updatedAt = new Date();
      await wishlist.save();
      return res.status(200).json({ message: "Product added" ,wishlist });
    } else {
      const newWishlist = await WishlistModel.create({
        userId,
        items: [{ productId, name, price }]
      });
      return res.status(201).json(newWishlist);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding to wishlist" });
  }
};


const removeFromWishlist = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const wishlist = await WishlistModel.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);
    wishlist.updatedAt = new Date();
    await wishlist.save();

    res.status(200).json({ message: "Product removed", wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error removing from wishlist" });
  }
};


const clearWishlist = async (req, res) => {
  const { userId } = req.params;

  try {
    const wishlist = await WishlistModel.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items = [];
    wishlist.updatedAt = new Date();
    await wishlist.save();

    res.status(200).json({ message: "Wishlist cleared", wishlist });
  } catch (error) {
    res.status(500).json({ error: "Error clearing wishlist" });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  getWishlistByUser
};
