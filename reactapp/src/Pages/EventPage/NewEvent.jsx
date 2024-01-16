import React, { useState } from 'react';
import PostChecker from "../../Components/RoleCheckers/PostChecker";
import {useNavigate} from "react-router-dom";

const NewEvent = ({}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dateTime, setDateTime] = useState('');
    const navigate = useNavigate();

    const authToken = localStorage.getItem('token');
    const submitPost = () => {
        // Format the dateTime as a string in a standard ISO format
        const formattedDateTime = new Date(dateTime).toISOString();

        // send the event data to the server at localhost:5100/api/event/CreateEvent
        fetch('http://localhost:5100/api/event/CreateEvent', {
            method: 'POST',
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
        <div>
            <h2>New Post</h2>
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
            <button onClick={submitPost}>Post</button>

        </div>
    );
};

export default PostChecker(NewEvent, [0, 2]);
