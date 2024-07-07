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
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add task');
            }
            return response.json();
        })
        .then(newTask => {
            tasks.push(newTask);
            renderTasks();
            taskInput.value = ''; // Clear the input field
        })
        .catch(error => console.error('Error adding task:', error));
    } else {
        alert('Please enter a task');
    }
}

function deleteTask(id, index) {
    fetch(`/tasks/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
        tasks.splice(index, 1);
        renderTasks();
    })
    .catch(error => console.error('Error deleting task:', error));
}

function renderTasks() {
    let taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        let li = document.createElement('li');
        li.style.whiteSpace = 'normal'; // Ensures text wraps instead of truncating
        li.style.display = 'flex'; // Use flexbox to align items in a row
        li.style.alignItems = 'center'; // Center align items vertically

        // Title
        let title = document.createElement('div');
        title.textContent = task.title;
        title.style.fontWeight = 'bold';
        title.style.flex = '1'; // Allow title to take up remaining space
        title.style.wordBreak = 'break-word'; // Allow word break to wrap long words
        li.appendChild(title);

        // Description (if any)
        if (task.description) {
            let description = document.createElement('p');
            description.textContent = task.description;
            description.style.flex = '1'; // Allow description to take up remaining space
            description.style.wordBreak = 'break-word'; // Allow word break for descriptions
            li.appendChild(description);
        }

        // Buttons container
        let buttonContainer = document.createElement('div');

        // Complete button
        let completeButton = document.createElement('button');
        completeButton.textContent = task.is_completed ? 'Mark as Incomplete' : 'Mark as Complete';
        completeButton.style.backgroundColor = task.is_completed ? '#28a745' : '#007BFF'; // Green for completed, blue for incomplete
        completeButton.addEventListener('click', () => markAsComplete(task.id, index));

        // Delete button
        let deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<img src="delete.png" alt="Delete">';
        deleteButton.addEventListener('click', () => deleteTask(task.id, index));
        
        buttonContainer.appendChild(completeButton);
        buttonContainer.appendChild(deleteButton);
        buttonContainer.style.marginLeft = '10px'; // Add margin between buttons
        
        li.appendChild(buttonContainer);
        taskList.appendChild(li);
    });
}


function fetchTasks() {
    fetch('/tasks')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        return response.json();
    })
    .then(data => {
        tasks = data;
        renderTasks();
    })
    .catch(error => console.error('Error fetching tasks:', error));
}

function logout() {
    // Clear user session data (this example assumes sessionStorage is used)
    sessionStorage.clear();

    // Redirect to the login page
    window.location.href = 'login.html';
}

function markAsComplete(id, index) {
    fetch(`/tasks/${id}/complete`, {
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to mark as complete');
        }
        tasks[index].is_completed = !tasks[index].is_completed;
        renderTasks();
    })
    .catch(error => console.error('Error marking as complete:', error));
}

fetchTasks();
