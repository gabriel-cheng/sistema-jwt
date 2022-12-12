const mongoose = require("mongoose");

const User = mongoose.model("Account", {
    name: String,
    email: String,
    password: String
});

module.exports = User;
