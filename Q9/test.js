require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// User Model (Plain text password)
const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    password: String
}));

// Signup Page
app.get('/signup', (req, res) => {
    res.send(`
        <h2>Sign Up</h2>
        <form action="/signup" method="post">
            <input type="text" name="username" placeholder="Username" required><br>
            <input type="password" name="password" placeholder="Password" required><br>
            <button type="submit">Sign Up</button>
        </form>
    `);
});

// Signup Handler
app.post('/signup', async (req, res) => {
    if (await User.findOne({ username: req.body.username })) {
        return res.send('User already exists! <a href="/signup">Try again</a>');
    }
    await new User(req.body).save();
    res.send('Signup successful! <a href="/login">Login here</a>');
});

// Login Page
app.get('/login', (req, res) => {
    res.send(`
        <h2>Login</h2>
        <form action="/login" method="post">
            <input type="text" name="username" placeholder="Username" required><br>
            <input type="password" name="password" placeholder="Password" required><br>
            <button type="submit">Login</button>
        </form>
    `);
});

// Login Handler
app.post('/login', async (req, res) => {
    const user = await User.findOne(req.body);
    if (!user) return res.send('Invalid credentials! <a href="/login">Try again</a>');
    res.send(`<h2>Welcome, ${user.username}!</h2><a href="/logout">Logout</a>`);
});

// Logout Route
app.get('/logout', (req, res) => res.send('Logged out! <a href="/login">Login again</a>'));

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/signup`));
