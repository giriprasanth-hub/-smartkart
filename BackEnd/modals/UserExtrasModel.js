const mongoose = require('mongoose');


const AddressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  addressLine: String,
  city: String,
  state: String,
  pincode: String,
  country: String
});


const SavedCardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  cardNumber: String,
  nameOnCard: String,
  expiryDate: String,
  cardType: String 
});


const UPISchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  upiId: String,
  verified: { type: Boolean, default: false }
});


const GiftCardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  amount: Number,
  isUsed: { type: Boolean, default: false },
  issuedDate: { type: Date, default: Date.now }
});


const AddressModel = mongoose.model('Address', AddressSchema);
const SavedCardModel = mongoose.model('SavedCard', SavedCardSchema);
const UPIModel = mongoose.model('UPI', UPISchema);
const GiftCardModel = mongoose.model('GiftCard', GiftCardSchema);

module.exports = {
  AddressModel,
  SavedCardModel,
  UPIModel,
  GiftCardModel
};
