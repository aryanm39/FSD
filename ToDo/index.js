require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Define Todo Schema and Model
const todoSchema = new mongoose.Schema({
    task: String
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes
const router = express.Router();

// Display To-Do List
router.get('/', async (req, res) => {   const todos = await Todo.find();
    res.render('index', { todos });
});

// Insert Page
router.get('/insert', (req, res) => {
    res.render('insert');
});

router.post('/insert', async (req, res) => {    const newTodo = new Todo({ task: req.body.task });
    await newTodo.save();
    res.redirect('/');
});

// Update Page
router.get('/update/:id', async (req, res) => { const todo = await Todo.findById(req.params.id);
    res.render('update', { todo });
});

router.post('/update/:id', async (req, res) => {  await Todo.findByIdAndUpdate(req.params.id, { task: req.body.task });
    res.redirect('/');
});

// Delete Page
router.get('/delete', async (req, res) => { const todos = await Todo.find();
    res.render('delete', { todos });
});

router.post('/delete', async (req, res) => { await Todo.findByIdAndDelete(req.body.taskId);
    res.redirect('/');  
});

// Use Routes
app.use('/', router);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
