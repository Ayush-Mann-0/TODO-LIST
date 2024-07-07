document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Clear previous error messages
    document.getElementById('usernameError').textContent = '';
    document.getElementById('passwordError').textContent = '';

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    let isValid = true;

    if (username.length < 3) {
        document.getElementById('usernameError').textContent = 'Username must be at least 3 characters long.';
        isValid = false;
    }

    if (password.length < 6) {
        document.getElementById('passwordError').textContent = 'Password must be at least 6 characters long.';
        isValid = false;
    }

    if (isValid) {
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('message').textContent = data.message; // Display registration message
            document.getElementById('message').style.display = 'block'; // Show message container
            document.getElementById('registerForm').reset(); // Reset form fields
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to register.');
        });
    }
});
