/**
 * ShoppingCartContext.js
 * 
 * This file provides a context for managing the shopping cart state in the application.
 * It includes functionality for adding, removing, updating item quantities, and clearing the cart.
 * The cart state is shared throughout the application using React's Context API.
 * 
 * Features:
 * - Allows adding items to the cart with unique identifiers.
 * - Provides functionality to remove items, update item quantities, and clear the cart.
 * - Uses the `nextId` state to generate unique IDs for each cart item.
 * - Provides a custom hook (`useShoppingCart`) for easy access to the cart context.
 * 
 * @module ShoppingCartContext
 */

import React, { createContext, useState, useContext } from 'react';

// Create the context for the shopping cart
const ShoppingCartContext = createContext();

/**
 * Custom hook to access the shopping cart context.
 * 
 * This hook provides access to the shopping cart's state and functions 
 * for adding items, removing items, updating quantities, and clearing the cart.
 * 
 * @returns {Object} - The shopping cart context value containing the cart items 
 * and functions for interacting with the cart.
 * @example
 * const { cartItems, addItemToCart, removeItemFromCart, updateItemQuantity, clearCart } = useShoppingCart();
 */
export const useShoppingCart = () => {
    return useContext(ShoppingCartContext);
};

/**
 * The provider component for the shopping cart context.
 * 
 * This component manages the shopping cart state and provides functions to interact with it.
 * It is wrapped around the application to provide the shopping cart context to child components.
 * 
 * @param {Object} props - The component's props.
 * @param {JSX.Element} props.children - The child components that will be wrapped by the provider.
 * @returns {JSX.Element} - The rendered provider component with the shopping cart context.
 * 
 * @example
 * <ShoppingCartProvider>
 *   <App />
 * </ShoppingCartProvider>
 */
export const ShoppingCartProvider = ({ children }) => {
    // State to manage cart items and generate unique item IDs
    const [cartItems, setCartItems] = useState([]);
    const [nextId, setNextId] = useState(1); 

    /**
     * Adds an item to the cart. If the item already exists, its quantity is increased by 1.
     * If the item doesn't exist, it is added to the cart with a quantity of 1.
     * 
     * @param {Object} item - The item to add to the cart.
     * @param {Object} [details] - Additional details for the item (e.g., entrees, sides).
     * @returns {void}
     */
    const addItemToCart = (item, details = {}) => {
        // Check if the item already exists in the cart
        const existingItemIndex = cartItems.findIndex(
            cartItem => 
                cartItem.name === item.name && 
                JSON.stringify(cartItem.entrees) === JSON.stringify(item.entrees) &&
                JSON.stringify(cartItem.sides) === JSON.stringify(item.sides)
        );

        if (existingItemIndex > -1) {
            // If item exists, increase its quantity
            const updatedCartItems = [...cartItems];
            updatedCartItems[existingItemIndex] = {
                ...updatedCartItems[existingItemIndex],
                quantity: (updatedCartItems[existingItemIndex].quantity || 1) + 1
            };
            setCartItems(updatedCartItems);
        } else {
            // If item doesn't exist, add a new item with quantity 1
            const newItem = { 
                ...item, 
                id: nextId,
                ...details,  // Add details like entrees, sides
                quantity: 1
            };
            setCartItems((prevItems) => [...prevItems, newItem]);
            setNextId(nextId + 1);  // Increment the next available ID
        }
    };

    /**
     * Removes an item from the cart by its ID.
     * 
     * @param {number} itemId - The ID of the item to remove.
     * @returns {void}
     */
    const removeItemFromCart = (itemId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    };

    /**
     * Updates the quantity of an item in the cart.
     * If the new quantity is greater than 0, it updates the item; otherwise, the item is removed.
     * 
     * @param {number} itemId - The ID of the item to update.
     * @param {number} quantityChange - The change in quantity (positive or negative).
     * @returns {void}
     */
    const updateItemQuantity = (itemId, quantityChange) => {
        setCartItems((prevItems) => 
            prevItems.map((item) => {
                if (item.id === itemId) {
                    const newQuantity = (item.quantity || 1) + quantityChange;
                    return newQuantity > 0 
                        ? { ...item, quantity: newQuantity } 
                        : null; // Remove item if quantity becomes 0
                }
                return item;
            }).filter(Boolean) // Remove items with 0 quantity
        );
    };

    /**
     * Clears all items from the cart and resets the item ID counter.
     * 
     * @returns {void}
     */
    const clearCart = () => {
        setCartItems([]);
        setNextId(1);  // Reset the item ID counter
    };

    return (
        <ShoppingCartContext.Provider
            value={{ 
                cartItems, 
                addItemToCart, 
                removeItemFromCart, 
                clearCart,
                updateItemQuantity 
            }}
        >
            {children}
        </ShoppingCartContext.Provider>
    );
};
