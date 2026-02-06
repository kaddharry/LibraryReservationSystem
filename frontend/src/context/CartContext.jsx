import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // FIX: Initialize state lazily from localStorage so it doesn't reset on refresh
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem('smartLibCart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error("Error reading cart from localStorage", error);
            return [];
        }
    });

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('smartLibCart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (book) => {
        // Rule 1: Limit 2 books
        if (cart.length >= 2) {
            return { success: false, message: "Limit reached: You can only borrow 2 books at a time." };
        }

        // Rule 2: Unique check
        if (cart.find(item => item._id === book._id)) {
            return { success: false, message: "This book is already in your basket." };
        }

        setCart([...cart, book]);
        return { success: true, message: `"${book.name || book.title}" added to basket` };
    };

    const removeFromCart = (bookId) => {
        setCart(cart.filter(item => item._id !== bookId));
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};