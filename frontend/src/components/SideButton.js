/**
 * SideButton Component
 * 
 * This component renders a button for selecting a side item in the cashier interface.
 * It displays the side's name and triggers a callback function when clicked.
 * 
 * Features:
 * - Displays the side item name on the button.
 * - Marks the button as selected if the `isSelected` prop is true.
 * - Uses the `CashierButton` component to maintain consistent styling and behavior.
 * 
 * Props:
 * @param {Object} side - The side item to represent.
 * @param {string} side.name - The name of the side item.
 * @param {function} onClick - Callback function triggered when the button is clicked.
 * @param {boolean} isSelected - Indicates whether the side button is selected.
 * 
 * @component
 * @example
 * // Example usage
 * <SideButton 
 *   side={{ name: "Fried Rice" }} 
 *   onClick={handleSideSelection} 
 *   isSelected={true} 
 * />
 */

import React from 'react';
import CashierButton from './CashierButton';

/**
 * Renders a button for selecting a side item.
 * 
 * @param {Object} props - Props for the component.
 * @param {Object} props.side - The side details.
 * @param {string} props.side.name - The name of the side item.
 * @param {function} props.onClick - Function triggered when the button is clicked.
 * @param {boolean} props.isSelected - Whether the side button is selected.
 * @returns {JSX.Element} - The rendered SideButton component.
 */
const SideButton = ({ side, onClick, isSelected }) => {
  return (
    <CashierButton
      text={side.name} // Display side name as button text
      onClick={() => onClick(side)} // Pass the selected side to the click handler
      isSelected={isSelected} // Apply the selected style if isSelected is true
      className="side" // Apply specific class for side styling
    />
  );
};

export default SideButton;
