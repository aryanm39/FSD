const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const MONGO_URI = 'mongodb://localhost:27017/';

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));

app.use(bodyParser.urlencoded({ extended: true }));

const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    password: String
}));

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

app.post('/signup', async (req, res) => {
    if (await User.findOne({ username: req.body.username })) {
        return res.send('User already exists! <a href="/signup">Try again</a>');
    }
    await new User(req.body).save();
    res.send('Signup successful! <a href="/login">Login here</a>');
});

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

app.post('/login', async (req, res) => {
    const user = await User.findOne(req.body);
    if (!user) return res.send('Invalid credentials! <a href="/login">Try again</a>');
    res.send(`<h2>Welcome, ${user.username}!</h2><a href="/logout">Logout</a>`);
});

app.get('/logout', (req, res) => res.send('Logged out! <a href="/login">Login again</a>'));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/signup`));
