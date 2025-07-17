const express = require("express");
const router = express.Router();
const { getuser, createUser, login, verifyUser, findUserbyid , updateUser} = require("../controllers/UserController");

router.get("/", getuser);
router.post("/create", createUser);
router.post("/login", login);
router.get("/:id",  findUserbyid);
router.put("/:id", updateUser);

module.exports = router;
