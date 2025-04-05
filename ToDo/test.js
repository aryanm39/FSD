const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3001;
const MONGO_URI = 'mongodb://localhost:27017/ToDoDB';

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// MongoDB Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    });

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

app.get('/delete/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
