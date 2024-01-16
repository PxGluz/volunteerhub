// Adaugă aceste stiluri în fișierul NavBar.jsx sau într-un fișier CSS separat
import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'
import { useNavigate } from 'react-router-dom';

const Navbar = ({}) => {
    const authToken = localStorage.getItem('token');
    const navigate = useNavigate();
    // create user data variable
    const [user, setUser] = useState('');
    
    useEffect(() => {

        // get id by sending token to localhost:5100/api/user/GetUserByToken
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
        if (authToken)
            GetUserInfo();
    }, [authToken]);
    
    
    return (
        <nav>
            <ul>
                <li><Link to="/dashboard">VolunteerHub</Link></li>
                {authToken ? (
                    <li>
                        <Link to={`/profile/${user['userId']}`}>{user['username']}'s Profile</Link>
                        <button onClick={() => {localStorage.removeItem('token');navigate('/dashboard');}}>Logout</button>
                    </li>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/signup">Sign Up</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;