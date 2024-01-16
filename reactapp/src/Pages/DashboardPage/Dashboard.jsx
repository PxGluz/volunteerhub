import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

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
        <div>
            <h2>All users</h2>
            <table>
                <thead>
                <tr>
                    <th>UserID</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {volunteers.map((item) => (
                        <tr key={item['userId']}>
                            <td>{item['userId']}</td>
                            <td>{item['username']}</td>
                            <td>{item['password']}</td>
                            <td>{item['role']}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <h2>All events</h2>
                <table>
                    <tbody>
                        {events.map((item) => (
                            <div className="event">
                                <h3>{item['eventId']}.{item['title']}</h3>
                                <p>{item['description']}</p>
                                <h4>{item['creatorName']} - {item['dateTime']}</h4>
                            </div>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
);
};

export default Dashboard;