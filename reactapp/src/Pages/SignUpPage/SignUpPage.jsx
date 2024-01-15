// SignUpPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpPage = ({ onSignUp }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignUp = () => {
        // Validare simplă pentru confirmarea parolei
        if (password !== confirmPassword) {
            setError('Parola și confirmarea parolei nu se potrivesc.');
            return;
        }

        // Simulare funcție de înregistrare
        // Aici ar trebui să utilizezi o logică reală pentru a gestiona înregistrarea
        // Poți apela onSignUp(username) pentru a seta utilizatorul autentificat
        onSignUp(username);

        // Redirecționare către pagina de dashboard după înregistrare
        navigate('/dashboard');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSignUp();
        }
    };

    return (
        <div>
            <h2>Înregistrare</h2>
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
            <div>
                <label>Confirmare parolă:</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
            </div>
            <button onClick={handleSignUp}>Înregistrare</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default SignUpPage;
