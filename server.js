const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000; // Use PORT environment variable or default to 3000

app.use(cors());

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

const Task = sequelize.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

// Establish relationships
User.hasMany(Task);
Task.belongsTo(User);

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'supersecretkey', // Replace with a more secure secret
    resave: false,
    saveUninitialized: true
}));

// Sync Sequelize models with the database
sequelize.sync()
    .then(() => {
        console.log('Database synced');
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });

// Middleware to check if a user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

// User registration endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already registered' });
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        const newUser = await User.create({ username, password: hashedPassword });

        // Optionally, you can set up session handling or other responses here
        req.session.userId = newUser.id;

        // Respond with success message
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: err.message });
    }
});

// User login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).send('Invalid login credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Invalid login credentials');
        }

        req.session.userId = user.id;
        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Get tasks for the logged-in user
app.get('/tasks', isAuthenticated, async (req, res) => {
    try {
        const tasks = await Task.findAll({ where: { UserId: req.session.userId } });
        res.status(200).json(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ message: 'Failed to fetch tasks' });
    }
});

// Create a new task for the logged-in user
app.post('/tasks', isAuthenticated, async (req, res) => {
    const { title } = req.body;

    try {
        const newTask = await Task.create({ title, UserId: req.session.userId });
        res.status(201).json(newTask);
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).json({ message: 'Failed to add task' });
    }
});

// Toggle task completion status
app.post('/tasks/:id/complete', isAuthenticated, async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findOne({ where: { id, UserId: req.session.userId } });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        task.is_completed = !task.is_completed;
        await task.save();
        res.status(200).json({ message: 'Task updated successfully' });
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).json({ message: 'Failed to update task' });
    }
});

// Delete a task
app.delete('/tasks/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findOne({ where: { id, UserId: req.session.userId } });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await task.destroy();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ message: 'Failed to delete task' });
    }
});

// Serve static files (e.g., index.html, styles.css) from the root directory
app.use(express.static(path.join(__dirname)));

// Default route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});
