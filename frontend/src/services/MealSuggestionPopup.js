/**
 * A popup component that suggests adding a drink or side to complete the meal.
 * 
 * This component renders a popup modal asking the user if they want to add a drink and a side to their meal.
 * The user can choose to add either, both, or close the popup without adding any items.
 */

/**
 * DrinkSideSuggestionPopup component is responsible for displaying a suggestion to the user
 * to complete their meal by adding a drink and a side. It provides options to proceed with
 * adding these items or to dismiss the popup.
 * 
 * @component
 * @example
 * // Usage example:
 * <DrinkSideSuggestionPopup
 *   onClose={handleClosePopup}
 *   onAddDrink={handleAddDrink}
 *   onAddSide={handleAddSide}
 * />
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.onClose - Function to close the popup.
 * @param {Function} props.onAddDrink - Function to add a drink to the cart.
 * @param {Function} props.onAddSide - Function to add a side to the cart.
 * 
 * @returns {JSX.Element} The rendered popup with options to add a drink or side.
 */
import React from "react";
import "../styles/ShoppingCartPage.css";

const DrinkSideSuggestionPopup = ({ onClose, onAddDrink, onAddSide }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h3>Complete Your Meal!</h3>
                <p>How about adding a refreshing drink and a tasty side?</p>
                <div className="popup-actions">
                    <button onClick={onAddDrink}>Add Drink</button>
                    <button onClick={onAddSide}>Add Side</button>
                    <button onClick={onClose}>No Thanks</button>
                </div>
            </div>
        </div>
    );
};

export default DrinkSideSuggestionPopup;
