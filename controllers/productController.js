
const productModel = require("../models/productModel");
const orderModel = require("../models/orderModel");

exports.createProduct = async (req, res) => {
    try {
        const product = await productModel.create(req.body);

        res.status(201).json({
            message: "Product created successfully",
            product
        });
    } catch (error) {
        res.status(400).json({
            message: `Error creating product: ${error}`
        });
    }
};


// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await productModel.find();

        res.status(200).json({
            count: products.length,
            products
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single product
exports.getProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({product});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const product = await productModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }


        const existingOrder = await orderModel.exists({
            "products.product": product._id
        });

        if (existingOrder) {
            return res.status(409).json({
            message: "Cannot delete a product that appears in an order"
            });
        }

        await product.deleteOne();

        res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(400).json({ message: `Error deleting product: ${error}` });
    }
};
