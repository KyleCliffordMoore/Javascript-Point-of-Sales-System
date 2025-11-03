/**
 * ShoppingCartPage.js
 * 
 * This component represents the Shopping Cart page of the application. 
 * It displays the user's selected items, calculates the total price, and 
 * provides options for modifying the cart or proceeding to checkout. 
 * Additionally, it includes a suggestion popup for adding a drink and a side 
 * to complete the user's meal.
 * 
 * Dependencies:
 * - useShoppingCart: Provides access to cart-related state and actions.
 * - useNavigate: For navigation between pages.
 * - useTranslate: For retrieving localized strings.
 */

import React, { useEffect, useState } from 'react';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '../contexts/TranslationContext';
import '../styles/ShoppingCartPage.css';
//import DrinkSideSuggestionPopup from '../services/MealSuggestionPopup';

const API_URL = '/api';

/**
 * ShoppingCartPage component
 * 
 * Displays the shopping cart and handles user interactions like 
 * updating quantities, clearing the cart, and proceeding to checkout. 
 * Includes a popup suggesting a drink and a side when appropriate.
 * 
 * @returns {JSX.Element} The rendered shopping cart page.
 */
const ShoppingCartPage = () => {
    const { 
        cartItems, 
        addItemToCart, 
        removeItemFromCart, 
        clearCart, 
        updateItemQuantity 
    } = useShoppingCart();
    const navigate = useNavigate();
    const { translate } = useTranslate();
    const [translatedStrings, setTranslatedStrings] = useState({
        cartTitle: '',
        emptyCartMessage: '',
        item: '',
        price: '',
        quantity: '',
        details: '',
        actions: '',
        backToOrder: '',
        clearCart: '',
        checkout: '',
        remove: '',
        total: '',
    });
    const [showPopup, setShowPopup] = useState(false);

    /**
     * Calculates the total price of all items in the cart.
     * 
     * @returns {number} The total price of items in the cart.
     */
    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            const itemPrice = isNaN(Number(item.price)) ? 0 : Number(item.price);
            return total + (itemPrice * (item.quantity || 1));
        }, 0);
    };

    /**
     * Handles the checkout process by sending cart data to the server.
     * Clears the cart and navigates to the order completion page upon success.
     */
    const handleCheckout = async () => {
        const checkoutDetails = cartItems.map(item => ({
            name: item.name,
            price: isNaN(Number(item.price)) ? 0 : Number(item.price),
            quantity: item.quantity || 1,
            entrees: item.entrees ? item.entrees.filter(entree => entree !== "N/A") : [],
            side: item.sides && item.sides.length > 0 ? item.sides[0] : 'White Rice',
            type: item.type
        }));

        try {
            const response = await fetch(`${API_URL}/processOrder`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderList: checkoutDetails,
                    totalPrice: calculateTotalPrice()
                })
            });

            if (response.ok) {
                const data = await response.json();
                alert("Checkout successful!");
                clearCart();
                navigate(`/completedorderpage`, { state: { receipt: data.result } });
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error during checkout:", error);
            alert("An error occurred while processing your order. Please try again.");
        }
    };

    /**
     * Monitors cartItems and shows the popup if the cart contains only a meal 
     * without a drink or side.
     */
    useEffect(() => {
        const hasMeal = cartItems.some(item => item.type === 'Meal');
        const hasDrink = cartItems.some(item => item.type === 'Drink');
        const hasSide = cartItems.some(item => item.type === 'Side');

        if (hasMeal && !hasDrink && !hasSide) {
            setShowPopup(true);
        } else {
            setShowPopup(false);
        }
    }, [cartItems]);

    /**
     * Adds a drink to the cart and hides the popup.
     */
    const handleAddDrink = () => {
        addItemToCart({ name: "Drink", price: 1.99, type: "Drink" });
        setShowPopup(false);
    };

    /**
     * Adds a side to the cart and hides the popup.
     */
    const handleAddSide = () => {
        addItemToCart({ name: "Side", price: 2.99, type: "Side" });
        setShowPopup(false);
    };

    /**
     * Fetches and sets translated strings for the UI.
     */
    useEffect(() => {
        const translateStrings = async () => {
            const cartTitle = await translate('Your Shopping Cart');
            const emptyCartMessage = await translate('Your cart is empty.');
            const item = await translate('Item');
            const price = await translate('Price');
            const quantity = await translate('Quantity');
            const details = await translate('Details');
            const actions = await translate('Actions');
            const backToOrder = await translate('Back to Order');
            const clearCart = await translate('Clear Cart');
            const checkout = await translate('Checkout');
            const remove = await translate('Remove');
            const total = await translate('Total');

            setTranslatedStrings({
                cartTitle,
                emptyCartMessage,
                item,
                price,
                quantity,
                details,
                actions,
                backToOrder,
                clearCart,
                checkout,
                remove,
                total,
            });
        };

        translateStrings();
    }, [translate]);

    return (
        <div className="shopping-cart-page">
            <h2>{translatedStrings.cartTitle}</h2>
            {cartItems.length === 0 ? (
                <p>{translatedStrings.emptyCartMessage}</p>
            ) : (
                <div className="table-container">
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>{translatedStrings.item}</th>
                                <th>{translatedStrings.price}</th>
                                <th>{translatedStrings.quantity}</th>
                                <th>{translatedStrings.details}</th>
                                <th>{translatedStrings.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>
                                        {isNaN(Number(item.price))
                                            ? 'N/A'
                                            : `$${Number(item.price).toFixed(2)}`}
                                    </td>
                                    <td>
                                        <div className="flex items-center">
                                            <button 
                                                onClick={() => updateItemQuantity(item.id, -1)}
                                                className="quantity-btn"
                                            >
                                                -
                                            </button>
                                            <span className="mx-2">{item.quantity || 1}</span>
                                            <button 
                                                onClick={() => updateItemQuantity(item.id, 1)}
                                                className="quantity-btn"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        {item.entrees && item.entrees.length > 0 && (
                                            <p>
                                                Entrees: {item.entrees.filter(entree => entree !== "N/A").join(', ')}
                                            </p>
                                        )}
                                        {item.sides && item.sides.length > 0 && (
                                            <p>
                                                Side: {item.sides[0]}
                                            </p>
                                        )}
                                    </td>
                                    <td>
                                        <button onClick={() => removeItemFromCart(item.id)}>
                                            {translatedStrings.remove}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <div className="total-price-container">
                        <span className="total-price-label">{translatedStrings.total}:</span>
                        <span className="total-price-value">
                            ${calculateTotalPrice().toFixed(2)}
                        </span>
                    </div>
                </div>
            )}
            <div className="cart-actions">
                <button className="back-btn" onClick={() => navigate('/order')}>
                    &larr; {translatedStrings.backToOrder}
                </button>
                {cartItems.length > 0 && (
                    <>
                        <button className="clear-cart-btn" onClick={clearCart}>
                            {translatedStrings.clearCart}
                        </button>
                        <button className="checkout-btn" onClick={handleCheckout}>
                            {translatedStrings.checkout}
                        </button>
                    </>
                )}
            </div>
            {/* {showPopup && (
                <DrinkSideSuggestionPopup 
                    onAddDrink={handleAddDrink} 
                    onAddSide={handleAddSide} 
                    onClose={() => setShowPopup(false)} 
                />
            )} */}
        </div> 
    );
};

export default ShoppingCartPage;
