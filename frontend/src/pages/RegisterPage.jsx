import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, ArrowLeft, Loader2, Library, BookOpen, CreditCard } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [branch, setBranch] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/home');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        // Simulate network delay for UX
        // await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const res = await register(name, rollNumber, branch, password);
            if (!res.success) {
                setError(res.message);
            }
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white">

            {/* Left Side - Visual/Brand Panel */}
            <div className="hidden lg:flex relative bg-brand-900 items-center justify-center overflow-hidden order-1 lg:order-2">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1000"
                        alt="Library Archives"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-brand-900/90 to-brand-800/50"></div>

                <div className="relative z-10 p-12 text-white max-w-lg text-right">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Library className="w-16 h-16 mb-8 text-brand-400 ml-auto" />
                        <h1 className="text-4xl font-bold mb-6">Join the Community</h1>
                        <p className="text-brand-100 text-lg leading-relaxed">
                            "I have always imagined that Paradise will be a kind of library."
                        </p>
                        <p className="mt-4 text-brand-300 font-serif italic">— Jorge Luis Borges</p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="flex items-center justify-center p-8 bg-slate-50 lg:bg-white order-2 lg:order-1">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md space-y-6"
                >
                    {/* Header */}
                    <div className="text-center lg:text-left">
                        <Link to="/" className="inline-block lg:hidden mb-4 p-3 bg-brand-50 rounded-xl">
                            <Library className="w-8 h-8 text-brand-600" />
                        </Link>
                        <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
                        <p className="mt-2 text-slate-600">Start your academic journey with SmartLib.</p>
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
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500 transition-all sm:text-sm"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        {/* Roll Number & Branch Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Roll Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <CreditCard className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={rollNumber}
                                        onChange={(e) => setRollNumber(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500 transition-all sm:text-sm"
                                        placeholder="21CSE..."
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Branch</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <BookOpen className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={branch}
                                        onChange={(e) => setBranch(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500 transition-all sm:text-sm"
                                        placeholder="CSE"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password */}
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
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500 transition-all sm:text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500 transition-all sm:text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-200 mt-6 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">
                                Sign in here
                            </Link>
                        </p>

                        <div className="mt-6">
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

export default RegisterPage;