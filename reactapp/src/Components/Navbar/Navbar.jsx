import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, styled } from '@mui/material';

const StyledLink = styled(Link)({
    textDecoration: 'none',
    color: 'inherit',
    flexGrow: 1,
});

const Navbar = () => {
    const navigate = useNavigate();
    const authToken = localStorage.getItem('token');
    const [user, setUser] = useState('');

    useEffect(() => {
        const GetUserInfo = () => {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: authToken,
                },
            };
            fetch('http://localhost:5100/api/user/GetUserByToken', requestOptions)
                .then(async (response) => {
                    const data = await response.json();

                    if (!response.ok) {
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    }

                    setUser(data);
                })
                .catch((error) => {
                    console.error('Există o eroare!', error);
                });
        };

        if (authToken) GetUserInfo();
    }, [authToken]);

    return (
        <AppBar position="static">
            <Container>
                <Toolbar>
                    <StyledLink to="/">
                        <Typography variant="h6" component="div">
                            Volunteer<b>Hub</b>
                        </Typography>
                    </StyledLink>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {authToken ? (
                            <>
                                <StyledLink to={`/profile/${user['userID']}`}>
                                    {user['username']}'s Profile
                                </StyledLink>
                                {user['role'] !== 1 ? (
                                    <Button className="space" variant="contained" color="secondary" onClick={() => navigate('/newEvent')}>
                                        New Event
                                    </Button>
                                ) : null}
                                <Button className="space" variant="contained" color="secondary" onClick={() => { localStorage.removeItem('token'); navigate('/'); }}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button color="inherit" component={Link} to="/login">
                                    Login
                                </Button>
                                <Button color="inherit" component={Link} to="/signup">
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </div>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
