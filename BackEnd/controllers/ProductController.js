
const multer = require("multer")
const ProductModel = require("../modals/ProductModel")
const Usermodel = require("../modals/Usermodel")
const Multer = require("multer")
const path = require("path");

const storage = Multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/")
    },
    filename:(req,file,cb)=>{
        let unique_name = new Date().getTime()+"."+file.mimetype.split("/")[1]
        cb(null,"/profile/"+unique_name)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const mimeType = allowedTypes.test(file.mimetype);
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extName) {
        cb(null, true);
    } else {
        cb(new Error("Only .jpeg, .jpg, and .png files are allowed"));
    }
};


const upload = multer({
    storage:storage,
    limits: { fileSize: 2 * 1024 * 1024 }, 
    fileFilter: fileFilter
})



const getProduct = async(req,res)=>{
    try {
        const Product = await ProductModel.find()
        return res.status(200).json(Product)
    } catch (error) {
        return res.status(200).json({message:"error varuthu"})
    }
}

const createProduct = async (req, res) => {
    try {
        const products = req.body; 

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "No products provided" });
        }

        await ProductModel.insertMany(products); 

        return res.status(201).json({ message: "Products saved successfully" });
    } catch (error) {
        console.error("Product creation error:", error);
        res.status(500).json({ message: "Something went wrong while saving products" });
    }
};

// Add this function
const uploadImageOnly = (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    return res.status(200).json({
      message: "Upload successful",
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`
    });
  });
};



const updateImage = (req, res) => {
    upload.single("image")(req, res, async (err) => {
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: "File size exceeds 2MB limit" });
        }

        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded or invalid file type" });
            }

            const product = await ProductModel.findById(req.body.id);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            product.image = req.file.filename;
            await product.save();

            return res.status(200).json({ message: "Image updated successfully" });
        } catch (error) {
            console.error(error);      
            return res.status(500).json({ message: "Internal server error" });
        }
    });
};
const getProductById = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Error fetching product" });
  }
};

module.exports = { getProduct, createProduct, updateImage,  uploadImageOnly, upload, getProductById };

