import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Book, AlertCircle, CheckCircle } from 'lucide-react';

const BookCard = ({ book, onReserve }) => {
    // Determine status color and icon
    const getStatusConfig = (status) => {
        switch (status) {
            case 'Available':
                return { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Available' };
            case 'Reserved':
                return { color: 'bg-amber-100 text-amber-700', icon: Clock, label: 'Reserved' };
            case 'Late':
                return { color: 'bg-red-100 text-red-700', icon: AlertCircle, label: 'Overdue' };
            default:
                return { color: 'bg-slate-100 text-slate-600', icon: Book, label: status };
        }
    };

    const config = getStatusConfig(book.status);
    const StatusIcon = config.icon;

    // FIX: Fallback to title if name is missing
    const displayTitle = book.name || book.title || "Unknown Title";

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group"
        >
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                    src={book.imageUrl}
                    alt={displayTitle}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${config.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-4">
                    <p className="text-xs font-bold text-brand-600 uppercase tracking-wide mb-1">{book.category}</p>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">{displayTitle}</h3>
                    <p className="text-sm text-slate-500">by {book.author}</p>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                        Shelf: <span className="font-mono font-bold text-slate-700">{book.shelfNumber}</span>
                    </div>

                    {book.status === 'Available' ? (
                        <button
                            onClick={() => onReserve(book)}
                            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors shadow-lg shadow-slate-200"
                        >
                            Reserve
                        </button>
                    ) : (
                        <button disabled className="px-4 py-2 bg-slate-100 text-slate-400 text-sm font-medium rounded-lg cursor-not-allowed">
                            Unavailable
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default BookCard;