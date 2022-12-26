const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    }
});

const User = mongoose.model("USER", userSchema);

module.exports = User;