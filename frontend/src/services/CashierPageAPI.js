// src/services/api.js

const API_URL = '/api'; // Base URL for the backend

/**
 * Fetches menu items of a specified type from the backend.
 * 
 * @async
 * @param {string} type - The type of menu items to fetch (e.g., 'drinks', 'food').
 * @returns {Promise<Object[]>} A promise that resolves to an array of menu item objects. 
 *                              Returns an empty array if the request fails.
 * @example
 * const drinks = await fetchMenuItems('drinks');
 * console.log(drinks); // [{ id: 1, name: 'Cola', price: 2.5 }, ...]
 */
export const fetchMenuItems = async (type) => {
  const queryText = `SELECT * FROM menu WHERE item_type = '${type}';`; // Directly include the type in the query

  try {
    const response = await fetch(`${API_URL}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: queryText, params: [type] }), // Ensure params is correctly included
    });

    const data = await response.json();
    if (response.ok) {
      return data; // This will be an array of rows
    } else {
      console.error('Error fetching menu items:', data.error);
      return [];
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};

/**
 * Processes an order by sending the order list and total price to the backend.
 * 
 * @async
 * @param {Object[]} orderList - An array of order items, each containing details such as item ID, name, and quantity.
 * @param {number} totalPrice - The total price of the order.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the order was successfully processed, `false` otherwise.
 * @example
 * const orderList = [
 *   { id: 1, name: 'Pizza', quantity: 2 },
 *   { id: 2, name: 'Soda', quantity: 1 },
 * ];
 * const isProcessed = await processOrder(orderList, 25.99);
 * console.log(isProcessed); // true or false
 */
export const processOrder = async (orderList, totalPrice) => {
  try {
    const response = await fetch(`${API_URL}/processOrder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderList, totalPrice }),
    });

    const data = await response.json();
    return response.ok;
  } catch (error) {
    console.error('Error processing order:', error);
    return false;
  }
};
