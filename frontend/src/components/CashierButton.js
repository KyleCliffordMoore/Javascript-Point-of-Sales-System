/**
 * CashierButton Component
 * 
 * This component renders a button specifically styled and used within the cashier interface.
 * It supports dynamic styling, click handling, and selection state management.
 * 
 * Features:
 * - Dynamically combines CSS classes for consistent styling and selection indication.
 * - Accepts custom class names for additional styling.
 * - Triggers a callback function on click.
 * 
 * Props:
 * @param {string} text - The text displayed on the button.
 * @param {function} onClick - The callback function invoked when the button is clicked.
 * @param {boolean} isSelected - Indicates whether the button is in a selected state.
 * @param {string} className - Additional class name for specific styling.
 * 
 * @component
 * @example
 * // Example usage
 * <CashierButton 
 *   text="Add Drink" 
 *   onClick={handleClick} 
 *   isSelected={true} 
 *   className="drink-button" 
 * />
 */

import React from 'react';
import styles from '../styles/CashierPage.module.css';

/**
 * Renders a styled button for the cashier interface.
 * 
 * @param {Object} props - Props for the component.
 * @param {string} props.text - The text displayed on the button.
 * @param {function} props.onClick - The function to execute when the button is clicked.
 * @param {boolean} props.isSelected - Whether the button is in a selected state.
 * @param {string} props.className - Additional class name for custom styling.
 * @returns {JSX.Element} - The rendered CashierButton component.
 */
const CashierButton = ({ text, onClick, isSelected, className }) => {
  // Combine the .cashier-button, .button, and any additional class passed via props
  const buttonClass = `${styles['cashier-button']} ${styles.button} ${styles[className]} ${
    isSelected ? styles.selected : ''
  }`;

  return (
    <button onClick={onClick} className={buttonClass}>
      {text}
    </button>
  );
};

export default CashierButton;
