const express = require("express");
const router = express.Router();
// Missing this line:
const Product = require("../modals/ProductModel"); 

const { getProduct, getProductById, createProduct,  uploadImageOnly, updateImage } = require("../controllers/ProductController");

router.get("/", getProduct);                         // GET /products
router.post("/bulk", createProduct);                 // POST /products/bulk
router.post("/upload", uploadImageOnly);             // POST /products/upload
router.post("/image", updateImage);                  // POST /products/image

router.get("/:id", getProductById);  
router.put("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const { stock } = req.body;

    if (typeof stock !== "number") {
      return res.status(400).json({ message: "Stock must be a number" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: { stock } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ message: "Error updating product" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting product" });
  }
});        

module.exports = router;
