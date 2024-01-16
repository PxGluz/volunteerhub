import React, {useEffect, useState} from 'react';
import PostChecker from "../../Components/RoleCheckers/PostChecker";
import {useNavigate, useParams} from "react-router-dom";
import OwnershipChecker from "../../Components/RoleCheckers/OwnershipChecker";

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
    }

    return (
        <>
            <h2>Edit Event</h2>
            <div>
                <h3>Title:</h3>
                <input
                    type="text"
                    value={title}
                    required='true'
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
            </div>
            <div>
                <h3>Description:</h3>
                <textarea
                    rows="5"  // Adjust the number of rows to increase or decrease the size
                    cols="40" // Adjust the number of columns to increase or decrease the size
                    value={description}
                    required='true'
                    onChange={(e) => setDescription(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
            </div>
            <div>
                <h3>Date and Time:</h3>
                <input
                    type="datetime-local"
                    value={dateTime}
                    required='true'
                    onChange={(e) => setDateTime(e.target.value)}
                />
            </div>
            <button onClick={confirmEdit}>Post</button>

        </>
    );
};

export default OwnershipChecker(EditEvent);
