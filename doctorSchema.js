const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
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

const Doctor = mongoose.model("DOCTOR", doctorSchema);

module.exports = Doctor;