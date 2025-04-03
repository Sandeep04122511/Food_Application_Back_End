const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const adminRoutes = require('./routes/adminRoutes');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// API landing page http://localhost:3000/
app.get('/', async (req, res) => {
    try {
        res.send("Welcome to the backend");
    } catch (err) {
        console.log(err);
    }
});

// Register Userhttp://localhost:3000/register
app.post('/register', async (req, res) => {
    const { user, email, password, phone, address } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ user, email, password: hashPassword, phone, address });
        await newUser.save();
        console.log("New user registered successfully");
        res.json({ message: 'User created' });
    } catch (err) {
        console.log(err);
    }
});

// Login User http://localhost:3000/login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid Credentials Try again...!" });
        }
        res.json({ message: "Login successfully..!", username: user.username });
    } catch (err) {
        console.log(err);
    }
});

// Use admin routes http://localhost:3000/admin/register  http://localhost:3000/admin/login  http://localhost:3000/admin/dashboard
app.use('/admin', adminRoutes);

// Start the server
app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("Server is running on port:" + PORT);
});
