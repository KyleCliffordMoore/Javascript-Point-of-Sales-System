/**
 * EntreeButton Component
 * 
 * This component renders a button for selecting entrees in the cashier interface.
 * It displays the name of the entree and, if selected, shows the count of how many have been chosen.
 * 
 * Features:
 * - Dynamically displays entree name with the count if selected.
 * - Triggers a callback function when clicked, passing the selected entree.
 * - Highlights the button if the entree is currently selected.
 * - Applies specific classes for styling based on the entree state.
 * 
 * Props:
 * @param {Object} entree - The entree item to represent.
 * @param {string} entree.name - The name of the entree.
 * @param {function} onClick - Callback function triggered when the button is clicked.
 * @param {boolean} isSelected - Indicates whether the entree is selected.
 * @param {number} count - The count of how many times the entree has been selected.
 * 
 * @component
 * @example
 * // Example usage
 * <EntreeButton 
 *   entree={{ name: "Orange Chicken" }} 
 *   onClick={handleEntreeSelection} 
 *   isSelected={true} 
 *   count={2} 
 * />
 */

import React from 'react';
import CashierButton from './CashierButton';

/**
 * Renders a button for selecting an entree.
 * 
 * @param {Object} props - Props for the component.
 * @param {Object} props.entree - The entree details.
 * @param {string} props.entree.name - The name of the entree.
 * @param {function} props.onClick - Function triggered when the button is clicked.
 * @param {boolean} props.isSelected - Whether the entree is selected.
 * @param {number} props.count - The count of how many times the entree has been selected.
 * @returns {JSX.Element} - The rendered EntreeButton component.
 */
const EntreeButton = ({ entree, onClick, isSelected, count }) => {
  return (
    <CashierButton
      text={`${entree.name}${count > 0 ? ` (${count})` : ''}`} // Display name and count if applicable
      onClick={() => onClick(entree)} // Pass the entree to the click handler
      isSelected={isSelected} // Highlight the button if selected
      className={`entree ${isSelected ? 'selected' : ''}`} // Apply styling based on selection
    />
  );
};

export default EntreeButton;
