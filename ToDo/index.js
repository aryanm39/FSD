require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("Error: MONGO_URI is missing in .env file.");
    process.exit(1);
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.set('view engine', 'ejs');

// MongoDB Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    });

// Define Todo Schema and Model
const todoSchema = new mongoose.Schema({ task: String });
const Todo = mongoose.model('Todo', todoSchema);

// Routes
app.get('/', async (req, res) => {
    const todos = await Todo.find();
    res.render('index', { todos });
});

app.get('/insert', (req, res) => res.render('insert'));

app.post('/insert', async (req, res) => {
    await new Todo({ task: req.body.task }).save();
    res.redirect('/');
});

app.get('/update/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id);
    res.render('update', { todo });
});

app.post('/update/:id', async (req, res) => {
    await Todo.findByIdAndUpdate(req.params.id, { task: req.body.task });
    res.redirect('/');
});

app.get('/delete', async (req, res) => {
    const todos = await Todo.find();
    res.render('delete', { todos });
});

app.post('/delete', async (req, res) => {
    await Todo.findByIdAndDelete(req.body.taskId);
    res.redirect('/');
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
