const express = require("express");
require("./db/config");
const cors = require("cors");
const User = require("./db/User");
const Product = require("./db/Product");
const jwt = require("jsonwebtoken");
const jwtKey = "e-commerce";
const app = express();
app.use(express.json());
app.use(cors());
app.post("/register", async (req, resp) => {
    const user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    if (result) {
        jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
            if (err) resp.send(err.message);
            resp.send({ result, auth: token });
        });
    } else resp.send({ result: "No Content Found" });
    
});
app.post("/login", async (req, resp) => {
    const user = (req.body.email && req.body.password) ? await User.findOne(req.body).select("-password") : { result: "Please enter valid fields" };
    if (user) {
        jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
            if (err) resp.send(err.message);
            resp.send({ user, auth: token });
        });
    } else resp.send({ result: "No Content Found" });
});
app.post("/add-product", varifyToken, async (req, resp) => {
    const product = new Product(req.body);
    let strResponse = await product.save();
    resp.send(strResponse);
});
app.get("/products", varifyToken, async (req, resp) => {
    const products = await Product.find();
    if (products.length > 0) resp.send(products);
    else resp.send({ Error: "No products found" });
});
app.delete("/product/:id", varifyToken, async (req, resp) => {
    let result = await Product.deleteOne({ _id: req.params.id });
    resp.send(result);
});
app.get("/product/:id", varifyToken, async (req, resp) => {
    let result = await Product.findOne({ _id: req.params.id });
    if (result) return resp.send(result);
    else return resp.send({ result: "No record found" });
});
app.put("/products/:id", varifyToken, async (req, resp) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    );
    resp.send(result);
});
app.get("/search/:key", varifyToken, async (req, resp) => {
    let result = await Product.find({
        "$or": [
            { model: { $regex: req.params.key } },
            { company: { $regex: req.params.key } },
            { price: { $regex: req.params.key } }
        ]
    });
    resp.send(result);
});
function varifyToken(req, resp, next) {
    let token = req.headers["authorization"];
    if (token) {
        token = token.split(' ')[1];
        jwt.verify(token, jwtKey, (err, valid) => {
            if (err) {
                resp.status(401).send({ result: "please provide a valid token" });
            } else {
                next();
            }
        });
    } else {
        resp.status(403).send({ result: "please send token with header" });
    }
}
app.listen(5020);
