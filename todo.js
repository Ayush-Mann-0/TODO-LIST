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
        li.style.whiteSpace = 'normal';
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.marginBottom = '10px';

        let title = document.createElement('div');
        title.textContent = task.title;
        title.style.fontWeight = 'bold';
        title.style.flex = '1';
        title.style.wordBreak = 'break-word';
        li.appendChild(title);

        if (task.description) {
            let description = document.createElement('p');
            description.textContent = task.description;
            description.style.flex = '1';
            description.style.wordBreak = 'break-word';
            li.appendChild(description);
        }

        let buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.marginLeft = '10px';

        let completeButton = document.createElement('button');
        completeButton.textContent = task.is_completed ? 'Mark as Incomplete' : 'Mark as Complete';
        completeButton.style.backgroundColor = task.is_completed ? '#28a745' : '#007BFF';
        completeButton.style.minHeight = '30px';
        completeButton.style.height = 'auto';
        completeButton.addEventListener('click', () => markAsComplete(task.id, index));

        let deleteButton = document.createElement('button');
        deleteButton.style.height = '30px';
        deleteButton.style.marginLeft = '5px';
        deleteButton.style.display = 'flex'; // Ensure flexbox is used for centering
        deleteButton.style.alignItems = 'center'; // Center align items vertically

        let deleteImage = document.createElement('img');
        deleteImage.src = 'delete.png'; // Replace with your image source
        deleteImage.alt = 'Delete';
        deleteImage.style.height = '100%'; // Ensure the image takes up the full height of the button
        deleteButton.appendChild(deleteImage);

        deleteButton.addEventListener('click', () => deleteTask(task.id, index));

        buttonContainer.appendChild(completeButton);
        buttonContainer.appendChild(deleteButton);
        
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
