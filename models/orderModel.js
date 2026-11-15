// const mongoose = require("mongoose");

// const orderSchema = mongoose.Schema({
//     customer: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Customer",
//         required: true},

//     product: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product",
//         required: true},

//     quantity: {type: Number,required: true,min: 1,
//         validate:{validator: Number.isInteger, message: "order quantity must be an integer"}},

//     totalAmount: {type: Number,required: true,min: 0},

//     orderStatus: {type: String,
//         Enum: ["Pending","Processing","Shipped","Delivered"], default: "Pending"},

//     orderDate: {type: Date,default: Date.now}
// })

// const orderModel = mongoose.model("Order", orderSchema);
// module.exports = orderModel;


const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },

    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
            validate: {
                validator: Number.isInteger,
                message: "Order quantity must be an integer"
            }
        }
    }],

    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },

    orderStatus: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered"],
        default: "Pending"
    },

    orderDate: {
        type: Date,
        default: Date.now
    }

});

const orderModel = mongoose.model("Order", orderSchema);

module.exports = orderModel;
