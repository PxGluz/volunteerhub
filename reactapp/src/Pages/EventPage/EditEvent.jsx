import React, { useEffect, useState } from 'react';
import {Button, TextField, TextareaAutosize, Typography, styled, Container, Paper, CssBaseline} from '@mui/material';
import PostChecker from '../../Components/RoleCheckers/PostChecker';
import { useNavigate, useParams } from 'react-router-dom';
import OwnershipChecker from '../../Components/RoleCheckers/OwnershipChecker';

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

const EditEvent = ({}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dateTime, setDateTime] = useState('');
    const navigate = useNavigate();
    const { id: eventId } = useParams();

    const authToken = localStorage.getItem('token');

    // get the data of the event to be edited from the server at localhost:5100/api/event/GetCreateEventData/{eventId}
    useEffect(() => {
        fetch(`http://localhost:5100/api/event/GetCreateEventData/${eventId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: authToken,
            },
        })
            .then(async (response) => {
                if (!response.ok) {
                    const errorText = await response.text();
                    alert(`Event creation failed: ${errorText}`);
                    throw new Error(`Event creation failed: ${errorText}`);
                }

                const data = await response.json();
                setTitle(data['title']);
                setDescription(data['description']);
                setDateTime(data['dateTime']);
            })
            .catch((err) => {
                console.error(err);
                alert('Event creation failed');
            });
    }, []);

    const confirmEdit = () => {
        // Validate the date before proceeding
        if (!dateTime || isNaN(new Date(dateTime))) {
            alert('Invalid date. Please provide a valid date.');
            return;
        }

        // Format the dateTime as a string in a standard ISO format
        const formattedDateTime = new Date(dateTime).toISOString();

        // Confirmation before proceeding with the edit
        const userConfirmed = window.confirm('Are you sure you want to edit this event?');
        if (!userConfirmed) {
            return;
        }

        // send the event data to the server at localhost:5100/api/event/EditEvent
        fetch(`http://localhost:5100/api/event/EditEvent/${eventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: authToken,
            },
            body: JSON.stringify({
                title: title,
                description: description,
                dateTime: formattedDateTime, // Use the formatted date string
            }),
        })
            .then(async (response) => {
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Event edit failed: ${errorText}`);
                    alert(`Event edit failed: ${errorText}`);
                    throw new Error(`Event edit failed: ${errorText}`);
                }

                alert('Event edited successfully');
                navigate(`/event/${eventId}`);
            })
            .catch((err) => {
                console.error(err);
                alert('Event edit failed');
            });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            confirmEdit();
        }
    };

    return (
        <StyledContainer component="main" maxWidth="xs">
            <CssBaseline />
            <StyledPaper elevation={3}>
                <Typography variant="h5" gutterBottom>
                    Edit Event
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
                    onClick={confirmEdit}
                >
                    Confirm
                </Button>
            </StyledPaper>
        </StyledContainer>
    );
};

export default OwnershipChecker(EditEvent);
