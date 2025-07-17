const Adminmodel = require("../modals/Adminmodel");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

const secret_key = "adminSecret123456"; // store in .env ideally

// Create Admin
// Create Admin
const createAdmin = async (req, res) => {
  try {
    const { name, email, phoneNumber, address, password } = req.body;

    if (!name || !email || !phoneNumber || !address || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingAdmin = await Adminmodel.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin already exists." });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await Adminmodel.create({
      name,
      email,
      phoneNumber,
      address,
      password: hashedPassword
    });

    return res.status(201).json({ message: "Admin created successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Adminmodel.findOne({ email }).select("+password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = bcrypt.compareSync(password, admin.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Invalid password" });
    }

    const token = JWT.sign({ id: admin._id }, secret_key, { expiresIn: "7d" });
    return res.status(200).json({ token, adminId: admin._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


// Verify Admin
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = JWT.verify(token, secret_key);
    req.params.id = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// Get Admin by ID
const getAdminById = async (req, res) => {
  try {
    const admin = await Adminmodel.findById(req.params.id);
    return res.status(200).json(admin);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createAdmin,
  adminLogin,
  verifyAdmin,
  getAdminById
};
