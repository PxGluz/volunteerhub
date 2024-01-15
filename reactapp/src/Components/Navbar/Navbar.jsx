// Adaugă aceste stiluri în fișierul NavBar.jsx sau într-un fișier CSS separat
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'

const Navbar = ({ loggedInUser, onLogout }) => {
    return (
        <nav>
            <ul>
                <li><Link to="/dashboard">Acasă</Link></li>
                <li><Link to="/events">Pagina de Evenimente</Link></li>
                {loggedInUser ? (
                    <li><button onClick={onLogout}>Logout</button></li>
                ) : (
                    <li><Link to="/login">Login</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;