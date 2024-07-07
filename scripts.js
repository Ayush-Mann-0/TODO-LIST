let currentUser = '';

document.getElementById('registerForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); // Display the registration message from the server
        if (data.message === 'User registered successfully') {
            // Optionally, handle successful registration (e.g., show success message)
            document.getElementById('message').textContent = 'Registration successful!';
            document.getElementById('message').style.color = '#4CAF50';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to register.');
    });
});

document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); // Display the login message from the server
        if (data.message === 'Login successful') {
            currentUser = username;
            document.getElementById('authSection').style.display = 'none';
            document.getElementById('todoContainer').style.display = 'block';
            loadTodos(); // Load todos for the logged-in user
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to login.');
    });
});

document.getElementById('logout').addEventListener('click', () => {
    currentUser = '';
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('todoContainer').style.display = 'none';
    document.getElementById('todoList').innerHTML = ''; // Clear TODO list
});

document.getElementById('addTodo').addEventListener('click', () => {
    const todoInput = document.getElementById('todoInput');
    const todoText = todoInput.value;

    fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: todoText })
    })
    .then(response => response.json())
    .then(data => {
        addTodoToList(todoText); // Add todo to UI
        todoInput.value = ''; // Clear input field
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to add TODO.');
    });
});

function addTodoToList(todoText) {
    const todoList = document.getElementById('todoList');
    const li = document.createElement('li');
    li.textContent = todoText;
    todoList.appendChild(li);
}

function loadTodos() {
    fetch('/tasks')
    .then(response => response.json())
    .then(data => {
        data.forEach(todo => addTodoToList(todo.title)); // Add each todo to UI
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to load TODOs.');
    });
}
