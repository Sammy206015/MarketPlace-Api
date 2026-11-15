const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus
} = require("../controllers/orderController");

router.post("/create", createOrder);
router.get("/getAll", getOrders);
router.get("/get/:id", getOrder);
router.patch("/update-status/:id/", updateOrderStatus);

module.exports = router;
