const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

// Define User model
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Define Task model
const Task = sequelize.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Establish relationships
User.hasMany(Task);
Task.belongsTo(User);

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: 'secret', // Change this to a more secure secret in production
    resave: false,
    saveUninitialized: true
}));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Sync Sequelize models
sequelize.sync()
    .then(() => {
        console.log('Database synced');
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });

// User registration endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).send('Username already registered');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashedPassword });
        req.session.userId = newUser.id;
        res.status(201).send('User registered');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// User login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user || !await bcrypt.compare(password, user.password)) {
            throw new Error('Invalid login credentials');
        }

        req.session.userId = user.id;
        res.status(200).send('Login successful');
    } catch (err) {
        res.status(401).send(err.message);
    }
});

// Create task endpoint
app.post('/tasks', async (req, res) => {
    const { title } = req.body;
    const userId = req.session.userId;

    try {
        const newTask = await Task.create({ title, UserId: userId });
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all tasks for the logged-in user
app.get('/tasks', async (req, res) => {
    const userId = req.session.userId;

    try {
        const tasks = await Task.findAll({ where: { UserId: userId } });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete task endpoint
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Task.destroy({ where: { id } });
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Default route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
