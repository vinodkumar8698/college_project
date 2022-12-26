const express = require("express")
const app = express()
const PORT = 5000
const cors = require("cors");

app.use(express.json())
app.use(cors());

app.get("/about", (req, res) => {
    res.status(200).send('hello from about server')
})
// const app = express.app();
// var ObjectId = require("mongodb").ObjectID;
const bcrypt = require('bcrypt');
require("./connectDB");

app.get('/', async (req, res) => {
    res.send("welcome to the vinodkumar college project")
})
app.post('/signup', async (req, res) => {
    // Validate the user's input
    const { fullname, email, password, gender } = req.body;
    if (!fullname || !email || !password, !gender) {
        return res.status(400).send('Missing required fields');
    }

    const User = require("./userSchema");
    try {
        const mailExist = await User.findOne({ email: email });
        if (mailExist) {
            return res.status(423).json({ error: " user already exists." });
        }
    } catch (err) {
        console.log(err);
    }
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Signup document
    const newUser = new User({
        fullname,
        email,
        gender,
        password: hashedPassword
    });

    await newUser.save()

    res.status(200).send("user created successfully");
});


app.listen(PORT, () => {
    console.log(`server is started on port ${PORT}` || 8080)
})

module.exports = app;