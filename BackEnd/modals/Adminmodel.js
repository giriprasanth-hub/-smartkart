const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  name:{
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    phoneNumber: {
        type: String, 
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },  
    password: {
        type: String,
        required: true,
        minLength: 6,
        select:false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

const Adminmodel = mongoose.model("admin", AdminSchema);
module.exports = Adminmodel;
