import React, {useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

const PostChecker = (WrappedComponent, allowedRoles) => {
    // create a checker if the logged in user has the required role
    const PostChecker = (props) => {
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
        
        console.log(user);
        if (allowedRoles.includes(user['role'])) {
            return <WrappedComponent {...props} />;
        } else {
            navigate('/');
            return null;
        }
    };
    return PostChecker;
};

export default PostChecker;