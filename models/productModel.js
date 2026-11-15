const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    productName: {type: String,required: true, unique: true, trim: true, uppercase: true},

    description: {type: String, required: true},

    price: {type: Number, required: true, min: 0},

    category: {type: String, required: true},

    quantity: {type: Number, required: true, min: 0, 
        validate:{validator: Number.isInteger, message: "stock quantity must be an integer"}}
});

const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;