const {
  AddressModel,
  SavedCardModel,
  UPIModel,
  GiftCardModel,
} = require("../modals/UserExtrasModel");


const createAddress = async (req, res) => {
  try {
    const newAddress = await AddressModel.create(req.body);
    res.status(200).json(newAddress);
  } catch (err) {
    res.status(500).json({ message: "Failed to save address", error: err });
  }
};

const getAddresses = async (req, res) => {
  try {
    const addresses = await AddressModel.find({ userId: req.params.userId });
    res.status(200).json(addresses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch addresses", error: err });
  }
};

const updateAddress = async (req, res) => {
  try {
    const updated = await AddressModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update address", error: err });
  }
};


// --- UPI ---
const addUPI = async (req, res) => {
  try {
    const upi = await UPIModel.create(req.body);
    res.status(200).json(upi);
  } catch (err) {
    res.status(500).json({ message: "Failed to save UPI", error: err });
  }
};

const getUPIs = async (req, res) => {
  try {
    const upis = await UPIModel.find({ userId: req.params.userId });
    res.status(200).json(upis);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch UPI", error: err });
  }
};

// --- Saved Cards ---
const addCard = async (req, res) => {
  try {
    const card = await SavedCardModel.create(req.body);
    res.status(200).json(card);
  } catch (err) {
    res.status(500).json({ message: "Failed to save card", error: err });
  }
};

const getCards = async (req, res) => {
  try {
    const cards = await SavedCardModel.find({ userId: req.params.userId });
    res.status(200).json(cards);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cards", error: err });
  }
};

// --- Gift Cards ---
const createGiftCard = async (req, res) => {
  try {
    const giftCard = await GiftCardModel.create(req.body);
    res.status(200).json(giftCard);
  } catch (err) {
    res.status(500).json({ message: "Failed to create gift card", error: err });
  }
};

const getGiftCards = async (req, res) => {
  try {
    const cards = await GiftCardModel.find({ userId: req.params.userId });
    res.status(200).json(cards);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch gift cards", error: err });
  }
};

module.exports = {
  createAddress,
  getAddresses,
  updateAddress,
  addUPI,
  getUPIs,
  addCard,
  getCards,
  createGiftCard,
  getGiftCards,
};
