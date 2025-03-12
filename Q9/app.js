const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// Configure session
app.use(session({
secret: 'secret_key',
resave: false,
saveUninitialized: true
}));
// Load existing users
const USERS_FILE = 'users.json';
// Route to display Sign-up Form
app.get('/signup', (req, res) => {
res.send(`
<h2>User Signup</h2>
<form action="/signup" method="post">
<label>Username:</label><input type="text" name="username" required><br>
<label>Password:</label><input type="password" name="password" required><br>
<button type="submit">Sign Up</button>
</form>
`);
});
// Handle Sign-up Form Submission
app.post('/signup', (req, res) => {
const { username, password } = req.body;
let users = [];
if (fs.existsSync(USERS_FILE)) {
users = JSON.parse(fs.readFileSync(USERS_FILE));
}
// Check if user already exists
if (users.some(user => user.username === username)) {
return res.send('User already exists! Try a different username.');
}
// Save new user
users.push({ username, password });
fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
res.send('Signup successful! <a href="/login">Login here</a>');
});
// Route to display Login Form
app.get('/login', (req, res) => {
res.send(`
<h2>User Login</h2>
<form action="/login" method="post">
<label>Username:</label><input type="text" name="username" required><br>
<label>Password:</label><input type="password" name="password" required><br>
<button type="submit">Login</button>
</form>
`);
});
// Handle Login Form Submission
app.post('/login', (req, res) => {
const { username, password } = req.body;
if (!fs.existsSync(USERS_FILE)) return res.send("No users found. Please sign up first.");
const users = JSON.parse(fs.readFileSync(USERS_FILE));
const user = users.find(user => user.username === username && user.password === password);
if (user) {
req.session.user = user; // Store user session
res.redirect('/dashboard');
} else {
res.send('Invalid credentials! <a href="/login">Try again</a>');
}
});
// Protected Dashboard Route (Only accessible if logged in)
app.get('/dashboard', (req, res) => {
if (!req.session.user) return res.send('Unauthorized Access! <a href="/login">Login here</a>');
res.send(`<h2>Welcome, ${req.session.user.username}!</h2><p>You are logged in.</p><a href="/logo">`)});

//Logout Route
app.get('/logout', (req, res) => {
req.session.destroy(() => {
res.send('Logged out successfully! <a href="/login">Login again</a>');

});
});
// Start Server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));