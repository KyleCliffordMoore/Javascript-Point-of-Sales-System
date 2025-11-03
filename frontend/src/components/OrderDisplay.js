/**
 * OrderDisplay Component
 * 
 * This component displays a list of items in the order, including their names, quantities, and prices.
 * It provides controls for adjusting the quantity of each item in the order.
 * 
 * Features:
 * - Displays the name, quantity, and price of each item in the order.
 * - Includes buttons to increase or decrease the quantity of each item.
 * - Updates the total price for each item when the quantity is adjusted.
 * 
 * Props:
 * @param {Array<Object>} orderList - The list of items in the current order.
 * @param {string} orderList.name - The name of the item.
 * @param {number} orderList.price - The price of the item.
 * @param {number} orderList.quantity - The quantity of the item.
 * @param {function} onQuantityChange - Callback function for adjusting the item quantity.
 * 
 * @component
 * @example
 * // Example usage
 * <OrderDisplay 
 *   orderList={[{ name: "Orange Chicken", price: 10.99, quantity: 2 }]} 
 *   onQuantityChange={handleQuantityChange} 
 * />
 */

import React, { useState, useEffect } from 'react';
import styles from '../styles/CashierPage.module.css';
import { useFasterTranslate } from '../contexts/FasterTranslationContext';

/**
 * Renders the current order with items, quantities, and prices.
 * Includes buttons to adjust the quantity of each item.
 * 
 * @param {Object} props - Props for the component.
 * @param {Array<Object>} props.orderList - The list of items in the order.
 * @param {function} props.onQuantityChange - The function to call when the quantity changes.
 * @returns {JSX.Element} - The rendered OrderDisplay component.
 */
const OrderDisplay = ({ orderList, onQuantityChange }) => {
  const { translate } = useFasterTranslate();
  const [orderLabel, setOrderLabel] = useState('Order');

  /**
   * Fetches the translation for the order header.
   */
  useEffect(() => {
    const loadTranslation = async () => {
      try {
        const translatedOrderLabel = await translate('Order');
        setOrderLabel(translatedOrderLabel);
      } catch (error) {
        console.error('Error translating order header:', error);
      }
    };

    loadTranslation();
  }, [translate]);

  return (
    <div className={styles['order-display']}>
      <h2>{orderLabel}</h2>
      <ul>
        {orderList.map((item, index) => (
          <li key={index} className={styles['order-item']}>
            <span className={styles['item-name']}>{item.name}</span>
            <span className={styles['item-controls']}>
              <button
                onClick={() => onQuantityChange(index, -1)} // Decrease quantity
                className={styles['quantity-button']}
              >
                -
              </button>
              <span className={styles['item-quantity']}>{item.quantity}</span>
              <button
                onClick={() => onQuantityChange(index, 1)} // Increase quantity
                className={styles['quantity-button']}
              >
                +
              </button>
            </span>
            <span className={styles['item-price']}>
              ${(item.price * item.quantity).toFixed(2)} {/* Display price with quantity */}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDisplay;
