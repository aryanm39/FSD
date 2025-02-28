const express = require('express');
const fs = require('fs');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const USERS_FILE = 'users.json';

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret_key', resave: false, saveUninitialized: true }));

// Signup Page
app.get('/signup', (req, res) => {
    res.send(`
        <h2>User Signup</h2>
        <form action="/signup" method="post">
            <input type="text" name="username" placeholder="Username" required><br>
            <input type="password" name="password" placeholder="Password" required><br>
            <button type="submit">Sign Up</button>
        </form>
    `);
});

// Handle Signup
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    let users = fs.existsSync(USERS_FILE) ? JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8')) : [];

    users.push({ username, password });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    
    res.send('Signup successful! <a href="/login">Login here</a>');
});

// Login Page
app.get('/login', (req, res) => {
    res.send(`
        <h2>User Login</h2>
        <form action="/login" method="post">
            <input type="text" name="username" placeholder="Username" required><br>
            <input type="password" name="password" placeholder="Password" required><br>
            <button type="submit">Login</button>
        </form>
    `);
});

// Handle Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = fs.existsSync(USERS_FILE) ? JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8')) : [];

    req.session.user = users.find(user => user.username === username && user.password === password);
    res.redirect(req.session.user ? '/dashboard' : '/login');
});

// Dashboard (Protected)
app.get('/dashboard', (req, res) => {
    if (!req.session.user) return res.send('<a href="/login">Login here</a>');
    res.send(`<h2>Welcome, ${req.session.user.username}!</h2><a href="/logout">Logout</a>`);
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => res.send('<a href="/login">Login again</a>'));
});

// Start Server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
