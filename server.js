const express = require("express");
require("./db/config");
const cors = require("cors");
const User = require("./db/User");
const Product = require("./db/Product");

const app = express();
app.use(express.json());
app.use(cors());
app.post("/register", async (req, resp) => {
    const user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    resp.send(result);
});
app.post("/login", async (req, resp) => {
    const user = (req.body.email && req.body.password) ? await User.findOne(req.body).select("-password") : { result: "Please enter valid fields" };
    if (user) resp.send(user);
    else resp.send({ result: "No Content Found" });
});
app.post("/add-product", async (req, resp) => {
    const product = new Product(req.body);
    let strResponse = await product.save();
    resp.send(strResponse);
});
app.get("/products", async (req, resp) => {
    const products = await Product.find();
    if (products.length > 0) resp.send(products);
    else resp.send({ Error: "No products found" });
});
app.delete("/product/:id", async (req, resp) => {
    let result = await Product.deleteOne({ _id: req.params.id });
    resp.send(result);
});
app.listen(5020);
