// LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'

const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook pentru a obține funcția de navigare

    const handleLogin = () => {
        // send login info to localhost:5100/api/user/SignIn
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        };
        fetch('http://localhost:5100/api/user/SignIn', requestOptions)
            .then(async (response) => {
                const data = await response.json();

                // Verifică dacă serverul a întors o eroare
                if (!response.ok) {
                    // Obțineți eroarea
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }

                // Actualizează starea cu datele primite de la server
                onLogin(username);
                navigate('/dashboard');
            })
            .catch((error) => {
                setError(error.toString());
                console.error('Există o eroare!', error);
            });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <div>
                <label>Utilizator:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
            </div>
            <div>
                <label>Parolă:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
            </div>
            <button onClick={handleLogin}>Login</button>
          
        </div>
    );
};

export default LoginPage;
