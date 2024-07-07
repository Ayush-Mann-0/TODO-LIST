document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Clear previous error messages
    document.getElementById('usernameError').style.display = 'none';
    document.getElementById('passwordError').style.display = 'none';

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    let isValid = true;

    // Simple validation
    if (username.length < 3) {
        document.getElementById('usernameError').textContent = 'Username must be at least 3 characters long.';
        document.getElementById('usernameError').style.display = 'block';
        isValid = false;
    }

    if (password.length < 6) {
        document.getElementById('passwordError').textContent = 'Password must be at least 6 characters long.';
        document.getElementById('passwordError').style.display = 'block';
        isValid = false;
    }

    if (isValid) {
        // Perform fetch request to register endpoint
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            // Handle response from server
            alert(data.message); // Optionally, display a message
            if (data.message === 'User registered successfully') {
                // Optionally, update UI or redirect to login page
                document.getElementById('message').textContent = 'Registration successful!';
                document.getElementById('message').style.color = '#4CAF50';
                document.getElementById('registerForm').reset(); // Clear form fields
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to register.');
        });
    }
});
