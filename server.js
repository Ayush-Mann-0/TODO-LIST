const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Set up SQLite database (file-based)
const db = new sqlite3.Database('todo-app.db');

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (username TEXT, password TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, username TEXT, todo TEXT)');
});

// Register endpoint
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function(err) {
        if (err) {
            res.json({ message: 'Registration failed' });
        } else {
            res.json({ message: 'Registration successful' });
        }
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (row) {
            res.json({ success: true, username });
        } else {
            res.json({ success: false, message: 'Invalid username or password' });
        }
    });
});

// Add TODO endpoint
app.post('/todos', (req, res) => {
    const { username, todo } = req.body;
    db.run('INSERT INTO todos (username, todo) VALUES (?, ?)', [username, todo], function(err) {
        if (err) {
            res.json({ success: false, message: 'Failed to add TODO' });
        } else {
            res.json({ success: true, id: this.lastID });
        }
    });
});

// Get TODOs endpoint
app.get('/todos', (req, res) => {
    const { username } = req.query;
    db.all('SELECT * FROM todos WHERE username = ?', [username], (err, rows) => {
        if (err) {
            res.json({ success: false, message: 'Failed to retrieve TODOs' });
        } else {
            res.json({ success: true, todos: rows });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
