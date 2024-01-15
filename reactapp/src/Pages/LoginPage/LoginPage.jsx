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
        // Simulare funcție de autentificare
        if (username === '123' && password === '123') {
            setError('');
            onLogin(username);
            navigate('/dashboard'); // Redirecționare către /dashboard după autentificare
        } else {
            setError('Nume de utilizator sau parolă incorecte.');
        }
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
