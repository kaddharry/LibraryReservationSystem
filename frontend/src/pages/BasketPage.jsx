import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trash2, AlertCircle, ChevronRight, ShoppingBag, Info, Loader2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BasketPage = () => {
    const { cart, removeFromCart, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [statusMsg, setStatusMsg] = useState({ show: false, message: '', type: '' });

    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + 30);

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setIsCheckingOut(true);
        let errorCount = 0;
        let lastError = "";

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            for (const book of cart) {
                try {
                    // FIX: Removed localhost
                    await axios.post('/api/reservations', { bookId: book._id }, config);
                } catch (err) {
                    console.error(`Failed to reserve ${book.name || book.title}`, err);
                    errorCount++;
                    lastError = err.response?.data?.message || err.message;
                }
            }

            if (errorCount === 0) {
                clearCart();
                setStatusMsg({ show: true, message: 'Books successfully reserved!', type: 'success' });
                setTimeout(() => navigate('/reserved'), 1500);
            } else if (errorCount === cart.length) {
                setStatusMsg({ show: true, message: `Checkout Failed: ${lastError}`, type: 'error' });
            } else {
                setStatusMsg({ show: true, message: `Reserved partial basket. ${errorCount} items failed.`, type: 'warning' });
                clearCart();
                setTimeout(() => navigate('/reserved'), 2000);
            }

        } catch (error) {
            console.error(error);
            setStatusMsg({ show: true, message: 'Network error occurred.', type: 'error' });
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans relative">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <ShoppingBag className="w-8 h-8 text-brand-600" />
                    My Book Basket
                </h1>

                <AnimatePresence>
                    {statusMsg.show && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`mb-6 p-4 rounded-xl flex items-center gap-3 font-medium ${statusMsg.type === 'error' ? 'bg-red-100 text-red-700' :
                                    statusMsg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                }`}
                        >
                            <AlertCircle className="w-5 h-5" />
                            {statusMsg.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                {cart.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                        <p className="text-slate-500 mb-6">Your basket is empty.</p>
                        <button onClick={() => navigate('/home')} className="px-6 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700">Browse Books</button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-4">
                            {cart.map(book => (
                                <motion.div
                                    layout
                                    key={book._id}
                                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4"
                                >
                                    <div className="w-16 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={book.imageUrl} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-slate-900">{book.name || book.title}</h3>
                                        <p className="text-sm text-slate-500">{book.author}</p>
                                        <p className="text-xs text-brand-600 font-mono mt-1">Shelf: {book.shelfNumber}</p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(book._id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>

                        <div className="md:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Checkout Summary</h3>
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Books</span>
                                        <span>{cart.length}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-900 font-bold text-lg pt-3 border-t">
                                        <span>Total Bill</span>
                                        <span>₹0.00</span>
                                    </div>
                                </div>
                                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
                                    <div className="flex gap-2 text-amber-800 font-bold text-xs uppercase mb-2">
                                        <Info className="w-4 h-4" /> Policy
                                    </div>
                                    <p className="text-xs text-amber-700 leading-relaxed mb-3">
                                        Late returns incur a penalty of <span className="font-bold">₹30 per day</span>.
                                    </p>
                                    <div className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-white/50 p-2 rounded-lg">
                                        <Calendar className="w-3 h-3" />
                                        Return by: {deadlineDate.toLocaleDateString()}
                                    </div>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut}
                                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-brand-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isCheckingOut ? <Loader2 className="animate-spin w-4 h-4" /> : 'Confirm Reservation'}
                                    {!isCheckingOut && <ChevronRight className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BasketPage;