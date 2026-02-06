import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, AlertCircle, CheckCircle, BookOpen, ChevronRight, Loader2, RefreshCw, X, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const ReservedBooksPage = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Return Flow State
    const [isReturnMode, setIsReturnMode] = useState(false);
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '']);

    const fetchReservations = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/reservations', config);
            // Only show books that are NOT returned for the main view
            setReservations(data.filter(r => r.status !== 'Returned'));
        } catch (error) {
            console.error("Failed to fetch reservations", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchReservations();
    }, [user]);

    const calculateFine = (deadline) => {
        const today = new Date();
        const dueDate = new Date(deadline);
        if (today > dueDate) {
            const diffTime = Math.abs(today - dueDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays * 30;
        }
        return 0;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const toggleBookSelection = (id) => {
        if (selectedBooks.includes(id)) {
            setSelectedBooks(selectedBooks.filter(bookId => bookId !== id));
        } else {
            setSelectedBooks([...selectedBooks, id]);
        }
    };

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    const handleVerifyReturn = async () => {
        const enteredOtp = otp.join('');
        if (enteredOtp !== '0000') {
            alert('Invalid OTP. Please ask the librarian.');
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/reservations/return', { ids: selectedBooks }, config);
            navigate('/thank-you');
        } catch (error) {
            alert('Return failed: ' + (error.response?.data?.message || error.message));
        }
    };

    // Animation variants
    const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const item = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans relative">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">My Reservations</h1>
                        <p className="text-slate-500 mt-1">Manage active loans & returns.</p>
                    </div>
                    {reservations.length > 0 && (
                        <button
                            onClick={() => { setIsReturnMode(!isReturnMode); setSelectedBooks([]); }}
                            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${isReturnMode ? 'bg-slate-200 text-slate-700' : 'bg-brand-600 text-white shadow-lg shadow-brand-200'}`}
                        >
                            {isReturnMode ? <X className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                            {isReturnMode ? 'Cancel Return' : 'Return Books'}
                        </button>
                    )}
                </div>

                {isReturnMode && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mb-6 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><CheckCircle className="w-5 h-5" /></div>
                            <p className="text-blue-800 font-medium">Select books to return ({selectedBooks.length})</p>
                        </div>
                        {selectedBooks.length > 0 && (
                            <button onClick={() => setShowOtpModal(true)} className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
                                Proceed to Return
                            </button>
                        )}
                    </motion.div>
                )}

                {loading ? (
                    <div className="py-20 text-center"><Loader2 className="w-10 h-10 text-brand-600 animate-spin mx-auto" /></div>
                ) : reservations.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center"
                    >
                        <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BookOpen className="w-10 h-10 text-brand-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No books reserved yet</h3>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                            Your reading list is empty. Explore our collection to find your next great read.
                        </p>
                        <Link
                            to="/home"
                            className="inline-flex items-center px-6 py-3 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200"
                        >
                            Browse Library <ChevronRight className="w-4 h-4 ml-2" />
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
                        {reservations.map((res) => {
                            const fine = calculateFine(res.deadlineDate);
                            const isLate = fine > 0;
                            const daysLeft = Math.ceil((new Date(res.deadlineDate) - new Date()) / (1000 * 60 * 60 * 24));

                            return (
                                <motion.div key={res._id} variants={item} className={`bg-white rounded-xl p-4 sm:p-6 shadow-sm border transition-all hover:shadow-md ${isLate ? 'border-red-200 bg-red-50/30' : 'border-slate-200'} relative`}>
                                    {isReturnMode && (
                                        <div className="absolute top-4 left-4 z-10">
                                            <input
                                                type="checkbox"
                                                checked={selectedBooks.includes(res._id)}
                                                onChange={() => toggleBookSelection(res._id)}
                                                className="w-6 h-6 text-brand-600 rounded focus:ring-brand-500 border-gray-300 cursor-pointer"
                                            />
                                        </div>
                                    )}
                                    <div className={`flex flex-col sm:flex-row gap-6 ${isReturnMode ? 'pl-8 sm:pl-10 opacity-90' : ''}`}>
                                        <div className="w-full sm:w-24 h-32 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden shadow-inner">
                                            {res.bookId?.imageUrl ? (
                                                <img src={res.bookId.imageUrl} alt={res.bookId.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-3xl">📖</div>
                                            )}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">{res.bookId?.name || "Unknown Title"}</h3>
                                                    <p className="text-slate-500 text-sm flex items-center gap-2">
                                                        <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono text-slate-600">Shelf {res.bookId?.shelfNumber || 'N/A'}</span>
                                                    </p>
                                                </div>
                                                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${isLate ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
                                                    {isLate ? <AlertCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                                                    {isLate ? 'Overdue' : res.status}
                                                </div>
                                            </div>
                                            <div className="mt-6 grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-slate-400 font-medium uppercase mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Reserved On</p>
                                                    <p className="text-slate-700 font-medium">{formatDate(res.reservationDate)}</p>
                                                </div>
                                                <div>
                                                    <p className={`text-xs font-medium uppercase mb-1 flex items-center gap-1 ${isLate ? 'text-red-500' : 'text-slate-400'}`}><Clock className="w-3 h-3" /> Deadline</p>
                                                    <p className={`font-medium ${isLate ? 'text-red-600 font-bold' : 'text-slate-700'}`}>
                                                        {formatDate(res.deadlineDate)}
                                                        {!isLate && <span className="text-xs text-slate-400 font-normal ml-2">({daysLeft} days left)</span>}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {isLate && (
                                            <div className="sm:border-l sm:pl-6 flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-2 min-w-[100px]">
                                                <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Fine Due</span>
                                                <span className="text-2xl font-bold text-red-600">₹{fine}</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>

            {/* OTP Modal */}
            <AnimatePresence>
                {showOtpModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShieldCheck className="w-8 h-8 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Librarian Verification</h2>
                                <p className="text-slate-500 mt-2">Please enter the One-Time Password provided by the librarian to confirm return.</p>
                            </div>

                            <div className="flex justify-center gap-3 mb-8">
                                {otp.map((data, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        className="w-12 h-14 border-2 border-slate-200 rounded-xl text-center text-2xl font-bold focus:border-blue-500 focus:outline-none transition-colors"
                                        value={data}
                                        onChange={e => handleOtpChange(e.target, index)}
                                        onFocus={e => e.target.select()}
                                    />
                                ))}
                            </div>

                            <p className="text-center text-xs text-slate-400 mb-6 font-mono">Default OTP: 0000</p>

                            <div className="flex gap-4">
                                <button onClick={() => setShowOtpModal(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl">Cancel</button>
                                <button onClick={handleVerifyReturn} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200">Verify & Return</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ReservedBooksPage;