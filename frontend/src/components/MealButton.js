/**
 * MealButton Component
 * 
 * This component renders a button for selecting a meal in the cashier interface.
 * It displays the meal's name and price, and triggers a callback function when clicked.
 * 
 * Features:
 * - Displays meal name and price on the button.
 * - Marks the button as selected if the `isSelected` prop is true.
 * - Uses the `CashierButton` component to maintain consistent styling and behavior.
 * 
 * Props:
 * @param {Object} meal - The meal item to represent, containing its details.
 * @param {string} meal.name - The name of the meal.
 * @param {number} meal.price - The price of the meal.
 * @param {function} onClick - Callback function triggered when the button is clicked.
 * @param {boolean} isSelected - Indicates whether the meal button is selected.
 * 
 * @component
 * @example
 * // Example usage
 * <MealButton 
 *   meal={{ name: "Orange Chicken", price: 10.99 }} 
 *   onClick={handleMealSelection} 
 *   isSelected={true} 
 * />
 */

import React from 'react';
import CashierButton from './CashierButton';

/**
 * Renders a button for selecting a meal.
 * 
 * @param {Object} props - Props for the component.
 * @param {Object} props.meal - The meal details.
 * @param {string} props.meal.name - The name of the meal.
 * @param {number} props.meal.price - The price of the meal.
 * @param {function} props.onClick - Function triggered when the button is clicked.
 * @param {boolean} props.isSelected - Whether the meal button is selected.
 * @returns {JSX.Element} - The rendered MealButton component.
 */
const MealButton = ({ meal, onClick, isSelected }) => {
  // Ensure price is a valid number
  const price = meal.price !== null && meal.price !== undefined ? parseFloat(meal.price) : 0.0;

  return (
    <CashierButton
      text={`${meal.name}: $${price.toFixed(2)}`} // Display meal name and formatted price
      onClick={() => onClick(meal)} // Pass the selected meal to the click handler
      isSelected={isSelected} // Apply the selected style if isSelected is true
      className="meal" // Apply specific class for meal styling
    />
  );
};

export default MealButton;
