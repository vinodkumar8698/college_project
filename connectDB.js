// Database Connection
const mongoose = require("mongoose");
const DB = "mongodb+srv://vinay8698:Smart%40123@vinay8698.kvuxg.mongodb.net/?retryWrites=true&w=majority";

// Database Connection
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        // useCreateIndex: true,
        useUnifiedTopology: true,
        // useFindAndModify: false,
    })
    .then(() => {
        console.log(`Database connected successful`);
    })
    .catch((err) => console.log(err, "no connection"));