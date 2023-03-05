const express = require("express")
const app = express()
const jwt = require('jsonwebtoken');
const PORT = 5000
const cors = require("cors");
const mongoose = require("mongoose");
app.use(express.json())
app.use(cors());

app.get("/about", (req, res) => {
    res.status(200).send('hello from about server')
})

const Request = require("./requestSchema");
const User = require("./userSchema");
const Doctor = require("./doctorSchema");
const Messages = require("./messagesSchema");

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


app.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const User = require("./userSchema");
        const user = await User.findOne({ email });
        if (user) {
            const userId = user._id;
            const cmp = await bcrypt.compare(req.body.password, user.password);
            if (cmp) {
                const token = jwt.sign({ email }, 'secret_key');
                res.status(200).send({ token: token, userId: userId, user });
            } else {
                res.status(422).send("wrong username or password.");
            }
        } else {
            res.status(423).send("user not found");
        }
    } catch (error) {
        res.status(424).send("server error: " + error.message)
        console.log(error);
    }

})

// Doctor 

app.get('/users', async (req, res) => {
    const User = require("./userSchema");
    const users = await User.find();
    res.send(users);
});

app.post('/doctor/signup', async (req, res) => {
    // Validate the user's input
    const { fullname, email, password, gender } = req.body;
    if (!fullname || !email || !password, !gender) {
        return res.status(400).send('Missing required fields');
    }

    const Doctor = require("./doctorSchema");
    try {
        const mailExist = await Doctor.findOne({ email: email });
        if (mailExist) {
            return res.status(423).json({ error: " email already exists." });
        }
    } catch (err) {
        console.log(err);
    }
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Signup document
    const newDoctor = new Doctor({
        fullname,
        email,
        gender,
        password: hashedPassword
    });

    await newDoctor.save()

    res.status(200).send("doctor created successfully");
});

app.post("/doctor/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const Doctor = require("./doctorSchema");
        const doctor = await Doctor.findOne({ email });
        if (doctor) {
            const doctorId = doctor._id;
            const cmp = await bcrypt.compare(req.body.password, doctor.password);
            if (cmp) {
                const token = jwt.sign({ email }, 'secret_key');
                res.status(200).send({ token: token, docterId: doctorId, doctor });
            } else {
                res.status(422).send("wrong username or password.");
            }
        } else {
            res.status(423).send("details not found");
        }
    } catch (error) {
        res.status(424).send("server error: " + error.message)
        console.log(error);
    }

})

// app.get('/doctors', async (req, res) => {
//     const Doctor = require("./doctorSchema");
//     const users = await Doctor.find();
//     res.send(users);
// });

app.get("/getDoctors", async (req, res) => {
    const { userId } = req.query;
    try {
        const sentRequests = await Request.find({ userId });
        const sentDoctorIds = sentRequests.map(request => request.doctorId);
        const user = await User.findById(userId);
        const availableDoctors = await Doctor.find({
            _id: { $nin: sentDoctorIds },
            specialty: user.specialty
        });
        res.status(200).send(availableDoctors);
    } catch (e) {
        console.log("index.js 163", e);
    }

});

app.post("/sendRequest", async (req, res) => {
    const { userId, doctorId } = req.body;
    try {
        const existingRequest = await Request.findOne({ userId, doctorId });
        if (existingRequest) {
            res.send({ message: "Request already sent." });
        } else {
            const request = new Request({ userId, doctorId, status: "pending" });
            await request.save();
            res.status(200).send({ message: "Request sent successfully." });
        }
    } catch (error) {
        console.log(error);
    }

});

app.put('/users/requests/accept', async (req, res) => {
    const { userId, doctorId } = req.body;
    try {
        const request = await Request.findOneAndUpdate(
            { userId: userId, doctorId: doctorId, status: 'pending' },
            { status: 'accepted' },
            { new: true }
        );
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.json(request);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// doctor accepted list by doctor id
app.get('/users/accepted-list', async (req, res) => {
    const { doctorId } = req.body;
    try {
        const requests = await Request.find({
            doctorId: doctorId,
            status: 'accepted',
        }).populate('doctorId', 'fullname _id').populate('userId', 'fullname _id');

        const userIds = requests.map(request => request.userId);
        const users = await User.find({ _id: { $in: userIds } }, "_id fullname");
        const requestsWithUserDetails = requests.map(request => {
            const matchingUser = users.find(user => user._id.toString() === request?.userId.toString());
            return {
                userId: request.userId,
                name: matchingUser.fullname
            };
        });
        res.json(requestsWithUserDetails);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// accepted list of doctors by user id
app.get('/doctors/accepted-list', async (req, res) => {
    const { userId } = req.body
    console.log(userId)
    try {
        if (!userId) {
            return res.status(400).json({ message: "Please provide userId" });
        }
        const requests = await Request.find({
            userId,
            status: 'accepted'
        })
            .populate('doctorId', 'fullname')
            .select('doctorId');
        const doctorIds = requests.map(request => request.doctorId);
        const doctors = await Doctor.find({ _id: { $in: doctorIds } }, "_id fullname");
        const requestsWithUserDetails = requests.map(request => {
            const matchingDoctor = doctors.find(doctor => doctor._id.toString() === request?.doctorId.toString());
            return {
                doctorId: request.doctorId,
                name: matchingDoctor.fullname
            };
        });
        res.json(requestsWithUserDetails);
        // res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get("/getRequests", async (req, res) => {
    const { doctorId } = req.query;
    try {
        const requests = await Request.find({ doctorId });
        const userIds = requests.map(request => request.userId);
        const users = await User.find({ _id: { $in: userIds } }, "_id fullname");
        const requestsWithUserDetails = requests.map(request => {
            const matchingUser = users.find(user => user._id.toString() === request.userId.toString());
            return {
                userId: request.userId,
                name: matchingUser.fullname
            };
        });
        res.send(requestsWithUserDetails);
    } catch (e) {
        console.error(e);
    }
});

app.post('/send-message', (req, res) => {
    const { sender, recipient, message, who } = req.body;

    const newMessage = new Messages({
        sender,
        recipient,
        who,
        message,
    });

    newMessage.save((err) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error sending message');
        } else {
            res.send('Message sent successfully');
        }
    });
});

app.post('/messages', (req, res) => {
    const { user, doctor } = req.body;

    Messages.find(
        { $or: [{ sender: user, recipient: doctor }, { sender: doctor, recipient: user }] },
        (err, messages) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error retrieving messages');
            } else {
                res.json(messages);
            }
        }
    );
});

app.listen(PORT, () => {
    console.log(`server is started on port ${PORT}` || 8080)
})

module.exports = app;