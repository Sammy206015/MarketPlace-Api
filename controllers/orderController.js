
const mongoose = require("mongoose");
const orderModel = require("../models/orderModel");
const customerModel = require("../models/customerModel");
const productModel = require("../models/productModel");

// Place an order
exports.createOrder = async (req, res) => {
    const session = await mongoose.startSession();
    let createdOrderId;

    try {
        const { customer, products } = req.body;

        if (!customer || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                message: "Customer and at least one product are required"
            });
        }

        // Validate product IDs and quantities
        if (products.some(
            item =>
                !mongoose.isValidObjectId(item.product) ||
                !Number.isInteger(item.quantity) ||
                item.quantity < 1
        )) {
            return res.status(400).json({
                message: "Each product must have a valid ID and positive integer quantity"
            });
        }

        // Validate customer ID
        if (!mongoose.isValidObjectId(customer)) {
            return res.status(400).json({
                message: "Invalid customer ID"
            });
        }

        await session.withTransaction(async () => {

            // Check if customer exists
            const customerExists = await customerModel
                .findById(customer)
                .session(session);

            if (!customerExists) {
                const error = new Error("Customer not found");
                error.statusCode = 404;
                throw error;
            }

            // Combine repeated product IDs
            const quantities = new Map();

            for (const item of products) {
                const id = item.product.toString();

                quantities.set(
                    id,
                    (quantities.get(id) || 0) + item.quantity
                );
            }

            const orderProducts = [];
            let totalAmount = 0;

            // Check stock and update product quantities
            for (const [productId, quantity] of quantities) {

                const product = await productModel.findOneAndUpdate(
                    {
                        _id: productId,
                        quantity: { $gte: quantity }
                    },
                    {
                        $inc: { quantity: -quantity }
                    },
                    {
                        new: true,
                        session
                    }
                );

                if (!product) {
                    const exists = await productModel
                        .exists({ _id: productId })
                        .session(session);

                    const error = new Error(
                        exists
                            ? `Insufficient stock for product ${productId}`
                            : `Product ${productId} not found`
                    );

                    error.statusCode = exists ? 400 : 404;
                    throw error;
                }
                
                // Calculate total amount
                totalAmount += product.price * quantity;

                // Add product details to order
                orderProducts.push({
                    product: product._id,
                    quantity
                });
            }

            // Create order
            const [createdOrder] = await orderModel.create(
                [{
                    customer,
                    products: orderProducts,
                    totalAmount
                }],
                { session }
            );

            // Save the newly created order ID
            createdOrderId = createdOrder._id;
        });

        // Retrieve the exact order created
        const order = await orderModel.findById(createdOrderId)
            .populate("customer", "-password")
            .populate("products.product");

        // Send success response
        return res.status(201).json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {

        return res.status(error.statusCode || 400).json({
            message: `Error placing order: ${error.message}`
        });

    } finally {
        await session.endSession();
    }
};



// Get all orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await orderModel.find().populate("customer", "-password")
        .populate("products.product");

        res.status(200).json({
            count: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
    }
};

// Get single order with customer and products
exports.getOrder = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id).populate("customer")
        .populate("products.product");

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({order});
    } catch (error) {
        res.status(400).json({ 
            message: "Error fetching order"});
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const {orderStatus} = req.body;
        const allowedStatuses = ["Pending","Processing","Shipped","Delivered"];

        if (!allowedStatuses.includes(orderStatus)) {
            return res.status(400).json({
                message: "Invalid order status"
            });
        }

        const order = await orderModel.findByIdAndUpdate(req.params.id,{orderStatus},
            {new: true,runValidators: true}).populate("customer").populate("products.product");

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        res.status(400).json({ 
            message: "Error Updating Order"});
        }
};
