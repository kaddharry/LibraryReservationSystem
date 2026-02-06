import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    // Optional: Show nothing or a spinner while AuthContext loads initial state
    if (loading) {
        return null;
    }

    // If not logged in, force redirect to Landing Page ('/')
    // 'replace' prevents this redirect from entering the history stack,
    // so clicking back again won't create a loop.
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // If logged in, render the page (Navbar + Component)
    return children;
};

export default ProtectedRoute;