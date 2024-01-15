import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [volunteers, setVolunteers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5100/api/user/GetUsers');
                const data = response.data;
                console.log('data', data);
                // Actualizează starea cu datele primite de la server
                setVolunteers(data);
            } catch (error) {
                console.error('Eroare la obținerea datelor de la server:', error);
            }
        };

        fetchData();

    }, []);

    return (
        <div>
            <h2>Tablou de bord</h2>
            <table>
                <thead>
                <tr>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Photo</th>
                    <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {volunteers.map((item) => (
                        <tr key={item['userId']}>
                            <td>{item['userId']}</td>
                            <td>{item['username']}</td>
                            <td>{item['password']}</td>
                            <td>{item['photo']}</td>
                            <td>{item['role']}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
);
};

export default Dashboard;