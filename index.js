const express = require("express");

require("./db");

const app = express();

PORT = 3030;

app.use(express.json());

app.get("/", (req,res) => {
    res.status(200).json({
        message: "Marketplace API is running"
    });
});

app.use("/customers", require("./routes/customerRoutes"));
app.use("/products", require("./routes/productRoutes"));
app.use("/orders", require("./routes/orderRoutes"));

app.listen(PORT, () => {
    console.log(`My Application is running on localhost:${PORT}`);
});