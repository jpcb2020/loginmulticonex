document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Simple validation
        if (username.trim() === '' || password.trim() === '') {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
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
            return data;
        })
        .then(data => {
            console.log("Resposta JSON:", data);
            alert('Login realizado com sucesso!');
            // Clear the form
            loginForm.reset();
        })
        .catch(error => {
            console.error("Erro:", error);
            alert('Erro ao realizar login. Por favor, tente novamente.');
        });
    });
});