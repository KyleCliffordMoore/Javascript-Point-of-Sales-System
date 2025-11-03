/**
 * Fetches menu items based on the specified type from the backend.
 * 
 * This function sends a POST request to the server with a SQL query to retrieve menu items of a given
 * type (e.g., "meal", "drink", "appetizer"). The results are ordered by price in ascending order.
 * It returns the fetched menu items or an empty array in case of an error.
 *
 * @param {string} type - The type of menu items to fetch (e.g., "meal", "drink", "appetizer").
 * 
 * @returns {Promise<Array>} - A promise that resolves to an array of menu items, where each item
 * is an object containing `name`, `price`, and `calories`. If an error occurs, an empty array is returned.
 *
 * @example
 * // Usage example:
 * fetchMenuType('meal').then(data => {
 *   console.log(data); // Process the fetched menu items
 * });
 */
const API_URL = '/api'; // Base URL for the backend

export const fetchMenuType = async (type) => {
    const queryText = `SELECT name, price, calories FROM menu WHERE item_type = '${type}' ORDER BY price ASC;`; // Directly include the type in the query
  
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
