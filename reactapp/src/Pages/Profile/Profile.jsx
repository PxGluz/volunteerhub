import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";
import './Profile.css'
import '../EventPage/Event.css'

const Profile = () => {
    // display a user's profile info based on the id in the url by making a request to localhost:5100/api/user/GetUserById
    const [user, setUser] = useState([]);
    const [events, setEvents] = useState([]);
    const { id: userId } = useParams();

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`http://localhost:5100/api/event/GetEventsCreatedByUser/${userId}`);
            const data = response.data;
            // Actualizează starea cu datele primite de la server
            setEvents(data);
        } catch (error) {
            console.error('Eroare la obținerea datelor de la server:', error);
        }
    };

    // get all events in which user was accepted with a request to localhost:5100/api/event/GetEventsAcceptedByUser/{userId}
    const fetchAcceptedEvents = async () => {
        try {
            const response = await axios.get(`http://localhost:5100/api/event/GetEventsAppliedToByUser/${userId}`);
            const data = response.data;
            // Actualizează starea cu datele primite de la server
            setEvents(data);
        } catch (error) {
            console.error('Eroare la obținerea datelor de la server:', error);
        }
    };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5100/api/user/GetUserById/${userId}`);
                const data = response.data;
                // Actualizează starea cu datele primite de la server
                setUser(data);
                console.log(data)
                switch (data['role']) {
                    case 0:
                        fetchEvents();
                        break;
                    case 1:
                        fetchAcceptedEvents();
                        break;
                    }
            } catch (error) {
                console.error('Eroare la obținerea datelor de la server:', error);
            }
        };
        // get all the events created by the user with a request to localhost:5100/api/event/GetEventsCreatedByUser/{userId}
        
        fetchData();

    }, [userId]);
    
    return (
        <>
            <div className='window'>
                <h1>Welcome to {user['username']}'s profile!</h1>
                <h2>{user['username']} the {user['role'] === 0 ? 'Event Planner' : (user['role'] === 1 ? 'Volunteer' : 'Admin')}</h2>
            </div>
            <div className='events'>
                {user !== undefined && user['role'] === 0 ? 
                    <div>
                        <h2>Events created by {user['username']}</h2>
                        {events !== undefined && events.map((item) => (
                            <div className="event">
                                <h3>{item['eventId']}.{item['title']}</h3>
                                <p>{item['description']}</p>
                                <h4>{item['creatorName']} - {item['dateTime']}</h4>
                            </div>
                        ))
                        }
                    </div> : (user !== undefined && user['role'] === 1 ? 
                        <div>
                            <h2>Events attended by {user['username']}</h2>
                            {events !== undefined && events.map((item) => (
                                <div className="event">
                                    <h3>{item['eventId']}.{item['title']}</h3>
                                    <p>{item['description']}</p>
                                    <h4>{item['creatorName']} - {item['dateTime']}</h4>
                                </div>
                            ))
                            }
                        </div>
                        : null)}
            </div>
        </>
    );
    
};

export default Profile;