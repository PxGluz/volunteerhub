// SignUpPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpPage = ({}) => {
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

        // send signup info to localhost:5100/api/user/SignUp
        // get radio button
        var radios = document.getElementsByName('role');
        // pick the value of the active radio button
        var role = 0;
        for (var i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked === true) {
                role = parseInt(radios[i].value);
                break;
            }
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role }),
        };
        fetch('http://localhost:5100/api/user/SignUp', requestOptions)
            .then(async (response) => {
                const data = await response.json();

                // Verifică dacă serverul a întors o eroare
                if (!response.ok) {
                    // Obțineți eroarea
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }

                // Actualizează starea cu datele primite de la server
                localStorage.setItem('token', data);
                navigate('/');
            })
            .catch((error) => {
                setError(error.toString());
                console.error('Există o eroare!', error);
            });
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
            <div>
                <input type="radio" id="volunteer" name="role" value={1} checked="true" />
                <label htmlFor="eventPlanner">Voluntar</label>
                <input type="radio" id="eventPlanner" name="role" value={0} />
                <label for="eventPlanner">Organizator de evenimente</label>
            </div>
            
            
            <button onClick={handleSignUp}>Înregistrare</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default SignUpPage;
