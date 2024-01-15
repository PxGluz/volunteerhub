// Dashboard.js - Componenta principală a dashboard-ului

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [totalVolunteers, setTotalVolunteers] = useState(0);
    const [totalHours, setTotalHours] = useState(0);
    const [activeProjects, setActiveProjects] = useState(0);

    useEffect(() => {
        // Funcție pentru a obține datele de la server
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/dashboard'); // Modifică URL-ul în consecință
                const data = response.data;

                // Actualizează starea cu datele primite de la server
                setTotalVolunteers(data.totalVolunteers);
                setTotalHours(data.totalHours);
                setActiveProjects(data.activeProjects);
            } catch (error) {
                console.error('Eroare la obținerea datelor de la server:', error);
            }
        };

        // Apelează funcția pentru obținerea datelor la încărcarea componentei
        fetchData();
    }, []); // [] asigură că useEffect este apelat doar la încărcarea componentei

    return (
        <div>
            <h2>Tablou de bord</h2>
            <p>Total voluntari: {totalVolunteers}</p>
            <p>Total ore voluntare: {totalHours}</p>
            <p>Proiecte active: {activeProjects}</p>
            {/* Adaugă aici altele componente și elemente vizuale */}
        </div>
    );
};

export default Dashboard;
