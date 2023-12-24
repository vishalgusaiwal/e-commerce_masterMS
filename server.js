const express = require("express");
require("./db/config");
const cors = require("cors");
const User = require("./db/User");

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
})
app.listen(5020);
