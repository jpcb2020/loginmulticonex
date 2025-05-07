document.addEventListener('DOMContentLoaded', () => {
    // Password toggle functionality
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    const usernameInput = document.getElementById('username'); // Get username input
    const rememberMeCheckbox = document.getElementById('remember-me'); // Get remember me checkbox

    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });

    // Load saved credentials from localStorage on page load
    const savedUsername = localStorage.getItem('rememberedUsername');
    const savedPassword = localStorage.getItem('rememberedPassword'); // Get saved password

    if (savedUsername) {
        usernameInput.value = savedUsername;
        // Optionally check the remember me checkbox if credentials were found
        if (savedPassword) { // Only check if both are found
             rememberMeCheckbox.checked = true;
             passwordInput.value = savedPassword; // Fill password if saved
        }
    }

    // Login form submission
    const loginForm = document.getElementById('login-form'); // Corrected ID from 'loginForm' to 'login-form' to match HTML

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = usernameInput.value;
        const password = passwordInput.value; // Re-getting value in case it was typed after page load

        const loginBtn = document.querySelector('.login-btn');

        // Simple validation
        if (username.trim() === '' || password.trim() === '') {
            showNotification('Por favor, preencha todos os campos.', 'error'); // Using 'error' type for validation messages
            return; // Exit if validation fails
        }

        // Add animation effect to the button
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
        loginBtn.disabled = true;

        // Using the provided authentication logic
        fetch("https://n8n-n8n.3i6pbm.easypanel.host/webhook/testelogin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: username, // Using the username input as email
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            // Extract headers from the response body
            const headers = data.headers || {};

            // Remove any key with null value
            const filteredHeaders = Object.fromEntries(Object.entries(headers).filter(([k, v]) => v !== null));

            // Encode to store in cookie
            const cookieValue = encodeURIComponent(JSON.stringify(filteredHeaders));

            // Set cookie with specified name
            const date = new Date();
            date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000)); // Add 1 year in milliseconds
            const expires = "expires=" + date.toUTCString();
            document.cookie = `cw_d_session_info=${cookieValue}; ${expires}; path=/; domain=.3i6pbm.easypanel.host`;

            console.log("Cookie 'cw_d_session_info' criado com sucesso e validade de 1 ano!");
            // The original new code had another .then(data => { console.log("Resposta JSON:", data); alert('Login realizado com sucesso!'); loginForm.reset(); })
            // We will combine this into the current .then block for clarity and to ensure button state is managed correctly.
            console.log("Resposta JSON:", data);
            showNotification('Login realizado com sucesso!', 'success');

            // Save credentials to localStorage if "Remember me" is checked
            if (rememberMeCheckbox.checked) {
                localStorage.setItem('rememberedUsername', username);
                localStorage.setItem('rememberedPassword', password); // Save password
            } else {
                // Clear saved credentials if checkbox is not checked
                localStorage.removeItem('rememberedUsername');
                localStorage.removeItem('rememberedPassword');
            }

            loginForm.reset(); // Clear the form

            // Reset button state
            loginBtn.innerHTML = 'Entrar';
            loginBtn.disabled = false;

            // Redirect the user to the specified page
            window.location.href = 'https://chatwoot-chatwoot.3i6pbm.easypanel.host/';

            return data; // Though not strictly necessary to return here unless chained further
        })
        .catch(error => {
            console.error("Erro:", error);
            showNotification('Erro ao realizar login. Por favor, tente novamente.', 'error'); // Using 'error' type for error messages

            // Reset button state on error
            loginBtn.innerHTML = 'Entrar';
            loginBtn.disabled = false;
        });
    });

    // Add animations to input fields when they receive focus
    const inputs = document.querySelectorAll('input');

    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
});

// Custom notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    if (type) {
        notification.classList.add(type);
    }
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        ${message}
    `; // Using info icon by default, could add logic for different icons based on type

    document.body.appendChild(notification);

    // Automatically hide after 3 seconds
    setTimeout(() => {
        notification.classList.add('hide');
        // Remove from DOM after animation
        notification.addEventListener('animationend', () => {
            notification.remove();
        });
    }, 3000);
}


// Additional CSS for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        animation: slideIn 0.5s forwards;
        z-index: 1000;
    }

    .notification i {
        margin-right: 10px;
    }

    .notification.hide {
        animation: slideOut 0.5s forwards;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .notification.error {
        background: #e74c3c; /* Cor vermelha para erro */
    }

    .input-group.focused input {
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }
`;

document.head.appendChild(style);
