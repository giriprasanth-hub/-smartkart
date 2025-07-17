const Usermodel = require("../modals/Usermodel");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

const secret_key = "asdbaskdjadhjabdkasjdbaskdjbkjbkjbkjbasdsabdakdj";

const getuser = async (req, res) => {
    try {
        const users = await Usermodel.find();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: "Error occurred" });
    }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, phoneNumber, address } = req.body;

    const updatedUser = await Usermodel.findByIdAndUpdate(
      userId,
      { name, email, phoneNumber, address },
      { new: true }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update user failed:", error);
    return res.status(500).json({ message: "Failed to update user" });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, address, password } = req.body;

    const existingUser = await Usermodel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists. Please login." });
    }

    const hashedpassword = bcrypt.hashSync(password, 10);

    await Usermodel.create({
      name,
      email,
      phoneNumber,
      password: hashedpassword,
      address
    });

    return res.status(200).json({ message: "User saved successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await Usermodel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return res.status(403).json({ message: "Password mismatch" });
        }

        const token = JWT.sign({ id: user._id }, secret_key, { expiresIn: "7d" });
        return res.status(200).json({ token, userId: user._id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const verifyUser = async (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        const result = JWT.verify(token, secret_key);
        req.params.id = result.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

const findUserbyid = async (req, res) => {
    try {
        let user = await Usermodel.findById(req.params.id);
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = { getuser, createUser, login, verifyUser, findUserbyid , updateUser};
