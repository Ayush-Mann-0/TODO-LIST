const loginForm = document.getElementById('loginForm');
const errorMessageElement = document.getElementById('error-message'); // Reference to error message container

loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            window.location.replace('todo.html');
        } else {
            const errorMessage = await response.text();
            errorMessageElement.textContent = errorMessage || 'Login failed'; // Display error message
            errorMessageElement.style.display = 'block'; // Show error message container
        }
    } catch (error) {
        console.error('Login error:', error.message);
        errorMessageElement.textContent = 'Login failed. Please check your credentials and try again.';
        errorMessageElement.style.display = 'block';
    }
});
