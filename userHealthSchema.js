const mongoose = require("mongoose");

const userHealthSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    heartrate: {
        type: [],
        required: true,
    },
    spo2: {
        type: [],
        required: true,
    },
    bodytemp: {
        type: [],
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    }
});

const UserHealth = mongoose.model("USERHEALTH", userHealthSchema);

module.exports = UserHealth;