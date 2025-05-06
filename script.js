document.addEventListener('DOMContentLoaded', () => {
    // Password toggle functionality
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });
    
    // Login form submission
    const loginForm = document.getElementById('login-form'); // Corrected ID from 'loginForm' to 'login-form' to match HTML
    
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const usernameInput = document.getElementById('username'); // Renamed for clarity
        const passwordInput = document.getElementById('password'); // Already defined above for toggle, but good to have it here for context
        const username = usernameInput.value;
        const password = passwordInput.value; // Re-getting value in case it was typed after page load
        
        const loginBtn = document.querySelector('.login-btn');

        // Simple validation
        if (username.trim() === '' || password.trim() === '') {
            alert('Por favor, preencha todos os campos.');
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
            document.cookie = `cw_d_session_info=${cookieValue}; path=/;`;

            console.log("Cookie 'cw_d_session_info' criado com sucesso!");
            // The original new code had another .then(data => { console.log("Resposta JSON:", data); alert('Login realizado com sucesso!'); loginForm.reset(); })
            // We will combine this into the current .then block for clarity and to ensure button state is managed correctly.
            console.log("Resposta JSON:", data);
            alert('Login realizado com sucesso!');
            loginForm.reset(); // Clear the form

            // Reset button state
            loginBtn.innerHTML = 'Entrar';
            loginBtn.disabled = false;
            
            return data; // Though not strictly necessary to return here unless chained further
        })
        .catch(error => {
            console.error("Erro:", error);
            alert('Erro ao realizar login. Por favor, tente novamente.');
            
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
    
    .input-group.focused input {
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }
`;

document.head.appendChild(style);
