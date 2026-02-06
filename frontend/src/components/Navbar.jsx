import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Library, LogOut, Menu, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/'); // FIX: Redirect to Landing Page on logout
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/home" className="flex items-center gap-2">
                            <div className="bg-brand-50 p-2 rounded-lg">
                                <Library className="w-6 h-6 text-brand-600" />
                            </div>
                            <span className="font-bold text-xl text-slate-800 hidden sm:block">SmartLib</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        {user ? (
                            <>
                                <Link
                                    to="/home"
                                    className={`text-sm font-medium transition-colors ${isActive('/home') ? 'text-brand-600' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    Browse Books
                                </Link>
                                <Link
                                    to="/reserved"
                                    className={`text-sm font-medium transition-colors ${isActive('/reserved') ? 'text-brand-600' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    My Reservations
                                </Link>

                                {/* Basket Icon */}
                                <Link
                                    to="/basket"
                                    className={`relative p-2 rounded-full transition-colors ${isActive('/basket') ? 'bg-brand-50 text-brand-600' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                    {cart.length > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-brand-600 rounded-full">
                                            {cart.length}
                                        </span>
                                    )}
                                </Link>

                                <div className="h-6 w-px bg-slate-200 mx-2"></div>

                                <Link to="/profile" className="flex items-center gap-2 text-slate-700 hover:text-brand-600 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs">
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <span className="text-sm font-medium">{user.name}</span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-4">
                                <Link to="/login" className="text-slate-600 hover:text-brand-600 font-medium px-4 py-2">Login</Link>
                                <Link to="/register" className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-sm">Register</Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center md:hidden">
                        <Link to="/basket" className="p-2 mr-2 text-slate-600 relative">
                            <ShoppingBag className="w-6 h-6" />
                            {cart.length > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-brand-600 rounded-full">
                                    {cart.length}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-slate-500 hover:text-slate-800 p-2"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-slate-100 bg-white"
                    >
                        <div className="p-4 space-y-4">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                        <div className="w-10 h-10 rounded-full bg-brand-200 flex items-center justify-center text-brand-800 font-bold">
                                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{user.name}</p>
                                        </div>
                                    </div>
                                    <Link to="/home" className="block text-slate-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>Browse Books</Link>
                                    <Link to="/basket" className="block text-slate-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>My Basket ({cart.length})</Link>
                                    <Link to="/reserved" className="block text-slate-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>My Reservations</Link>
                                    <Link to="/profile" className="block text-slate-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                                    <button onClick={handleLogout} className="w-full text-left text-red-600 py-2 font-medium">Logout</button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link to="/login" className="w-full text-center py-2 border border-slate-200 rounded-lg text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                                    <Link to="/register" className="w-full text-center py-2 bg-brand-600 text-white rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;