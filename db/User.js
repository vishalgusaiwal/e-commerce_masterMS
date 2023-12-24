const mongo = require('mongoose');

const userschema = new mongo.Schema({
    name: String,
    email: String,
    password: String
});
module.exports = mongo.model("Development", userschema);