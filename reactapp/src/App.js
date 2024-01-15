import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/DashboardPage/Dashboard';
import Navbar from './Components/Navbar/Navbar';
import LoginPage from './Pages/LoginPage/LoginPage';
import { Navigate } from 'react-router-dom';
import SignUpPage from './Pages/SignUpPage/SignUpPage';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = (username) => {
        setIsLoggedIn(username);
    };

    const handleLogout = () => {
        setIsLoggedIn(null);
    };

    return (
        <Router>
            {/* Componenta Routes pentru a trata rutele */}
            <Routes>
                <Route
                    path="/login"
                    element={
                        <>
                            <LoginPage onLogin={handleLogin} />
                            {/* Navbar nu este afișat pe pagina de login */}
                        </>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <>
                            <SignUpPage onSignUp={handleLogin} />
                            {/* Navbar nu este afișat pe pagina de signup */}
                        </>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <>
                            <Navbar loggedInUser={isLoggedIn} onLogout={handleLogout} />
                            <Dashboard />
                        </>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
