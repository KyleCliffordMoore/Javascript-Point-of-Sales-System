/**
 * Sidebar Component
 * 
 * This component renders a sidebar that displays the current order summary.
 * It shows a list of items in the order, their prices, and the total price.
 * The component also includes a "Checkout" button to proceed with the order.
 * 
 * Features:
 * - Displays a list of items with their names and prices.
 * - Calculates and displays the total price for the order.
 * - Includes a button that triggers a checkout action.
 * 
 * Props:
 * @param {Array<Object>} order - The list of items in the current order.
 * @param {string} order.name - The name of the item.
 * @param {number} order.price - The price of the item.
 * 
 * @component
 * @example
 * // Example usage
 * <Sidebar 
 *   order={[{ name: "Orange Chicken", price: 10.99 }, { name: "Fried Rice", price: 5.99 }]} 
 * />
 */

import React from 'react';
import '../styles/Sidebar.css';

/**
 * Renders the sidebar displaying the order summary.
 * 
 * @param {Object} props - Props for the component.
 * @param {Array<Object>} props.order - The list of items in the current order.
 * @returns {JSX.Element} - The rendered Sidebar component.
 */
function Sidebar({ order }) {
  // Calculate the total price by summing up the price of each item in the order
  const total = order.reduce((sum, item) => sum + item.price, 0);

  /**
   * Handles the checkout action.
   * This function is called when the "Checkout" button is clicked.
   */
  const handleCheckout = () => {
    alert('Proceeding to checkout!');
  };

  return (
    <div className="sidebar">
      <h3>Order Summary</h3>
      <ul>
        {order.map((item, index) => (
          <li key={index}>{item.name} - ${item.price.toFixed(2)}</li>
        ))}
      </ul>
      <p>Total: ${total.toFixed(2)}</p>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
}

export default Sidebar;
