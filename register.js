document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const messageDiv = document.getElementById('message');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(registerForm);
        const username = formData.get('username');
        const password = formData.get('password');

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();
            if (response.status === 201) {
                messageDiv.textContent = 'User registered successfully';
                messageDiv.style.color = 'green';
            } else if (response.status === 409) {
                messageDiv.textContent = 'User already registered';
                messageDiv.style.color = 'red';
            } else {
                messageDiv.textContent = result.message;
                messageDiv.style.color = 'red';
            }
        } catch (err) {
            messageDiv.textContent = 'Error: ' + err.message;
            messageDiv.style.color = 'red';
        }
    });
});
