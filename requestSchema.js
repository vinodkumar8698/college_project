const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    // userName: {
    //     type: String,
    //     required: true,
    // },
    doctorId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
});

const REQUEST = mongoose.model("REQUEST", requestSchema);

module.exports = REQUEST;