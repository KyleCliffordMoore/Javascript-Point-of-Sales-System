/**
 * CashierLabel Component
 * 
 * This component renders a styled label used in the cashier interface.
 * It is designed to display section titles or headings with consistent styling.
 * 
 * Features:
 * - Dynamically accepts text for display.
 * - Uses inline styles for customized appearance.
 * 
 * Props:
 * @param {string} text - The text to display as the label.
 * 
 * @component
 * @example
 * // Example usage
 * <CashierLabel text="Drinks" />
 */

import React from 'react';

/**
 * Renders a styled label for use in the cashier interface.
 * 
 * @param {Object} props - Props for the component.
 * @param {string} props.text - The text to display as the label.
 * @returns {JSX.Element} - The rendered CashierLabel component.
 */
const CashierLabel = ({ text }) => {
  // Inline styles for the label
  const labelStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'left',
    margin: '10px 0',
    position: 'relative',
    left: '2%',
  };

  return <div style={labelStyle}>{text}</div>;
};

export default CashierLabel;
