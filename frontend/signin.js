document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');
    const btnText = loginBtn.querySelector('.btn-text');
    const loader = document.getElementById('loader');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // UI State: Loading
        loginBtn.disabled = true;
        loader.style.display = 'block';
        btnText.style.opacity = '0.5';

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            // Updated to 127.0.0.1 for local connection reliability
            const response = await fetch('http://127.0.0.1:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Success: Redirect to dashboard
                // We'll simulate a token or session by just allowing redirect
                window.location.href = 'index.html';
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Could not connect to the backend.');
        } finally {
            // UI State: Reset
            loginBtn.disabled = false;
            loader.style.display = 'none';
            btnText.style.opacity = '1';
        }
    });
});
