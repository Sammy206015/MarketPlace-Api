const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

router.post("/create", createProduct);
router.get("/getAll", getProducts);
router.get("/get/:id", getProduct);
// router.put("/update/:id", updateProduct);
router.patch("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;
