// models/SettingModel.js
const mongoose = require("mongoose");

const SettingSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: true,
    unique: true  // One settings document per admin
  },
  storeName: String,
  email: String,
  phone: String,
  address: String,
  notifications: Boolean,
  theme: String
}, { timestamps: true });

module.exports = mongoose.model("Setting", SettingSchema);
