const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    model: String,
    price: String,
    company: String,
    productID: String
});
module.exports = mongoose.model("products", productSchema);