import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Search, Clock, ArrowRight, Library } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const LandingPage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // If user is already logged in, redirect to Home Dashboard immediately
    useEffect(() => {
        if (user) {
            navigate('/home');
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Navbar Overlay */}
            <nav className="absolute top-0 w-full p-6 z-10">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2 font-bold text-xl text-brand-900">
                        <Library className="w-8 h-8 text-brand-600" />
                        <span>SmartLib</span>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/login" className="px-5 py-2 text-slate-600 hover:text-brand-600 font-medium transition-colors">
                            Login
                        </Link>
                        <Link to="/register" className="hidden sm:block px-5 py-2 bg-brand-600 text-white rounded-full font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-block px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 font-medium text-sm mb-6 border border-brand-100">
                            🚀 Smart Library System v2.0
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-slate-900 mb-6">
                            The future of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">
                                Academic Reading
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-lg">
                            Experience a distraction-free environment to manage your reading list.
                            Search intelligently, reserve instantly, and track your academic journey.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link to="/register" className="flex items-center gap-2 px-8 py-4 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-all shadow-xl shadow-brand-200 hover:shadow-2xl hover:-translate-y-1">
                                Start Reading <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link to="/login" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-all">
                                Student Login
                            </Link>
                        </div>
                    </motion.div>

                    {/* Hero Image / Illustration */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-all duration-500">
                            <img
                                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1000"
                                alt="Library Interior"
                                className="w-full h-auto object-cover"
                            />

                            {/* Floating UI Card 1 */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50 max-w-xs"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold">Status</p>
                                        <p className="font-semibold text-slate-800">Book Reserved</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Decor Elements */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-amber-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                    </motion.div>
                </div>
            </div>

            {/* Feature Grid */}
            <div className="bg-white py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why use SmartLib?</h2>
                        <p className="text-slate-600">Streamlining the library experience for the modern campus.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Search, title: "AI Search", desc: "Find books even if you don't know the exact title." },
                            { icon: BookOpen, title: "Live Availability", desc: "Real-time shelf tracking. Never check an empty shelf again." },
                            { icon: Clock, title: "Auto-Reminders", desc: "Get notified before fines kick in. We've got your back." }
                        ].map((feature, idx) => (
                            <motion.div
                                whileHover={{ y: -5 }}
                                key={idx}
                                className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all"
                            >
                                <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center mb-6">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;