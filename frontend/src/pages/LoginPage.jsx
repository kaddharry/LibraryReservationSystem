import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, ArrowLeft, Loader2, Library } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
    const [rollNumber, setRollNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            // FIX: Replace history so they can't click back to login
            navigate('/home', { replace: true });
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await login(rollNumber, password);
            if (!res.success) {
                setError(res.message);
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white font-sans">

            {/* Left Side - Visual/Brand Panel */}
            <div className="hidden lg:flex relative bg-brand-900 items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1507842217121-9e87bd229e27?auto=format&fit=crop&q=80&w=1000"
                        alt="Library Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900 to-transparent"></div>

                <div className="relative z-10 p-12 text-white max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Library className="w-16 h-16 mb-8 text-brand-400" />
                        <h1 className="text-4xl font-bold mb-6">Welcome to SmartLib</h1>
                        <p className="text-brand-100 text-lg leading-relaxed">
                            "The only thing that you absolutely have to know, is the location of the library."
                        </p>
                        <p className="mt-4 text-brand-300 font-serif italic">— Albert Einstein</p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex items-center justify-center p-8 bg-slate-50 lg:bg-white">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md space-y-8"
                >
                    {/* Header */}
                    <div className="text-center">
                        <div className="flex justify-center mb-4 lg:hidden">
                            <div className="p-3 bg-brand-50 rounded-xl">
                                <Library className="w-8 h-8 text-brand-600" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">Student Login</h2>
                        <p className="mt-2 text-slate-600">Enter your credentials to access your account.</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2"
                        >
                            <span className="font-bold">Error:</span> {error}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            {/* Roll Number Input */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Roll Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={rollNumber}
                                        onChange={(e) => setRollNumber(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                                        placeholder="e.g. 21CSE101"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-slate-50 lg:bg-white text-slate-500">Don't have an account?</span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <Link
                                to="/register"
                                className="font-semibold text-brand-600 hover:text-brand-500 transition-colors"
                            >
                                Register as a new student
                            </Link>
                        </div>

                        <div className="mt-8 text-center">
                            <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 transition-colors">
                                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;