
const customerModel = require("../models/customerModel");
const orderModel = require("../models/orderModel");
const bcrypt = require("bcryptjs");

exports.registerCustomer = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            address,
            phoneNumber
        } = req.body;

        const existingCustomer = await customerModel.findOne({ email: req.body.email});

        const checkPhone = await customerModel.findOne({phoneNumber: req.body.phoneNumber});

        if (existingCustomer || checkPhone) {
            return res.status(409).json({
                message: "Customer already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const customer = await customerModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            address, 
            phoneNumber
        });

        res.status(201).json({
            message: "Customer registered successfully",
            customer: {
                id: customer._id,
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                phoneNumber: customer.phoneNumber,
                address:customer.address

            }
        });

    } catch (error) {
        res.status(500).json({
            message: `Error creating customer ${error}`,
        });
    }
};



exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await customerModel.find();

    res.status(200).json({
      count: customers.length,
      customers
    });
  } catch (error) {
    res.status(500).json({
      message: `error getting customers: ${error}`
    });
  }
};


exports.getOneCustomer = async (req, res) => {
  try {
    const customer = await customerModel.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    res.status(200).json({
      message: "Customer retrieved successfully",
      customer });
  } catch (error) {
    res.status(400).json({
      message: `error retrieving customer: ${error}` 
    });
  }
};


// exports.updateCustomer = async (req, res) => {
//   try {
//     const customer = await customerModel.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//         runValidators: true
//       }
//     );

//     if (!customer) {
//       return res.status(404).json({
//         message: "Customer not found"
//       });
//     }

//     res.status(200).json({
//       message: "Customer updated successfully",
//       customer
//     });
//   } catch (error) {
//     res.status(400).json({
//       message: `error updating customer: ${error}`
//     });
//   }
// };

exports.updateCustomer = async (req, res) => {
    try {
        const allowedFields = [
            "firstName",
            "lastName",
            "email",
            "phoneNumber",
            "address",
            "password"
        ];

        const updates = {};

        // Only accept permitted fields
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        // Check that at least one permitted field was supplied
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "No valid fields provided for update"
            });
        }

        // Hash the password if the customer wants to change it
        if (updates.password) {
            updates.password = await bcrypt.hash(
                updates.password,
                10
            );
        }

        const updatedCustomer = await customerModel.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!updatedCustomer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        return res.status(200).json({
            message: "Customer updated successfully",
            customer: updatedCustomer
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error updating customer",
            error: error.message
        });
    }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await customerModel.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    const existingOrder = await orderModel.exists({
      customer: customer._id
    });

    if (existingOrder) {
      return res.status(409).json({
        message: "Cannot delete customer with existing orders"
      });
    }

    await customer.deleteOne();

    res.status(200).json({
      message: "Customer deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      message: `error deleting customer: ${error}`
    });
  }
};

// Get customer profile with order history
exports.getCustomerOrders = async (req, res) => {
  try {
    const customer = await customerModel.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    const orders = await orderModel.find({
      customer: customer._id
    }).populate("products.product");

    res.status(200).json({
      customer,
      orderHistory: orders
    });
  } catch (error) {
    res.status(400).json({
      message: `error getting customer orders: ${error}`
    });
  }
};
