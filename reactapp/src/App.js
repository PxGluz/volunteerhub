import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/DashboardPage/Dashboard';
import Navbar from './Components/Navbar/Navbar';
import LoginPage from './Pages/LoginPage/LoginPage';
import { Navigate } from 'react-router-dom';
import SignUpPage from './Pages/SignUpPage/SignUpPage';
import Profile from "./Pages/Profile/Profile";

function App() {
    return (
        <Router>
            {/* Componenta Routes pentru a trata rutele */}
            <Routes>
                <Route
                    path="/login"
                    element={
                        <>
                            <LoginPage/>
                            {/* Navbar nu este afișat pe pagina de login */}
                        </>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <>
                            <SignUpPage/>
                            {/* Navbar nu este afișat pe pagina de signup */}
                        </>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <>
                            <Navbar/>
                            <Dashboard />
                        </>
                    }
                />
                <Route
                    path="/profile/:id"
                    element={
                        <>
                            <Navbar/>
                            <Profile />
                        </>
                    }
                />
                
            </Routes>
        </Router>
    );
}

export default App;
