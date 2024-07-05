let tasks = [];

function addTask() {
    let taskInput = document.getElementById('taskInput');
    let task = taskInput.value.trim();
    if (task !== '') {
        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: task })
        })
        .then(response => response.json())
        .then(newTask => {
            tasks.push(newTask);
            renderTasks();
            taskInput.value = ''; // Clear the input field
        })
        .catch(error => console.error('Error:', error));
    }
}

function deleteTask(id, index) {
    fetch(`/tasks/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        tasks.splice(index, 1);
        renderTasks();
    })
    .catch(error => console.error('Error:', error));
}

function renderTasks() {
    let taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        let li = document.createElement('li');
        li.textContent = task.title;
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTask(task.id, index);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });
}

function fetchTasks() {
    fetch('/tasks')
    .then(response => response.json())
    .then(data => {
        tasks = data;
        renderTasks();
    })
    .catch(error => console.error('Error:', error));
}

function logout() {
    // Implement logout functionality
}

fetchTasks();
