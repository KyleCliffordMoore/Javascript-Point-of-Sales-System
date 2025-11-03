// src/services/kitchenApi.js

const API_URL = '/api'; // Base URL for the backend

/**
 * Fetches the list of pending orders from the backend.
 *
 * @async
 * @returns {Promise<Object[]>} A promise that resolves to an array of pending order objects.
 *                              Returns an empty array if the request fails.
 * @example
 * const orders = await fetchPendingOrders();
 * console.log(orders); // [{ id: 1, items: ['Burger', 'Fries'], ... }, ...]
 */
export const fetchPendingOrders = async () => {
  try {
    const response = await fetch(`${API_URL}/pendingOrders`);
    const data = await response.json();
    if (response.ok) {
      return data; // Array of orders
    } else {
      console.error('Error fetching pending orders:', data.error);
      return [];
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};

/**
 * Marks a specific order as complete.
 *
 * @async
 * @param {number} receipt_id - The unique identifier of the order receipt.
 * @param {string} email - The email address associated with the order.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the order is successfully marked as complete,
 *                             or `false` if there is an error.
 * @example
 * const success = await completeOrder(12345, 'customer@example.com');
 * console.log(success); // true or false
 */
export const completeOrder = async (receipt_id, email) => {
  try {
    const response = await fetch(`${API_URL}/completeOrder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receipt_id, email }),
    });
    if (response.ok) {
      return true;
    } else {
      const data = await response.json();
      console.error('Error completing order:', data.error);
      return false;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return false;
  }
};
