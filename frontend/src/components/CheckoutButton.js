/**
 * CheckoutButton Component
 * 
 * This component renders a button for completing the checkout process in the cashier interface.
 * It validates the current order, processes the checkout, and resets the order upon successful completion.
 * 
 * Features:
 * - Validates the order before proceeding to checkout.
 * - Calls the backend API to process the order.
 * - Resets the order upon successful checkout.
 * 
 * Props:
 * @param {Array<Object>} orderList - The list of items in the current order.
 * @param {number} totalPrice - The total price of the current order.
 * @param {function} resetOrder - A function to reset the order after checkout.
 * 
 * @component
 * @example
 * // Example usage
 * <CheckoutButton 
 *   orderList={currentOrder} 
 *   totalPrice={42.99} 
 *   resetOrder={clearOrder} 
 * />
 */

import React, { useState, useEffect } from 'react';
import { processOrder } from '../services/CashierPageAPI';
import styles from '../styles/CashierPage.module.css';
import { useFasterTranslate } from '../contexts/FasterTranslationContext';

/**
 * Renders a button for completing the checkout process.
 * 
 * @param {Object} props - Props for the component.
 * @param {Array<Object>} props.orderList - The list of items in the current order.
 * @param {number} props.totalPrice - The total price of the current order.
 * @param {function} props.resetOrder - A function to reset the order after checkout.
 * @returns {JSX.Element} - The rendered CheckoutButton component.
 */
const CheckoutButton = ({ orderList, totalPrice, resetOrder }) => {
  const { translate } = useFasterTranslate();
  const [buttonLabel, setButtonLabel] = useState('Checkout');

  /**
   * Fetches the translation for the Checkout button text.
   */
  useEffect(() => {
    const loadTranslation = async () => {
      try {
        const translatedLabel = await translate('Checkout');
        setButtonLabel(translatedLabel);
      } catch (error) {
        console.error('Error translating checkout button label:', error);
      }
    };

    loadTranslation();
  }, [translate]);

  /**
   * Handles the checkout process.
   * - Validates the order list to ensure there are items to checkout.
   * - Calls the `processOrder` API function to complete the order.
   * - Alerts the user of success or failure and resets the order on success.
   * 
   * @returns {Promise<void>} - Asynchronous function that handles the checkout process.
   */
  const handleCheckout = async () => {
    if (orderList.length === 0) {
      alert('No items in the order to checkout.');
      return;
    }

    const success = await processOrder(orderList, totalPrice);
    if (success) {
      alert('Checkout completed.');
      resetOrder();
    } else {
      alert('Checkout failed. Please try again.');
    }
  };

  return (
    <button onClick={handleCheckout} className={styles['checkout-button']}>
      {buttonLabel}
    </button>
  );
};

export default CheckoutButton;
