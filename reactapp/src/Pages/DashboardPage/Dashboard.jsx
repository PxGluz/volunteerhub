import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import {Link} from "react-router-dom";

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
        <div className='dashboard'>
            <div className='eventList'>
                <h2>Upcoming events</h2>
                {events.map((item) => (
                    <Link to={`/event/${item['eventId']}`}>
                        <div className="event">
                            <h3>{item['eventId']}.{item['title']}</h3>
                            <p>{item['description']}</p>
                            <h4>{item['creatorName']} - {item['dateTime']}</h4>
                        </div>
                    </Link>
                ))}
            </div>
            <div className='leaderboard'>
                <h2>Leaderboard</h2>
                {volunteers.map((item) => (
                    <Link to={`/profile/${item['userId']}`}>
                        <div className="volunteer">
                            <h3>{item['userId']}. {item['username']}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
);
};

export default Dashboard;