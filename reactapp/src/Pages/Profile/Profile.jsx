import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";

const Profile = () => {
    // display a user's profile info based on the id in the url by making a request to localhost:5100/api/user/GetUserById
    const [user, setUser] = useState([]);
    const { id: userId } = useParams();
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5100/api/user/GetUserById/${userId}`);
                const data = response.data;
                console.log('data', data);
                // Actualizează starea cu datele primite de la server
                setUser(data);
            } catch (error) {
                console.error('Eroare la obținerea datelor de la server:', error);
            }
        };

        fetchData();

    }, [userId]);
    
    return (
        <div>
            <h2>Profile</h2>
            <table>
                <thead>
                <tr>
                    <th>Username</th>
                    <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{user['username']}</td>
                        <td>{user['role']}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
    
};

export default Profile;