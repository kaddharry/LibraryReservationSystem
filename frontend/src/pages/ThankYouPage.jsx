import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const ThankYouPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white max-w-lg w-full rounded-3xl p-12 text-center shadow-xl border border-slate-100"
            >
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                </div>

                <h1 className="text-4xl font-bold text-slate-900 mb-4">Success!</h1>
                <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                    Your books have been successfully returned. The library system has been updated, and any outstanding fines for these items have been cleared.
                </p>

                <div className="space-y-4">
                    <Link
                        to="/home"
                        className="block w-full py-4 bg-brand-600 text-white text-lg font-bold rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-200"
                    >
                        Browse More Books
                    </Link>
                    <Link
                        to="/profile"
                        className="block w-full py-4 bg-white border border-slate-200 text-slate-700 text-lg font-bold rounded-xl hover:bg-slate-50 transition-all"
                    >
                        Go to Profile
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ThankYouPage;