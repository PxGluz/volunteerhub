// LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, CssBaseline, styled } from '@mui/material';

const StyledContainer = styled(Container)(({ theme }) => ({
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

const StyledForm = styled('form')({
    width: '100%',
    marginTop: theme => theme.spacing(1),
});

const StyledTextField = styled(TextField)({
    marginBottom: theme => theme.spacing(2),
});

const StyledButton = styled(Button)({
    margin: theme => theme.spacing(3, 0, 2),
});

const LoginPage = ({}) => {
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
                // register the session token to local storage
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
            handleLogin();
        }
    };

    return (
        <StyledContainer component="main" maxWidth="xs">
            <CssBaseline />
            <div>
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <StyledForm noValidate>
                    <StyledTextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <StyledTextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <StyledButton
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleLogin}
                    >
                        Login
                    </StyledButton>
                </StyledForm>
            </div>
        </StyledContainer>
    );
};

export default LoginPage;