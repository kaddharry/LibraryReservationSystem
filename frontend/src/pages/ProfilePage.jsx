import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, CreditCard, BookOpen, ShieldCheck, Mail, AlertTriangle, CheckCircle, Wallet, Loader2 } from 'lucide-react';

const ProfilePage = () => {
    const { user } = useContext(AuthContext);
    const [isPaying, setIsPaying] = useState(false);

    const handlePayFine = async () => {
        setIsPaying(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            // Simulate network delay for effect
            await new Promise(resolve => setTimeout(resolve, 1000));

            const { data } = await axios.post('http://localhost:5000/api/reservations/pay-fine', {}, config);
            alert(data.message);
            // In a real app, you would refetch the user context here to update the fine amount displayed
        } catch (error) {
            alert('Error paying fine. Please try again.');
        } finally {
            setIsPaying(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-slate-500 text-lg">Please login to view your profile.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold text-slate-900 mb-8">My Dashboard</h1>

                    <div className="grid md:grid-cols-3 gap-8">

                        {/* Column 1: Student ID Card */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                {/* Card Header Background */}
                                <div className="h-32 bg-gradient-to-r from-brand-600 to-brand-800 relative">
                                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white border border-white/20">
                                        Active Student
                                    </div>
                                </div>

                                <div className="px-8 pb-8">
                                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                                        <div className="w-24 h-24 rounded-2xl border-4 border-white bg-slate-100 flex items-center justify-center text-3xl font-bold text-brand-700 shadow-md">
                                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                                        <p className="text-slate-500 font-medium">{user.email || 'Student Account'}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 mt-8">
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="flex items-center gap-2 mb-1 text-slate-400">
                                                <CreditCard className="w-4 h-4" />
                                                <span className="text-xs font-semibold uppercase tracking-wider">Roll Number</span>
                                            </div>
                                            <p className="font-mono text-lg font-bold text-slate-800">{user.rollNumber}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="flex items-center gap-2 mb-1 text-slate-400">
                                                <BookOpen className="w-4 h-4" />
                                                <span className="text-xs font-semibold uppercase tracking-wider">Branch</span>
                                            </div>
                                            <p className="text-lg font-bold text-slate-800">{user.branch}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Help Section */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-start gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Need Help?</h3>
                                    <p className="text-slate-500 text-sm mt-1 mb-3">
                                        For issues regarding lost books or account access, please contact the library administration.
                                    </p>
                                    <a href="mailto:library@college.edu" className="inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-700">
                                        <Mail className="w-4 h-4 mr-2" /> library@college.edu
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Fines & Status */}
                        <div className="space-y-6">
                            <div className={`rounded-2xl shadow-sm border p-6 ${user.fines > 0 ? 'bg-white border-slate-200' : 'bg-brand-50 border-brand-100'}`}>
                                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Wallet className="w-5 h-5 text-slate-400" />
                                    Account Status
                                </h3>

                                <div className="text-center py-4">
                                    <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Outstanding Fines</p>
                                    <div className={`text-4xl font-bold mt-2 mb-1 ${user.fines > 0 ? 'text-red-600' : 'text-brand-600'}`}>
                                        ₹{user.fines || 0}
                                    </div>
                                    {user.fines === 0 && (
                                        <p className="text-brand-600 text-sm flex items-center justify-center gap-1 mt-2">
                                            <CheckCircle className="w-4 h-4" /> All clear!
                                        </p>
                                    )}
                                </div>

                                {user.fines > 0 ? (
                                    <div className="mt-6 pt-6 border-t border-slate-100">
                                        <div className="flex items-start gap-3 mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                            <p>You have pending dues. Please clear them to continue borrowing books.</p>
                                        </div>
                                        <button
                                            onClick={handlePayFine}
                                            disabled={isPaying}
                                            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                                        >
                                            {isPaying ? <Loader2 className="animate-spin w-4 h-4" /> : 'Pay Fines Now'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mt-6 pt-6 border-t border-brand-200/50">
                                        <p className="text-center text-brand-700 text-sm">
                                            Your account is in good standing. Keep reading!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;