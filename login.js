const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    // Get username and password from the form inputs
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Send a POST request to the /login endpoint
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        // Check if the response indicates success (status 200-299)
        if (response.ok) {
            // Redirect to todo.html upon successful login
            window.location.replace('todo.html');
        } else {
            // Handle non-successful responses
            // Extract and parse the error message from the response
            const errorMessage = await response.text();
            throw new Error(errorMessage || 'Login failed');
        }
    } catch (error) {
        // Handle network errors, fetch API errors, or server-side errors
        console.error('Login error:', error.message);
        // Display an error message to the user or handle it appropriately
        // Example: Update the UI to inform the user about the login failure
        // Replace with your actual error handling mechanism (e.g., showing an alert)
        alert('Login failed. Please check your credentials and try again.');
    }
});
