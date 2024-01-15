// Dashboard.js - Componenta principală a dashboard-ului

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [totalHours, setTotalHours] = useState(0);
    const [activeProjects, setActiveProjects] = useState(0);

    useEffect(() => {
        // Funcție pentru a obține datele de la server
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/dashboard'); // Modifică URL-ul în consecință
                const data = response.data;

                // Actualizează starea cu datele primite de la server
                setVolunteers(data.volunteers);
                setTotalHours(data.totalHours);
                setActiveProjects(data.activeProjects);
            } catch (error) {
                console.error('Eroare la obținerea datelor de la server:', error);
            }
        };

        // Apelează funcția pentru obținerea datelor la încărcarea componentei
        fetchData();
        fetch("api/users/GetUsers")
            .then(response => { return response.json() })
            .then(responseJson => {

                setVolunteers(responseJson)
            })

    }, []); // [] asigură că useEffect este apelat doar la încărcarea componentei

    return (
        <div>
            <h2>Tablou de bord</h2>
            {
                volunteers.map((item) => (
                    <tr>
                        <td>{item.UserId}</td>
                        <td>{ item.Username}</td>
                        <td>{item.Password}</td>
                        <td>{item.Photo}</td>
                        <td>{item.Role}</td>
                    </tr>

                ))
            }

            <p>Total ore voluntare: {totalHours}</p>
            <p>Proiecte active: {activeProjects}</p>
            {/* Adaugă aici altele componente și elemente vizuale */}
        </div>
    );
};

export default Dashboard;
