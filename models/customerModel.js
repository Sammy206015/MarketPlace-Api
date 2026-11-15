const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    firstName: {type: String, required: true},

    lastName: {type: String, required: true},

    email: {type: String, required: true, unique: true},

    password: {type: String, required: true, select: false},

    address: {type: String, required: true},

    phoneNumber: {type: String, required: true, unique: true},
});

const customerModel = mongoose.model("Customer", customerSchema);
module.exports = customerModel;