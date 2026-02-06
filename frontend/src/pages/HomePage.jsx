import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Loader2, BookOpen, Clock, AlertCircle, X, Sparkles, Plus, CheckCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import BookCard from '../components/BookCard';
import { books as mockBooks } from '../data/mockData';

const HomePage = () => {
    const { user } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');

    // Real-time Dashboard Stats
    const [dashboardStats, setDashboardStats] = useState({
        activeLoans: 0,
        dueSoon: 0,
        fines: 0
    });

    // Toast State
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    // Fetch Books
    const fetchBooks = async (search = '') => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            const { data } = await axios.get(`http://localhost:5000/api/books?keyword=${search}`, config);
            if (!data || (data.length === 0 && search === '')) {
                setBooks(mockBooks);
            } else {
                setBooks(data);
            }
        } catch (error) {
            setBooks(mockBooks);
        } finally {
            setLoading(false);
        }
    };

    // Fetch Dashboard Stats (Active Loans, Fines, Due Soon)
    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/reservations', config);

                let totalFines = 0;
                let dueSoonCount = 0;
                const today = new Date();
                const threeDaysFromNow = new Date();
                threeDaysFromNow.setDate(today.getDate() + 3);

                data.forEach(res => {
                    const deadline = new Date(res.deadlineDate);

                    // Calculate Fines (30rs per day late)
                    if (today > deadline) {
                        const diffTime = Math.abs(today - deadline);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        totalFines += diffDays * 30;
                    }

                    // Calculate Due Soon (Active loans due within 3 days, not yet late)
                    if (deadline > today && deadline <= threeDaysFromNow) {
                        dueSoonCount++;
                    }
                });

                setDashboardStats({
                    activeLoans: data.length, // Logic: Returned books are deleted, so this is accurate
                    dueSoon: dueSoonCount,
                    fines: totalFines
                });

            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, [user]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => { fetchBooks(searchTerm); }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleAddToCart = (book) => {
        if (!user) {
            showToast("Please login to reserve books.", "error");
            return;
        }
        const result = addToCart(book);
        showToast(result.message, result.success ? 'success' : 'error');
    };

    const filteredBooks = books.filter(book => {
        const bookName = (book.name || book.title || '').toLowerCase();
        const bookAuthor = (book.author || '').toLowerCase();
        const search = searchTerm.toLowerCase();

        // Frontend filtering in case backend search is insufficient or fallback data is used
        const matchesSearch = bookName.includes(search) || bookAuthor.includes(search) || book.shelfNumber?.toLowerCase().includes(search);
        const matchesCategory = filter === 'All' || book.category === filter;

        return matchesSearch && matchesCategory;
    });

    const categories = ['All', 'Computer Science', 'Algorithms', 'Software Engineering', 'AI & Data Science'];

    // Stats Configuration
    const stats = [
        { label: 'Active Loans', value: dashboardStats.activeLoans, icon: BookOpen, color: 'text-brand-600', bg: 'bg-brand-50' },
        { label: 'Due Soon', value: dashboardStats.dueSoon, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Fines', value: `₹${dashboardStats.fines}`, icon: AlertCircle, color: dashboardStats.fines > 0 ? 'text-red-600' : 'text-green-600', bg: dashboardStats.fines > 0 ? 'bg-red-50' : 'bg-green-50' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans relative">
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-white font-medium ${toast.type === 'error' ? 'bg-red-600' : 'bg-slate-900'}`}
                    >
                        {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid md:grid-cols-3 gap-8 items-center mb-8">
                        <div className="md:col-span-2">
                            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                                Hello, {user?.name?.split(' ')[0] || 'Scholar'}
                                <span className="inline-block animate-wave origin-bottom-right">👋</span>
                            </h1>
                            <p className="text-slate-500 mt-2 text-lg">Ready to expand your knowledge today?</p>
                        </div>

                        {/* Live Stats Section with Animation */}
                        <div className="hidden md:flex gap-4 justify-end">
                            {stats.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * idx, type: "spring", stiffness: 200 }}
                                    className={`px-4 py-3 rounded-xl border border-slate-100 flex items-center gap-3 ${stat.bg} shadow-sm`}
                                >
                                    <div className={`p-2 rounded-lg bg-white shadow-sm ${stat.color}`}>
                                        <stat.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                        <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Search className="h-5 w-5 text-slate-400" /></div>
                            <input type="text" className="block w-full pl-11 pr-10 py-3 border border-slate-200 rounded-2xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500 transition-all shadow-sm" placeholder="Search by title, author..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>}
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                            <SlidersHorizontal className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
                            {categories.map(cat => (
                                <button key={cat} onClick={() => setFilter(cat)} className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${filter === cat ? 'bg-brand-600 text-white shadow-lg shadow-brand-200' : 'bg-white border border-slate-200 text-slate-600'}`}>{cat}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32"><Loader2 className="w-12 h-12 text-brand-600 animate-spin mb-4" /><p className="text-slate-500">Fetching library collection...</p></div>
                ) : filteredBooks.length > 0 ? (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredBooks.map((book) => (
                            <motion.div key={book._id} variants={itemVariants}>
                                {/* Using BookCard but overriding click behavior */}
                                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
                                    <div className="relative h-48 overflow-hidden bg-slate-100">
                                        <img src={book.imageUrl} alt={book.name || book.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-3 right-3"><span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${book.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{book.status}</span></div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-grow">
                                        <div className="mb-4">
                                            <p className="text-xs font-bold text-brand-600 uppercase mb-1">{book.category}</p>
                                            <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1 line-clamp-2">{book.name || book.title}</h3>
                                            <p className="text-sm text-slate-500 line-clamp-1">by {book.author}</p>
                                        </div>
                                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <div className="text-xs text-slate-500">Shelf: <span className="font-mono font-bold text-slate-700">{book.shelfNumber}</span></div>
                                            {book.status === 'Available' ? (
                                                <button onClick={() => handleAddToCart(book)} className="flex items-center gap-1 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors"><Plus className="w-4 h-4" /> Add</button>
                                            ) : <button disabled className="px-4 py-2 bg-slate-100 text-slate-400 text-sm font-medium rounded-lg">Unavailable</button>}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 border-dashed"><Sparkles className="w-10 h-10 text-slate-400 mx-auto mb-6" /><h3 className="text-xl font-bold text-slate-900">No books found</h3><p className="text-slate-500 mt-2">Try broader keywords.</p><button onClick={() => { setSearchTerm(''); setFilter('All'); }} className="mt-8 px-6 py-3 bg-white border border-slate-300 text-slate-700 font-medium rounded-xl">Clear filters</button></div>
                )}
            </div>
        </div>
    );
};
export default HomePage;