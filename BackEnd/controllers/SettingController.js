// controllers/SettingController.js
const Setting = require("../modals/SettingModel");

const getSettings = async (req, res) => {
  try {
    const { adminId } = req.query;
    if (!adminId) return res.status(400).json({ message: "adminId is required" });

    const settings = await Setting.findOne({ adminId });
    res.status(200).json(settings || {});
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch settings", err });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { adminId, ...data } = req.body;
    if (!adminId) return res.status(400).json({ message: "adminId is required" });

    const existing = await Setting.findOne({ adminId });
    const updated = existing
      ? await Setting.findOneAndUpdate({ adminId }, data, { new: true })
      : await Setting.create({ adminId, ...data });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update settings", err });
  }
};

module.exports = { getSettings, updateSettings };
