let currentUser = '';

document.getElementById('register-form').addEventListener('submit', (event) => {
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
        alert(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to register.');
    });
});

document.getElementById('login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            currentUser = username;
            document.getElementById('auth-section').style.display = 'none';
            document.getElementById('todo-container').style.display = 'block';
            loadTodos();
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to login.');
    });
});

document.getElementById('add-todo').addEventListener('click', () => {
    const todoInput = document.getElementById('todo-input');
    const todoText = todoInput.value;

    fetch('/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: currentUser, todo: todoText })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            addTodoToList(todoText);
            todoInput.value = '';
        } else {
            alert('Failed to add TODO');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to add TODO.');
    });
});

document.getElementById('logout').addEventListener('click', () => {
    currentUser = '';
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('todo-container').style.display = 'none';
    document.getElementById('todo-list').innerHTML = ''; // Clear TODO list
});

function addTodoToList(todoText) {
    const todoList = document.getElementById('todo-list');
    const li = document.createElement('li');
    li.textContent = todoText;
    todoList.appendChild(li);
}

function loadTodos() {
    fetch(`/todos?username=${currentUser}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            data.todos.forEach(todo => addTodoToList(todo.todo));
        } else {
            alert('Failed to load TODOs');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to load TODOs.');
    });
}
