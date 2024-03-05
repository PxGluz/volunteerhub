import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Paper, Typography, List, ListItem, Divider, Container, CssBaseline, styled } from '@mui/material';
import './Dashboard.css';


const StyledDashboard = styled(Container)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(4),
}));

const StyledSection = styled(Paper)(({ theme }) => ({
    textAlign: 'center',
    background: '#fafafa',
    margin: '0 16px', // Adaugă un spațiu între secțiuni
    flex: 1,
    border: '1px solid #ddd',
    padding: '10px',
    marginBottom: '10px',
}));

const StyledLink = styled(Link)({
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': {
        textDecoration: 'underline',
    },
});



const Dashboard = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5100/api/user/GetUsers');
                const data = response.data;
                // Actualizează starea cu datele primite de la server
                setVolunteers(data);
            } catch (error) {
                console.error('Eroare la obținerea datelor de la server:', error);
            }
            // get all events with a request to localhost:5100/api/event/GetEvents
            try {
                const response = await axios.get('http://localhost:5100/api/event/GetEvents');
                const data = response.data;
                // Actualizează starea cu datele primite de la server
                setEvents(data);
            } catch (error) {
                console.error('Eroare la obținerea datelor de la server:', error);
            }
            
        };

        fetchData();

    }, []);

    return (
        <div className="dashboard">
            <StyledSection className="eventList">
                <CssBaseline />
                <Typography variant="h5" gutterBottom>
                    Upcoming events
                </Typography>
                <List>
                    {events.map((item) => (
                        <StyledLink to={`/event/${item['eventId']}`} key={item['eventId']}>
                            <ListItem button>
                                <Typography variant="h6">{item['title']}</Typography>
                                <Typography variant="body2" className="space"> {item['description']}</Typography>
                                <Typography variant="body2" className="space">
                                     {item['creatorName']} - {item['dateTime']}
                                </Typography>
                            </ListItem>
                            <Divider />
                        </StyledLink>
                    ))}
                </List>
            </StyledSection>

            <StyledSection className="leaderboard">
                <Typography variant="h5" gutterBottom>
                    Leaderboard
                </Typography>
                <List>
                    {volunteers.map((item) => (
                        <StyledLink to={`/profile/${item['userId']}`} key={item['userId']}>
                            <ListItem button>
                                <Typography variant="h6">{item['username']}</Typography>
                            </ListItem>
                            <Divider />
                        </StyledLink>
                    ))}
                </List>
            </StyledSection>
        </div>
    );
};

export default Dashboard;