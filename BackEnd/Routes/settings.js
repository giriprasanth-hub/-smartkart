// routes/settings.js
const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/SettingController");

router.get("/", getSettings);     // /settings?adminId=...
router.put("/", updateSettings);  // body must include adminId

module.exports = router;
