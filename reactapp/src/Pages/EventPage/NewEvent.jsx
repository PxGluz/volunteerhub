import React, { useState } from 'react';
import PostChecker from "../../Components/RoleCheckers/PostChecker";
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, TextField, Button, Container, CssBaseline, styled } from '@mui/material';





const StyledContainer = styled(Container)({
    marginTop: '20px',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
});

const StyledPaper = styled(Paper)({
    padding: '20px',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center',
});

const NewEvent = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dateTime, setDateTime] = useState('');
    const navigate = useNavigate();

    const authToken = localStorage.getItem('token');

    const submitPost = () => {
        const formattedDateTime = new Date(dateTime).toISOString();

        fetch('http://localhost:5100/api/event/CreateEvent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: authToken,
            },
            body: JSON.stringify({
                title: title,
                description: description,
                dateTime: formattedDateTime,
            }),
        })
            .then(async (response) => {
                if (!response.ok) {
                    const errorText = await response.text();
                    alert(`Event creation failed: ${errorText}`);
                    throw new Error(`Event creation failed: ${errorText}`);
                }

                const data = await response.json();
                navigate('/');
            })
            .catch((err) => {
                console.error(err);
                alert('Event creation failed');
            });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            submitPost();
        }
    };

    return (
        <StyledContainer component="main" maxWidth="xs">
            <CssBaseline />
            <StyledPaper elevation={3}>
                <Typography variant="h5" gutterBottom>
                    New Post
                </Typography>
                <TextField
                    label="Title"
                    type="text"
                    fullWidth
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <TextField
                    label="Description"
                    multiline
                    rows={5}
                    fullWidth
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <TextField
                   
                    type="datetime-local"
                    fullWidth
                    required
                    style={{ marginBottom: '10px' }}  // Adaugă spațiu între Date and Time și selectorul de data
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={submitPost}
                >
                    Post
                </Button>
            </StyledPaper>
        </StyledContainer>
    );
};

export default PostChecker(NewEvent, [0, 2]);
