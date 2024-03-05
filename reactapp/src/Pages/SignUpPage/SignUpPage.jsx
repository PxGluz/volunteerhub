import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Paper,
    Typography,
    TextField,
    Button,
    Container,
    CssBaseline,
    styled,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
} from '@mui/material';

const StyledContainer = styled(Container)({
    marginTop: '20px',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
});

const StyledPaper = styled(Paper)({
    padding: '20px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
});

const SignUpPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState(1); // Default: voluntar
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignUp = () => {
        // Validare simplă pentru confirmarea parolei
        if (password !== confirmPassword) {
            setError('Parola și confirmarea parolei nu se potrivesc.');
            return;
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role }),
        };

        fetch('http://localhost:5100/api/user/SignUp', requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }

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
        <StyledContainer component="main" maxWidth="xs">
            <CssBaseline />
            <StyledPaper elevation={3}>
                <Typography variant="h5" gutterBottom>
                    Înregistrare
                </Typography>
                <TextField
                    label="Utilizator"
                    type="text"
                    fullWidth
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <TextField
                    label="Parolă"
                    type="password"
                    fullWidth
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <TextField
                    label="Confirmare parolă"
                    type="password"
                    fullWidth
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <FormControl component="fieldset" style={{ marginTop: '10px' }}>
                    <FormLabel component="legend">Rol</FormLabel>
                    <RadioGroup
                        aria-label="role"
                        name="role"
                        value={role}
                        onChange={(e) => setRole(parseInt(e.target.value))}
                    >
                        <FormControlLabel value={1} control={<Radio />} label="Voluntar" />
                        <FormControlLabel value={0} control={<Radio />} label="Organizator de evenimente" />
                    </RadioGroup>
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSignUp}
                    style={{ marginTop: '10px' }}
                >
                    Înregistrare
                </Button>
                {error && <Typography variant="body2" style={{ color: 'red', marginTop: '10px' }}>{error}</Typography>}
            </StyledPaper>
        </StyledContainer>
    );
};

export default SignUpPage;
