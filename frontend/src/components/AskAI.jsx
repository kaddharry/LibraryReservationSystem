import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, X, BookOpen, Plus, AlertTriangle } from 'lucide-react';
import axios from '../api/axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const AskAI = ({ onToast }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);       // { books: [], message: '', tokens: [] }
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    const handleAsk = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        setResults(null);

        try {
            const { data } = await axios.post('/api/books/ask-ai', { query });
            setResults(data);
        } catch (error) {
            setResults({
                books: [],
                message: error.response?.data?.message || 'Something went wrong. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (book) => {
        if (!user) {
            onToast?.('Please login to reserve books.', 'error');
            return;
        }
        const result = addToCart(book);
        onToast?.(result.message, result.success ? 'success' : 'error');
    };

    // Quick suggestion chips
    const suggestions = [
        'Suggest coding books',
        'I need DBMS books',
        'Books on algorithms',
        'AI and machine learning',
        'Software engineering',
    ];

    return (
        <div className="mb-8">
            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl border transition-all duration-300 ${
                    isOpen
                        ? 'bg-gradient-to-r from-violet-50 to-indigo-50 border-violet-200 shadow-lg shadow-violet-100'
                        : 'bg-white border-slate-200 hover:border-violet-300 hover:shadow-md'
                }`}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${isOpen ? 'bg-violet-600' : 'bg-gradient-to-br from-violet-500 to-indigo-600'} shadow-lg`}>
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-slate-900 text-base">Ask AI for Book Recommendations</p>
                        <p className="text-xs text-slate-500 mt-0.5">Describe what you're looking for in plain English</p>
                    </div>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <Plus className={`w-5 h-5 ${isOpen ? 'text-violet-600' : 'text-slate-400'}`} />
                </motion.div>
            </motion.button>

            {/* Expandable Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            {/* Search Form */}
                            <form onSubmit={handleAsk} className="flex gap-3">
                                <div className="relative flex-grow">
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder='Try "I want a book for coding" or "suggest DBMS books"...'
                                        className="w-full px-5 py-3.5 pr-10 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
                                    />
                                    {query && (
                                        <button
                                            type="button"
                                            onClick={() => { setQuery(''); setResults(null); }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <motion.button
                                    type="submit"
                                    disabled={loading || !query.trim()}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="px-6 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-violet-200 transition-all"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                    <span className="hidden sm:inline">Ask AI</span>
                                </motion.button>
                            </form>

                            {/* Suggestion Chips */}
                            {!results && !loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-wrap gap-2 mt-4"
                                >
                                    {suggestions.map((s, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { setQuery(s); }}
                                            className="px-4 py-2 text-xs font-medium bg-slate-100 text-slate-600 rounded-full hover:bg-violet-50 hover:text-violet-700 border border-transparent hover:border-violet-200 transition-all"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </motion.div>
                            )}

                            {/* Loading State */}
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-12"
                                >
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center">
                                            <Sparkles className="w-7 h-7 text-violet-600 animate-pulse" />
                                        </div>
                                        <div className="absolute inset-0 rounded-full border-2 border-violet-300 border-t-violet-600 animate-spin" />
                                    </div>
                                    <p className="mt-4 text-sm text-slate-500 font-medium">Analyzing your query...</p>
                                </motion.div>
                            )}

                            {/* Results */}
                            {results && !loading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6"
                                >
                                    {/* Tokens used (debug-friendly, great for viva) */}
                                    {results.tokens && results.tokens.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            <span className="text-xs text-slate-400 font-medium mr-1 self-center">Keywords matched:</span>
                                            {results.tokens.slice(0, 8).map((t, i) => (
                                                <span key={i} className="px-2.5 py-1 text-xs bg-violet-50 text-violet-700 rounded-full font-medium border border-violet-100">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {results.books.length > 0 ? (
                                        <>
                                            <p className="text-sm font-medium text-green-700 bg-green-50 px-4 py-2.5 rounded-xl mb-5 border border-green-100">
                                                {results.message}
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                                {results.books.map((book) => (
                                                    <motion.div
                                                        key={book._id}
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        whileHover={{ y: -4 }}
                                                        className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
                                                    >
                                                        {/* Book Image */}
                                                        <div className="relative h-36 overflow-hidden bg-slate-100">
                                                            <img
                                                                src={book.imageUrl}
                                                                alt={book.name}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                            <div className="absolute top-2 left-2">
                                                                <span className="px-2 py-0.5 text-[10px] font-bold bg-green-100 text-green-700 rounded-full">
                                                                    Available
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Book Info */}
                                                        <div className="p-3.5 flex flex-col flex-grow">
                                                            <p className="text-[10px] font-bold text-violet-600 uppercase tracking-wider mb-0.5">{book.category}</p>
                                                            <h4 className="text-sm font-bold text-slate-900 leading-tight line-clamp-2 mb-0.5">{book.name}</h4>
                                                            <p className="text-xs text-slate-500 mb-3">by {book.author}</p>
                                                            
                                                            <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-100">
                                                                <span className="text-[10px] text-slate-400 font-mono">Shelf {book.shelfNumber}</span>
                                                                <button
                                                                    onClick={() => handleAddToCart(book)}
                                                                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-violet-600 transition-colors"
                                                                >
                                                                    <Plus className="w-3.5 h-3.5" />
                                                                    Add
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                                            <p className="text-sm font-semibold text-slate-700">{results.message}</p>
                                            <p className="text-xs text-slate-400 mt-1">Try keywords like "algorithms", "AI", "clean code", "DBMS"</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AskAI;
