import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReservedBooksPage from './pages/ReservedBooksPage';
import ProfilePage from './pages/ProfilePage';
import BasketPage from './pages/BasketPage';
import ThankYouPage from './pages/ThankYouPage';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            {/* Main Application Routes */}
            <Route path="/home" element={
              <>
                <Navbar />
                <HomePage />
              </>
            } />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/reserved" element={
              <>
                <Navbar />
                <ReservedBooksPage />
              </>
            } />

            <Route path="/profile" element={
              <>
                <Navbar />
                <ProfilePage />
              </>
            } />

            <Route path="/basket" element={
              <>
                <Navbar />
                <BasketPage />
              </>
            } />

            <Route path="/thank-you" element={
              <>
                <Navbar />
                <ThankYouPage />
              </>
            } />

          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;