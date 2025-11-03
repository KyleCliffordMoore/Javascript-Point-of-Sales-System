/**
 * DrinkAndAppetizerButton Component
 * 
 * This component renders a button for drink or appetizer items within the cashier interface.
 * It leverages the `CashierButton` component to maintain consistent styling and behavior.
 * 
 * Features:
 * - Dynamically generates the button text based on the item's name and price.
 * - Calls a callback function with the item details when the button is clicked.
 * - Applies a specific class for styling based on the item's type (e.g., "drink" or "appetizer").
 * 
 * Props:
 * @param {Object} item - The item to represent, containing its details.
 * @param {string} item.name - The name of the item.
 * @param {string} item.item_type - The type of the item (e.g., "drink" or "appetizer").
 * @param {number|string} item.price - The price of the item (parsed to a float).
 * @param {function} onClick - Callback function triggered when the button is clicked.
 * 
 * @component
 * @example
 * // Example usage
 * <DrinkAndAppetizerButton 
 *   item={{ name: "Coke", item_type: "drink", price: 1.99 }} 
 *   onClick={handleAddItem} 
 * />
 */

import React from 'react';
import CashierButton from './CashierButton';

/**
 * Renders a button for drinks or appetizers.
 * 
 * @param {Object} props - Props for the component.
 * @param {Object} props.item - The item details.
 * @param {string} props.item.name - The name of the item.
 * @param {string} props.item.item_type - The type of the item (e.g., "drink" or "appetizer").
 * @param {number|string} props.item.price - The price of the item.
 * @param {function} props.onClick - Callback function triggered when the button is clicked.
 * @returns {JSX.Element} - The rendered DrinkAndAppetizerButton component.
 */
const DrinkAndAppetizerButton = ({ item, onClick }) => {
  // Capitalize the first letter of the item type
  const itemTypeCapitalized = item.item_type.charAt(0).toUpperCase() + item.item_type.slice(1);

  return (
    <CashierButton
      text={`${item.name}: $${parseFloat(item.price).toFixed(2)}`} // Button text with item name and price
      onClick={() => onClick(item)} // Pass the item to the click handler
      className={itemTypeCapitalized.toLowerCase()} // Class name based on item type
    />
  );
};

export default DrinkAndAppetizerButton;
