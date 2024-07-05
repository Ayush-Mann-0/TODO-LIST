let currentUser = '';

document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    }).then(response => response.json()).then(data => {
        alert(data.message);
    });
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    }).then(response => response.json()).then(data => {
        if (data.success) {
            currentUser = username;
            document.getElementById('register-form').style.display = 'none';
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('todo-container').style.display = 'block';
            loadTodos();
        } else {
            alert(data.message);
        }
    });
});

document.getElementById('add-todo').addEventListener('click', function() {
    const todoInput = document.getElementById('todo-input');
    const todoText = todoInput.value;
    fetch('/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: currentUser, todo: todoText })
    }).then(response => response.json()).then(data => {
        if (data.success) {
            addTodoToList(todoText);
            todoInput.value = '';
        } else {
            alert('Failed to add TODO');
        }
    });
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
        });
}
