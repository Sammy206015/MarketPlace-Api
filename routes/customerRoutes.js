const express = require("express");
const router = express.Router();

const {
  registerCustomer,
  getAllCustomers,
  getOneCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerOrders
} = require("../controllers/customerController");

router.post("/register", registerCustomer);
router.get("/getAll", getAllCustomers);
router.get("/:id/orders", getCustomerOrders);
router.get("/get/:id", getOneCustomer);
// router.put("/update/:id", updateCustomer);
router.patch("/update/:id", updateCustomer);
router.delete("/delete/:id", deleteCustomer);

module.exports = router;
