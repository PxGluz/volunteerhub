import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link, useNavigate, useParams} from "react-router-dom";
import './Event.css'

const Event = () => {
    const authToken = localStorage.getItem('token');
    const navigate = useNavigate();
    // display a user's profile info based on the id in the url by making a request to localhost:5100/api/user/GetUserById
    const [event, setEvent] = useState([]);
    const [user, setUser] = useState([]);
    const { id: eventId } = useParams();

    // function to apply to the event to localhost:5100/api/event/ApplyToEvent/{eventId}
    const ApplyToEvent = () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: authToken, // Include the token in the headers
            },
        };

        fetch(`http://localhost:5100/api/event/ApplyToEvent/${eventId}`, requestOptions)
            .then((response) => {
                // Check if the response status is OK
                if (response.ok) {
                    // No need to parse JSON from an empty response
                    // Proceed with the navigation or other actions
                    console.log(`/event/${eventId}`)
                    navigate('/');
                } else {
                    // Handle the case where the server responds with an error
                    return response.json().then((errorData) => Promise.reject(errorData));
                }
            })
            .catch((error) => {
                alert(error);
            });
    };
    
    
    
    
    // function to delete a post
    const DeletePost = () => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: authToken, // Include the token in the headers
            },
        };

        fetch(`http://localhost:5100/api/event/DeleteEvent/${eventId}`, requestOptions)
            .then((response) => {
                // Check if the response status is OK
                if (response.ok) {
                    // No need to parse JSON from an empty response
                    // Proceed with the navigation or other actions
                    navigate('/');
                } else {
                    // Handle the case where the server responds with an error
                    return response.json().then((errorData) => Promise.reject(errorData));
                }
            })
            .catch((error) => {
                console.error('Există o eroare!', error);
            });
    };
    
    function hasApplied() {
        if (event['applicants'] !== undefined) {
            for (let i = 0; i < event['applicants'].length; i++) {
                if (event['applicants'][i]['userId'] === user['userId']) {
                    return true;
                }
            }
        }
        return false;
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5100/api/event/GetEvent/${eventId}`);
                const data = response.data;
                // Actualizează starea cu datele primite de la server
                setEvent(data);
            } catch (error) {
                console.error('Eroare la obținerea datelor de la server:', error);
            }
        };
        const GetUserInfo = () => {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: authToken, // Include the token in the headers
                },
            };
            fetch('http://localhost:5100/api/user/GetUserByToken', requestOptions)
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
                    setUser(data);
                })
                .catch((error) => {
                    console.error('Există o eroare!', error);
                });

        }
        fetchData();
        if (authToken)
            GetUserInfo();


    }, [eventId]);

    return (
        <div>
            <div className='utilityBar'>
                <h1><u>{event['eventId']}. {event['title']}</u></h1>
                {user['userID'] === event['creatorId'] || user['role'] === 2  ? <button onClick={() => {DeletePost();}}>Delete Post</button> : null}
                {user['userID'] === event['creatorId'] ? <button onClick={() => {navigate(`/editEvent/${eventId}`);}}>Edit Post</button> : null}
                {user['role'] === 1 && !hasApplied() ? <button onClick={ApplyToEvent}>Apply</button> : null}
            </div>
            <div className='event-body'>
                <div className='content'>
                    <h5>{event['creatorName']} - {event['dateTime']}</h5>
                    <p>{event['description']}</p>
                </div>
                <div className='volunteers'>
                    <h2>Volunteers</h2>
                    {event['applicants'] !== undefined ? event['applicants'].map((item) => (
                        <div className="volunteer">
                            <Link to={`/profile/${item['userId']}`}>
                                <h3>{item['username']}</h3>
                            </Link>
                        </div>
                    )) : null}
                </div>
            </div>
        </div>
    );

};

export default Event;