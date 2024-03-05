import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const OwnershipChecker = (WrappedComponent) => {
    const OwnershipCheckerComponent = (props) => {
        const authToken = localStorage.getItem('token');
        const navigate = useNavigate();
        const [user, setUser] = useState(null);
        const [creator, setCreator] = useState(null);
        const [loading, setLoading] = useState(true); // Added loading state
        const { id: eventId } = useParams();

        useEffect(() => {
            const fetchUserInfo = async () => {
                try {
                    const userResponse = await fetch('http://localhost:5100/api/user/GetUserByToken', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: authToken,
                        },
                    });

                    const creatorResponse = await fetch(`http://localhost:5100/api/event/GetEvent/${eventId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: authToken,
                        },
                    });

                    const userData = await userResponse.json();
                    const creatorData = await creatorResponse.json();

                    setUser(userData);
                    setCreator(creatorData);
                    setLoading(false); // Set loading to false once fetches are complete
                } catch (error) {
                    console.error('Error fetching user or creator data:', error);
                }
            };

            if (authToken) {
                fetchUserInfo();
            }
        }, [authToken, eventId]);

        // Check ownership when both user and creator data are available and loading is false
        if (!loading && user?.userID === creator?.creatorId) {
            return <WrappedComponent {...props} />;
        } else if (!loading) {
            // If loading is false and ownership check fails, navigate to '/'
            navigate('/');
        }

        return null;
    };

    return OwnershipCheckerComponent;
};

export default OwnershipChecker;
